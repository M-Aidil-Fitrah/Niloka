import type { DefaultSession } from "next-auth";

export type NilokaSessionRole = "buyer" | "seller" | "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: NilokaSessionRole;
      sellerId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: NilokaSessionRole;
    sellerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: NilokaSessionRole;
    sellerId?: string | null;
  }
}
