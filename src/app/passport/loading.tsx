import { PassportSkeleton } from "@/components/ui/skeletons";

export default function PassportLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-28 rounded-full bg-gold-500/30 animate-pulse" />
          <div className="h-9 w-60 rounded-xl bg-cream-100/80 animate-pulse" />
        </div>
        <div className="h-4 w-full max-w-md rounded bg-cream-100/60 animate-pulse" />
      </div>
      <PassportSkeleton />
    </div>
  );
}
