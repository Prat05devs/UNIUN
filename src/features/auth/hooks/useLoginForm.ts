"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { RequestError } from "@/lib/api";
import { generatePrivkey } from "../services";
import { useAuth } from "./useAuth";

const PRIVKEY_PATTERN = /^[0-9a-f]{64}$/i;

function loginErrorMessage(error: unknown): string {
  if (error instanceof RequestError) {
    if (error.type === "bad_signature" || error.type === "challenge_invalid") {
      return "Login failed — the signature was rejected. Check your key and try again.";
    }
    if (error.type === "rate_limited") {
      return "Too many attempts. Wait a moment and try again.";
    }
    if (error.type === "network_error") {
      return "Could not reach the server. Check your connection and try again.";
    }
    return error.message;
  }
  return "Login failed. Please try again.";
}

export function useLoginForm() {
  const { login, connectWithKey } = useAuth();
  const router = useRouter();

  const [privkey, setPrivkey] = useState("");
  // Set when the user generates a fresh keypair — shown exactly once with a
  // save warning; it is their only credential and cannot be recovered.
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Returning login on a browser without a saved key: identity is proven but
  // the gateway didn't mint a key — the user pastes one they saved earlier.
  const [pendingAccount, setPendingAccount] = useState<{
    accountId: string;
    hasProfile?: boolean;
  } | null>(null);
  const [apiKey, setApiKey] = useState("");

  const handleChange = useCallback((value: string) => {
    setPrivkey(value);
    setError(null);
  }, []);

  const handleGenerate = useCallback(() => {
    const key = generatePrivkey();
    setPrivkey(key);
    setGeneratedKey(key);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const key = privkey.trim();
    if (!PRIVKEY_PATTERN.test(key)) {
      setError("Private key must be 64 hexadecimal characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await login(key);
      if (result.status === "needs_key") {
        setPendingAccount({
          accountId: result.accountId,
          hasProfile: result.hasProfile
        });
        setIsSubmitting(false);
        return;
      }
      router.push(
        result.session.newAccount ? "/dashboard?welcome=1" : "/dashboard"
      );
    } catch (err) {
      setError(loginErrorMessage(err));
      setIsSubmitting(false);
    }
  }, [privkey, login, router]);

  const handleApiKeyChange = useCallback((value: string) => {
    setApiKey(value);
    setError(null);
  }, []);

  const handleConnectKey = useCallback(async () => {
    if (!pendingAccount) return;
    const key = apiKey.trim();
    if (!key.startsWith("uk_")) {
      setError("API keys start with uk_ — paste the key you saved at signup.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await connectWithKey(key, pendingAccount.accountId, pendingAccount.hasProfile);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.type === "wrong_account") {
          setError(err.message);
        } else if (
          err.type === "unauthorized" ||
          err.type === "invalid_api_key"
        ) {
          setError("That key is invalid or revoked. Try another one.");
        } else {
          setError(loginErrorMessage(err));
        }
      } else {
        setError("Could not connect with that key. Please try again.");
      }
      setIsSubmitting(false);
    }
  }, [apiKey, pendingAccount, connectWithKey, router]);

  const handleBackToLogin = useCallback(() => {
    setPendingAccount(null);
    setApiKey("");
    setError(null);
  }, []);

  return {
    privkey,
    generatedKey,
    error,
    isSubmitting,
    pendingAccount,
    apiKey,
    handleChange,
    handleGenerate,
    handleSubmit,
    handleApiKeyChange,
    handleConnectKey,
    handleBackToLogin
  };
}
