'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
};

export default function SystemProvider({ children }: Props) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: true,
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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
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
