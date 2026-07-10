"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { showToast } from "@/lib/toast";
import { ArrowLeft, UserPlus, User, Mail, Lock, ShieldCheck, MapPin } from "lucide-react";
import nilokaLogo from "@/public/assets/logo/logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP Animation Effects
  useGSAP(() => {
    // 1. Entrance animation for Left Hero Panel elements
    gsap.fromTo(
      ".hero-content-item",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out" }
    );

    // 2. Entrance animation for the Right Form Card and its elements
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.94, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "power4.out" }
    );

    gsap.fromTo(
      ".form-element-item",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.4 }
    );

    // 3. Floating Sine-Wave motion for the "Aroma Particles" representing patchouli steam
    gsap.to(".aroma-particle-1", {
      x: "random(-35, 35)",
      y: "random(-35, 35)",
      duration: "random(7, 10)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".aroma-particle-2", {
      x: "random(-50, 50)",
      y: "random(-50, 50)",
      duration: "random(9, 13)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".aroma-particle-3", {
      x: "random(-30, 30)",
      y: "random(-30, 30)",
      duration: "random(6, 11)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".aroma-particle-4", {
      x: "random(-45, 45)",
      y: "random(-45, 45)",
      duration: "random(8, 12)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 4. Parallax Effect on Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.015;
      const moveY = (clientY - window.innerHeight / 2) * 0.015;

      // Subtle parallax on Left Hero Image
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          x: moveX * 0.4,
          y: moveY * 0.4,
          duration: 0.9,
          ease: "power2.out",
        });
      }

      // Parallax on Floating Aroma Particles (moving in opposite directions)
      gsap.to(".aroma-particle", {
        xPercent: -moveX * 2,
        yPercent: -moveY * 2,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.03,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  const validateName = (val: string) => {
    if (!val) return "";
    return val.trim().length >= 3 ? "" : "Nama lengkap minimal 3 karakter";
  };

  const validateEmail = (val: string) => {
    if (!val) return "";
    const isValid = /\S+@\S+\.\S+/.test(val);
    return isValid ? "" : "Format email tidak valid";
  };

  const validatePassword = (val: string) => {
    if (!val) return "";
    if (val.length < 8) return "Kata sandi minimal 8 karakter";
    if (!/[A-Z]/.test(val)) return "Kata sandi harus mengandung huruf kapital";
    if (!/[a-z]/.test(val)) return "Kata sandi harus mengandung huruf kecil";
    if (!/[0-9]/.test(val)) return "Kata sandi harus mengandung angka";
    return "";
  };

  const validateConfirmPassword = (val: string, pass: string) => {
    if (!val) return "";
    return val === pass ? "" : "Konfirmasi sandi tidak cocok";
  };

  // Derive validation errors dynamically
  const nameError = name ? validateName(name) : "";
  const emailError = email ? validateEmail(email) : "";
  const passwordError = password ? validatePassword(password) : "";
  const confirmPasswordError = confirmPassword ? validateConfirmPassword(confirmPassword, password) : "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nameError || emailError || passwordError || confirmPasswordError) {
      showToast("Periksa kembali data pendaftaran kamu.", "warning");
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.ok) {
      showToast("Akun berhasil dibuat. Selamat datang di NILOKA.", "success");
      router.push("/");
    } else {
      showToast(result.error || "Pendaftaran gagal. Silakan coba lagi.", "error");
    }
  };

  const isFormInvalid =
    !!nameError ||
    !!emailError ||
    !!passwordError ||
    !!confirmPasswordError ||
    !name ||
    !email ||
    !password ||
    !confirmPassword;

  return (
    <div ref={containerRef} className="h-screen w-screen bg-cream-50 flex overflow-hidden">
      {/* LEFT PANEL: Branding & Visual Hero (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-[40%] h-full text-white-soft relative p-10 flex-col justify-between overflow-hidden shrink-0">
        {/* Full-bleed high-quality Unsplash image representing patchouli/essential oils */}
        <Image
          ref={heroImgRef}
          src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop"
          alt="Minyak Atsiri Nilam"
          fill
          priority
          sizes="40vw"
          className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-brand-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-brand-900/30 opacity-80" />
        
        {/* Top brand info with actual Niloka Logo */}
        <div className="z-10 flex items-center gap-2 hero-content-item">
          <Image
            src={nilokaLogo}
            alt="Niloka Logo"
            width={100}
            height={32}
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Hero Copy */}
        <div className="z-10 my-auto space-y-4 max-w-xs hero-content-item">
          <h1 className="text-3xl xl:text-4xl font-extrabold leading-[1.15] font-accent text-white-soft">
            Bergabung Bersama NILOKA
          </h1>
          <p className="text-xs text-white-soft/75 leading-relaxed font-medium">
            Buat akun untuk mulai membeli produk atsiri pilihan dengan transparansi penelusuran asal panen.
          </p>
        </div>

        {/* Bottom footer inside hero */}
        <div className="z-10 text-[10px] text-white-soft/60 font-semibold flex items-center gap-4 justify-between border-t border-white-soft/10 pt-4 hero-content-item">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-gold-500" />
            Keaslian Terjamin
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gold-500" />
            Aceh, Indonesia
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Register (Scrollable internally, minimalist styling) */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-8 lg:p-12 relative z-10">
        
        {/* Floating Aroma Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="aroma-particle aroma-particle-1 absolute top-[20%] left-[15%] w-32 h-32 rounded-full bg-gold-200/10 blur-2xl" />
          <div className="aroma-particle aroma-particle-2 absolute bottom-[25%] right-[20%] w-48 h-48 rounded-full bg-brand-100/20 blur-3xl" />
          <div className="aroma-particle aroma-particle-3 absolute top-[60%] left-[70%] w-24 h-24 rounded-full bg-gold-300/10 blur-xl" />
          <div className="aroma-particle aroma-particle-4 absolute bottom-[10%] left-[40%] w-40 h-40 rounded-full bg-cream-200/30 blur-2xl" />
        </div>

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
          <div ref={cardRef} className="bg-white-soft/90 backdrop-blur-md py-7 px-6 border border-line/35 rounded-3xl sm:px-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-brand-950 font-accent tracking-tight mb-1 form-element-item">
              Buat Akun
            </h2>
            <p className="text-xs text-ink-600 font-semibold mb-6 flex items-center flex-wrap gap-y-1 form-element-item">
              Sudah memiliki akun?{" "}
              <Link
                href="/auth/login"
                className="font-extrabold text-brand-950 hover:text-brand-900 transition-colors inline-flex items-center gap-0.5 ml-1"
              >
                Masuk Sekarang <span className="text-[10px]">↗</span>
              </Link>
            </p>

            <form className="space-y-4" onSubmit={handleRegister}>
              {/* Nama Lengkap */}
              <div className="form-element-item">
                <label htmlFor="name" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative rounded-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-3.5 w-3.5 text-ink-600" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
                      nameError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-line/45"
                    }`}
                    placeholder="Budi Handoko"
                  />
                </div>
                {nameError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{nameError}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="form-element-item">
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
              <div className="form-element-item">
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

              {/* Confirm Password Input */}
              <div className="form-element-item">
                <label htmlFor="confirmPassword" className="block text-[10px] font-extrabold text-brand-950 uppercase tracking-wider mb-1.5">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative rounded-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-3.5 w-3.5 text-ink-600" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-9 pr-4 py-2.5 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 text-xs placeholder:text-ink-600/35 text-brand-950 font-semibold transition-all ${
                      confirmPasswordError ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-line/45"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {confirmPasswordError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1.5 pl-3.5">{confirmPasswordError}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-1 form-element-item">
                <button
                  type="submit"
                  disabled={isSubmitting || isFormInvalid}
                  className="w-full flex justify-center items-center gap-1.5 py-2.5 px-4 border border-transparent rounded-full shadow-sm text-xs font-bold text-white bg-brand-900 hover:bg-brand-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {isSubmitting ? "Mendaftarkan..." : "Daftar Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Trust/Info Footer (Always visible) */}
        <div className="w-full text-center text-[10px] text-ink-600/50 font-semibold z-20">
          © {new Date().getFullYear()} NILOKA.
        </div>
      </div>
    </div>
  );
}
