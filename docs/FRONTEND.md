# Frontend Integration Guide

For the UNIUN website / app (Next.js) integrating with the gateway. Covers the two
kinds of caller, the login flow, inference, usage/credits, and Razorpay payments, with
the exact request/response shapes, error handling, and rate limits.

- **Gateway base URL:** `http://localhost:8081` in dev; the production domain later.
  Put it in one env var (e.g. `NEXT_PUBLIC_GATEWAY_URL`) — never hardcode.
- **Two response conventions:**
  - `/uniun/v1/*` uses the **UNIUN envelope**: success `{"data": …}`, list
    `{"data": […], "pagination": {…}}`, error `{"error": {"message","type"}}`.
  - `/v1/*` (inference) is **raw OpenAI-compatible** — no envelope; OpenAI-style
    objects and `{"error": {…}}`.
- Full endpoint reference: [`api/README.md`](api/README.md). Admin: [`ADMIN.md`](ADMIN.md).
  Payments: [`PAYMENTS.md`](PAYMENTS.md).

---

## 1. Two callers

| Caller | Auth | Uses |
|---|---|---|
| **Signed-in app user** | a UNIUN API key (Bearer) obtained via keypair login | inference, usage, credits, key management |
| **Anonymous website visitor** | none — CORS-gated, rate-limited | payments (checkout) |

The website's marketing/checkout pages need **no key** — they call the public payments
routes. The app (dashboard, chat) needs a **UNIUN key** from the login flow below.

## 2. Login (no signup) — get a UNIUN API key

UNIUN users bring their **own ecosystem keypair** (secp256k1, Nostr-compatible). There is
**no signup step**: the first successful login auto-creates the account, later logins just
return a fresh API key (the response's `new_account` flag tells you which — use it to show
a first-time welcome). **The private key signs a challenge locally and never leaves the
client**; only the public key + signature reach the gateway.

```
1. POST /uniun/v1/auth/challenge  { pubkey }                   -> { data: { challenge, expires_in } }
2. sign  sha256(challenge)  with the private key (BIP-340 Schnorr, secp256k1)   [client-side]
3. POST /uniun/v1/auth/login  { pubkey, challenge, signature } -> { data: { account_id, key_id, api_key, new_account } }
```

- `pubkey` is the 64-hex x-only secp256k1 public key (the account identity).
- `signature` is 128-hex (BIP-340 Schnorr over `sha256(challenge)`).
- `api_key` (prefix `uk_…`) is returned **once** — store it client-side (secure cookie /
  session); it is not recoverable. Reissue anytime with `POST /uniun/v1/keys`.

**Drop-in module:** [`examples/uniun-login.ts`](examples/uniun-login.ts) implements all
three steps (`npm i @noble/curves @noble/hashes`):

```ts
import { login } from "./uniun-login";
const session = await login(process.env.NEXT_PUBLIC_GATEWAY_URL!, userPrivKey);
// session.apiKey -> use as `Authorization: Bearer uk_…`; session.newAccount -> first login?
```

The private key comes from wherever the UNIUN ecosystem holds it (a signer extension /
UNIUN wallet, or a key the user supplies). If it lives in an external signer, keep steps
1 and 3 and let the signer produce the Schnorr signature over `sha256(challenge)` — see
the signer sketch at the bottom of the module. The key never reaches our servers, and we
store only the **public** key (plus a hash of the issued API key) — never a private key.

Errors: `401 bad_signature` (signature doesn't verify), `401 challenge_invalid`
(unknown/expired/already-used nonce).

## 3. Call inference

Send the key as a Bearer token to the OpenAI-compatible endpoint. The model prefix
picks the backend: `claude-*` → subscription, `gpt-*` → paid API, else → local.

```ts
await fetch(`${base}/v1/chat/completions`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({
    model: "claude-sonnet-5",
    max_tokens: 256,
    messages: [{ role: "user", content: "hello" }],
  }),
});
```

Standard OpenAI chat-completion response (or SSE when `stream: true`). No key → `401`.
A subscription user over their fair-use limit is **silently served by the local model**
(no error). A credits user with an empty wallet → `402 insufficient_credit`.

`GET /v1/models` lists available models.

## 4. Show plans & pricing (public — no key)

For the pricing page and the "choose a plan" UI. No login needed:

```
GET /uniun/v1/plans   -> { data: [ { name, kind, window_seconds, window_tokens, weekly_seconds, weekly_tokens } ] }
GET /uniun/v1/prices  -> { data: [ { model, input_per_mtok, output_per_mtok } ] }   // INR per 1M tokens
```

Render plans from `/plans` (the fair-use limits per plan) and per-token cost from
`/prices`. To show "what a request costs": `cost = prompt_tokens*input_per_mtok/1e6 +
completion_tokens*output_per_mtok/1e6` (in INR).

## 5. Usage & credits (for the dashboard)

```
GET /uniun/v1/usage?page=1&per_page=20   (Bearer key)  -> { data: [ … metered requests … ], pagination }
GET /uniun/v1/credits                    (Bearer key)  -> { data: { plan, balance } }
```

Use these to render "your plan / balance / recent usage". Metering & billing model:
[`USAGE.md`](USAGE.md).

## 6. Payments — Razorpay checkout & credit top-up

The gateway creates the order (server-side, with the Razorpay secret), the browser opens
Razorpay Checkout, then the gateway verifies the signature. The browser only needs the
**Razorpay key id** (publishable) for the widget.

```
1. POST /uniun/v1/payments/orders  { amount, currency?, receipt? }  -> { order_id, amount, currency }
2. open Razorpay Checkout with { key: RAZORPAY_KEY_ID, order_id, amount, currency }
3. on success Razorpay returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }
4. POST /uniun/v1/payments/verify  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   -> 200 { verified: true, credited?: number }   |   400 { verified: false }
```

- `amount` is in **paise** (₹1 = 100), integer, minimum 100. Non-integer or `< 100` → `400`.
- Only `{ verified: true }` should unlock the purchase in your UI.

**Top-up (logged-in user buying credits):** send the user's `Authorization: Bearer
<uniun_key>` **on the create-order call**. The order is then tied to their account and,
on verify, credits their wallet: **1 credit = ₹1** (a verified ₹500 top-up → `credited:
500`, and `GET /uniun/v1/credits` reflects the new balance). Crediting is idempotent — a
replayed verify won't double-credit. Omit the key for a plain anonymous payment. (An
*invalid* key on create-order → `401`.)

```ts
// authenticated top-up: only the create-order call carries the key
await fetch(`${base}/uniun/v1/payments/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({ amount: 50000 }), // ₹500 -> 500 credits on verify
});
```

- These routes replace the site-local `/api/create-order` and `/api/verify-payment` —
  the gateway's Postgres is the single payment + credit record.
- Full detail incl. the checkout callback shape: [`PAYMENTS.md`](PAYMENTS.md).

**CORS:** the gateway echoes CORS headers only for origins in `PAYMENTS_ALLOWED_ORIGINS`
(set it to your site origin, e.g. `http://localhost:3000` in dev), and allows the
`Authorization` header so the top-up key can be sent. A disallowed origin gets no CORS
headers and the browser blocks the call.

## 7. Errors — one shape, stable codes

Every `/uniun/v1/*` error is `{"error": {"message": string, "type": string}}`. Branch on
`type` (stable), show `message` (human). Common `type`s:

| `type` | HTTP | Meaning (frontend action) |
|---|---|---|
| `invalid_request` | 400 | fix the request body / inputs |
| `unauthorized` / `invalid_api_key` | 401 | not logged in / key invalid → re-login |
| `bad_signature` / `challenge_invalid` | 401 | login failed → restart the challenge |
| `insufficient_credit` | 402 | credits user out of balance → prompt top-up |
| `not_admin` | 403 | non-admin hit an admin route |
| `not_found` | 404 | unknown resource |
| `rate_limited` | 429 | throttled → back off, honor `Retry-After` |
| `internal_error` / `upstream_error` | 500 / 502 | our fault → retry / show generic error |

## 8. Rate limits

The **public** routes (payments + auth login/challenge/keys) are per-IP rate limited
(default 5 req/s, burst 20). Over the limit → `429 rate_limited` with a `Retry-After`
header. Normal user flows never hit this; a retry/backoff on `429` is enough. Inference
and dashboard routes are gated by the key, not this limiter.

## 9. Config the frontend needs

| Env (frontend) | Purpose |
|---|---|
| `NEXT_PUBLIC_GATEWAY_URL` | gateway base URL (e.g. `http://localhost:8081`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay **key id** for the checkout widget (publishable) |

Gateway-side, the operator sets `PAYMENTS_ALLOWED_ORIGINS` to your site origin(s) so CORS
permits the payments calls. Never put the Razorpay **secret** in the frontend — it lives
only on the gateway.
