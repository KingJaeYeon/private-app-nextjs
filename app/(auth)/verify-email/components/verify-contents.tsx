'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { clientAxios } from '@/lib/axios/client';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

type VerifyType = {
  email: string;
  token: string;
};

export function VerifyContents({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const { setUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const { mutate } = useMutation({
    mutationFn: async (dto: VerifyType) => {
      const { data } = await clientAxios.post('/auth/verify-email', dto);
      return data.data;
    },
    onSuccess: async (data) => {
      setUser(data);
      setIsLoading(false);
    },
    onError: async (error) => {
      setIsLoading(false);
    },
  });

  useLayoutEffect(() => {
    mutate({ email, token });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-lg p-8 text-center shadow-lg">
          <div className={'flex items-center justify-center gap-5'}>
            <Spinner className={'h-10 w-10'} />
            <p className={'text-xl font-semibold'}>로딩중</p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return <VerifySuccess />;
  }

  return <VerifyError />;
}

export default function VerifySuccess() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">✅</div>
        <h2 className="mb-4 text-2xl font-bold">가입 완료!</h2>
        <p className="text-muted-foreground mb-2">환영합니다</p>
        <p className="text-muted-foreground text-sm">
          메인 페이지로 이동합니다...
        </p>
      </div>
    </div>
  );
}

function VerifyError() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">❌</div>
        <h2 className="mb-4 text-2xl font-bold">인증 실패</h2>
        <Link
          href={'/signup'}
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          다시 시도하기
        </Link>
      </div>
    </div>
  );
}
