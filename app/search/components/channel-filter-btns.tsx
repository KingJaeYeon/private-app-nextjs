'use client';
import { SearchQuery } from '@/app/search/page';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TAGS = ['쇼츠', '바이럴', '리뷰어', '게임', '뷰티', 'ASMR'];

const UPLOAD_PERIODS = [
  { value: 'day', label: '최근 1일' },
  { value: 'week', label: '최근 1주' },
  { value: 'month', label: '최근 1개월' },
  { value: 'year', label: '최근 1년' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: '최신순' },
  { value: 'subscriberCount', label: '구독자순' },
  { value: 'viewCount', label: '조회수순' },
];
export default function ChannelFilterBtns({ query }: { query: SearchQuery }) {
  const [filters, setFilters] = useState({
    uploadAt: query.uploadAt || '',
    sort: query.sort || 'createdAt',
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    // 필터 적용
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex w-[200px] justify-center gap-2">
      <Label>정렬</Label>
      {/*<Select*/}
      {/*  value={filters.sort}*/}
      {/*  onValueChange={(value) => handleFilterChange('sort', value)}*/}
      {/*>*/}
      {/*  <SelectTrigger>{filters.sort}</SelectTrigger>*/}
      {/*  <SelectContent>*/}
      {/*    {SORT_OPTIONS.map((option) => (*/}
      {/*      <SelectItem key={option.value} value={option.value}>*/}
      {/*        {option.label}*/}
      {/*      </SelectItem>*/}
      {/*    ))}*/}
      {/*  </SelectContent>*/}
      {/*</Select>*/}
    </div>
  );
}
