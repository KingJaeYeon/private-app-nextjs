// 고민을 해봤는데 service를 안만드니까 클라이언트에서 어떤 api를 사용하는지 한눈에 파악하기가 너무 힘들다.
import { clientAxios } from '@/lib/axios/client';

export type ChannelSearchParams = {};

export const fetchChannelSuggest = async (keyword: string) => {
  const { data } = await clientAxios.get('/channels/suggest', {
    params: { q: keyword },
  });
  return data;
};

export const searchChannels = async (params: ChannelSearchParams) => {
  const { data } = await clientAxios.get('/channels/search', { params });
  return data;
};

// ==== 인증 X ====
const fetchChannel = async (channelId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/channels/${channelId}`,
    { next: { revalidate: 0, tags: ['channels'] } },
  );
  return res.json();
};
