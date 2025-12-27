import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Calendar, ExternalLink, Eye, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChannelSubscribeButton } from '@/components/channel/ChannelSubscribeButton';
import Link from 'next/link';
import { IChannel } from '@/app/search/components/channel-list';
import { formatDate, formatNumber } from '@/lib/utils';

export function ChannelCard({
  channel,
}: {
  channel: IChannel & { uniqueKey?: string };
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {channel.thumbnailUrl ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={channel.thumbnailUrl}
                alt={channel.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
              <Users className="text-muted-foreground h-8 w-8" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-1 text-lg">
              {channel.name}
            </CardTitle>
            {channel.handle && (
              <CardDescription className="mt-1 text-sm">
                {channel.handle}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {channel.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {channel.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">구독자</span>
            <span className="font-medium">
              {formatNumber(channel.subscriberCount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">일일 조회</span>
            <span className="font-medium">
              {formatNumber(channel.dailyViewCount)}
            </span>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>마지막 업로드: {formatDate(channel.lastVideoUploadedAt)}</span>
        </div>

        {channel.tags && channel.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {channel.tags.map((tag) => (
              <Badge
                key={`${channel.uniqueKey}-tag-${tag.id}`}
                variant="secondary"
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          {/* bulk 선택용 체크박스 (UI만) */}
          <Checkbox aria-label="채널 선택" />

          {/* 구독(즐겨찾기) 버튼 */}
          <ChannelSubscribeButton
            channelId={channel.id}
            isSubscribed={channel.isSubscribed}
          />

          {/* 채널 링크 */}
          <Link
            href={`https://www.youtube.com/channel/${channel.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary ml-auto flex items-center text-sm"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>채널 보기</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
