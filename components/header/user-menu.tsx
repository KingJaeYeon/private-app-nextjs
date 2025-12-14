'use client';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import * as React from 'react';
import { UserAvatarMenu } from '@/components/header/user-avatar-menu';
import { useModalStore } from '@/store/modal-store';

export function UserMenu() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <UserAvatarMenu /> : <LoginButton />;
}

function LoginButton() {
  const { openModal } = useModalStore();
  return (
    <Button onClick={() => openModal('login', undefined)} variant={'outline'}>
      로그인
    </Button>
  );
}
