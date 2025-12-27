import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modal-store';
import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';
import { logoutAction, signInAction } from '@/services/auth.service';
import type { AxiosError } from 'axios';
import type { ServerErrorResponse } from '@/lib/axios/interface';

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
    mutationFn: signInAction,
    onSuccess: (data) => {
      setUser(data);
      closeModal();
      router.push('/');
    },
    onError: (error: AxiosError<ServerErrorResponse>) => {
      const message = error.response?.data?.message;
      if (message) {
        onErrorMessage?.(message);
      }
    },
  });

  // 로그아웃 mutation
  const logout = useMutation({
    mutationFn: logoutAction,
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
