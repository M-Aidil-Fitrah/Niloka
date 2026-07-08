"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/auth-context";
import { getAdminValidationItemsAction, getAllSellersAction } from "@/lib/actions/admin-actions";
import type { AdminValidationItem, Seller } from "@/lib/contracts";
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
  const [validationItems, setValidationItems] = useState<AdminValidationItem[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

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

  useEffect(() => {
    if (isAuthorized) {
      getAdminValidationItemsAction()
        .then((items) => {
          setValidationItems(items);
        })
        .catch((err) => {
          console.error("Failed to load validation items", err);
        });

      getAllSellersAction()
        .then((s) => {
          setSellers(s);
        })
        .catch((err) => {
          console.error("Failed to load sellers", err);
        });
    }
  }, [isAuthorized]);

  if (isLoading || !isAuthorized || !user) {
    return <AdminShellSkeleton />;
  }

  return (
    <AdminShell validationItems={validationItems} sellers={sellers} />
  );
}
