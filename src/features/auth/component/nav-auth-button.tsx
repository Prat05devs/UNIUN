"use client";

import { useAuth } from "../hooks/useAuth";

// The nav's auth entry point: Login when signed out, Dashboard when signed in.
// Server-rendered as Login; flips after the session hydrates.
export function NavAuthButton() {
  const { session, isLoading } = useAuth();

  if (!isLoading && session) {
    return (
      <a className="btn btn-secondary btn-sm" href="/dashboard">
        Dashboard
      </a>
    );
  }

  return (
    <a className="btn btn-secondary btn-sm" href="/login">
      Login
    </a>
  );
}
