import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid.").trim().toLowerCase(),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.email("Format email tidak valid.").trim().toLowerCase(),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
