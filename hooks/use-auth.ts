import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/axios/client';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modal-store';
import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';

interface SignInDto {
  identifier: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();

  // 로그인 mutation
  const signIn = useMutation({
    mutationFn: async (dto: SignInDto) => {
      const { data } = await clientAxios.post('/auth/sign-in', dto);
      return data;
    },
    onSuccess: () => {
      router.push('/');
    },
    onError: (error: any) => {
      const res = error.response.data;
      openModal('alert', res?.message);
    },
  });

  // 로그아웃 mutation
  const logout = useMutation({
    mutationFn: async () => {
      const { data } = await clientAxios.post('/auth/logout');
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    signIn,
    logout,
  };
};

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  return { isAuthenticated, user };
}
