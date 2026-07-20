import { schnorr } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { apiClient, RequestError } from "@/lib/api";
import { HANDOFF_TOKEN_KEY, SESSION_STORAGE_KEY } from "@/types/constant";
import {
  Challenge,
  ChallengeSchema,
  LoginResponseSchema,
  Session,
  SessionSchema
} from "../types";

export async function requestChallenge(pubkey: string): Promise<Challenge> {
  const res = await apiClient.post<Challenge>(
    "/uniun/v1/auth/challenge",
    { pubkey },
    { auth: false }
  );
  return ChallengeSchema.parse(res.data);
}

// A login either yields a ready session (the gateway minted a key: signup or
// zero-active-keys recovery) or proves identity without a key — the caller
// must then supply one of the account's existing keys to connect.
export type LoginResult =
  | { status: "ok"; session: Session }
  | { status: "needs_key"; accountId: string; hasProfile?: boolean };

// The 3-step keypair login (no signup — the first successful login creates the
// account). The private key exists only inside this function's scope: it signs
// sha256(challenge) locally (BIP-340 Schnorr) and never leaves the browser.
export async function loginWithPrivkey(privkeyHex: string): Promise<LoginResult> {
  const priv = hexToBytes(privkeyHex);
  const pubkey = bytesToHex(schnorr.getPublicKey(priv));

  const { challenge } = await requestChallenge(pubkey);

  const digest = sha256(new TextEncoder().encode(challenge));
  const signature = bytesToHex(schnorr.sign(digest, priv));

  const res = await apiClient.post<unknown>(
    "/uniun/v1/auth/login",
    { pubkey, challenge, signature },
    { auth: false }
  );
  const data = LoginResponseSchema.parse(res.data);

  if (!data.api_key) {
    return {
      status: "needs_key",
      accountId: data.account_id,
      hasProfile: data.has_profile
    };
  }

  return {
    status: "ok",
    session: {
      accountId: data.account_id,
      keyId: data.key_id,
      apiKey: data.api_key,
      newAccount: data.new_account,
      hasProfile: data.has_profile
    }
  };
}

// Builds a session from a pasted uk_ key by asking the gateway whose key it
// is; rejects a key that belongs to a different account than the one that
// just proved key ownership.
export async function sessionFromApiKey(
  apiKey: string,
  expectedAccountId: string,
  hasProfile?: boolean
): Promise<Session> {
  const res = await apiClient.get<{ account_id: string }>("/uniun/v1/profile", {
    auth: false,
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (res.data.account_id !== expectedAccountId) {
    throw new RequestError(
      "That API key belongs to a different account.",
      "wrong_account",
      0
    );
  }

  return {
    accountId: expectedAccountId,
    apiKey,
    newAccount: false,
    hasProfile
  };
}

// --- mobile hand-off token (docs/frontend/BACKEND-UPDATES-web.md §1b) ---
//
// The app opens the site with `#uniun_token=uk_...` in the URL fragment. We
// move it into sessionStorage (never localStorage, never a cookie — it must
// die with the tab) and strip the fragment so it never sits in the address
// bar or browser history.

// Call once on mount, before first render if possible. No-op when there is
// no fragment token; safe to call on every page since it only ever reads
// location.hash for this one param.
export function consumeHandoffFragment(): void {
  if (typeof window === "undefined" || !window.location.hash) return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get(HANDOFF_TOKEN_KEY);
  if (!token) return;

  window.sessionStorage.setItem(HANDOFF_TOKEN_KEY, token);
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );
}

export function loadHandoffToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(HANDOFF_TOKEN_KEY);
}

export function clearHandoffToken(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(HANDOFF_TOKEN_KEY);
}

// Resolves a hand-off token to the account it belongs to. Unlike
// sessionFromApiKey there's no accountId to check against — the token itself
// is the proof. The token expires in ~300s and can't be renewed by the site;
// callers should treat a 401 here as "reopen from the app", not a retryable
// error.
export async function sessionFromHandoffToken(apiKey: string): Promise<Session> {
  // /profile has no has_profile field (that's login-only) — derive it from
  // whether a username has been set.
  const res = await apiClient.get<{ account_id: string; username: string | null }>(
    "/uniun/v1/profile",
    { auth: false, headers: { Authorization: `Bearer ${apiKey}` } }
  );

  return {
    accountId: res.data.account_id,
    apiKey,
    newAccount: false,
    hasProfile: res.data.username != null,
    ephemeral: true
  };
}

export function generatePrivkey(): string {
  return bytesToHex(schnorr.utils.randomSecretKey());
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = SessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
