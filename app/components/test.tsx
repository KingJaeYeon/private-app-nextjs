'use client';
import { useEffect } from 'react';
import { clientAxios } from '@/lib/axios/client';

export default function Test() {
  useEffect(() => {
    clientAxios.get('/channels');
  }, []);
  return <div>dd</div>;
}
