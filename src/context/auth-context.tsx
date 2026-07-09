"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import {
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { registerBuyerAction } from "@/lib/actions/auth-actions";

export type UserRole = "buyer" | "seller" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sellerId?: string;
  sellerType?: string;
  location?: {
    province: string;
    city: string;
    district: string;
  };
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const sessionUser = session?.user;

  const user: AuthUser | null = useMemo(() => {
    if (!sessionUser?.id || !sessionUser.email) return null;
    return {
      id: sessionUser.id,
      name: sessionUser.name ?? "Pengguna NILOKA",
      email: sessionUser.email,
      role: sessionUser.role,
      sellerId: sessionUser.sellerId ?? undefined,
    };
  }, [sessionUser]);

  const login = useCallback(async (
    email: string,
    password: string,
  ): Promise<AuthUser | null> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      return null;
    }

    const nextSession = await update();
    const nextUser = nextSession?.user;

    if (!nextUser?.id || !nextUser.email) {
      return null;
    }

    return {
      id: nextUser.id,
      name: nextUser.name ?? "Pengguna NILOKA",
      email: nextUser.email,
      role: nextUser.role,
      sellerId: nextUser.sellerId ?? undefined,
    };
  }, [update]);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    const result = await registerBuyerAction({
      name,
      email,
      password,
    });

    if (!result.ok) {
      return false;
    }

    const loginResult = await login(email, password);
    return loginResult !== null;
  }, [login]);

  const logout = useCallback(async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading: status === "loading",
    login,
    register,
    logout,
  }), [user, status, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthBridge>{children}</AuthBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
