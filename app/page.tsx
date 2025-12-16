import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

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

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/channels`,
    {
      next: {
        revalidate: 60,
        tags: ['public-channel'],
      },
    },
  );
  const json = await res.json();
  const data: ChannelBaseResponseDto[] = json.data;

  return (
    <div className={'flex flex-1 justify-center'}>
      <div className={'w-full max-w-[1200px]'}>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((channel: ChannelBaseResponseDto) => {
            return <ChannelCard key={channel.channelId} channel={channel} />;
          })}
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel }: { channel: ChannelBaseResponseDto }) {
  return (
    <Link href={{ pathname: `/channel/${channel.channelId}` }}>
      <Card className="cursor-pointer transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Image
            src={channel.thumbnailUrl ?? '/placeholder.png'}
            alt={channel.name}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <CardTitle className="text-lg">{channel.name}</CardTitle>
            {channel.handle && (
              <p className="text-muted-foreground text-sm">{channel.handle}</p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subscribers</span>
            <span>{channel.subscriberCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Videos</span>
            <span>{channel.videoCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Views</span>
            <span>{channel.viewCount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
