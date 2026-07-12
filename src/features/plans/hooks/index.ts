"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchModels, fetchPlans, fetchPrices } from "../services";

const CATALOG_STALE_TIME = 6 * 60 * 60 * 1000; // 6 hours — catalog changes rarely

export function usePlans() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: CATALOG_STALE_TIME
  });
  return { plans: data ?? [], error, isLoading };
}

export function useModels() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
    staleTime: CATALOG_STALE_TIME
  });
  return { models: data ?? [], error, isLoading };
}

export function usePrices() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    staleTime: CATALOG_STALE_TIME
  });
  return { prices: data ?? [], error, isLoading };
}
