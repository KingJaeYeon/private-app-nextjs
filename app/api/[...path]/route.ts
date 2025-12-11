import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3500';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, await params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, await params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, await params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, await params, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string,
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

  // Cookie 헤더 구성
  const cookieHeader = [
    accessToken && `access_token=${accessToken}`,
    refreshToken && `refresh_token=${refreshToken}`,
  ]
    .filter(Boolean)
    .join('; ');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(cookieHeader && { Cookie: cookieHeader }),
  };

  // Body 처리 (POST, PUT)
  let body: string | undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      const requestBody = await request.json();
      body = JSON.stringify(requestBody);
    } catch (e) {
      // Body 없음
    }
  }

  // ============================================
  // 1차 요청
  // ============================================
  let response = await fetch(url, {
    method,
    headers,
    body,
    cache: 'no-store',
  });

  // ============================================
  // 401 에러 처리
  // ============================================
  if (response.status === 401 && refreshToken) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // JSON 파싱 실패
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const errorCode = errorData?.code;

    // Refresh Token 만료 → 401 그대로 반환
    if (errorCode === 'AUTH-003') {
      return NextResponse.json(errorData, { status: 401 });
    }

    // Access Token 만료 → Refresh 시도
    if (errorCode === 'AUTH-002') {
      try {
        // ✅ 토큰 재발급
        const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
          },
        });

        if (!refreshResponse.ok) {
          return NextResponse.json(errorData, { status: 401 });
        }

        // ✅ Set-Cookie 헤더 추출
        const setCookieHeaders = refreshResponse.headers.getSetCookie() || [];

        // 새 쿠키로 원래 요청 재시도
        let newAccessToken = accessToken;
        let newRefreshToken = refreshToken;

        setCookieHeaders.forEach((cookie) => {
          if (cookie.startsWith('access_token=')) {
            newAccessToken = cookie.split(';')[0].split('=')[1];
          } else if (cookie.startsWith('refresh_token=')) {
            newRefreshToken = cookie.split(';')[0].split('=')[1];
          }
        });

        const newCookieHeader = [
          newAccessToken && `access_token=${newAccessToken}`,
          newRefreshToken && `refresh_token=${newRefreshToken}`,
        ]
          .filter(Boolean)
          .join('; ');

        // 원래 요청 재시도
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Cookie: newCookieHeader,
          },
          body,
          cache: 'no-store',
        });

        // ✅ 재시도 성공 → 새 쿠키를 브라우저로 전달
        if (response.ok) {
          const data = await response.json();
          const nextResponse = NextResponse.json(data);

          // 브라우저로 새 쿠키 설정
          setCookieHeaders.forEach((cookie) => {
            nextResponse.headers.append('Set-Cookie', cookie);
          });

          return nextResponse;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        return NextResponse.json(
          {
            success: false,
            code: 'REFRESH_FAILED',
            message: 'Token refresh failed',
          },
          { status: 401 },
        );
      }
    }
  }

  // ============================================
  // 일반 응답
  // ============================================
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
