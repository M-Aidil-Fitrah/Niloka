import { ListTodo, Clock, CheckCircle2 } from "lucide-react";
import type { AdminValidationItem } from "@/lib/contracts";
import { DashboardStatsCard } from "@/components/dashboard/dashboard-layout";

type AdminStatsProps = {
  items: AdminValidationItem[];
  queuedCount: number;
  approvedCount: number;
  rejectedCount: number;
};

export function AdminStats({ items, queuedCount, approvedCount, rejectedCount }: AdminStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {/* Total Queue Card */}
      <DashboardStatsCard
        title="Total Antrian"
        value={items.length}
        icon={ListTodo}
        trend={{ type: "up", label: "+12% hari ini" }}
        sparkline="M 0 20 Q 15 5, 30 15 T 60 25 T 90 5 T 100 10"
        theme="brand"
      />

      {/* Pending Review Card */}
      <DashboardStatsCard
        title="Menunggu Review"
        value={queuedCount}
        icon={Clock}
        trend={{ type: "down", label: "-4% antrean" }}
        sparkline="M 0 15 Q 15 25, 30 10 T 60 5 T 90 20 T 100 15"
        theme="gold"
      />

      {/* Approved Card */}
      <DashboardStatsCard
        title="Telah Disetujui"
        value={approvedCount}
        icon={CheckCircle2}
        trend={{ type: "up", label: "+18% valid" }}
        sparkline="M 0 25 Q 15 15, 30 20 T 60 10 T 90 5 T 100 2"
        theme="cream"
      />
    </div>
  );
}
