import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/constants/auth';

export interface User {
  userId: string;
  exp?: number;
}

export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE.ACCESS)?.value;
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
