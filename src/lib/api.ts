import { GATEWAY_URL, HANDOFF_TOKEN_KEY, SESSION_STORAGE_KEY } from "@/types/constant";
import type { Pagination } from "@/types/common";

// Gateway error type codes are stable — branch on `type`, show `message`.
// Registry: uniun-inference internal/core/errors.go (unauthorized,
// invalid_api_key, bad_signature, challenge_invalid, insufficient_credit,
// rate_limited, ...). "network_error" is ours, for fetch-level failures.
export class RequestError extends Error {
  type: string;
  statusCode: number;

  constructor(message: string, type: string, statusCode: number) {
    super(message);
    this.name = "RequestError";
    this.type = type;
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }
  }
}

// Envelope used by /uniun/v1/* routes: { data } or { data, pagination }.
// The payments routes return flat JSON instead — use postRaw for those.
export type Enveloped<T> = {
  data: T;
  pagination?: Pagination;
};

type RequestOptions = RequestInit & {
  // Attach the stored session's Bearer token (default true). Public routes
  // (challenge, login, plans, prices, payment verify) opt out so a stale key
  // never pollutes them.
  auth?: boolean;
};

function storedApiKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const session = JSON.parse(raw) as { apiKey?: unknown };
      if (typeof session.apiKey === "string") return session.apiKey;
    }
  } catch {
    // fall through to the hand-off token
  }
  // No persisted login — fall back to a mobile hand-off token, if one was
  // captured into sessionStorage this tab (docs/frontend/BACKEND-UPDATES-web.md
  // §1b). It's short-lived and un-renewable; a 401 here just means it expired.
  return window.sessionStorage.getItem(HANDOFF_TOKEN_KEY);
}

async function rawRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, ...init } = options;
  const token = auth ? storedApiKey() : null;

  let response: Response;
  try {
    response = await fetch(`${GATEWAY_URL}${endpoint}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...init.headers
      }
    });
  } catch (error) {
    throw new RequestError(
      error instanceof Error ? error.message : "Network request failed",
      "network_error",
      0
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const err = (body as { error?: { message?: string; type?: string } } | null)
      ?.error;
    throw new RequestError(
      err?.message || `Request failed (HTTP ${response.status})`,
      err?.type || "unknown",
      response.status
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new RequestError("Invalid JSON response", "network_error", 0);
  }
}

export const apiClient = {
  // Enveloped /uniun/v1/* routes — services Zod-parse the returned data.
  get<T>(endpoint: string, options?: RequestOptions) {
    return rawRequest<Enveloped<T>>(endpoint, options);
  },
  post<T>(endpoint: string, data: unknown, options?: RequestOptions) {
    return rawRequest<Enveloped<T>>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options
    });
  },
  patch<T>(endpoint: string, data: unknown, options?: RequestOptions) {
    return rawRequest<Enveloped<T>>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options
    });
  },
  put<T>(endpoint: string, data: unknown, options?: RequestOptions) {
    return rawRequest<Enveloped<T>>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options
    });
  },
  delete<T>(endpoint: string, options?: RequestOptions) {
    return rawRequest<Enveloped<T>>(endpoint, {
      method: "DELETE",
      ...options
    });
  },

  // Un-enveloped routes (payments) — flat JSON body.
  postRaw<T>(endpoint: string, data: unknown, options?: RequestOptions) {
    return rawRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options
    });
  }
};
