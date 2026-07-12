import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient, RequestError } from "./api";
import { SESSION_STORAGE_KEY } from "@/types/constant";

const okJson = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });

describe("apiClient", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("returns the envelope for enveloped routes", async () => {
    fetchMock.mockResolvedValue(okJson({ data: { plan: "subscription" } }));
    const res = await apiClient.get<{ plan: string }>("/uniun/v1/credits");
    expect(res.data.plan).toBe("subscription");
  });

  it("returns flat JSON from postRaw (payments routes are un-enveloped)", async () => {
    fetchMock.mockResolvedValue(
      okJson({ order_id: "order_1", amount: 50000, currency: "INR" })
    );
    const res = await apiClient.postRaw<{ order_id: string }>(
      "/uniun/v1/payments/orders",
      { amount: 50000 }
    );
    expect(res.order_id).toBe("order_1");
    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ amount: 50000 });
  });

  it("attaches the stored session Bearer token by default", async () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ apiKey: "uk_test123" })
    );
    fetchMock.mockResolvedValue(okJson({ data: [] }));
    await apiClient.get("/uniun/v1/usage");
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer uk_test123");
  });

  it("omits the token when auth: false", async () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ apiKey: "uk_test123" })
    );
    fetchMock.mockResolvedValue(okJson({ verified: true }));
    await apiClient.postRaw("/uniun/v1/payments/verify", {}, { auth: false });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("sends no token when nothing is stored", async () => {
    fetchMock.mockResolvedValue(okJson({ order_id: "o", amount: 1, currency: "INR" }));
    await apiClient.postRaw("/uniun/v1/payments/orders", { amount: 100 });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("throws RequestError carrying the gateway error type and status", async () => {
    fetchMock.mockResolvedValue(
      okJson(
        { error: { message: "invalid signature", type: "bad_signature" } },
        401
      )
    );
    const err = await apiClient
      .post("/uniun/v1/auth/login", {})
      .catch((e) => e);
    expect(err).toBeInstanceOf(RequestError);
    expect(err.type).toBe("bad_signature");
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("invalid signature");
  });

  it("maps a non-JSON error body to type unknown with the HTTP status", async () => {
    fetchMock.mockResolvedValue(new Response("gateway exploded", { status: 502 }));
    const err = await apiClient.get("/uniun/v1/plans").catch((e) => e);
    expect(err).toBeInstanceOf(RequestError);
    expect(err.type).toBe("unknown");
    expect(err.statusCode).toBe(502);
  });

  it("maps fetch failures to network_error with status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const err = await apiClient.get("/uniun/v1/plans").catch((e) => e);
    expect(err).toBeInstanceOf(RequestError);
    expect(err.type).toBe("network_error");
    expect(err.statusCode).toBe(0);
  });
});
