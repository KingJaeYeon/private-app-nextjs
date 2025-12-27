// src/components/data-table.tsx
import * as React from 'react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  type Table as typeTable,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useMeasure from 'react-use-measure';
import useTableStore from '@/store/use-table-store';
import { cn, FontSize } from '@/lib/utils';
import { animated, useSpring } from '@react-spring/web';
import useSyncScroll from '@/hooks/use-sync-scroll';

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableControls?: (table: typeTable<TData>) => ReactNode;
  enableMultiRowSelection?: boolean;
  enableRowClickSelection?: boolean;
  onSelectedRow?: (row: TData | null) => void;
  hasNo?: boolean;
  isFixHeader?: boolean;
  fontSize?: { head?: FontSize; cell?: FontSize };
  name?: string;
  isEdit?: boolean;
  initialSorting?: SortingState;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isFixHeader = false,
  name = 'default',
  onSelectedRow,
  enableMultiRowSelection,
  enableRowClickSelection,
  hasNo,
  fontSize,
  isEdit,
  initialSorting,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [ref, { height }] = useMeasure();
  const tableMeasure = useMeasure();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting:
        sorting.length === 0 && initialSorting ? initialSorting : sorting,
      columnVisibility: {
        createdAt: false,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: true,
    enableMultiRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: {
      size: 80,
      minSize: 20,
      maxSize: 600,
    },
  });

  const { setTriggerHeight, getTriggerHeight, getHeaderWidth } =
    useTableStore();
  const [isFixedHeader, setIsFixedHeader] = useState(false);

  const props = useSpring({
    opacity: isFixedHeader ? 1 : 0,
    height: isFixedHeader ? height : 0,
  });

  const [ref1, ref2] = useSyncScroll(isFixedHeader);

  // 스크롤 가능한 부모 찾기
  const findScrollableParent = (
    element: HTMLElement | null,
  ): HTMLElement | null => {
    if (!element) return null;

    let parent = element.parentElement;
    while (parent) {
      const { overflow, overflowY } = window.getComputedStyle(parent);
      if (
        overflow === 'auto' ||
        overflow === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll'
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  // 초기 triggerHeight 설정
  useEffect(() => {
    if (!isFixHeader || !scrollContainerRef.current) return;

    const triggerHeight = getTriggerHeight(name);
    if (triggerHeight === undefined || triggerHeight === 0) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      // window 스크롤 또는 부모 스크롤 확인
      const scrollableParent = findScrollableParent(scrollContainerRef.current);
      if (scrollableParent) {
        setTriggerHeight(containerRect.top, name);
      } else {
        setTriggerHeight(containerRect.top + window.scrollY, name);
      }
    }
  }, [isFixHeader, name, getTriggerHeight, setTriggerHeight]);

  // 스크롤 이벤트 감지 (window 또는 부모 컨테이너)
  useEffect(() => {
    if (!isFixHeader || !scrollContainerRef.current) return;

    const scrollableParent = findScrollableParent(scrollContainerRef.current);
    const scrollTarget = scrollableParent || window;

    function handleScroll() {
      let currentScrollY: number;

      if (scrollableParent) {
        // 부모 컨테이너 스크롤
        currentScrollY = scrollableParent.scrollTop;
      } else {
        // window 스크롤
        currentScrollY = window.scrollY;
      }

      const triggerHeight = getTriggerHeight(name);

      if (triggerHeight > currentScrollY) {
        setIsFixedHeader(false);
      } else {
        setIsFixedHeader(true);
      }
    }

    scrollTarget.addEventListener('scroll', handleScroll);
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
    };
  }, [isFixHeader, name, getTriggerHeight]);

  // cleanup
  useEffect(() => {
    return () => {
      setTriggerHeight(0, name);
    };
  }, [name, setTriggerHeight]);

  useEffect(() => {
    table.setRowSelection({});
  }, [isEdit, table]);

  // ref1과 scrollContainerRef 통합
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollContainerRef.current = node;
      ref1.current = node;
    },
    [ref1],
  );
  return (
    <div className={'flex flex-1 flex-col'} ref={setRefs}>
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
        className={'scrollNone relative flex flex-1 rounded-md border'}
      >
        <div
          style={{
            width: '100%',
          }}
          ref={tableMeasure[0]}
        >
          {isFixHeader && isFixedHeader && (
            <animated.div
              className={'bg-background fixed z-[50] flex flex-row border-b-2'}
              style={{
                ...props,
                top: `${getTriggerHeight(name)}px`,
                left: `${tableMeasure[1].left}px`,
              }}
            >
              <div
                className={'scrollNone hover:bg-muted/50 flex'}
                ref={ref2}
                style={{
                  width: tableMeasure[1].width,
                  overflow: 'auto',
                }}
              >
                {table.getHeaderGroups().map((headerGroup, i) => (
                  <div className={'flex'} key={'headerGroupFix' + i}>
                    {headerGroup.headers.map((h) => {
                      const canSort = h.column.getCanSort?.() ?? false;
                      const sortDir = h.column.getIsSorted?.();
                      const onClick = h.column.getToggleSortingHandler?.();
                      return (
                        <div
                          key={name + h.id}
                          className={cn(
                            `flex text-left align-middle font-medium whitespace-nowrap`,
                            canSort && 'cursor-pointer select-none',
                            hasNo && h.id === 'no' && 'pr-0',
                          )}
                        >
                          <div
                            onClick={canSort ? onClick : undefined}
                            className={cn(
                              'flex items-center justify-start text-center text-sm',
                              fontSize?.head && fontSize.head,
                            )}
                            style={{
                              width: getHeaderWidth(`${name}-${h.id}`),
                            }}
                          >
                            <span className="px-1.5 text-center">
                              {h.isPlaceholder
                                ? null
                                : flexRender(
                                    h.column.columnDef.header,
                                    h.getContext(),
                                  )}
                              {canSort && (
                                <span className="text-muted-foreground ml-1">
                                  {sortDir === 'asc'
                                    ? '▲'
                                    : sortDir === 'desc'
                                      ? '▼'
                                      : ''}
                                  {h.column.getSortIndex() !== -1 && (
                                    <span className="text-xs">
                                      {h.column.getSortIndex() + 1}
                                    </span>
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </animated.div>
          )}

          <Table className="relative">
            <TableHeader className="bg-background z-10" ref={ref}>
              {table.getHeaderGroups().map((hg, i) => (
                <TableRow key={'headerGroup' + i}>
                  {hg.headers.map((h, i) => {
                    const canSort = h.column.getCanSort?.() ?? false;
                    const sortDir = h.column.getIsSorted?.();
                    const onClick = h.column.getToggleSortingHandler?.();
                    return (
                      <TableHead
                        key={'headerChild' + i}
                        headerKey={`${name}-${h.id}`}
                        onClick={canSort ? onClick : undefined}
                        className={cn(
                          canSort ? 'cursor-pointer select-none' : '',
                          hasNo && h.id === 'no' && 'pr-0',
                          fontSize?.head && fontSize.head,
                        )}
                        aria-sort={
                          sortDir === false
                            ? 'none'
                            : sortDir === 'asc'
                              ? 'ascending'
                              : 'descending'
                        }
                      >
                        <span className="text-center">
                          {h.isPlaceholder
                            ? null
                            : flexRender(
                                h.column.columnDef.header,
                                h.getContext(),
                              )}
                          {canSort && (
                            <span className="text-muted-foreground ml-1">
                              {sortDir === 'asc'
                                ? '▲'
                                : sortDir === 'desc'
                                  ? '▼'
                                  : ''}
                              {h.column.getSortIndex() !== -1 && (
                                <span className="text-xs text-gray-400">
                                  {h.column.getSortIndex() + 1}
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                <>
                  {table.getRowModel().rows.map((r) => {
                    return (
                      <TableRow
                        key={r.id}
                        data-state={r.getIsSelected() && 'selected'}
                        onClick={() => {
                          if (enableRowClickSelection) {
                            const isSelected = r.getIsSelected();
                            r.toggleSelected(!isSelected);
                            !!onSelectedRow &&
                              onSelectedRow(!isSelected ? r.original : null);
                          } else {
                            !!onSelectedRow && onSelectedRow(r.original);
                          }
                        }}
                        className={cn(
                          onSelectedRow ? 'hover:cursor-pointer' : undefined,
                        )}
                      >
                        {r.getVisibleCells().map((c) => (
                          <TableCell
                            key={c.id}
                            className={cn(
                              hasNo && c.column.columnDef.id === `no` && 'pr-0',
                              fontSize?.cell && fontSize.cell,
                            )}
                            style={{
                              width: c.column.columnDef.size,
                              maxWidth: c.column.columnDef.maxSize,
                              minWidth: c.column.columnDef.minSize,
                            }}
                          >
                            {flexRender(
                              c.column.columnDef.cell,
                              c.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={'h-24 text-center'}
                  >
                    결과 없음
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
