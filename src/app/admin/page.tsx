import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAdminValidationItems } from "@/lib/mock-queries";
import { sellers } from "@/lib/mock-data";
import { AdminShellSkeleton } from "@/components/ui/skeletons";

const AdminShell = dynamic(
  () => import("@/components/admin/admin-shell").then((m) => m.AdminShell),
  {
    loading: () => <AdminShellSkeleton />,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Admin Panel - NILOKA",
  description: "Panel moderasi internal untuk validasi seller, produk, Nilam Passport, dan review listing ampas nilam.",
};

export default function AdminPage() {
  const validationItems = getAdminValidationItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Internal Moderation</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif-accent italic">
          Panel Administrasi
        </h1>
      </div>

      <AdminShell validationItems={validationItems} sellers={sellers} />
    </div>
  );
}
