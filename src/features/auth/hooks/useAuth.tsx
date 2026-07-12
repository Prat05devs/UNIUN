"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  clearSession,
  loadSession,
  loginWithPrivkey,
  LoginResult,
  saveSession,
  sessionFromApiKey
} from "../services";
import { Session } from "../types";

type AuthContextType = {
  session: Session | null;
  // true until localStorage hydration completes — guards against a logged-in
  // user being redirected away before the session is read back.
  isLoading: boolean;
  // Resolves to needs_key on a returning login (the gateway no longer mints a
  // key each time) — finish with connectWithKey using one of the saved keys.
  login: (privkeyHex: string) => Promise<LoginResult>;
  connectWithKey: (
    apiKey: string,
    accountId: string,
    hasProfile?: boolean
  ) => Promise<Session>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  login: async () => {
    throw new Error("AuthProvider missing");
  },
  connectWithKey: async () => {
    throw new Error("AuthProvider missing");
  },
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setSession(loadSession());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (privkeyHex: string) => {
    const result = await loginWithPrivkey(privkeyHex);
    if (result.status === "ok") {
      saveSession(result.session);
      setSession(result.session);
    }
    return result;
  }, []);

  const connectWithKey = useCallback(
    async (apiKey: string, accountId: string, hasProfile?: boolean) => {
      const next = await sessionFromApiKey(apiKey, accountId, hasProfile);
      saveSession(next);
      setSession(next);
      return next;
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, login, connectWithKey, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Client-side route guard for logged-in pages (no middleware): redirects to
// /login once hydration shows there is no session.
export function useRequireAuth() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  return { session, isLoading };
}
