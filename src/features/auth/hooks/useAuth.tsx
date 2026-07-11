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
  saveSession
} from "../services";
import { Session } from "../types";

type AuthContextType = {
  session: Session | null;
  // true until localStorage hydration completes — guards against a logged-in
  // user being redirected away before the session is read back.
  isLoading: boolean;
  login: (privkeyHex: string) => Promise<Session>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  login: async () => {
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
    const next = await loginWithPrivkey(privkeyHex);
    saveSession(next);
    setSession(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
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
