import { AxiosError, AxiosInstance } from 'axios';
import { createServerAxios } from '@/lib/axios/server';
import { ServerErrorResponse } from '@/lib/axios/interface';
import { redirect } from 'next/navigation';

/**
 * 서버 컴포넌트에서 안전하게 API를 호출하는 유틸리티 <br/>
 * 401 에러 발생시 자동으로 로그인 페이지로 리다이렉트
 *
 * @example 캐싱 X
 * const data = await serverFetch(
 *     (axios) => axios.get('/channels'),
 *     { redirectTo: '/login' },
 *   );
 */
export async function serverFetch<T>(
  fetcher: (axios: AxiosInstance) => Promise<{ data: T }>,
  options?: {
    redirectOnAuth?: boolean; // 401시 리다이렉트 여부 (기본: true)
    redirectTo?: string; // 리다이렉트 경로 (기본: '/login')
  },
): Promise<T> {
  const { redirectOnAuth = true, redirectTo = '/login' } = options || {};

  try {
    const axios = await createServerAxios();
    const response = await fetcher(axios);
    return response.data;
  } catch (error) {
    // Axios 에러 타입 체크
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as AxiosError<ServerErrorResponse>;
      const status = axiosError.response?.status;
      const code = axiosError.response?.data?.code;

      // 401 에러 처리
      if (status === 401) {
        if (redirectOnAuth) {
          redirect(redirectTo);
        }
      }
    }

    // 다른 에러는 그대로 throw (에러 바운더리가 처리)
    throw error;
  }
}
