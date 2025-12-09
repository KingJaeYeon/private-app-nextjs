'use client';

import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/axios/client';

export default function ChannelList() {
  const {
    data: channels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data } = await clientAxios.get('/public/channels');
      return data;
    },
    staleTime: 60 * 1000, // 1분
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div>
      {channels?.map((channel: any) => (
        <div key={channel.id}>{channel.name}</div>
      ))}
    </div>
  );
}
