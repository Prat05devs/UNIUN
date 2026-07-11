"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../services";
import { RazorpayPaymentResponse } from "../types";

export function useCreateOrder() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ amount, currency }: { amount: number; currency?: string }) =>
      createOrder(amount, currency)
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
    }
  });
  return { verifyPayment: mutateAsync, isVerifying: isPending };
}
