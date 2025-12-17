import { SearchChannelInput } from '@/app/search/components/search-channel-input';
import { ChannelMultiFilter } from '@/app/search/components/channel-multi-filter';
import ChannelFilterModal from '@/app/search/components/channel-filter-modal';
import ChannelList from '@/app/search/components/channel-list';
import {
  ChannelBaseResponseDto,
  ChannelSearchParams,
  fetchPublicChannels,
} from '@/services/channel.service';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<ChannelSearchParams>;
}) {
  const query = await searchParams;
  const json = await fetchPublicChannels(query);
  const data: ChannelBaseResponseDto[] = json.data;

  return (
    <div className="flex h-full w-full flex-1 md:pt-3">
      <div className="flex w-full flex-col gap-4">
        <div className={'flex w-full flex-col gap-2'}>
          <SearchChannelInput query={query} />
          <div className={'flex w-full gap-2'}>
            <ChannelFilterModal query={query} />
            <ChannelMultiFilter query={query} />
          </div>
        </div>
        <ChannelList query={query} />
      </div>
    </div>
  );
}
