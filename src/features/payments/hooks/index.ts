"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, createPlanOrder, verifyPayment } from "../services";
import { RazorpayPaymentResponse } from "../types";

export function useCreateOrder() {
  const { mutateAsync, isPending } = useMutation({
    // A plan purchase names the plan (server-side price); a top-up names the
    // amount in paise. Exactly one of the two.
    mutationFn: (input: { amount: number; currency?: string } | { plan: string }) =>
      "plan" in input
        ? createPlanOrder(input.plan)
        : createOrder(input.amount, input.currency)
  });
  return { createOrder: mutateAsync, isCreating: isPending };
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RazorpayPaymentResponse) => verifyPayment(payload),
    onSuccess: (result) => {
      // The server computed the new wallet balance — refetch rather than
      // recompute it locally.
      if (result.credited != null) {
        void queryClient.invalidateQueries({ queryKey: ["credits"] });
      }
      // A plan purchase already re-assigned the account's plan server-side —
      // refetch everything that renders it (badge, model picker, credits).
      if (result.plan) {
        void queryClient.invalidateQueries({ queryKey: ["profile"] });
        void queryClient.invalidateQueries({ queryKey: ["credits"] });
      }
    }
  });
  return { verifyPayment: mutateAsync, isVerifying: isPending };
}
