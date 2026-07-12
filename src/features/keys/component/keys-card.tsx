"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useKeys, useMintKey, useRevokeKey } from "../hooks";

const cell: React.CSSProperties = { padding: "8px 12px" };

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn btn-secondary btn-sm"
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

// API-key management: copy the current session key, mint new keys (secret
// shown once), and revoke. Revoking the session's own key logs you out —
// every request from this browser would 401 afterwards anyway.
export function KeysCard() {
  const { session, logout } = useAuth();
  const [page, setPage] = useState(1);
  const { keys, pagination, error, isLoading } = useKeys(page);
  const { mintKey, isMinting } = useMintKey();
  const { revokeKey, isRevoking } = useRevokeKey();

  const [name, setName] = useState("");
  const [minted, setMinted] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // "uk_" + first 8 hex chars — same shape the gateway stores as the prefix.
  const sessionPrefix = session?.apiKey.slice(0, 11);
  const totalPages = pagination?.total_pages ?? 1;

  const handleMint = async () => {
    setActionError(null);
    try {
      const key = await mintKey(name.trim() || "unnamed");
      setMinted(key.api_key);
      setName("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not create the key.");
    }
  };

  const handleRevoke = async (id: string, prefix: string) => {
    const isSessionKey = prefix === sessionPrefix;
    const warning = isSessionKey
      ? "This is the key this browser is logged in with — revoking it will log you out. Continue?"
      : `Revoke key ${prefix}…? Anything using it stops working immediately.`;
    if (!window.confirm(warning)) return;
    setActionError(null);
    try {
      await revokeKey(id);
      if (isSessionKey) logout();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not revoke the key.");
    }
  };

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      {session && (
        <div className="chiprow" style={{ marginTop: 0, alignItems: "center" }}>
          <span className="muted">This session&apos;s key:</span>
          <code>{sessionPrefix}…</code>
          <CopyButton value={session.apiKey} label="Copy full key" />
        </div>
      )}

      {isLoading && <InlineLoader label="Loading keys…" />}
      {!!error && <p role="alert">Could not load your keys.</p>}

      {!isLoading && !error && keys.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ ...cell, textAlign: "left" }}>Key</th>
              <th style={{ ...cell, textAlign: "left" }}>Name</th>
              <th style={{ ...cell, textAlign: "left" }}>Created</th>
              <th style={{ ...cell, textAlign: "left" }}>Status</th>
              <th style={{ ...cell, textAlign: "left" }} />
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key.id}>
                <td style={cell}>
                  <code>{key.prefix}…</code>
                  {key.prefix === sessionPrefix && (
                    <span className="chip chip-tonal" style={{ marginLeft: 8 }}>
                      this session
                    </span>
                  )}
                </td>
                <td style={cell}>{key.name}</td>
                <td style={cell}>
                  {new Date(key.created_at).toLocaleDateString()}
                </td>
                <td style={cell}>
                  <span className={key.revoked ? "chip" : "chip chip-tonal"}>
                    {key.revoked ? "revoked" : "active"}
                  </span>
                </td>
                <td style={cell}>
                  {!key.revoked && (
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      disabled={isRevoking}
                      onClick={() => void handleRevoke(key.id, key.prefix)}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="chiprow" style={{ marginTop: 12 }}>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="muted">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}

      <form
        style={{ marginTop: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          void handleMint();
        }}
      >
        <div className="chiprow" style={{ marginTop: 0, alignItems: "flex-end" }}>
          <label className="field" style={{ marginBottom: 0, flex: 1 }}>
            <span>New key name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="laptop, mobile app, …"
              spellCheck={false}
            />
          </label>
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={isMinting}
          >
            {isMinting ? "Creating…" : "Create new key"}
          </button>
        </div>
      </form>

      {minted && (
        <div className="card" role="status" style={{ padding: 16, marginTop: 16 }}>
          <strong>Copy this key now — it will never be shown again.</strong>
          <div className="chiprow" style={{ marginTop: 10, alignItems: "center" }}>
            <code style={{ wordBreak: "break-all" }}>{minted}</code>
            <CopyButton value={minted} />
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={() => setMinted(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {actionError && (
        <p role="alert" style={{ marginTop: 12 }}>
          {actionError}
        </p>
      )}
    </div>
  );
}
