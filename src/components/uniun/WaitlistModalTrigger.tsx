"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { X, type LucideIcon } from "lucide-react";

type WaitlistModalTriggerProps = {
  className?: string;
  icon: LucideIcon;
  label: string;
};

const waitlistEmail = "pranavpandey1998developer@gmail.com";

export function WaitlistModalTrigger({
  className,
  icon: Icon,
  label
}: WaitlistModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const subject = encodeURIComponent("UNIUN waitlist request");
    const body = encodeURIComponent(
      [
        "Hi UNIUN team,",
        "",
        "Thank you for building UNIUN. I would like to join the waitlist and receive updates when access opens.",
        "",
        "My details:",
        `Name: ${name}`,
        `Email ID: ${email}`,
        `Phone number: ${phone || "Not provided"}`,
        "",
        "Thank you."
      ].join("\n")
    );

    setStatusMessage("Your mail app should open with the message ready to send.");
    window.location.href = `mailto:${waitlistEmail}?subject=${subject}&body=${body}`;
  };

  const modal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="waitlist-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <div
              aria-labelledby={titleId}
              aria-modal="true"
              className="waitlist-modal"
              role="dialog"
            >
              <button
                aria-label="Close waitlist form"
                className="waitlist-modal-close"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <X aria-hidden="true" />
              </button>

              <div className="waitlist-modal-heading">
                <span>UNIUN waitlist</span>
                <h2 id={titleId}>Join the waitlist.</h2>
                <p>Share your details and we will keep you posted as UNIUN opens up.</p>
              </div>

              <form className="waitlist-form" onSubmit={handleSubmit}>
                <label>
                  <span>
                    Name <strong aria-hidden="true">*</strong>
                  </span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>

                <label>
                  <span>
                    Email ID <strong aria-hidden="true">*</strong>
                  </span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>

                <label>
                  <span>Phone number</span>
                  <input name="phone" type="tel" autoComplete="tel" />
                </label>

                <button type="submit">Submit</button>

                {statusMessage ? (
                  <p className="waitlist-form-note success" role="status">
                    {statusMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => {
          setStatusMessage("");
          setIsOpen(true);
        }}
      >
        <Icon aria-hidden="true" />
        {label}
      </button>

      {modal}
    </>
  );
}
