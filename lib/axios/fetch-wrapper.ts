import { cookies } from 'next/headers';

interface FetchOptions extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}
/*
1. 서버 컴포넌트에서 데이터 fetching:
   - GET 요청: fetchWithCache 사용 (Next.js 캐싱 활용)
   - POST/PUT/DELETE: createServerAxios 사용 (캐싱 안함)

2. 클라이언트 컴포넌트에서 데이터 fetching:
   - React Query + clientAxios 사용
   - React Query의 캐싱 전략 활용

3. 캐싱 설정 예시:
   - 정적 데이터: { next: { revalidate: 3600 } } // 1시간
   - 자주 변하는 데이터: { next: { revalidate: 60 } } // 1분
   - 실시간 데이터: { cache: 'no-store' } // 캐싱 안함
   - 태그 기반 재검증: { next: { tags: ['products'] } }

4. 캐시 무효화:
   - 서버 액션에서: revalidateTag('products')
   - 클라이언트에서: queryClient.invalidateQueries({ queryKey: ['products'] })
*/
/**
 * @param endpoint
 * @param options
 * @example 캐싱 O
 * const products2 = await fetchWithCache('/products', {
 *     next: {
 *       revalidate: 60, // 60초 캐싱
 *       tags: ['products'],
 *     },
 *   });
 */
export const fetchWithCache = async <T>(
  endpoint: string,
  options?: FetchOptions,
): Promise<T> => {
  const cookieStore = await cookies();

  // Nest에서 설정한 쿠키 이름에 맞춰서 읽기
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  // 서버 → 백엔드로 넘길 Cookie 헤더 구성
  const cookieHeader = [
    accessToken && `access_token=${accessToken}`,
    refreshToken && `refresh_token=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(cookieHeader && { Cookie: cookieHeader }),
    ...options?.headers,
  };

  // 최초 요청
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    next: options?.next || { revalidate: 60 },
  });

  // 401이 아니면 일반 에러 처리
  if (response.status !== 401) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // 401 에러 - 토큰 재발급 시도
  if (!refreshToken) {
    // 서버 입장에서 넘겨줄 refreshToken 자체가 없으면 재발급 불가
    throw new Error('UNAUTHORIZED');
  }

  // 토큰 재발급 시도 (refreshToken을 쿠키로 넘김)
  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        // Next 서버 → 백엔드로 전달할 실제 쿠키
        Cookie: `refreshToken=${refreshToken}`,
      },
    },
  );

  // 재발급 실패
  if (!refreshResponse.ok) {
    throw new Error('UNAUTHORIZED');
  }

  // ★ 백엔드가 Set-Cookie 로 새 accessToken/refreshToken 을 내려주면
  // 브라우저 쪽 쿠키는 "사용자 ← Next 서버 응답"에서 세팅되고,
  // 여기 서버 컴포넌트 안에서는 기존 cookieStore 값 그대로인 상태.
  // 이 함수 안에서 쿠키 값을 다시 읽어올 순 없으니,
  // 재시도 요청은 그냥 현재 쿠키 헤더 그대로 한 번 더 날려주는 형태.

  const retryResponse = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      // 재시도도 쿠키 기반으로
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!retryResponse.ok) {
    throw new Error(`HTTP error! status: ${retryResponse.status}`);
  }

  return retryResponse.json();
};

class ApiError extends Error {
  status: number;
  code?: string;
  path?: string;
  details?: any;

  constructor(init: {
    message: string;
    status: number;
    code?: string;
    path?: string;
    details?: any;
  }) {
    super(init.message);
    this.status = init.status;
    this.code = init.code;
    this.path = init.path;
    this.details = init.details;
  }
}
