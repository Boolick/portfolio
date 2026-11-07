"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface SanitizedUser {
  id: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  session: { user: SanitizedUser } | null;
  user: SanitizedUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function wipeLegacyClientStorage() {
  if (typeof window === "undefined") return;

  // 1. Purge any Supabase tokens or session artifacts from localStorage
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("sb-") || key.includes("supabase.auth.token") || key.includes("supabase"))) {
        localStorage.removeItem(key);
      }
    }
  } catch {}

  // 2. Clean up any legacy non-HttpOnly client cookies to prevent collision or DevTools leak
  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith("sb-") && name.includes("-auth-token")) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      }
    }
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SanitizedUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setIsAdmin(!!data.isAdmin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial verification via BFF session endpoint
    void refreshSession();
    wipeLegacyClientStorage();
  }, [refreshSession]);

  const signIn = async (email: string, password: string) => {
    try {
      wipeLegacyClientStorage();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        return { error: data.error?.message || "Authentication failed" };
      }

      setUser(data.user);
      setIsAdmin(data.user?.role === "admin");
      wipeLegacyClientStorage();

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Network error" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setIsAdmin(false);
      wipeLegacyClientStorage();
    }
  };

  const session = user ? { user } : null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        loading,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
