"use client";

import React, { createContext, useContext } from "react";
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

  const user: AuthUser | null =
    sessionUser?.id && sessionUser.email
      ? {
          id: sessionUser.id,
          name: sessionUser.name ?? "Pengguna NILOKA",
          email: sessionUser.email,
          role: sessionUser.role,
          sellerId: sessionUser.sellerId ?? undefined,
        }
      : null;

  const login = async (
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
  };

  const register = async (
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
  };

  const logout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === "loading",
        login,
        register,
        logout,
      }}
    >
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
