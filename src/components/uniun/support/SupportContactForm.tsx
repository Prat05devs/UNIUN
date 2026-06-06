"use client";

import { FormEvent } from "react";
import { Send } from "lucide-react";

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
    <form className="support-form" onSubmit={handleSubmit}>
      <div className="support-form-heading">
        <span>Contact support</span>
        <h2>Tell us what needs attention.</h2>
      </div>

      <label>
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
      </label>

      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <label>
        <span>Support topic</span>
        <select name="topic" defaultValue="iOS app support">
          <option>iOS app support</option>
          <option>Account or access</option>
          <option>Privacy or data request</option>
          <option>Bug report</option>
          <option>Product feedback</option>
        </select>
      </label>

      <label>
        <span>Device or platform</span>
        <input name="device" type="text" placeholder="iPhone, iPad, web, or desktop" />
      </label>

      <label className="support-form-message">
        <span>Message</span>
        <textarea
          name="message"
          placeholder="Share what happened, what you expected, and any steps that reproduce it."
          required
        />
      </label>

      <button type="submit">
        <Send aria-hidden="true" />
        Send message
      </button>
    </form>
  );
}
