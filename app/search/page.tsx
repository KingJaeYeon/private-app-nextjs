import { SearchChannelInput } from '@/app/search/components/search-channel-input';
import { ChannelMultiFilter } from '@/app/search/components/channel-multi-filter';
import ChannelFilterBtns from '@/app/search/components/channel-filter-btns';

export type SearchQuery = {
  q?: string;
  country?: string;
  tag?: string;
  subscriber?: string;
  uploadAt?: string;
  dailyViewCount?: string;
  sort?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchQuery>;
}) {
  const query = await searchParams;

  return (
    <div className="flex h-full w-full flex-1 p-6 md:pt-3">
      <div className="w-full">
        <div className={'flex w-full flex-col gap-2'}>
          <ChannelMultiFilter query={query} />
          <div className={'flex w-full gap-2'}>
            <SearchChannelInput query={query} />
            <ChannelFilterBtns query={query} />
          </div>
        </div>
      </div>
    </div>
  );
}
