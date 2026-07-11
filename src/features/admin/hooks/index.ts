"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RequestError } from "@/lib/api";
import {
  adjustCredits,
  deletePrice,
  fetchAdminAccounts,
  fetchAdminPrices,
  fetchAdminStats,
  updateAccount,
  upsertPrice
} from "../services";
import { AdminAccount, AdminPrice, CreditOp } from "../types";

export const ACCOUNTS_PER_PAGE = 20;

// Doubles as the admin gate: `isAdmin` is only true once /admin/stats has
// answered 200 for this session's key. A 403 not_admin means a regular user.
export function useAdminStats() {
  const { session } = useAuth();
  const { data: stats, error, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    enabled: !!session,
    staleTime: 60 * 1000,
    retry: false
  });

  const denied =
    error instanceof RequestError &&
    (error.type === "not_admin" ||
      error.type === "forbidden" ||
      error.statusCode === 401);

  return { stats, error, isLoading, isAdmin: !!stats, denied };
}

export function useAdminAccounts(page: number, q: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin", "accounts", page, q],
    queryFn: () => fetchAdminAccounts(page, ACCOUNTS_PER_PAGE, q),
    staleTime: 0
  });
  return {
    accounts: data?.data ?? [],
    pagination: data?.pagination,
    error,
    isLoading
  };
}

function patchAccountsCache(
  queryClient: ReturnType<typeof useQueryClient>,
  updated: AdminAccount
) {
  queryClient.setQueriesData(
    { queryKey: ["admin", "accounts"] },
    (old: { data: AdminAccount[] } | undefined) =>
      old && {
        ...old,
        data: old.data.map((a) => (a.id === updated.id ? updated : a))
      }
  );
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      ...updates
    }: {
      id: string;
      plan?: string;
      role?: "user" | "admin";
    }) => updateAccount(id, updates),
    onSuccess: (updated) => patchAccountsCache(queryClient, updated)
  });
  return { updateAccount: mutateAsync, isUpdating: isPending };
}

export function useAdjustCredits() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      op,
      amount,
      reason
    }: {
      id: string;
      op: CreditOp;
      amount: number;
      reason: string;
    }) => adjustCredits(id, op, amount, reason),
    onSuccess: (result, { id }) => {
      queryClient.setQueriesData(
        { queryKey: ["admin", "accounts"] },
        (old: { data: AdminAccount[] } | undefined) =>
          old && {
            ...old,
            data: old.data.map((a) =>
              a.id === id ? { ...a, balance: result.balance } : a
            )
          }
      );
    }
  });
  return { adjustCredits: mutateAsync, isAdjusting: isPending };
}

export function useAdminPrices() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin", "prices"],
    queryFn: fetchAdminPrices,
    staleTime: 0
  });
  return { prices: data ?? [], error, isLoading };
}

export function useUpsertPrice() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      model,
      inputPerMtok,
      outputPerMtok
    }: {
      model: string;
      inputPerMtok: number;
      outputPerMtok: number;
    }) => upsertPrice(model, inputPerMtok, outputPerMtok),
    onSuccess: (saved) => {
      queryClient.setQueryData(
        ["admin", "prices"],
        (old: AdminPrice[] = []) => {
          const exists = old.some((p) => p.model === saved.model);
          return exists
            ? old.map((p) => (p.model === saved.model ? saved : p))
            : [...old, saved];
        }
      );
      // The public pricing page reads the same table.
      void queryClient.invalidateQueries({ queryKey: ["prices"] });
    }
  });
  return { upsertPrice: mutateAsync, isSaving: isPending };
}

export function useDeletePrice() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (model: string) => deletePrice(model),
    onSuccess: (_res, model) => {
      queryClient.setQueryData(["admin", "prices"], (old: AdminPrice[] = []) =>
        old.filter((p) => p.model !== model)
      );
      void queryClient.invalidateQueries({ queryKey: ["prices"] });
    }
  });
  return { deletePrice: mutateAsync, isDeleting: isPending };
}
