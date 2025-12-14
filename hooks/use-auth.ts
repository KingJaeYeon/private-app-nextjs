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

export function useAuth({
  onErrorMessage,
}: {
  onErrorMessage?: (message: string) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const { clearUser, setUser } = useAuthStore();

  // 로그인 mutation
  const signIn = useMutation({
    mutationFn: async (dto: SignInDto) => {
      const { data } = await clientAxios.post('/auth/sign-in', dto);
      return data.data;
    },
    onSuccess: (data) => {
      setUser(data);
      closeModal();
      router.push('/');
    },
    onError: (error: any) => {
      const res = error.response.data;
      onErrorMessage && onErrorMessage(res?.message);
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
      clearUser();
      router.push('/');
    },
  });

  return {
    signIn,
    logout,
  };
}

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
