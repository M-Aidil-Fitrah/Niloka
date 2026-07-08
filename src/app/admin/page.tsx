"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import { getAdminValidationItems } from "@/lib/mock-queries";
import { sellers } from "@/lib/mock-data";
import { AdminShellSkeleton } from "@/components/ui/skeletons";

const AdminShell = dynamic(
  () => import("@/components/admin/admin-shell").then((m) => m.AdminShell),
  {
    loading: () => <AdminShellSkeleton />,
    ssr: false,
  }
);

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login?role=admin");
      } else if (user.role !== "admin") {
        router.replace("/");
      } else {
        setTimeout(() => {
          setIsAuthorized(true);
        }, 0);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized || !user) {
    return <AdminShellSkeleton />;
  }

  const validationItems = getAdminValidationItems();

  return (
    <AdminShell validationItems={validationItems} sellers={sellers} />
  );
}
