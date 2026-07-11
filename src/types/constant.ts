export const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// localStorage key for the persisted auth session. Lives here (not in the auth
// feature) so lib/api.ts can read the Bearer token without importing a feature.
export const SESSION_STORAGE_KEY = "uniun_session";
