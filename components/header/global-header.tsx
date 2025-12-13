import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/providers/theme-provider';
import { UserMenu } from '@/components/header/user-menu';
import { HomeLogo } from '@/components/header/home-logo';

export function GlobalHeader() {
  return (
    <div
      className={cn(
        'drag bg-background flex h-[60px] w-full items-center justify-between border-b px-4',
      )}
    >
      <HomeLogo />
      <div className={cn('no-drag flex items-center gap-2')}>
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  );
}
