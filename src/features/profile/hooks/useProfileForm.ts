"use client";

import { useState } from "react";
import { RequestError } from "@/lib/api";
import { useUpdateProfile } from "./index";

const USERNAME_RE = /^[a-z0-9_]{3,32}$/;
// Syntax-level check only — the gateway validates the same way (no verification flow).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function friendlyError(error: unknown): string {
  if (error instanceof RequestError) {
    if (error.type === "username_taken") {
      return "That username is already taken — try another.";
    }
    if (error.type === "invalid_request") return error.message;
    if (error.type === "network_error") {
      return "Could not reach the server. Check your connection and try again.";
    }
    return error.message;
  }
  return "Could not save your profile. Please try again.";
}

// Form state for the complete/edit profile step. Usernames are lowercased as
// typed (the gateway lowercases on write anyway, so show the truth early).
export function useProfileForm(
  initial: { username?: string | null; email?: string | null },
  onSaved?: () => void
) {
  const [username, setUsername] = useState(initial.username ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const { updateProfile, isSaving } = useUpdateProfile();

  const handleUsernameChange = (value: string) =>
    setUsername(value.toLowerCase());

  const handleSubmit = async () => {
    const name = username.trim();
    const mail = email.trim();

    if (!name && !mail) {
      setError("Enter a username or an email.");
      return;
    }
    if (name && !USERNAME_RE.test(name)) {
      setError(
        "Username must be 3–32 characters: lowercase letters, digits, underscore."
      );
      return;
    }
    if (mail && !EMAIL_RE.test(mail)) {
      setError("That email address doesn't look right.");
      return;
    }

    setError(null);
    try {
      await updateProfile({
        ...(name && { username: name }),
        ...(mail && { email: mail })
      });
      onSaved?.();
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return {
    username,
    email,
    setUsername: handleUsernameChange,
    setEmail,
    error,
    isSaving,
    handleSubmit
  };
}
