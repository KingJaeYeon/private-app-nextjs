import { ColumnDef } from '@tanstack/react-table';
import { IChannel } from '@/app/search/components/channel-list';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { countriesMap } from '@/app/search/components/channel-multi-filter';
import { formatDate, formatNumber } from '@/lib/utils';

export const CHANNELS_COLUMNS: ColumnDef<IChannel>[] = [
  {
    id: 'select',
    size: 40,
    maxSize: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: '채널',
    maxSize: 220,
    minSize: 170,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 py-2 text-xs">
        <Avatar className="h-6 w-6">
          <AvatarImage src={row.original.thumbnailUrl ?? ''} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="line-clamp-1 font-medium">{row.original.name}</div>
          {row.original.handle && (
            <div className="text-muted-foreground text-sm">
              {row.original.handle}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'regionCode',
    header: '국가',
    maxSize: 50,
    cell: ({ row }) => (
      <p className="text-xs">
        {row.original.regionCode === ''
          ? '-'
          : (countriesMap[row.original.regionCode] ?? 'other')}
      </p>
    ),
  },
  {
    accessorKey: 'subscriberCount',
    header: '구독자 수',
    size: 50,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatNumber(row.original.subscriberCount)}
      </span>
    ),
  },
  {
    accessorKey: 'viewCount',
    header: '총 조회수',
    size: 120,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatNumber(row.original.viewCount)}
      </span>
    ),
  },
  {
    accessorKey: 'dailyViewCount',
    header: '일일 조회수',
    size: 120,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatNumber(row.original.dailyViewCount)}
      </span>
    ),
  },
  {
    accessorKey: 'videoCount',
    header: '영상 수',
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatNumber(row.original.videoCount)}
      </span>
    ),
  },
  {
    accessorKey: 'lastVideoUploadedAt',
    header: '마지막 업로드',
    size: 120,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatDate(row.original.lastVideoUploadedAt)}
      </span>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: '개설일',
    size: 120,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatDate(row.original.publishedAt)}
      </span>
    ),
  },
];
