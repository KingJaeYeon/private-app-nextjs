'use client';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

import { ChevronsUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export type Option = {
  label: string;
  value: string;
};

export type MultiSelectDropBoxProps = {
  options: Option[];
  selected: string[]; // controlled
  setSelected: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  maxHeight?: number; // px for the list, default 280
  syncWithUrl?: { key: string };
  prefix?: string;
};

export default function MultiSelectDropBox({
  options,
  selected,
  setSelected,
  placeholder = '전체 선택',
  disabled,
  className,
  popoverClassName,
  maxHeight = 280,
  syncWithUrl,
  prefix,
}: MultiSelectDropBoxProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedOptions = useMemo(
    () => options.filter((o) => selected.includes(o.value)),
    [options, selected],
  );

  const allValues = useMemo(() => options.map((o) => o.value), [options]);

  const toggle = (v: string) => {
    if (selected.includes(v)) setSelected(selected.filter((x) => x !== v));
    else setSelected([...selected, v]);
  };

  const applyUrlSync = React.useCallback(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams(searchParams.toString());
    const key = syncWithUrl.key;

    if (selected.length > 0) params.set(key, selected.join(','));
    else params.delete(key);

    router.push('?' + params.toString());
  }, [router, searchParams, selected, syncWithUrl]);

  const selectAllValues = () => {
    if (selected.length === allValues.length) {
      setSelected([]);
      return;
    }
    setSelected(allValues);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);

    if (!open) applyUrlSync();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Multi select"
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            {selectedOptions.length === 1 ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate text-sm">
                  {prefix ? `${prefix}:` : null} {selectedOptions[0]?.label}
                </span>
              </div>
            ) : selectedOptions.length > 1 ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate text-sm">
                  {prefix ? `${prefix}:` : null} {selectedOptions[0]?.label} 외{' '}
                  {selected.length - 1}개
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground truncate">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-lg p-0',
          popoverClassName,
        )}
        align="start"
      >
        <ScrollArea style={{ maxHeight }} className={'flex flex-col'}>
          <button
            className="dark:hover:bg-input/50 dark:border-border flex w-full items-center gap-3 border-b border-gray-100 p-2 text-left transition-colors last:border-b-0 hover:bg-gray-50"
            onClick={selectAllValues}
          >
            전체 선택
          </button>
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="dark:hover:bg-input/50 dark:border-border flex w-full items-center gap-3 border-b border-gray-100 p-2 text-left transition-colors last:border-b-0 hover:bg-gray-50"
              >
                <div className="mr-2 flex items-center justify-center">
                  <Checkbox checked={checked} aria-label={opt.label} />
                </div>
                <span className="flex-1 truncate">{opt.label}</span>
              </div>
            );
          })}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Usage example:
// const [tags, setTags] = useState<string[]>([]);
// const options: Option[] = [...];
// <MultiSelectDropBox options={options} selected={tags} setSelected={setTags} />
