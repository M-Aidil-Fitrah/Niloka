"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, LogIn, Mail, Lock, ShieldCheck, MapPin } from "lucide-react";
import nilokaLogo from "@/public/assets/logo/logo.png";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (val: string) => {
    if (!val) return "";
    const isValid = /\S+@\S+\.\S+/.test(val);
    return isValid ? "" : "Format email tidak valid";
  };

  const validatePassword = (val: string) => {
    if (!val) return "";
    return val.length >= 6 ? "" : "Kata sandi minimal 6 karakter";
  };

  // Run validations in real-time as user types
  useEffect(() => {
    if (email) {
      setEmailError(validateEmail(email));
    } else {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordError(validatePassword(password));
    } else {
      setPasswordError("");
    }
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const currentEmailErr = validateEmail(email);
    const currentPasswordErr = validatePassword(password);

    if (currentEmailErr || currentPasswordErr) {
      setEmailError(currentEmailErr);
      setPasswordError(currentPasswordErr);
      return;
    }

    setIsSubmitting(true);
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
      setError("Email tidak terdaftar.");
    }
  };

  const isFormInvalid = !!emailError || !!passwordError || !email || !password;

  return (
    <div className="h-screen w-screen bg-cream-50 flex overflow-hidden">
      {/* LEFT PANEL: Branding & Visual Hero (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-[40%] h-full text-white-soft relative p-10 flex-col justify-between overflow-hidden shrink-0">
        {/* Full-bleed high-quality Unsplash image representing patchouli/essential oils */}
        <img
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop"
          alt="Minyak Atsiri Nilam"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-brand-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-brand-900/30 opacity-80" />
        
        {/* Top brand info with actual Niloka Logo */}
        <div className="z-10 flex items-center gap-2">
          <Image
            src={nilokaLogo}
            alt="Niloka Logo"
            width={100}
            height={32}
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Hero Copy */}
        <div className="z-10 my-auto space-y-4 max-w-xs">
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-[1.15] font-accent text-white-soft">
            Minyak Nilam Aceh Terbaik
          </h1>
          <p className="text-xs text-white-soft/75 leading-relaxed font-medium">
            Masuk untuk mengakses pasar atsiri terkurasi dengan transparansi penelusuran bahan langsung dari penyuling lokal.
          </p>
        </div>

        {/* Bottom footer inside hero */}
        <div className="z-10 text-[10px] text-white-soft/60 font-semibold flex items-center gap-4 justify-between border-t border-white-soft/10 pt-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-gold-500" />
            Terverifikasi Petani Lokal
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gold-500" />
            Aceh, Indonesia
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Login (Scrollable internally, minimalist styling) */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-8 lg:p-12 relative">
        {/* Top Header - Logo on Mobile, Back Button */}
        <div className="w-full flex items-center justify-between lg:justify-end z-20">
          <div className="lg:hidden">
            <Image
              src={nilokaLogo}
              alt="Niloka Logo"
              width={90}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-800 hover:text-brand-950 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke Pasar
          </Link>
        </div>

        {/* Center Card */}
        <div className="my-auto py-6 sm:mx-auto sm:w-full sm:max-w-sm z-10 w-full">
          <div className="bg-white-soft/90 backdrop-blur-md py-7 px-6 border border-line/35 rounded-3xl sm:px-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-brand-950 font-accent tracking-tight mb-1">
              Masuk Akun
            </h2>
            <p className="text-xs text-ink-600 font-semibold mb-6 flex items-center flex-wrap gap-y-1">
              Belum memiliki akun?{" "}
              <Link
                href="/auth/register"
                className="font-extrabold text-brand-950 hover:text-brand-900 transition-colors inline-flex items-center gap-0.5 ml-1"
              >
                Buat Akun Gratis <span className="text-[10px]">↗</span>
              </Link>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-100/80 leading-relaxed">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
                  Alamat Email
                </label>
                <div className="relative rounded-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-3.5 w-3.5 text-ink-600" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
                      emailError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-line/45"
                    }`}
                    placeholder="nama@email.com"
                  />
                </div>
                {emailError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative rounded-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-3.5 w-3.5 text-ink-600" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
                      passwordError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-line/45"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {passwordError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{passwordError}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || isFormInvalid}
                  className="w-full flex justify-center items-center gap-1.5 py-2.5 px-4 border border-transparent rounded-full shadow-sm text-xs font-bold text-white-soft bg-brand-900 hover:bg-brand-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  {isSubmitting ? "Memproses..." : "Masuk"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Trust/Info Footer (Always visible) */}
        <div className="w-full text-center text-[10px] text-ink-600/50 font-semibold z-20">
          © {new Date().getFullYear()} NILOKA. Semua Data Terproteksi Aman.
        </div>
      </div>
    </div>
  );
}
