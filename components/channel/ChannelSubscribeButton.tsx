'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  channelId: number | string;
  isSubscribed?: boolean;
  className?: string;
  onClick?: () => void; // 실제 API 연동 시 사용할 핸들러 (지금은 선택 사항)
};

export function ChannelSubscribeButton({
  channelId,
  isSubscribed,
  className,
  onClick,
}: Props) {
  return (
    <Button
      type="button"
      variant={isSubscribed ? 'default' : 'outline'}
      size="sm"
      className={cn('flex items-center gap-1', className)}
      onClick={onClick}
    >
      <Star
        className={cn(
          'h-4 w-4',
          isSubscribed
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-muted-foreground',
        )}
      />
    </Button>
  );
}
