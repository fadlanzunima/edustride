"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

// Demo user data for fallback
export const DEMO_USER = {
  id: "demo-user-id",
  name: "Demo Student",
  email: "demo@edustride.id",
  level: "S1",
  institution: "Universitas Indonesia",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
  isDemo: true,
};

export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  institution: string;
  image?: string;
  isDemo: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  authError: Error | null;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Check if there's an auth error from the session
  useEffect(() => {
    if (status === "unauthenticated" && !isDemoMode) {
      // Auto-enable demo mode if auth fails and not already in demo mode
      console.log("Auth: User unauthenticated, demo mode available");
    }
  }, [status, isDemoMode]);

  const enableDemoMode = () => {
    console.log("Auth: Enabling demo mode");
    setIsDemoMode(true);
    setAuthError(null);
  };

  const disableDemoMode = () => {
    console.log("Auth: Disabling demo mode");
    setIsDemoMode(false);
  };

  // Determine the current user and auth state
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "",
        level: session.user.level || "S1",
        institution: session.user.institution || "",
        image: session.user.image || undefined,
        isDemo: false,
      }
    : isDemoMode
    ? DEMO_USER
    : null;

  const isAuthenticated = !!user;
  const isLoading = status === "loading";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isDemoMode,
        isLoading,
        authError,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
