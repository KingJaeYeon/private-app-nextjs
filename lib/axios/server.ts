import { cookies } from 'next/headers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { RetryRequestConfig, ServerErrorResponse } from '@/lib/axios/interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const createServerAxios = async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      // withCredentials는 브라우저가 해주는거라 직접 쿠키 넣어줘야함.
      // 쿠키를 헤더로 직접 전달 (서버 to 서버 통신)
      Cookie: [
        accessToken && `access_token=${accessToken}`,
        refreshToken && `refresh_token=${refreshToken}`,
      ]
        .filter(Boolean)
        .join('; '),
    },
  });

  // Response 인터셉터 - 401 에러시 토큰 재발급 시도
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ServerErrorResponse>) => {
      const originalRequest = error.config as RetryRequestConfig;
      const errorData = error.response?.data;
      const statusCode = error.response?.status;

      // 401이 아니거나 이미 재시도했으면 에러 반환
      if (statusCode !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const errorCode = errorData?.code;

      if (errorCode === 'AUTH-003') {
        return Promise.reject(error);
      }

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        // 토큰 재발급 요청
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Cookie: `refresh_token=${refreshToken}`,
            },
            validateStatus: (status) => status < 500,
          },
        );

        // 재발급 실패 - 원본 에러 그대로 전달
        if (response.status !== 200 && response.status !== 201) {
          return Promise.reject(error);
        }

        // Set-Cookie 헤더에서 새 토큰 추출 (선택사항)
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
          // 새 토큰으로 쿠키 헤더 업데이트
          const newAccessToken = setCookieHeader
            .find((cookie: string) => cookie.startsWith('access_token='))
            ?.split(';')[0]
            .split('=')[1];

          const newRefreshToken = setCookieHeader
            .find((cookie: string) => cookie.startsWith('refresh_token='))
            ?.split(';')[0]
            .split('=')[1];

          if (newAccessToken || newRefreshToken) {
            originalRequest.headers.Cookie = [
              newAccessToken && `access_token=${newAccessToken}`,
              newRefreshToken && `refresh_token=${newRefreshToken}`,
            ]
              .filter(Boolean)
              .join('; ');
          }
        }

        // 원래 요청 재시도
        return instance(originalRequest);
      } catch (refreshError) {
        // 재발급 중 에러 발생 - 원본 에러 그대로 전달
        return Promise.reject(error);
      }
    },
  );

  return instance;
};
