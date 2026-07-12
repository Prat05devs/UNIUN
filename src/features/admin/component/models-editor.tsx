"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { RequestError } from "@/lib/api";
import {
  useAdminModels,
  useCliproxyModels,
  useDeleteModel,
  useUpsertModel
} from "../hooks";

const cell: React.CSSProperties = { padding: "8px 12px" };

export function ModelsEditor() {
  const { models, error, isLoading } = useAdminModels();
  const { upsertModel, isSaving } = useUpsertModel();
  const { deleteModel, isDeleting } = useDeleteModel();

  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [backend, setBackend] = useState("subscription");
  const [formError, setFormError] = useState<string | null>(null);

  // Claude discovery: only hits the sidecar after the operator asks.
  const [discovering, setDiscovering] = useState(false);
  const {
    discovered,
    error: discoverError,
    isLoading: isDiscovering
  } = useCliproxyModels(discovering);

  const handleSave = async () => {
    if (!id.trim() || !displayName.trim()) {
      setFormError("Model id and display name are required.");
      return;
    }
    setFormError(null);
    try {
      await upsertModel({
        id: id.trim(),
        display_name: displayName.trim(),
        backend
      });
      setId("");
      setDisplayName("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed.");
    }
  };

  const known = new Set(models.map((m) => m.id));

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      {isLoading && <InlineLoader label="Loading models…" />}
      {!!error && <p role="alert">Could not load the model catalog.</p>}

      {!isLoading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...cell, textAlign: "left" }}>Model id</th>
              <th style={{ ...cell, textAlign: "left" }}>Display name</th>
              <th style={{ ...cell, textAlign: "left" }}>Backend</th>
              <th style={{ ...cell, textAlign: "left" }}>Public</th>
              <th style={{ ...cell, textAlign: "left" }} />
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td style={cell}>
                  <code>{model.id}</code>
                </td>
                <td style={cell}>{model.display_name}</td>
                <td style={cell}>
                  <span className="chip">{model.backend}</span>
                </td>
                <td style={cell}>
                  <button
                    className={
                      model.available ? "btn btn-tinted btn-sm" : "btn btn-secondary btn-sm"
                    }
                    type="button"
                    disabled={isSaving}
                    title="Hidden models stay in the catalog but drop off the public list"
                    onClick={() =>
                      void upsertModel({
                        id: model.id,
                        display_name: model.display_name,
                        backend: model.backend,
                        available: !model.available
                      }).catch((err) =>
                        setFormError(
                          err instanceof Error ? err.message : "Update failed."
                        )
                      )
                    }
                  >
                    {model.available ? "visible" : "hidden"}
                  </button>
                </td>
                <td style={cell}>
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      if (window.confirm(`Delete model ${model.id}?`)) {
                        void deleteModel(model.id).catch((err) =>
                          setFormError(
                            err instanceof Error ? err.message : "Delete failed."
                          )
                        );
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form
        style={{ marginTop: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave();
        }}
      >
        <div className="cols-3" style={{ marginTop: 0, gap: 12 }}>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Model id</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="claude-sonnet-5"
              spellCheck={false}
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Display name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Claude Sonnet 5"
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Backend</span>
            <select value={backend} onChange={(e) => setBackend(e.target.value)}>
              <option value="subscription">subscription</option>
              <option value="api">api</option>
              <option value="local">local</option>
            </select>
          </label>
        </div>
        <div className="chiprow" style={{ marginTop: 14 }}>
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Add / update model"}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            disabled={isDiscovering}
            onClick={() => setDiscovering(true)}
          >
            {isDiscovering ? "Discovering…" : "Discover Claude models"}
          </button>
        </div>
        {formError && (
          <p role="alert" style={{ marginTop: 10 }}>
            {formError}
          </p>
        )}
      </form>

      {discovering && !isDiscovering && (
        <div style={{ marginTop: 16 }}>
          {discoverError ? (
            <p role="alert">
              {discoverError instanceof RequestError &&
              discoverError.type === "upstream_error"
                ? "The Claude sidecar is unreachable — is CLIProxyAPI running?"
                : "Model discovery failed."}
            </p>
          ) : discovered.length ? (
            <>
              <p className="muted" style={{ margin: "0 0 8px" }}>
                Models the Claude sidecar actually serves — click to add:
              </p>
              <div className="chiprow" style={{ marginTop: 0 }}>
                {discovered.map((modelId) => (
                  <button
                    key={modelId}
                    className={known.has(modelId) ? "chip chip-tonal" : "chip"}
                    type="button"
                    style={{ cursor: "pointer" }}
                    disabled={isSaving}
                    onClick={() => {
                      setId(modelId);
                      setDisplayName(modelId);
                      setBackend("subscription");
                    }}
                  >
                    {modelId}
                    {known.has(modelId) && " ✓"}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="muted">The sidecar reported no models.</p>
          )}
        </div>
      )}
    </div>
  );
}
