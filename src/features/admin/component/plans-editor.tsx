"use client";

import { useState } from "react";
import { InlineLoader } from "@/components/molecules/loading";
import { useAdminModels, useAdminPlans, useDeletePlan, useSavePlan } from "../hooks";
import { AdminPlan } from "../types";

const cell: React.CSSProperties = { padding: "8px 12px" };
const cellRight: React.CSSProperties = { ...cell, textAlign: "right" };

const inr = new Intl.NumberFormat("en-IN");

const EMPTY_FORM = {
  name: "",
  kind: "subscription",
  priceRupees: "",
  models: [] as string[],
  window_seconds: "18000",
  window_tokens: "80000",
  weekly_seconds: "604800",
  weekly_tokens: "800000",
  pool_window_tokens: "0"
};

type PlanForm = typeof EMPTY_FORM;

function toForm(plan: AdminPlan): PlanForm {
  return {
    name: plan.name,
    kind: plan.kind,
    priceRupees: plan.price_paise ? String(plan.price_paise / 100) : "",
    models: plan.models,
    window_seconds: String(plan.window_seconds),
    window_tokens: String(plan.window_tokens),
    weekly_seconds: String(plan.weekly_seconds),
    weekly_tokens: String(plan.weekly_tokens),
    pool_window_tokens: String(plan.pool_window_tokens)
  };
}

export function PlansEditor() {
  const { plans, error, isLoading } = useAdminPlans();
  const { models } = useAdminModels();
  const { savePlan, isSaving } = useSavePlan();
  const { deletePlan, isDeleting } = useDeletePlan();

  const [form, setForm] = useState<PlanForm>(EMPTY_FORM);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const set = (patch: Partial<PlanForm>) => setForm((f) => ({ ...f, ...patch }));

  const toggleModel = (id: string) =>
    set({
      models: form.models.includes(id)
        ? form.models.filter((m) => m !== id)
        : [...form.models, id]
    });

  // Price and fair-use windows only mean something on subscription plans:
  // credits bills per token from the wallet.
  const isSubscription = form.kind === "subscription";

  const handleSave = async () => {
    const name = form.name.trim();
    if (!name) {
      setFormError("Plan name is required.");
      return;
    }
    const nums = isSubscription
      ? {
          price_paise: Math.round(Number(form.priceRupees || 0) * 100),
          window_seconds: Number(form.window_seconds),
          window_tokens: Number(form.window_tokens),
          weekly_seconds: Number(form.weekly_seconds),
          weekly_tokens: Number(form.weekly_tokens),
          pool_window_tokens: Number(form.pool_window_tokens)
        }
      : {
          price_paise: 0,
          window_seconds: 0,
          window_tokens: 0,
          weekly_seconds: 0,
          weekly_tokens: 0,
          pool_window_tokens: 0
        };
    if (Object.values(nums).some((n) => !Number.isFinite(n) || n < 0)) {
      setFormError("All numeric fields must be non-negative numbers.");
      return;
    }
    setFormError(null);
    try {
      await savePlan({
        plan: { name, kind: form.kind, models: form.models, ...nums },
        isNew: editingName === null
      });
      setForm(EMPTY_FORM);
      setEditingName(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="card" style={{ padding: 20, overflowX: "auto" }}>
      {isLoading && <InlineLoader label="Loading plans…" />}
      {!!error && <p role="alert">Could not load plans.</p>}

      {!isLoading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...cell, textAlign: "left" }}>Plan</th>
              <th style={{ ...cell, textAlign: "left" }}>Kind</th>
              <th style={cellRight}>Price</th>
              <th style={{ ...cell, textAlign: "left" }}>Models</th>
              <th style={{ ...cell, textAlign: "left" }} />
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.name}>
                <td style={cell}>
                  <strong>{plan.name}</strong>
                </td>
                <td style={cell}>{plan.kind}</td>
                <td style={cellRight}>
                  {plan.price_paise > 0
                    ? `₹${inr.format(plan.price_paise / 100)}`
                    : "free"}
                </td>
                <td style={cell}>
                  {plan.models.length ? (
                    <div className="chiprow" style={{ marginTop: 0 }}>
                      {plan.models.map((id) => (
                        <span key={id} className="chip">
                          {id}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="muted">all models</span>
                  )}
                </td>
                <td style={cell}>
                  <div className="chiprow" style={{ marginTop: 0 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => {
                        setForm(toForm(plan));
                        setEditingName(plan.name);
                        setFormError(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      disabled={isDeleting}
                      onClick={() => {
                        if (window.confirm(`Delete plan ${plan.name}?`)) {
                          void deletePlan(plan.name).catch((err) =>
                            setFormError(
                              err instanceof Error
                                ? err.message
                                : "Delete failed."
                            )
                          );
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
        <strong>{editingName ? `Edit plan: ${editingName}` : "New plan"}</strong>
        <div className="cols-3" style={{ marginTop: 12, gap: 12 }}>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Name</span>
            <input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              disabled={editingName !== null}
              placeholder="sub_pro"
              spellCheck={false}
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Kind</span>
            <select
              value={form.kind}
              onChange={(e) => set({ kind: e.target.value })}
            >
              <option value="subscription">subscription</option>
              <option value="credits">credits</option>
            </select>
          </label>
          {isSubscription && (
            <label className="field" style={{ marginBottom: 0 }}>
              <span>Price (₹, 0 = free)</span>
              <input
                value={form.priceRupees}
                onChange={(e) => set({ priceRupees: e.target.value })}
                placeholder="499"
                inputMode="decimal"
              />
            </label>
          )}
        </div>

        {!isSubscription && (
          <p className="muted" style={{ marginTop: 12 }}>
            Credits plans have no flat price or token windows — users top up a
            wallet and every request is billed at the model prices below.
          </p>
        )}

        <div className="field" style={{ marginTop: 12 }}>
          <span>Unlocked models (none checked = ALL models)</span>
          <div className="chiprow" style={{ marginTop: 8 }}>
            {models.map((model) => (
              <label
                key={model.id}
                className={
                  form.models.includes(model.id) ? "chip chip-tonal" : "chip"
                }
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={form.models.includes(model.id)}
                  onChange={() => toggleModel(model.id)}
                  style={{ marginRight: 6 }}
                />
                {model.display_name}
              </label>
            ))}
            {!models.length && (
              <span className="muted">No models in the catalog yet.</span>
            )}
          </div>
        </div>

        {isSubscription && (
        <>
        <div className="cols-3" style={{ marginTop: 12, gap: 12 }}>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Window seconds</span>
            <input
              value={form.window_seconds}
              onChange={(e) => set({ window_seconds: e.target.value })}
              inputMode="numeric"
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Window tokens</span>
            <input
              value={form.window_tokens}
              onChange={(e) => set({ window_tokens: e.target.value })}
              inputMode="numeric"
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Pool window tokens</span>
            <input
              value={form.pool_window_tokens}
              onChange={(e) => set({ pool_window_tokens: e.target.value })}
              inputMode="numeric"
            />
          </label>
        </div>
        <div className="cols-3" style={{ marginTop: 12, gap: 12 }}>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Weekly seconds</span>
            <input
              value={form.weekly_seconds}
              onChange={(e) => set({ weekly_seconds: e.target.value })}
              inputMode="numeric"
            />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>Weekly tokens</span>
            <input
              value={form.weekly_tokens}
              onChange={(e) => set({ weekly_tokens: e.target.value })}
              inputMode="numeric"
            />
          </label>
        </div>
        </>
        )}

        <div className="chiprow" style={{ marginTop: 14 }}>
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : editingName ? "Save changes" : "Create plan"}
          </button>
          {editingName && (
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={() => {
                setForm(EMPTY_FORM);
                setEditingName(null);
                setFormError(null);
              }}
            >
              Cancel
            </button>
          )}
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
