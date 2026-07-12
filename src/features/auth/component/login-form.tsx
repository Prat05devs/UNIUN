"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/components/uniun/DsxChrome";
import { useAuth } from "../hooks/useAuth";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const {
    privkey,
    generatedKey,
    error,
    isSubmitting,
    pendingAccount,
    apiKey,
    handleChange,
    handleGenerate,
    handleSubmit,
    handleApiKeyChange,
    handleConnectKey,
    handleBackToLogin
  } = useLoginForm();

  // Already logged in — go straight to the dashboard.
  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, session, router]);

  // Step 2 for a returning login on a fresh browser: identity is proven, but
  // this browser holds no API key — the user pastes one they saved.
  if (pendingAccount) {
    return (
      <form
        className="feature-card"
        onSubmit={(e) => {
          e.preventDefault();
          void handleConnectKey();
        }}
      >
        <span className="isq">
          <Icon name="vpn_key" />
        </span>
        <strong>Welcome back — connect your API key.</strong>
        <p>
          Your identity checked out, but this browser doesn&apos;t have one of
          your API keys yet. Paste the <code>uk_…</code> key you saved when you
          signed up (or minted on your dashboard).
        </p>

        <label className="field" style={{ marginTop: 16 }}>
          <span>API key</span>
          <input
            type="password"
            name="apikey"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="uk_…"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </label>

        <div className="chiprow">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Connecting…" : "Connect"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleBackToLogin}
            disabled={isSubmitting}
          >
            Back
          </button>
        </div>

        {error && (
          <p role="alert" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}

        <p className="muted" style={{ marginTop: 16, fontSize: ".85rem" }}>
          Lost every key? Revoke them all from a logged-in device — your next
          login here will issue a fresh one automatically.
        </p>
      </form>
    );
  }

  return (
    <form
      className="feature-card"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <span className="isq">
        <Icon name="key" />
      </span>
      <strong>Sign in with your key.</strong>
      <p>
        Your private key signs a one-time challenge locally — it never leaves
        this browser. No account yet? Your first login creates one.
      </p>

      <label className="field" style={{ marginTop: 16 }}>
        <span>Private key (64 hex characters)</span>
        <input
          type="password"
          name="privkey"
          value={privkey}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="e.g. 3f9a…c21e"
          autoComplete="off"
          spellCheck={false}
          required
        />
      </label>

      {generatedKey && (
        <div
          className="card"
          role="note"
          style={{ padding: 16, marginBottom: 16 }}
        >
          <strong>Save this key now.</strong>
          <p className="muted" style={{ margin: "8px 0" }}>
            It is your only login credential and cannot be recovered if lost.
          </p>
          <code
            style={{
              display: "block",
              wordBreak: "break-all",
              userSelect: "all"
            }}
          >
            {generatedKey}
          </code>
        </div>
      )}

      <div className="chiprow">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Login"}
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleGenerate}
          disabled={isSubmitting}
        >
          <Icon name="add_circle" />
          Generate new keypair
        </button>
      </div>

      {error && (
        <p role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}

      <p className="muted" style={{ marginTop: 16, fontSize: ".85rem" }}>
        Signer extension support is coming soon — for now, paste or generate a
        key.
      </p>
    </form>
  );
}
