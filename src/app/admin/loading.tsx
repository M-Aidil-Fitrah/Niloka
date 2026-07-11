import { AdminShellSkeleton } from "@/components/ui/skeletons";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-brand-950 px-4 py-8 text-white-soft sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminShellSkeleton />
      </div>
    </div>
  );
}
