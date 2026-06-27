"use client";

import { FormEvent } from "react";

const supportEmail = "pranavpandey1998developer@gmail.com";

export function SupportContactForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const topic = String(data.get("topic") || "General support");
    const device = String(data.get("device") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`UNIUN support: ${topic}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic}`,
        `Device: ${device}`,
        "",
        "Message:",
        message
      ].join("\n")
    );

    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <span className="section-label" style={{ margin: "0 0 8px" }}>
          <span className="material-symbols-rounded" aria-hidden="true">
            edit_note
          </span>
          Contact support
        </span>
        <h2 className="h3">Tell us what needs attention.</h2>
      </div>

      <label className="field">
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
      </label>

      <label className="field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="field">
        <span>Support topic</span>
        <select name="topic" defaultValue="iOS app support">
          <option>iOS app support</option>
          <option>Account or access</option>
          <option>Privacy or data request</option>
          <option>Bug report</option>
          <option>Product feedback</option>
        </select>
      </label>

      <label className="field">
        <span>Device or platform</span>
        <input name="device" type="text" placeholder="iPhone, iPad, web, or desktop" />
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          placeholder="Share what happened, what you expected, and any steps that reproduce it."
          required
        />
      </label>

      <button className="btn btn-primary" type="submit" style={{ justifySelf: "start" }}>
        <span className="material-symbols-rounded" aria-hidden="true">
          send
        </span>
        Send message
      </button>
    </form>
  );
}
