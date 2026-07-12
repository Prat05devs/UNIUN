"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RequestError } from "@/lib/api";
import {
  adjustCredits,
  createPlan,
  deleteModel,
  deletePlan,
  deletePrice,
  fetchAdminAccounts,
  fetchAdminModels,
  fetchAdminPlans,
  fetchAdminPrices,
  fetchAdminStats,
  fetchCliproxyModels,
  fetchProviders,
  patchPlan,
  updateAccount,
  updateProvider,
  upsertModel,
  upsertPrice
} from "../services";
import {
  AdminAccount,
  AdminModel,
  AdminPlan,
  AdminPrice,
  CreditOp
} from "../types";

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

// --- plans (price + models) ---

export function useAdminPlans() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: fetchAdminPlans,
    staleTime: 0
  });
  return { plans: data ?? [], error, isLoading };
}

function replacePlanInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  saved: AdminPlan
) {
  queryClient.setQueryData(["admin", "plans"], (old: AdminPlan[] = []) => {
    const exists = old.some((p) => p.name === saved.name);
    return exists
      ? old.map((p) => (p.name === saved.name ? saved : p))
      : [...old, saved];
  });
  // The public AI Inference page reads the same table.
  void queryClient.invalidateQueries({ queryKey: ["plans"] });
}

export function useSavePlan() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ plan, isNew }: { plan: AdminPlan; isNew: boolean }) => {
      if (isNew) return createPlan(plan);
      const { name, ...updates } = plan;
      return patchPlan(name, updates);
    },
    onSuccess: (saved) => replacePlanInCache(queryClient, saved)
  });
  return { savePlan: mutateAsync, isSaving: isPending };
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (name: string) => deletePlan(name),
    onSuccess: (_res, name) => {
      queryClient.setQueryData(["admin", "plans"], (old: AdminPlan[] = []) =>
        old.filter((p) => p.name !== name)
      );
      void queryClient.invalidateQueries({ queryKey: ["plans"] });
    }
  });
  return { deletePlan: mutateAsync, isDeleting: isPending };
}

// --- model catalog ---

export function useAdminModels() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin", "models"],
    queryFn: fetchAdminModels,
    staleTime: 0
  });
  return { models: data ?? [], error, isLoading };
}

export function useUpsertModel() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      id,
      ...updates
    }: {
      id: string;
      display_name: string;
      backend: string;
      available?: boolean;
    }) => upsertModel(id, updates),
    onSuccess: (saved) => {
      queryClient.setQueryData(["admin", "models"], (old: AdminModel[] = []) => {
        const exists = old.some((m) => m.id === saved.id);
        return exists
          ? old.map((m) => (m.id === saved.id ? saved : m))
          : [...old, saved];
      });
      // Availability changes show up in the public catalog immediately.
      void queryClient.invalidateQueries({ queryKey: ["models"] });
    }
  });
  return { upsertModel: mutateAsync, isSaving: isPending };
}

export function useDeleteModel() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteModel(id),
    onSuccess: (_res, id) => {
      queryClient.setQueryData(["admin", "models"], (old: AdminModel[] = []) =>
        old.filter((m) => m.id !== id)
      );
      void queryClient.invalidateQueries({ queryKey: ["models"] });
    }
  });
  return { deleteModel: mutateAsync, isDeleting: isPending };
}

// Fetched on demand (button click) — the sidecar may be down, and that's fine.
export function useCliproxyModels(enabled: boolean) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin", "cliproxy-models"],
    queryFn: fetchCliproxyModels,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false
  });
  return { discovered: data ?? [], error, isLoading };
}

// --- provider credentials ---

export function useProviders() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin", "providers"],
    queryFn: fetchProviders,
    staleTime: 0
  });
  return { providers: data ?? [], error, isLoading };
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      provider,
      ...updates
    }: {
      provider: string;
      api_key?: string;
      base_url?: string;
    }) => updateProvider(provider, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "providers"] });
    }
  });
  return { updateProvider: mutateAsync, isSaving: isPending };
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
