'use client';
import { SearchQuery } from '@/app/search/page';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ListFilterIcon } from 'lucide-react';
import { IconClose } from '@/assets/Icon-close';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const TAGS = ['쇼츠', '바이럴', '리뷰어', '게임', '뷰티', 'ASMR'];

const UPLOAD_PERIODS = [
  { value: '-1', label: '전체' },
  { value: '7d', label: '최근 7일' },
  { value: '14d', label: '최근 14일' },
  { value: '1m', label: '최근 1달' },
  { value: '2m', label: '최근 2달' },
  { value: '3m', label: '최근 3달' },
  { value: '6m', label: '최근 6개월' },
  { value: '1y', label: '최근 1년' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: '추가날짜' },
  { value: 'subscriberCount', label: '구독자 수' },
  { value: 'viewCount', label: '조회수' },
];

export default function ChannelFilterBtns({ query }: { query: SearchQuery }) {
  const [open, setOpen] = useState(false);
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          필터
          <ListFilterIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={'flex h-[70%] max-w-[800px] flex-1 flex-col gap-2'}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className={
              'border-border flex items-start justify-between border-b py-4'
            }
          >
            필터옵션
            <button className={'cursor-pointer'} onClick={() => setOpen(!open)}>
              <IconClose className={'stroke-2'} />
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription hidden />
        </AlertDialogHeader>
        <div className="scrollWidth3 relative flex min-h-[20px] flex-1 flex-col gap-4 overflow-auto">
          <div className={'absolute h-full w-full'}>
            <div className={'mb-8 flex w-full flex-col gap-4'}>
              <Label className={'font-semibold'}>테이블 정렬</Label>
              <RadioGroup
                defaultValue={SORT_OPTIONS[0].value}
                className={'grid-cols-3 gap-y-5 p-2'}
              >
                {SORT_OPTIONS.map((option, i) => (
                  <div
                    className="flex w-fit items-center gap-3"
                    key={option.value}
                  >
                    <RadioGroupItem value={option.value} id={'sort' + i} />
                    <Label htmlFor={'sort' + i} className={'text-sm'}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className={'mb-8 flex w-full flex-col gap-4'}>
              <Label className={'font-semibold'}>마지막 업로드일</Label>
              <RadioGroup
                defaultValue={UPLOAD_PERIODS[0].value}
                className={'grid-cols-3 gap-y-5 p-2'}
              >
                {UPLOAD_PERIODS.map((option, i) => (
                  <div
                    className="flex w-fit items-center gap-3"
                    key={option.value}
                  >
                    <RadioGroupItem value={option.value} id={'sort' + i} />
                    <Label htmlFor={'sort' + i} className={'text-sm'}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className={'flex w-full flex-col gap-4'}>
              <Label className={'font-semibold'}>태그</Label>
              <div className={'p-2 text-sm'}>준비중</div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>검색</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
