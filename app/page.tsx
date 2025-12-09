import Test from '@/app/components/test';
import { createServerAxios } from '@/lib/axios/server';
import { serverFetch } from '@/lib/axios/server-fetch';

export default async function Home() {
  const data = await serverFetch((axios) => axios.get('/channels'), {
    redirectTo: '/login',
  });
  console.log(data);
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center bg-white px-16 py-32 dark:bg-black"></main>
    </div>
  );
}
