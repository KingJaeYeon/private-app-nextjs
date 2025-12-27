import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AUTH_COOKIE } from '@/constants/auth';

export type FontSize =
  | 'text-2xs'
  | 'text-1.5xs'
  | 'text-xs'
  | 'text-0.5xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl'
  | 'text-5xl'
  | 'text-6xl'
  | 'text-7xl'
  | 'text-8xl'
  | 'text-9xl';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthCookies(cookies: string[]) {
  let newAccessToken: string = '',
    newRefreshToken: string = '';

  cookies.forEach((cookie) => {
    if (cookie.startsWith(`${AUTH_COOKIE.ACCESS}=`)) {
      newAccessToken = cookie.split(';')[0].split('=')[1];
    } else if (cookie.startsWith(`${AUTH_COOKIE.REFRESH}=`)) {
      newRefreshToken = cookie.split(';')[0].split('=')[1];
    }
  });

  return { newAccessToken, newRefreshToken };
}

type QueryParamValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | null
  | undefined;

export const toQueryString = (params: Record<string, QueryParamValue>) => {
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      sp.set(key, value.join(',')); // country=kr,us
    } else {
      sp.set(key, String(value));
    }
  }

  return sp.toString();
};

// 유틸리티 함수들
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatDate(date: Date | null): string {
  if (!date) return '정보 없음';
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}
