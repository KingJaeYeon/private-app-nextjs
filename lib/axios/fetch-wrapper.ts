import { SuccessResponse } from '@/lib/axios/interface';

// TODO
export const fetchWithCache = async <T>(
  endpoint: string,
): Promise<SuccessResponse<T>> => {
  // ✅ 서버 컴포넌트에서는 절대 URL 필요
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api${endpoint}`;

  const response = await fetch(url, {
    // ...options,
    credentials: 'include',
    // next: options?.next || { revalidate: 60 },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
