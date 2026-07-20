"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HandoffNotice } from "@/features/auth/component/handoff-notice";
import { AuthProvider } from "@/features/auth/hooks/useAuth";

export default function Provider({ children }: { children: React.ReactNode }) {
  // useState ensures a new QueryClient per request in SSR — do NOT use a
  // module-level constant.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60, // 1 hour in memory
            staleTime: 1000 * 60 * 10 // 10 minutes fresh
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HandoffNotice />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
