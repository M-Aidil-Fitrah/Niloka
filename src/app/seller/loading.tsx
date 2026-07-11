import { SellerDashboardSkeleton } from "@/components/ui/skeletons";

export default function SellerLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="h-16 bg-cream-100/70 animate-pulse" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SellerDashboardSkeleton />
      </div>
    </div>
  );
}
