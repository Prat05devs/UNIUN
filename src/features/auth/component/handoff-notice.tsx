"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

// Shown when the mobile app's hand-off token (docs/frontend/BACKEND-UPDATES-web.md
// §1b) has expired or was rejected. The site can't renew it — only the app
// can — so this just points the user back there instead of retrying.
export function HandoffNotice() {
  const { handoffExpired } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!handoffExpired || dismissed) return null;

  return (
    <div
      role="alert"
      className="card"
      style={{
        margin: "12px auto",
        maxWidth: 640,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
      }}
    >
      <span>This link has expired — please reopen it from the UNIUN app.</span>
      <button
        className="btn btn-ghost btn-sm"
        type="button"
        onClick={() => setDismissed(true)}
      >
        Dismiss
      </button>
    </div>
  );
}
