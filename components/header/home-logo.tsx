'use client';
import Link from 'next/link';
import Logo from '@/public/logo.svg';

export function HomeLogo() {
  return (
    <Link href={'/'}>
      <Logo />
    </Link>
  );
}
