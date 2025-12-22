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

export const toQueryString = (params: Record<string, any>) => {
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
