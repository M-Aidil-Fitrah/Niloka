"use server";

import { UserRole } from "@/generated/prisma/client";
import { registerSchema, type RegisterInput } from "@/lib/auth/schemas";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";

export type AuthActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export async function registerBuyerAction(
  input: RegisterInput,
): Promise<AuthActionResult> {
  const parsedInput = registerSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      ok: false,
      message:
        parsedInput.error.issues[0]?.message ??
        "Data pendaftaran belum valid.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsedInput.data.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      ok: false,
      message: "Email sudah terdaftar.",
    };
  }

  await prisma.user.create({
    data: {
      name: parsedInput.data.name,
      email: parsedInput.data.email,
      role: UserRole.BUYER,
      passwordHash: await hashPassword(parsedInput.data.password),
    },
  });

  return {
    ok: true,
  };
}
