"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchKeys, mintKey, revokeKey } from "../services";

export const KEYS_PER_PAGE = 20;

export function useKeys(page: number) {
  const { session } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ["keys", page],
    queryFn: () => fetchKeys(page, KEYS_PER_PAGE),
    enabled: !!session,
    staleTime: 0
  });
  return {
    keys: data?.data ?? [],
    pagination: data?.pagination,
    error,
    isLoading
  };
}

export function useMintKey() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (name: string) => mintKey(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["keys"] });
    }
  });
  return { mintKey: mutateAsync, isMinting: isPending };
}

export function useRevokeKey() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => revokeKey(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["keys"] });
    }
  });
  return { revokeKey: mutateAsync, isRevoking: isPending };
}
