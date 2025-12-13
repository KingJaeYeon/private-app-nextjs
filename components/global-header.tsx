import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/providers/theme-provider';

export function GlobalHeader() {
  return (
    <div
      className={cn(
        'drag bg-background flex h-[60px] w-full items-center justify-between border-b px-3',
      )}
    >
      <div className={cn('no-drag flex items-center gap-2')}>
        <ThemeToggle />
      </div>
    </div>
  );
}
