'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setTheme((cur) => (cur === 'dark' ? 'light' : 'dark'))}
        >
          <Sun className="absolute size-1 h-[1.5rem] w-[1.5rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <Moon className="size-1 h-[1.5rem] w-[1.5rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === 'dark' ? '밝은 테마' : '어두운 테마'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
