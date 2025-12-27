import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@/hooks/use-debounce';
import {
  ChannelSearchParams,
  fetchSuggestChannels,
} from '@/services/channel.service';

export function useChannelSearch(initialQuery?: string) {
  const router = useRouter();
  const [input, setInput] = useState(initialQuery || '');
  const [open, setOpen] = useState(false);
  const debouncedInput = useDebounce(input, 300);

  // Handle/URL이 아닌 키워드만 자동완성
  const isKeyword =
    debouncedInput.trim().length > 0 &&
    !debouncedInput.startsWith('@') &&
    !debouncedInput.startsWith('http');

  // 자동완성 쿼리
  const { data, isPending } = useQuery({
    queryKey: ['channels-suggest', debouncedInput],
    queryFn: async () => fetchSuggestChannels(debouncedInput),
    enabled: isKeyword,
  });

  // 검색 실행 (Enter or 버튼)
  const handleSearch = (currentQuery: ChannelSearchParams = {}) => {
    const value = input.trim();
    const params = new URLSearchParams();

    Object.entries(currentQuery ?? {}).forEach(([key, rawValue]) => {
      if (rawValue) {
        params.set(key, rawValue);
      }
    });

    if (!value) {
      params.delete('q');
      router.push(`/search?${params.toString()}`);
      setOpen(false);
      return;
    }

    if (!debouncedInput) {
      return;
    }

    if (!isKeyword) {
      if (!debouncedInput.startsWith('https://youtube.com')) {
        router.push(`/not-found`);
        return;
      }
      const handle = debouncedInput.split('/').pop();
      router.push(`/channel/${handle}`);
      return;
    }

    params.set('q', value);
    router.push(`/search?${params.toString()}`);
    setOpen(false);
  };

  // 자동완성 아이템 선택
  const handlePick = (channelId: string) => {
    if (!input && !debouncedInput) {
      return;
    }

    router.push(`/channel/${channelId}`);
    setOpen(false);
  };

  // input 포커스 시 결과 있으면 열기
  const handleFocus = () => {
    if ((data?.length || 0) > 0) {
      setOpen(true);
    }
  };

  return {
    input,
    setInput,
    open,
    setOpen,
    data: data || [],
    isPending,
    isKeyword,
    handleSearch,
    handlePick,
    handleFocus,
  };
}
