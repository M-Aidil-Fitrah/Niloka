import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid.").trim().toLowerCase(),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.email("Format email tidak valid.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter.")
    .regex(/[A-Z]/, "Kata sandi harus mengandung huruf kapital.")
    .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil.")
    .regex(/[0-9]/, "Kata sandi harus mengandung angka."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
