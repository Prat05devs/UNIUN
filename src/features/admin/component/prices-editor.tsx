"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { useAdminPrices, useDeletePrice, useUpsertPrice } from "../hooks";

const cell: React.CSSProperties = { padding: "8px 12px" };
const cellRight: React.CSSProperties = { ...cell, textAlign: "right" };

export function PricesEditor() {
  const { prices, error, isLoading } = useAdminPrices();
  const { upsertPrice, isSaving } = useUpsertPrice();
  const { deletePrice, isDeleting } = useDeletePrice();

  const [model, setModel] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSave = async () => {
    const inputPerMtok = Number(input);
    const outputPerMtok = Number(output);
    if (!model.trim()) {
      setFormError("Model name is required.");
      return;
    }
    if (
      !Number.isFinite(inputPerMtok) ||
      !Number.isFinite(outputPerMtok) ||
      inputPerMtok < 0 ||
      outputPerMtok < 0
    ) {
      setFormError("Prices must be non-negative numbers.");
      return;
    }
    setFormError(null);
    try {
      await upsertPrice({ model: model.trim(), inputPerMtok, outputPerMtok });
      setModel("");
      setInput("");
      setOutput("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      {isLoading && <InlineLoader label="Loading prices…" />}
      {!!error && <p role="alert">Could not load prices.</p>}

      {!isLoading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...cell, textAlign: "left" }}>Model</th>
              <th style={cellRight}>Input / 1M</th>
              <th style={cellRight}>Output / 1M</th>
              <th style={{ ...cell, textAlign: "left" }} />
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.model}>
                <td style={cell}>{price.model}</td>
                <td style={cellRight}>{price.input_per_mtok}</td>
                <td style={cellRight}>{price.output_per_mtok}</td>
                <td style={cell}>
                  <div className="chiprow" style={{ marginTop: 0 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => {
                        setModel(price.model);
                        setInput(String(price.input_per_mtok));
                        setOutput(String(price.output_per_mtok));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      disabled={isDeleting}
                      onClick={() => {
                        if (window.confirm(`Delete price for ${price.model}?`)) {
                          void deletePrice(price.model).catch(() => {});
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
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
            <span>Model</span>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4o"
              spellCheck={false}
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Input / 1M tokens</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="2.5"
              inputMode="decimal"
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Output / 1M tokens</span>
            <input
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="10"
              inputMode="decimal"
            />
          </label>
        </div>
        <div className="chiprow" style={{ marginTop: 14 }}>
          <button className="btn btn-primary btn-sm" type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save price"}
          </button>
        </div>
        {formError && (
          <p role="alert" style={{ marginTop: 10 }}>
            {formError}
          </p>
        )}
      </form>
    </div>
  );
}
