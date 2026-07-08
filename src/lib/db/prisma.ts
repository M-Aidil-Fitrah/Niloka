import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/niloka?schema=public";

const globalForPrisma = globalThis as typeof globalThis & {
  nilokaPrisma?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma =
  globalForPrisma.nilokaPrisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.nilokaPrisma = prisma;
}
