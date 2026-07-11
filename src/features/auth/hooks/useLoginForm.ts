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
  const { login } = useAuth();
  const router = useRouter();

  const [privkey, setPrivkey] = useState("");
  // Set when the user generates a fresh keypair — shown exactly once with a
  // save warning; it is their only credential and cannot be recovered.
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const session = await login(key);
      router.push(session.newAccount ? "/dashboard?welcome=1" : "/dashboard");
    } catch (err) {
      setError(loginErrorMessage(err));
      setIsSubmitting(false);
    }
  }, [privkey, login, router]);

  return {
    privkey,
    generatedKey,
    error,
    isSubmitting,
    handleChange,
    handleGenerate,
    handleSubmit
  };
}
