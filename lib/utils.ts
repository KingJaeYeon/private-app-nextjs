import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AUTH_COOKIE } from '@/constants/auth';

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
