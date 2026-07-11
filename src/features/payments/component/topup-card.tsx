"use client";

import { useState } from "react";
import { Icon } from "@/components/uniun/DsxChrome";
import { CheckoutButton } from "./checkout-button";

// Preset top-up amounts in paise (₹1 = 100).
const PRESETS = [
  { paise: 10000, label: "₹100" },
  { paise: 50000, label: "₹500" },
  { paise: 100000, label: "₹1,000" }
];

export function TopupCard() {
  const [amount, setAmount] = useState(PRESETS[1].paise);

  const selected = PRESETS.find((p) => p.paise === amount) ?? PRESETS[1];

  return (
    <div className="feature-card" aria-label="Buy credits">
      <span className="isq">
        <Icon name="add_card" />
      </span>
      <strong>Top up credits.</strong>
      <p>1 credit = ₹1. Credits land in your wallet as soon as the payment is
      verified.</p>

      <div className="chiprow" role="group" aria-label="Amount">
        {PRESETS.map((preset) => (
          <button
            key={preset.paise}
            className={
              preset.paise === amount
                ? "btn btn-tinted btn-sm"
                : "btn btn-secondary btn-sm"
            }
            type="button"
            onClick={() => setAmount(preset.paise)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <CheckoutButton
          amount={amount}
          label={`Buy ${selected.label} of credits`}
          description="UNIUN credit top-up"
        />
      </div>
    </div>
  );
}
