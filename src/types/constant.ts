export const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// localStorage key for the persisted auth session. Lives here (not in the auth
// feature) so lib/api.ts can read the Bearer token without importing a feature.
export const SESSION_STORAGE_KEY = "uniun_session";

// sessionStorage key for a short-lived hand-off token from the mobile app
// (arrives as a URL fragment, #uniun_token=...). Deliberately sessionStorage,
// never localStorage/a cookie — it must die with the tab. Same name as the
// fragment param per docs/frontend/BACKEND-UPDATES-web.md §1b.
export const HANDOFF_TOKEN_KEY = "uniun_token";
