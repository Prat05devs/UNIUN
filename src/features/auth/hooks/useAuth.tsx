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
import { RequestError } from "@/lib/api";
import {
  clearHandoffToken,
  clearSession,
  consumeHandoffFragment,
  loadHandoffToken,
  loadSession,
  loginWithPrivkey,
  LoginResult,
  saveSession,
  sessionFromApiKey,
  sessionFromHandoffToken
} from "../services";
import { Session } from "../types";

type AuthContextType = {
  session: Session | null;
  // true until localStorage hydration (and any hand-off token) completes —
  // guards against a logged-in user being redirected away before it's read.
  isLoading: boolean;
  // Set when a mobile hand-off token (see docs §1b) was present but expired
  // or was otherwise rejected — show "reopen from the app", don't retry.
  handoffExpired: boolean;
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
  handoffExpired: false,
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
  const [handoffExpired, setHandoffExpired] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      setSession(stored);
      setIsLoading(false);
      return;
    }

    // No persisted login — check for a mobile hand-off token, either just
    // arriving as a URL fragment or left over from earlier this tab.
    consumeHandoffFragment();
    const token = loadHandoffToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    sessionFromHandoffToken(token)
      .then((next) => {
        if (cancelled) return;
        // Deliberately not saveSession(): this stays sessionStorage-only and
        // dies with the tab, per §1b.
        setSession(next);
      })
      .catch((err) => {
        if (cancelled) return;
        clearHandoffToken();
        if (err instanceof RequestError && err.type !== "network_error") {
          setHandoffExpired(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (privkeyHex: string) => {
    const result = await loginWithPrivkey(privkeyHex);
    if (result.status === "ok") {
      saveSession(result.session);
      clearHandoffToken(); // a real login supersedes any hand-off token
      setSession(result.session);
    }
    return result;
  }, []);

  const connectWithKey = useCallback(
    async (apiKey: string, accountId: string, hasProfile?: boolean) => {
      const next = await sessionFromApiKey(apiKey, accountId, hasProfile);
      saveSession(next);
      clearHandoffToken();
      setSession(next);
      return next;
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    clearHandoffToken();
    setSession(null);
    setHandoffExpired(false);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        handoffExpired,
        login,
        connectWithKey,
        logout
      }}
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
