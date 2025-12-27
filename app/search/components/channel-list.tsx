'use client';

import { ChannelSearchParams, fetchChannels } from '@/services/channel.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, ExternalLink, Eye, Loader2, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { ChannelCard } from '@/app/search/components/channel-card';
import { formatDate, formatNumber } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { CHANNELS_COLUMNS } from '@/app/search/components/channel-columns';

export interface IChannel {
  id: number;
  channelId: string;
  name: string;
  handle: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number;
  dailyViewCount: number;
  viewCount: number;
  regionCode: string;
  videoCount: number;
  publishedAt: Date;
  lastVideoUploadedAt: Date | null;
  isSubscribed: boolean;
  link: string;
  tags?: Array<{ id: number; name: string; slug: string }>;
}

interface IChannelListResponse {
  data: IChannel[];
  nextCursor: number | null;
}

export default function ChannelList({ query }: { query: ChannelSearchParams }) {
  const { user } = useAuthStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    fetchNextPage,
  } = useInfiniteQuery<IChannelListResponse>({
    queryKey: ['channels', query],
    queryFn: async ({ pageParam }) => {
      return await fetchChannels({
        ...query,
        userId: user?.userId,
        cursor: pageParam ? String(pageParam) : undefined,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      console.log(allPages);
      return lastPage.nextCursor;
    },
  });

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 페이지의 데이터를 평탄화 (key 중복 방지를 위해 channelId 사용)
  const channels =
    data?.pages.flatMap((page, pageIndex) =>
      page.data.map((channel) => ({
        ...channel,
        uniqueKey: `${channel.channelId}-${pageIndex}`, // 고유 키 생성
      })),
    ) ?? [];

  if (status === 'pending') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">채널을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              오류가 발생했습니다
            </CardTitle>
            <CardDescription>
              {error?.message || '알 수 없는 오류가 발생했습니다.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>채널을 찾을 수 없습니다</CardTitle>
            <CardDescription>검색 조건에 맞는 채널이 없습니다.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full space-y-4">
      {/* 모바일: 카드 형태 */}
      <div className="grid gap-4 md:hidden">
        {channels.map((channel) => (
          <ChannelCard key={channel.uniqueKey} channel={channel} />
        ))}
      </div>
      {/* 데스크톱: 테이블 형태 */}
      <div className="hidden md:block">
        <DataTable
          data={channels}
          columns={CHANNELS_COLUMNS}
          isFixHeader={true}
          name={'channels'}
        />

        {/*<div className="rounded-md border">*/}
        {/*  <Table>*/}
        {/*    <TableHeader>*/}
        {/*      <TableRow>*/}
        {/*        /!* bulk 선택용 전체 체크박스 (UI만) *!/*/}
        {/*        <TableHead className="w-[40px]">*/}
        {/*          <Checkbox aria-label="전체 선택" />*/}
        {/*        </TableHead>*/}
        {/*        <TableHead className="w-[200px]">채널</TableHead>*/}
        {/*        <TableHead>설명</TableHead>*/}
        {/*        <TableHead className="w-[120px]">구독자</TableHead>*/}
        {/*        <TableHead className="w-[120px]">일일 조회</TableHead>*/}
        {/*        <TableHead className="w-[150px]">마지막 업로드</TableHead>*/}
        {/*        <TableHead className="w-[100px]">태그</TableHead>*/}
        {/*        <TableHead className="w-[100px]">링크</TableHead>*/}
        {/*      </TableRow>*/}
        {/*    </TableHeader>*/}
        {/*    <TableBody>*/}
        {/*      {channels.map((channel) => (*/}
        {/*        <ChannelTableRow key={channel.uniqueKey} channel={channel} />*/}
        {/*      ))}*/}
        {/*    </TableBody>*/}
        {/*  </Table>*/}
        {/*</div>*/}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="flex h-20 items-center justify-center">
        {isFetchingNextPage && (
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">더 많은 채널을 불러오는 중...</span>
          </div>
        )}
        {!hasNextPage && channels.length > 0 && (
          <p className="text-muted-foreground text-sm">
            모든 채널을 불러왔습니다.
          </p>
        )}
      </div>
    </div>
  );
}

// 데스크톱용 테이블 행 컴포넌트
function ChannelTableRow({
  channel,
}: {
  channel: IChannel & { uniqueKey?: string };
}) {
  return (
    <TableRow>
      {/* 각 행 체크박스 (UI만) */}
      <TableCell>
        <Checkbox aria-label="채널 선택" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {channel.thumbnailUrl ? (
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={channel.thumbnailUrl}
                alt={channel.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
              <Users className="text-muted-foreground h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="line-clamp-1 font-medium">{channel.name}</div>
            {channel.handle && (
              <div className="text-muted-foreground text-sm">
                {channel.handle}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground line-clamp-2 max-w-[300px] text-sm">
          {channel.description || '-'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Users className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">
            {formatNumber(channel.subscriberCount)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Eye className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">
            {formatNumber(channel.dailyViewCount)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(channel.lastVideoUploadedAt)}</span>
        </div>
      </TableCell>
      <TableCell>
        {channel.tags && channel.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {channel.tags.slice(0, 2).map((tag) => (
              <Badge
                key={`${channel.uniqueKey}-tag-${tag.id}`}
                variant="secondary"
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
            {channel.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{channel.tags.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      {/* 링크 컬럼 */}
      <TableCell>
        <Link
          href={`https://www.youtube.com/channel/${channel.channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          <span>보기</span>
        </Link>
      </TableCell>
    </TableRow>
  );
}
