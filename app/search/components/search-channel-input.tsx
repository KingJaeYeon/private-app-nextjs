'use client';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useChannelSearch } from '@/hooks/use-channel-search';
import Logo from '@/public/logo.svg';
import DarkLogo from '@/public/logo-dark.png';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import {
  ChannelSearchParams,
  ChannelSuggestItem,
} from '@/services/channel.service';

export function SearchChannelInput({ query }: { query: ChannelSearchParams }) {
  const {
    input,
    setInput,
    open,
    setOpen,
    data,
    isPending,
    isKeyword,
    handleSearch,
    handlePick,
  } = useChannelSearch(query.q);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Input 포커스 상태 추적
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleInputFocus = () => {
      // 포커스되면 열기
      if (data.length > 0 || isKeyword) {
        setOpen(true);
      }
    };

    const handleInputBlur = (e: FocusEvent) => {
      // Popover 내부로 포커스 이동하면 닫지 않음
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (wrapperRef.current?.contains(relatedTarget)) {
        return;
      }
      // 외부로 포커스 이동하면 닫기
      setOpen(false);
    };

    input.addEventListener('focus', handleInputFocus);
    input.addEventListener('blur', handleInputBlur);

    return () => {
      input.removeEventListener('focus', handleInputFocus);
      input.removeEventListener('blur', handleInputBlur);
    };
  }, [data.length, isKeyword, setOpen]);

  return (
    <div ref={wrapperRef} className={'w-full sm:w-[350px]'}>
      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen && inputRef.current === document.activeElement) {
            return;
          }
          setOpen(newOpen);
        }}
      >
        <PopoverTrigger asChild>
          <div className="relative flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="URL 또는 키워드 입력"
              className={cn(
                'y-3 bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 flex-1 rounded-lg border pr-20 pl-4 shadow-xs',
                'transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500',
              )}
            />
            <button
              type="button"
              onClick={() => handleSearch(query)}
              className="absolute right-2 rounded-lg bg-blue-600 px-3 py-1 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              검색
            </button>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-[var(--radix-popover-trigger-width)] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SearchResultsList
            data={data}
            isPending={isPending}
            isKeyword={isKeyword}
            onPick={handlePick}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// 결과 리스트 (순수 프레젠테이션)
function SearchResultsList({
  data,
  isPending,
  isKeyword,
  onPick,
}: {
  data: ChannelSuggestItem[];
  isPending: boolean;
  isKeyword: boolean;
  onPick: (id: string) => void;
}) {
  const { theme } = useTheme();
  if (!isKeyword) {
    return (
      <div className="flex h-60 flex-col items-center justify-center overflow-y-auto rounded-lg">
        <Image
          src={theme === 'dark' ? DarkLogo : Logo}
          alt={'logo'}
          height={150}
        />
        <div className="text-muted-foreground p-4 text-center text-sm">
          검색내역이 없습니다.
        </div>
      </div>
    );
  }

  if (isKeyword && isPending) {
    return (
      <div className="flex h-60 flex-col items-center justify-center overflow-y-auto rounded-lg">
        <Image
          src={theme === 'dark' ? DarkLogo : Logo}
          alt={'logo'}
          height={150}
        />
        <div className="text-muted-foreground flex items-center gap-2 p-4 text-center text-sm">
          <Spinner />
          검색 중
        </div>
      </div>
    );
  }

  if (isKeyword && !isPending && data.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center overflow-y-auto rounded-lg">
        <Image
          src={theme === 'dark' ? DarkLogo : Logo}
          alt={'logo'}
          height={150}
        />
        <div className="text-muted-foreground flex items-center gap-2 p-4 text-center text-sm">
          검색 결과가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-72 overflow-y-auto rounded-lg">
      {data.map((channel) => (
        <button
          key={channel.channelId}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(channel.channelId)}
          className="dark:hover:bg-input/50 dark:border-border flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
        >
          <img
            src={channel.thumbnailUrl || '/default-channel.png'}
            alt={channel.name}
            className="dark:hover:bg-input/50 h-10 w-10 rounded-full bg-gray-100 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{channel.name}</p>
            {channel.handle && (
              <p className="text-muted-foreground truncate text-xs">
                {channel.handle}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              구독자 {(channel.subscriberCount || 0).toLocaleString()}명
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
