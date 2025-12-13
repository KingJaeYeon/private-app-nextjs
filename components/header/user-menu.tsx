'use client';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import * as React from 'react';
import { UserAvatarMenu } from '@/components/header/user-avatar-menu';

export function UserMenu() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <UserAvatarMenu /> : <LoginButton />;
}

function LoginButton() {
  return (
    <Link href={'/login'} className={buttonVariants({ variant: 'outline' })}>
      로그인
    </Link>
  );
}
