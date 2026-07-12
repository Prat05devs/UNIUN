import { Icon } from "../uniun/DsxChrome";

/* Shared loading states, dsx-styled. Organisms render these instead of
   writing their own spinner markup. */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="card"
      role="status"
      style={{ display: "grid", placeItems: "center", minHeight: "30vh" }}
    >
      <span className="muted" style={{ display: "inline-flex", gap: 8 }}>
        <Icon name="progress_activity" />
        {label}
      </span>
    </div>
  );
}

export function InlineLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <p className="muted" role="status">
      {label}
    </p>
  );
}
