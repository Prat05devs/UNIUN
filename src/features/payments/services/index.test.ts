import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createOrder, verifyPayment } from "./index";
import { SESSION_STORAGE_KEY } from "@/types/constant";

const okJson = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });

describe("payments services", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  describe("createOrder", () => {
    it("posts amount/currency and parses the flat order response", async () => {
      fetchMock.mockResolvedValue(
        okJson({ order_id: "order_abc", amount: 50000, currency: "INR" })
      );
      const order = await createOrder(50000);
      expect(order).toEqual({
        order_id: "order_abc",
        amount: 50000,
        currency: "INR"
      });
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toContain("/uniun/v1/payments/orders");
      expect(JSON.parse(init.body)).toEqual({ amount: 50000, currency: "INR" });
    });

    it("carries the session Bearer so a logged-in top-up is tied to the account", async () => {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ apiKey: "uk_topup" })
      );
      fetchMock.mockResolvedValue(
        okJson({ order_id: "o", amount: 50000, currency: "INR" })
      );
      await createOrder(50000);
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers.Authorization).toBe("Bearer uk_topup");
    });

    it("rejects a malformed order response (Zod)", async () => {
      fetchMock.mockResolvedValue(okJson({ order_id: 123, amount: "bad" }));
      await expect(createOrder(50000)).rejects.toThrow();
    });
  });

  describe("verifyPayment", () => {
    const payload = {
      razorpay_order_id: "order_abc",
      razorpay_payment_id: "pay_xyz",
      razorpay_signature: "f".repeat(64)
    };

    it("parses verified with the credited amount", async () => {
      fetchMock.mockResolvedValue(okJson({ verified: true, credited: 500 }));
      const result = await verifyPayment(payload);
      expect(result.verified).toBe(true);
      expect(result.credited).toBe(500);
    });

    it("parses an anonymous verify (no credited field)", async () => {
      fetchMock.mockResolvedValue(
        okJson({ verified: true, order_id: "order_abc", payment_id: "pay_xyz" })
      );
      const result = await verifyPayment(payload);
      expect(result.verified).toBe(true);
      expect(result.credited).toBeUndefined();
    });

    it("never sends a Bearer token (only create-order carries the key)", async () => {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ apiKey: "uk_topup" })
      );
      fetchMock.mockResolvedValue(okJson({ verified: true }));
      await verifyPayment(payload);
      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers.Authorization).toBeUndefined();
    });

    it("returns verified: false untouched so the UI can reject the payment", async () => {
      fetchMock.mockResolvedValue(okJson({ verified: false }, 200));
      const result = await verifyPayment(payload);
      expect(result.verified).toBe(false);
    });
  });
});
