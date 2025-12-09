'use client';

import { useUser } from '@/hooks/useAuth';

export default function Test() {
  const user = useUser();
  return <div className={'w-20'}>{JSON.stringify(user)}</div>;
}
