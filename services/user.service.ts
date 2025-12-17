import { clientAxios } from '@/lib/axios/client';
import { SuccessResponse } from '@/lib/axios/interface';

interface IUser {
  id: number;
  email: string;
  emailVerified: boolean;
  username: string;
  bio: string;
  profileIcon: string;
  createdAt: string;
  oAuthType: string;
}

export const fetchCurrentUser = async () => {
  const { data } = await clientAxios.get<SuccessResponse<IUser>>('/users/me');
  return data.data;
};
