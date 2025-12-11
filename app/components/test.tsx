'use client';

import { useAuth, useUser } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Test() {
  const user = useUser();
  const { logout } = useAuth();
  return (
    <div className={'w-full'}>
      {JSON.stringify(user.data)}
      <Button onClick={() => logout.mutate()}>logout</Button>
    </div>
  );
}
