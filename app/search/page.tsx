import { SearchChannelInput } from '@/app/search/components/search-channel-input';

export type SearchQuery = {
  q?: string;
  country?: string;
  tag?: string;
  subscriber?: string;
  uploadAt?: string;
  dailyViewCount?: string;
  totalViewCount?: string;
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
      <div className="w-full max-w-sm">
        <SearchChannelInput query={query} />
      </div>
    </div>
  );
}
