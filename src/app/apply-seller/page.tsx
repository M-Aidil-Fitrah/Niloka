"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { SiteNavbar } from "@/components/ui/navbar";
import { SiteFooter } from "@/components/ui/footer";
import { 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  ChevronLeft
} from "lucide-react";

// Subcomponents
import { StepPersonalInfo } from "@/components/seller/apply-form/step-personal-info";
import { StepBusinessInfo } from "@/components/seller/apply-form/step-business-info";
import { StepDocuments } from "@/components/seller/apply-form/step-documents";
import { StepConfirmation } from "@/components/seller/apply-form/step-confirmation";
import { StepSuccess } from "@/components/seller/apply-form/step-success";

export default function ApplySellerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");

  const [shopName, setShopName] = useState("");
  const [businessType, setBusinessType] = useState("umkm");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("Aceh");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [ktpFileName, setKtpFileName] = useState("");
  const [nibFileName, setNibFileName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize name from logged-in user
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  // Validators
  const validateName = (val: string) => {
    if (!val) return "";
    return val.trim().length >= 3 ? "" : "Nama lengkap minimal 3 karakter";
  };

  const validatePhone = (val: string) => {
    if (!val) return "";
    const cleanPhone = val.replace(/[\s-+]/g, "");
    return /^\d{10,14}$/.test(cleanPhone) ? "" : "Format nomor tidak valid (10-14 digit)";
  };

  const validateNik = (val: string) => {
    if (!val) return "";
    return /^\d{16}$/.test(val) ? "" : "NIK harus terdiri dari 16 digit angka";
  };

  const validateShopName = (val: string) => {
    if (!val) return "";
    return val.trim().length >= 3 ? "" : "Nama toko minimal 3 karakter";
  };

  const validateDescription = (val: string) => {
    if (!val) return "";
    return val.trim().length >= 10 ? "" : "Deskripsi usaha minimal 10 karakter";
  };

  // Run validations in real-time as values change
  useEffect(() => {
    if (currentStep === 1) {
      setErrors({
        name: name ? validateName(name) : "",
        phone: phone ? validatePhone(phone) : "",
        nik: nik ? validateNik(nik) : "",
      });
    }
  }, [name, phone, nik, currentStep]);

  useEffect(() => {
    if (currentStep === 2) {
      setErrors({
        shopName: shopName ? validateShopName(shopName) : "",
        description: description ? validateDescription(description) : "",
        city: city ? (city.trim() ? "" : "Kota/Kabupaten wajib diisi") : "",
        district: district ? (district.trim() ? "" : "Kecamatan wajib diisi") : "",
        detailAddress: detailAddress ? (detailAddress.trim() ? "" : "Alamat lengkap wajib diisi") : "",
      });
    }
  }, [shopName, description, city, district, detailAddress, currentStep]);

  useEffect(() => {
    if (currentStep === 3) {
      setErrors({
        ktp: ktpFileName ? "" : "Foto KTP wajib diunggah",
      });
    }
  }, [ktpFileName, currentStep]);

  // Step validation state for locking button
  const isStep1Invalid = 
    !name || !phone || !nik || 
    !!validateName(name) || !!validatePhone(phone) || !!validateNik(nik);

  const isStep2Invalid = 
    !shopName || !description || !city || !district || !detailAddress ||
    !!validateShopName(shopName) || !!validateDescription(description);

  const isStep3Invalid = !ktpFileName;

  const isCurrentStepInvalid = 
    (currentStep === 1 && isStep1Invalid) ||
    (currentStep === 2 && isStep2Invalid) ||
    (currentStep === 3 && isStep3Invalid);

  // Navigations
  const handleNext = () => {
    if (isCurrentStepInvalid) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Save to localStorage for mock database verification
    const application = {
      id: `validation-seller-demo-${Date.now()}`,
      target: "seller",
      targetId: `seller-demo-${Date.now()}`,
      status: "queued",
      submittedBy: user?.id || "unknown",
      submittedAt: new Date().toISOString(),
      notes: `Pengajuan dari ${name} (Toko: ${shopName}, Tipe: ${businessType.toUpperCase()}). Menunggu review.`,
    };
    try {
      const stored = localStorage.getItem("niloka_demo_applications") || "[]";
      const list = JSON.parse(stored);
      list.push(application);
      localStorage.setItem("niloka_demo_applications", JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }
  };

  // Mock File Uploads
  const triggerKtpUpload = () => {
    setKtpFileName("ktp_terverifikasi.jpg");
    setErrors((prev) => ({ ...prev, ktp: "" }));
  };

  const triggerNibUpload = () => {
    setNibFileName("nib_legalitas_usaha.pdf");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-900"></div>
      </div>
    );
  }

  // Auth Protection
  if (!user) {
    return (
      <main className="min-h-screen bg-cream-50 flex flex-col justify-between">
        <SiteNavbar />
        <div className="my-auto py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="bg-white border border-line/35 rounded-3xl p-8 max-w-sm w-full text-center shadow-sm">
            <ShieldCheck className="h-12 w-12 text-brand-700 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-extrabold text-brand-950 font-accent mb-2">Akses Terbatas</h2>
            <p className="text-xs text-ink-600 mb-6 font-semibold leading-relaxed">
              Anda harus masuk ke akun Anda terlebih dahulu untuk dapat mengajukan diri menjadi penjual (seller) di NILOKA.
            </p>
            <Link
              href="/auth/login?redirect=/apply-seller"
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-xs font-bold !text-white bg-brand-950 hover:bg-brand-900 transition-all cursor-pointer"
            >
              Masuk Sekarang
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col justify-between">
      <SiteNavbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center">
        <div className="max-w-xl w-full mx-auto">
          
          {/* STEPPER PROGRESS INDICATOR */}
          {!isSubmitted && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center relative">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep > step 
                          ? "bg-brand-900 text-white" 
                          : currentStep === step 
                          ? "bg-brand-950 text-white ring-4 ring-brand-900/10" 
                          : "bg-white border border-line/65 text-ink-600"
                      }`}>
                        {currentStep > step ? <Check className="h-4 w-4" /> : step}
                      </div>
                      <span className="absolute top-10 text-[9px] font-extrabold uppercase tracking-wider text-ink-600 whitespace-nowrap hidden sm:block">
                        {step === 1 ? "Info Pribadi" : step === 2 ? "Info Bisnis" : step === 3 ? "Dokumen" : "Konfirmasi"}
                      </span>
                    </div>
                    {step < 4 && (
                      <div className={`h-[2px] w-full mx-2 transition-all ${
                        currentStep > step ? "bg-brand-900" : "bg-line/45"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP CARD WRAPPER */}
          <div className="bg-white-soft border border-line/35 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* SUBMITTED SUCCESS FLOW */}
            {isSubmitted ? (
              <StepSuccess name={name} shopName={shopName} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: INFORMASI PRIBADI */}
                {currentStep === 1 && (
                  <StepPersonalInfo
                    name={name}
                    setName={setName}
                    phone={phone}
                    setPhone={setPhone}
                    nik={nik}
                    setNik={setNik}
                    errors={errors}
                  />
                )}

                {/* STEP 2: INFORMASI BISNIS */}
                {currentStep === 2 && (
                  <StepBusinessInfo
                    shopName={shopName}
                    setShopName={setShopName}
                    businessType={businessType}
                    setBusinessType={setBusinessType}
                    description={description}
                    setDescription={setDescription}
                    province={province}
                    city={city}
                    setCity={setCity}
                    district={district}
                    setDistrict={setDistrict}
                    detailAddress={detailAddress}
                    setDetailAddress={setDetailAddress}
                    errors={errors}
                  />
                )}

                {/* STEP 3: UNGGAH DOKUMEN */}
                {currentStep === 3 && (
                  <StepDocuments
                    ktpFileName={ktpFileName}
                    setKtpFileName={setKtpFileName}
                    nibFileName={nibFileName}
                    setNibFileName={setNibFileName}
                    triggerKtpUpload={triggerKtpUpload}
                    triggerNibUpload={triggerNibUpload}
                    errors={errors}
                  />
                )}

                {/* STEP 4: KONFIRMASI DATA */}
                {currentStep === 4 && (
                  <StepConfirmation
                    name={name}
                    phone={phone}
                    nik={nik}
                    shopName={shopName}
                    businessType={businessType}
                    detailAddress={detailAddress}
                    district={district}
                    city={city}
                    province={province}
                    agreeTerms={agreeTerms}
                    setAgreeTerms={setAgreeTerms}
                  />
                )}

                {/* NAVIGATION CONTROLS */}
                <div className="pt-4 border-t border-line/25 flex items-center justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="flex items-center gap-1 py-2 px-4 border border-line rounded-full text-xs font-bold text-brand-950 hover:bg-cream-50 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Kembali
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isCurrentStepInvalid}
                      className="flex items-center gap-1 py-2 px-5 border border-transparent rounded-full text-xs font-bold text-white bg-brand-950 hover:bg-brand-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer ml-auto"
                    >
                      Lanjut
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !agreeTerms}
                      className="flex items-center gap-1.5 py-2 px-6 border border-transparent rounded-full text-xs font-bold text-white bg-brand-900 hover:bg-brand-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer ml-auto hover:scale-[1.01]"
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                    </button>
                  )}
                </div>

              </form>
            )}

          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
