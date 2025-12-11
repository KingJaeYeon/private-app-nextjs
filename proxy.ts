import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh');
  const { pathname } = req.nextUrl;

  if (refreshToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const isProtected = pathname.startsWith('/my');
  if (!refreshToken && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my'],
};
