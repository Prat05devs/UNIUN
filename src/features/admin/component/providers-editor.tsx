"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { useProviders, useUpdateProvider } from "../hooks";
import { ProviderCred } from "../types";

function ProviderRow({ cred }: { cred: ProviderCred }) {
  const { updateProvider, isSaving } = useUpdateProvider();
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(cred.base_url);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const updates: { api_key?: string; base_url?: string } = {};
    // Only send a key the operator actually typed — the stored one is never
    // shown, so an empty field means "leave it unchanged".
    if (apiKey.trim()) updates.api_key = apiKey.trim();
    if (baseUrl.trim() !== cred.base_url) updates.base_url = baseUrl.trim();
    if (!Object.keys(updates).length) {
      setError("Nothing to save — type a new key or change the base URL.");
      return;
    }
    setError(null);
    setMessage(null);
    try {
      const res = await updateProvider({ provider: cred.provider, ...updates });
      setApiKey("");
      setMessage(res.note ?? "Saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <form
      style={{ marginTop: 16 }}
      onSubmit={(e) => {
        e.preventDefault();
        void handleSave();
      }}
    >
      <div className="chiprow" style={{ marginTop: 0, alignItems: "center" }}>
        <strong>{cred.provider}</strong>
        <span className={cred.key_set ? "chip chip-tonal" : "chip"}>
          {cred.key_set ? "key configured" : "no key"}
        </span>
      </div>
      <div className="cols-2" style={{ marginTop: 10, gap: 12 }}>
        <label className="field" style={{ marginBottom: 0 }}>
          <span>API key (leave blank to keep the current one)</span>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={cred.key_set ? "••••••••" : "sk-…"}
            type="password"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="field" style={{ marginBottom: 0 }}>
          <span>Base URL</span>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://…"
            spellCheck={false}
          />
        </label>
      </div>
      <div className="chiprow" style={{ marginTop: 10 }}>
        <button
          className="btn btn-secondary btn-sm"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
        {message && <span className="muted">{message}</span>}
      </div>
      {error && (
        <p role="alert" style={{ marginTop: 8 }}>
          {error}
        </p>
      )}
    </form>
  );
}

// Backend credential settings. Keys are write-only: the API masks them, so the
// UI only ever shows the "configured" badge. Changes apply on gateway restart.
export function ProvidersEditor() {
  const { providers, error, isLoading } = useProviders();

  return (
    <div className="card" style={{ padding: 20 }}>
      {isLoading && <InlineLoader label="Loading providers…" />}
      {!!error && <p role="alert">Could not load provider credentials.</p>}

      {!isLoading && !error && (
        <>
          <p className="muted" style={{ margin: 0 }}>
            Provider keys live in the database and apply on the next gateway
            restart. Plan, model, and price edits are live — these are not.
          </p>
          {providers.map((cred) => (
            <ProviderRow key={cred.provider} cred={cred} />
          ))}
          {!providers.length && (
            <p className="muted" style={{ marginTop: 12 }}>
              No providers configured.
            </p>
          )}
        </>
      )}
    </div>
  );
}
