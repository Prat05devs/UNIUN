"use client";

import { useState } from "react";
import { Icon } from "@/components/uniun/DsxChrome";
import { useProfile } from "../hooks";
import { useProfileForm } from "../hooks/useProfileForm";
import { Profile } from "../types";

function ProfileForm({
  profile,
  onDone
}: {
  profile: Profile;
  onDone: () => void;
}) {
  const form = useProfileForm(profile, onDone);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="cols-2" style={{ marginTop: 16, gap: 12 }}>
        <label className="field" style={{ marginBottom: 0 }}>
          <span>Username</span>
          <input
            value={form.username}
            onChange={(e) => form.setUsername(e.target.value)}
            placeholder="your_name"
            autoComplete="username"
            spellCheck={false}
          />
        </label>
        <label className="field" style={{ marginBottom: 0 }}>
          <span>Email</span>
          <input
            value={form.email}
            onChange={(e) => form.setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            spellCheck={false}
          />
        </label>
      </div>

      <div className="chiprow" style={{ marginTop: 14 }}>
        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={form.isSaving}
        >
          {form.isSaving ? "Saving…" : "Save profile"}
        </button>
        <button
          className="btn btn-ghost btn-sm"
          type="button"
          onClick={onDone}
        >
          {profile.username ? "Cancel" : "Later"}
        </button>
      </div>

      {form.error && (
        <p role="alert" style={{ marginTop: 10 }}>
          {form.error}
        </p>
      )}
    </form>
  );
}

// Dashboard profile block. Three states: username missing → "complete your
// profile" card; username set → compact identity line with an Edit toggle;
// profile still loading / errored → render nothing (the dashboard works fine
// without it — the keypair remains the identity).
export function ProfileSection() {
  const { profile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!profile) return null;

  if (!profile.username && !dismissed) {
    return (
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <strong>Finish setting up your account</strong>
        <p className="muted" style={{ marginTop: 6 }}>
          Pick a username and add an email so this account is recognisably
          yours. Optional — your keypair stays the real login.
        </p>
        <ProfileForm profile={profile} onDone={() => setDismissed(true)} />
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 20, marginBottom: 24 }}>
      <div className="chiprow" style={{ marginTop: 0, alignItems: "center" }}>
        <span className="isq">
          <Icon name="person" />
        </span>
        <strong>{profile.username ? `@${profile.username}` : "Anonymous"}</strong>
        {profile.email && <span className="muted">{profile.email}</span>}
        <span className="chip chip-tonal">{profile.plan}</span>
        <button
          className="btn btn-ghost btn-sm"
          type="button"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "Close" : "Edit profile"}
        </button>
      </div>
      {editing && (
        <ProfileForm profile={profile} onDone={() => setEditing(false)} />
      )}
    </div>
  );
}
