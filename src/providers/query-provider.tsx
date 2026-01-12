"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes - veri 10 dakika boyunca fresh (önce 5 dakikaydı)
            gcTime: 30 * 60 * 1000, // 30 minutes - unused cache 30 dakika sonra temizlenir (önce 10 dakikaydı)
            refetchOnWindowFocus: false, // Pencere focus aldığında otomatik refetch yapma
            refetchOnMount: false, // Component mount olduğunda otomatik refetch yapma
            refetchOnReconnect: true, // İnternet bağlantısı koptuğunda refetch yap
            retry: 1, // Hata durumunda 1 kez daha dene
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
