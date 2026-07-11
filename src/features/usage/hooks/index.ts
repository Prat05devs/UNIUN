"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchCredits, fetchUsage } from "../services";

export const USAGE_PER_PAGE = 20;

export function useCredits() {
  const { session } = useAuth();
  const { data: credits, error, isLoading } = useQuery({
    queryKey: ["credits"],
    queryFn: fetchCredits,
    enabled: !!session,
    staleTime: 0 // balance changes on every top-up and metered request
  });
  return { credits, error, isLoading };
}

export function useUsage(page: number) {
  const { session } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ["usage", page],
    queryFn: () => fetchUsage(page, USAGE_PER_PAGE),
    enabled: !!session
  });
  return {
    rows: data?.data ?? [],
    pagination: data?.pagination,
    error,
    isLoading
  };
}
