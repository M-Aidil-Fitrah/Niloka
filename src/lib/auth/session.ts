import "server-only";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import type { NilokaSessionRole } from "@/types/next-auth";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: NilokaSessionRole;
  sellerId: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id || !user.email) {
    return null;
  }

  return {
    id: user.id,
    name: user.name ?? "Pengguna NILOKA",
    email: user.email,
    role: user.role,
    sellerId: user.sellerId ?? null,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function requireSeller(): Promise<CurrentUser> {
  const user = await requireUser();

  if (user.role !== "seller" || !user.sellerId) {
    redirect("/");
  }

  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}
