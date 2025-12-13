'use client';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ModalRenderer from '@/components/modal-renderer';
import { IPayload } from '@/lib/auth';
import { useAuthStore } from '@/store/auth-store';
import { TooltipProvider } from '@/components/ui/tooltip';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  user: IPayload | null;
};

export default function AppProvider({ children, user }: Props) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnReconnect: true,
            retry: (failureCount, error: any) => {
              if (error?.response?.status === 401) {
                return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: (failureCount, error: any) => {
              if (error?.response?.status === 401) {
                return failureCount < 1;
              }
              return false;
            },
          },
        },
      }),
    [],
  );

  const { initialize } = useAuthStore();

  useLayoutEffect(() => {
    initialize(user);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        <ModalRenderer />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
//const { data: products, isLoading, error } = useQuery({
//     queryKey: ['products'],
//     queryFn: async () => {
//       const { data } = await clientAxios.get('/products');
//       return data;
//     },
//     staleTime: 60 * 1000, // 1분
//   });
