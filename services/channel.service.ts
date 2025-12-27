// 고민을 해봤는데 service를 안만드니까 클라이언트에서 어떤 api를 사용하는지 한눈에 파악하기가 너무 힘들다.
import { clientAxios } from '@/lib/axios/client';

export type ChannelBaseResponseDto = {
  id: number;
  channelId: string;
  name: string;
  handle: string | null;
  description: string | null;
  link: string;
  thumbnailUrl: string | null;
  regionCode: string | null;
  defaultLanguage: string | null;
  videoCount: number;
  viewCount: number;
  subscriberCount: number;
  publishedAt: Date;
  lastVideoUploadedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ChannelSearchParams = {
  q?: string;
  country?: string;
  subscriber?: string;
  dailyViewCount?: string;
  uploadAt?: string;
  sort?: string;
  userId?: string;
  cursor?: string;
};

export type ChannelSuggestItem = Pick<
  ChannelBaseResponseDto,
  'channelId' | 'name' | 'handle' | 'thumbnailUrl' | 'subscriberCount'
>;

export const fetchSuggestChannels = async (
  keyword: string,
): Promise<ChannelSuggestItem[]> => {
  const { data } = await clientAxios.get('/channels/suggest', {
    params: { q: keyword },
  });
  return data.data;
};

export const fetchChannels = async (params: ChannelSearchParams) => {
  const { data } = await clientAxios.get('/channels', { params });
  return data.data;
};

export const fetchPublicChannels = async (params?: ChannelSearchParams) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/channels?${params}`,
    {
      next: { revalidate: 60, tags: ['public-channel'] },
    },
  );
  return res.json();
};

export const fetchChannel = async (channelId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}`,
    { next: { revalidate: 0, tags: ['channels'] } },
  );
  return res.json();
};

export const fetchPublicChannelHistory = async (channelId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/channels/${channelId}/history`,
    { next: { revalidate: 60, tags: ['public-channel'] } },
  );
  return res.json();
};
