"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, LogIn, Mail, Lock, Sparkles, ShieldCheck, MapPin } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email) {
      setError("Alamat email wajib diisi");
      setIsSubmitting(false);
      return;
    }

    const user = await login(email);
    setIsSubmitting(false);

    if (user) {
      if (user.role === "seller") {
        router.push("/seller");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setError("Email tidak terdaftar. Gunakan tombol Akun Demo di bawah untuk masuk instan.");
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
    setIsSubmitting(true);

    const user = await login(demoEmail);
    setIsSubmitting(false);

    if (user) {
      if (user.role === "seller") {
        router.push("/seller");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex overflow-hidden">
      {/* LEFT PANEL: Branding & Visual Hero (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-[42%] bg-brand-950 text-white-soft relative p-12 flex-col justify-between overflow-hidden">
        {/* Abstract organic background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--brand-700),transparent_60%)] opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
        
        {/* Top brand info */}
        <div className="z-10 flex items-center gap-2">
          <span className="h-9 w-9 rounded-full bg-gold-500 flex items-center justify-center font-accent text-brand-950 font-bold text-lg">
            N
          </span>
          <span className="font-extrabold tracking-wider text-sm uppercase text-gold-100">
            NILOKA
          </span>
        </div>

        {/* Hero Copy */}
        <div className="z-10 my-auto space-y-6 max-w-sm">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white-soft/10 text-xs font-semibold text-gold-500 border border-white-soft/10">
            <Sparkles className="h-3 w-3" />
            Ecosystem Nilam Sirkular
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] font-accent text-white-soft">
            Minyak Atsiri Terbaik Dari Bumi Aceh
          </h1>
          <p className="text-sm text-ink-600 leading-relaxed font-medium">
            Temukan produk turunan nilam berkualitas premium yang ditelusuri secara transparan lewat Nilam Passport dari petani lokal.
          </p>

          {/* Floating interactive-style card */}
          <div className="pt-4">
            <div className="bg-white-soft/5 backdrop-blur-md border border-white-soft/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-gold-500/25 flex items-center justify-center text-gold-500 font-bold text-xs shrink-0">
                PA%
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-white-soft">Kadar Pogostone Acetate (PA)</p>
                <p className="text-[10px] text-gold-500 font-bold mt-0.5">34.2% (Premium Quality Verified)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer inside hero */}
        <div className="z-10 text-[11px] text-ink-600 font-semibold flex items-center gap-4 justify-between border-t border-white-soft/10 pt-6">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
            Terverifikasi UPTD Atsiri
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gold-500" />
            Aceh, Indonesia
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Login (Full width on mobile/tablet) */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Blurry mobile background blobs */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-200/10 blur-3xl pointer-events-none" />
        <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold-100/20 blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-800 hover:text-brand-950 transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" />
            Kembali ke Pasar
          </Link>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 font-accent tracking-tight">
            Masuk Akun
          </h2>
          <p className="mt-1 text-sm text-ink-600 font-semibold">
            Belum terdaftar?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-gold-600 hover:text-gold-500 transition-colors underline"
            >
              Mulai mendaftar gratis
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-white-soft/75 backdrop-blur-md py-8 px-6 border border-line/45 rounded-3xl sm:px-10 shadow-sm">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-100 leading-relaxed">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-[11px] font-extrabold text-brand-950 uppercase tracking-wider mb-2">
                  Alamat Email
                </label>
                <div className="relative rounded-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-ink-600" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-line/50 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 text-sm placeholder:text-ink-600/40 text-brand-950 font-semibold transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-[11px] font-extrabold text-brand-950 uppercase tracking-wider mb-2">
                  Kata Sandi
                </label>
                <div className="relative rounded-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-ink-600" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-line/50 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 text-sm placeholder:text-ink-600/40 text-brand-950 font-semibold transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-md text-sm font-bold text-white-soft bg-brand-900 hover:bg-brand-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  {isSubmitting ? "Memproses..." : "Masuk"}
                </button>
              </div>
            </form>

            {/* Quick Demo Shortcuts (No Role Switcher) */}
            <div className="mt-8 pt-6 border-t border-line/45">
              <p className="text-center text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-4">
                Masuk Instan dengan Akun Demo
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("buyer@niloka.com")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-cream-50/60 hover:bg-cream-100 border border-line/35 transition-all text-center group cursor-pointer"
                >
                  <span className="text-[10px] font-extrabold text-brand-950">Pembeli</span>
                  <span className="text-[8px] text-ink-600 mt-0.5 font-medium truncate w-full">buyer@niloka.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("seller@niloka.com")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-cream-50/60 hover:bg-cream-100 border border-line/35 transition-all text-center group cursor-pointer"
                >
                  <span className="text-[10px] font-extrabold text-brand-950">Penjual</span>
                  <span className="text-[8px] text-ink-600 mt-0.5 font-medium truncate w-full">seller@niloka.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin@niloka.com")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-cream-50/60 hover:bg-cream-100 border border-line/35 transition-all text-center group cursor-pointer"
                >
                  <span className="text-[10px] font-extrabold text-brand-950">Admin</span>
                  <span className="text-[8px] text-ink-600 mt-0.5 font-medium truncate w-full">admin@niloka.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
