"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import {
  createQueryClient,
  getQueryUserId,
  removeOtherUserQueries,
} from "@/lib/query-cache";
import { useAuthStore } from "@/store/auth.store";

type Props = {
  children: ReactNode;
};

export function QueryProvider({ children }: Props) {
  // The factory runs per provider/request, never as a server-shared singleton.
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    let userId = getQueryUserId(useAuthStore.getState());
    removeOtherUserQueries(queryClient, userId);

    // Subscribe directly so cleanup accompanies the identity change instead of
    // waiting for a render. Same-account refreshes/profile edits keep the cache.
    return useAuthStore.subscribe((session) => {
      const nextUserId = getQueryUserId(session);
      if (nextUserId === userId) return;

      userId = nextUserId;
      removeOtherUserQueries(queryClient, userId);
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
