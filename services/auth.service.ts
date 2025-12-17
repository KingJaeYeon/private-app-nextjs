import { clientAxios } from '@/lib/axios/client';

export type VerifyType = {
  email: string;
  token: string;
};

export type SignUpType = {
  email: string;
  password: string;
};

interface SignInType {
  identifier: string;
  password: string;
}

export const verifyEmail = async (body: VerifyType) => {
  const { data } = await clientAxios.post('/auth/verify-email', body);
  return data.data;
};

export const requestEmailVerification = async (body: SignUpType) => {
  const { data } = await clientAxios.post(
    '/auth/request-email-verification',
    body,
  );
  return data.data;
};

export const signInAction = async (body: SignInType) => {
  const { data } = await clientAxios.post('/auth/sign-in', body);
  return data.data;
};

export const logoutAction = async () => {
  const { data } = await clientAxios.post('/auth/logout');
  return data;
};
