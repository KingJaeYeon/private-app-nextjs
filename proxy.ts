import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/constants/auth';

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get(AUTH_COOKIE.ACCESS);
  const { pathname } = req.nextUrl;
  console.log(pathname);
  if (accessToken && (pathname === '/signup' || pathname === '/verify-email')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const isProtected = pathname.startsWith('/my');
  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my', '/verify-email', '/signup'],
};
