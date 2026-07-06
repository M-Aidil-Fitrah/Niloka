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
    <AdminShell validationItems={validationItems} sellers={sellers} />
  );
}
