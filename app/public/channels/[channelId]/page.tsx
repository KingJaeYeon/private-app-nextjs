type ChannelBaseResponseDto = {
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
export const revalidate = 0;
export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}`,
    {
      next: {
        revalidate: 0, // 60초 캐싱
        tags: ['channels'],
      },
    },
  );
  const json = await res?.json();
  const data: ChannelBaseResponseDto = json.data;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{JSON.stringify(data)}</div>
    </div>
  );
}
