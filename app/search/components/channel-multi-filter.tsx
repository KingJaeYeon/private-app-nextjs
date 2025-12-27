'use client';

import { useState } from 'react';
import MultiSelectDropBox from '@/components/multi-select-dropbox';
import { ChannelSearchParams } from '@/services/channel.service';

const COUNTRIES = [
  { value: 'KR', label: '한국' },
  { value: 'US', label: '미국' },
  { value: 'JP', label: '일본' },
  { value: 'GB', label: '영국' },
];

export const countriesMap: Record<string, string> = {
  KR: '한국',
  US: '미국',
  JP: '일본',
  GB: '영국',
};

const SUBSCRIBERS = [
  { value: '10K_under', label: '~1만' },
  { value: '10K_100K', label: '1만 ~ 10만' },
  { value: '100K_500K', label: '10만 ~ 50만' },
  { value: '500K_1M', label: '50만 ~ 100만' },
  { value: '1M_over', label: '100만~' },
];

const VIEW_COUNT = [
  { value: '100K_under', label: '~10만' },
  { value: '100K_1M', label: '10만 ~ 100만' },
  { value: '1M_over', label: '100만~' },
];

export function ChannelMultiFilter({ query }: { query: ChannelSearchParams }) {
  const [countries, setCountries] = useState<string[]>(() =>
    query.country ? query.country.split(',') : [],
  );
  const [subscriber, setSubscriber] = useState<string[]>(() =>
    query.subscriber ? query.subscriber.split(',') : [],
  );
  const [dailyViewCount, setDailyViewCount] = useState<string[]>(() =>
    query.dailyViewCount ? query.dailyViewCount.split(',') : [],
  );

  return (
    <div className="scrollNone flex gap-2 overflow-x-auto">
      <MultiSelectDropBox
        selected={countries}
        options={COUNTRIES}
        setSelected={setCountries}
        placeholder={'국가 전체'}
        prefix={'국가'}
        syncWithUrl={{ key: 'country' }}
        className={'w-[200px]'}
      />
      <MultiSelectDropBox
        selected={subscriber}
        options={SUBSCRIBERS}
        setSelected={setSubscriber}
        placeholder={'구독자 전체'}
        prefix={'구독자'}
        syncWithUrl={{ key: 'subscriber' }}
        className={'w-[220px]'}
      />
      <MultiSelectDropBox
        selected={dailyViewCount}
        options={VIEW_COUNT}
        setSelected={setDailyViewCount}
        placeholder={'1일 조회수 전체'}
        prefix={'1일 조회수'}
        syncWithUrl={{ key: 'dailyViewCount' }}
        className={'w-[250px]'}
      />
    </div>
  );
}
