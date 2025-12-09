import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/axios/client';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/store/modalStore';

interface SignInDto {
  identifier: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  username: string;
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
      queryClient.invalidateQueries({ queryKey: ['user'] });
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

// 사용자 정보 조회 query 예시
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await clientAxios.get<User>('/users/me');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: false, // 401 에러시 재시도 안함
  });
};
