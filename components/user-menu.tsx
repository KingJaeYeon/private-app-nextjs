'use client';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

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

function UserAvatarMenu() {
  return <div>아바타</div>;
}
