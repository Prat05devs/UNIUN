// UNIUN keypair login — drop-in for the Next.js site.
//
// UNIUN users bring their own ecosystem keypair (secp256k1, Nostr-compatible). There is
// NO signup: the first successful login auto-creates the account; later logins just
// return a fresh API key. The private key signs a challenge locally and NEVER leaves the
// browser — only the public key + signature reach the gateway.
//
// deps: npm i @noble/curves @noble/hashes
import { schnorr } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";

export interface Session {
  accountId: string;
  keyId: string;
  apiKey: string; // "uk_…" — send as `Authorization: Bearer`; returned once, store client-side
  newAccount: boolean; // true only on the very first login for this keypair
}

/**
 * login runs the 3-step keypair flow and returns a UNIUN session.
 * @param base    gateway base URL, e.g. process.env.NEXT_PUBLIC_GATEWAY_URL
 * @param privKey the user's 32-byte UNIUN-ecosystem private key (held on the client)
 */
export async function login(base: string, privKey: Uint8Array): Promise<Session> {
  // x-only public key (64-hex), the account's identity.
  const pubkey = bytesToHex(schnorr.getPublicKey(privKey));

  // 1) ask for a one-time challenge
  const ch = await postJSON(`${base}/uniun/v1/auth/challenge`, { pubkey });
  const challenge: string = ch.data.challenge;

  // 2) sign sha256(challenge) locally — BIP-340 Schnorr, exactly what the server verifies
  const digest = sha256(new TextEncoder().encode(challenge));
  const signature = bytesToHex(schnorr.sign(digest, privKey)); // 128-hex

  // 3) exchange the signature for an API key
  const res = await postJSON(`${base}/uniun/v1/auth/login`, { pubkey, challenge, signature });
  return {
    accountId: res.data.account_id,
    keyId: res.data.key_id,
    apiKey: res.data.api_key,
    newAccount: res.data.new_account,
  };
}

async function postJSON(url: string, body: unknown): Promise<any> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error?.message ?? `login failed (HTTP ${r.status})`);
  return j;
}

// --- Using an external UNIUN/Nostr signer instead of a raw private key ---
//
// If the key lives in a signer (browser extension / UNIUN wallet) rather than in JS,
// keep steps 1 and 3 and replace step 2 with a call that asks the signer to produce a
// BIP-340 Schnorr signature over sha256(challenge). The signer holds the private key;
// this code never sees it. Sketch:
//
//   const pubkey = await signer.getPublicKey();               // 64-hex x-only
//   const challenge = (await postJSON(base + "/uniun/v1/auth/challenge", { pubkey })).data.challenge;
//   const signature = await signer.signSchnorr(sha256(enc(challenge))); // 128-hex, in the signer
//   const res = await postJSON(base + "/uniun/v1/auth/login", { pubkey, challenge, signature });
