'use client';

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { RetryRequestConfig, ServerErrorResponse } from '@/lib/axios/interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500';

// 토큰 재발급 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

export const clientAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // httpOnly 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터
clientAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // httpOnly 쿠키는 자동으로 전송되므로 별도 처리 불필요
    return config;
  },
  (error) => Promise.reject(error),
);

// Response 인터셉터
clientAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ServerErrorResponse>) => {
    const originalRequest = error.config as RetryRequestConfig;
    const res = error.response;

    const data = res?.data!;
    const status = res?.status ?? data?.statusCode;

    if (status !== 401) {
      return Promise.reject(error);
    }

    const errorCode = data.code;

    if (errorCode === 'AUTH-003') {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 이미 재시도한 요청이면 에러 반환
    // 토큰 재발급 후에도 401이 발생하는 경우 (서버 이슈 or 토큰 갱신 실패)
    if (originalRequest._retry) {
      console.error(
        'Token refresh succeeded but still got 401 - redirecting to login',
      );
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 이미 토큰 재발급 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => clientAxios(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // /auth/refresh 엔드포인트 호출 (쿠키가 자동으로 전송됨)
      const refreshResponse = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        },
      );

      // 큐에 대기 중인 요청들 처리
      processQueue(null);

      // 원래 요청 재시도
      return clientAxios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
