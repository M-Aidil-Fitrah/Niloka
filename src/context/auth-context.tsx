"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  login: (email: string) => Promise<AuthUser | null>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: AuthUser[] = [
  {
    id: "user-buyer-1",
    name: "Budi Handoko",
    email: "buyer@niloka.com",
    role: "buyer",
  },
  {
    id: "user-seller-1",
    name: "Ahmad Atsiri (Aceh Aroma House)",
    email: "seller@niloka.com",
    role: "seller",
    sellerId: "seller-aceh-aroma",
    sellerType: "umkm",
    location: {
      province: "Aceh",
      city: "Aceh Selatan",
      district: "Tapaktuan",
    },
  },
  {
    id: "user-admin-1",
    name: "Siti Rahma (Admin)",
    email: "admin@niloka.com",
    role: "admin",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user session and local users DB from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("niloka_auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Initialize mock users database in localStorage if not exists
      const storedDb = localStorage.getItem("niloka_users_db");
      if (!storedDb) {
        localStorage.setItem("niloka_users_db", JSON.stringify(DEFAULT_USERS));
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<AuthUser | null> => {
    try {
      const dbStr = localStorage.getItem("niloka_users_db") || JSON.stringify(DEFAULT_USERS);
      const db: AuthUser[] = JSON.parse(dbStr);

      // Find user by email (case-insensitive)
      const foundUser = db.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("niloka_auth_user", JSON.stringify(foundUser));
        return foundUser;
      }

      return null;
    } catch (e) {
      console.error("Login error", e);
      return null;
    }
  };

  const register = async (
    name: string,
    email: string
  ): Promise<boolean> => {
    try {
      const dbStr = localStorage.getItem("niloka_users_db") || JSON.stringify(DEFAULT_USERS);
      const db: AuthUser[] = JSON.parse(dbStr);

      // Check if email already exists
      const emailExists = db.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        return false;
      }

      const newUserId = `user-buyer-${Date.now()}`;
      const newUser: AuthUser = {
        id: newUserId,
        name,
        email,
        role: "buyer",
      };

      const updatedDb = [...db, newUser];
      localStorage.setItem("niloka_users_db", JSON.stringify(updatedDb));

      // Auto login after successful registration
      setUser(newUser);
      localStorage.setItem("niloka_auth_user", JSON.stringify(newUser));
      return true;
    } catch (e) {
      console.error("Registration error", e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("niloka_auth_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
