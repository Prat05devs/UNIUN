import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RequestError } from "@/lib/api";
import { useRazorpayCheckout } from "./useRazorpayCheckout";
import { RazorpayPaymentResponse } from "../types";

vi.mock("../services", () => ({
  createOrder: vi.fn(),
  verifyPayment: vi.fn()
}));

import { createOrder, verifyPayment } from "../services";

const createOrderMock = vi.mocked(createOrder);
const verifyPaymentMock = vi.mocked(verifyPayment);

const paymentResponse: RazorpayPaymentResponse = {
  razorpay_order_id: "order_abc",
  razorpay_payment_id: "pay_xyz",
  razorpay_signature: "f".repeat(64)
};

// Captures the options passed to `new Razorpay(...)` and lets each test drive
// the modal outcome (success handler, dismiss, payment.failed).
class FakeRazorpay {
  static lastInstance: FakeRazorpay | undefined;
  options: Record<string, any>;
  handlers: Record<string, (r: unknown) => void> = {};

  constructor(options: Record<string, any>) {
    this.options = options;
    FakeRazorpay.lastInstance = this;
  }
  open() {}
  on(event: string, handler: (r: unknown) => void) {
    this.handlers[event] = handler;
  }
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function renderCheckout() {
  return renderHook(
    () => useRazorpayCheckout({ amount: 50000, description: "test" }),
    { wrapper }
  );
}

describe("useRazorpayCheckout", () => {
  beforeEach(() => {
    (window as any).Razorpay = FakeRazorpay;
    FakeRazorpay.lastInstance = undefined;
    createOrderMock.mockResolvedValue({
      order_id: "order_abc",
      amount: 50000,
      currency: "INR"
    });
  });

  afterEach(() => {
    delete (window as any).Razorpay;
    vi.clearAllMocks();
  });

  it("errors without opening checkout when the script has not loaded", async () => {
    delete (window as any).Razorpay;
    const { result } = renderCheckout();

    await act(() => result.current.handleCheckout());

    expect(result.current.status).toMatchObject({ state: "error" });
    expect(createOrderMock).not.toHaveBeenCalled();
  });

  it("passes the created order to the Razorpay modal", async () => {
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    const opts = FakeRazorpay.lastInstance!.options;
    expect(opts.order_id).toBe("order_abc");
    expect(opts.amount).toBe(50000);
    expect(opts.currency).toBe("INR");
    expect(createOrderMock).toHaveBeenCalledWith(50000, "INR");
  });

  it("reaches success with the credited amount once verify confirms", async () => {
    verifyPaymentMock.mockResolvedValue({ verified: true, credited: 500 });
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    await act(async () => {
      await FakeRazorpay.lastInstance!.options.handler(paymentResponse);
    });

    await waitFor(() =>
      expect(result.current.status).toEqual({
        state: "success",
        paymentId: "pay_xyz",
        credited: 500
      })
    );
    expect(verifyPaymentMock).toHaveBeenCalledWith(paymentResponse);
  });

  it("treats verified: false as a failed payment", async () => {
    verifyPaymentMock.mockResolvedValue({ verified: false });
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    await act(async () => {
      await FakeRazorpay.lastInstance!.options.handler(paymentResponse);
    });

    await waitFor(() =>
      expect(result.current.status).toMatchObject({
        state: "error",
        message: "Payment could not be verified."
      })
    );
  });

  it("errors when verify itself fails", async () => {
    verifyPaymentMock.mockRejectedValue(
      new RequestError("invalid signature", "bad_signature", 400)
    );
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    await act(async () => {
      await FakeRazorpay.lastInstance!.options.handler(paymentResponse);
    });

    await waitFor(() =>
      expect(result.current.status).toMatchObject({
        state: "error",
        message: "invalid signature"
      })
    );
  });

  it("reports a cancelled payment when the modal is dismissed", async () => {
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    act(() => FakeRazorpay.lastInstance!.options.modal.ondismiss());

    expect(result.current.status).toMatchObject({
      state: "error",
      message: "Payment cancelled. You can try again anytime."
    });
  });

  it("surfaces the payment.failed description", async () => {
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    act(() =>
      FakeRazorpay.lastInstance!.handlers["payment.failed"]({
        error: { description: "Card declined" }
      })
    );

    expect(result.current.status).toMatchObject({
      state: "error",
      message: "Card declined"
    });
  });

  it("surfaces the gateway error when order creation fails", async () => {
    createOrderMock.mockRejectedValue(
      new RequestError("payment provider unavailable", "upstream_error", 502)
    );
    const { result } = renderCheckout();
    await act(() => result.current.handleCheckout());

    await waitFor(() =>
      expect(result.current.status).toMatchObject({
        state: "error",
        message: "payment provider unavailable"
      })
    );
    expect(FakeRazorpay.lastInstance).toBeUndefined();
  });
});
