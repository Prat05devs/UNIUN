import { schnorr } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { apiClient } from "@/lib/api";
import { SESSION_STORAGE_KEY } from "@/types/constant";
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

// The 3-step keypair login (no signup — the first successful login creates the
// account). The private key exists only inside this function's scope: it signs
// sha256(challenge) locally (BIP-340 Schnorr) and never leaves the browser.
export async function loginWithPrivkey(privkeyHex: string): Promise<Session> {
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

  return {
    accountId: data.account_id,
    keyId: data.key_id,
    apiKey: data.api_key,
    newAccount: data.new_account
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
