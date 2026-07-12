"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import {
  getSession,
  SessionProvider,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import type { Session } from "next-auth";
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

type AuthResult = { ok: boolean; user?: AuthUser; error?: string };

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSessionUser(session: Session | null | undefined): AuthUser | null {
  const sessionUser = session?.user;

  if (!sessionUser?.id) return null;

  return {
    id: sessionUser.id,
    name: sessionUser.name ?? "Pengguna NILOKA",
    email: sessionUser.email ?? "",
    role: sessionUser.role,
    sellerId: sessionUser.sellerId ?? undefined,
  };
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFreshSessionUser(): Promise<AuthUser | null> {
  const retryDelays = [0, 150, 300, 600];

  for (const delay of retryDelays) {
    if (delay > 0) {
      await sleep(delay);
    }

    const user = mapSessionUser(await getSession());

    if (user) {
      return user;
    }
  }

  return null;
}

function AuthBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: AuthUser | null = useMemo(() => {
    return mapSessionUser(session);
  }, [session]);

  const login = useCallback(async (
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      return { ok: false, error: result?.error === "CredentialsSignin" ? "Email atau kata sandi salah." : "Gagal masuk. Silakan coba lagi." };
    }

    const nextUser = await getFreshSessionUser();

    if (!nextUser) {
      return { ok: false, error: "Gagal memuat data pengguna. Silakan coba lagi." };
    }

    return {
      ok: true,
      user: nextUser,
    };
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    const result = await registerBuyerAction({
      name,
      email,
      password,
    });

    if (!result.ok) {
      return { ok: false, error: result.message || "Email sudah terdaftar." };
    }

    const loginResult = await login(email, password);
    return loginResult;
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
    isLoggingIn: status !== "authenticated" && status !== "loading",
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
