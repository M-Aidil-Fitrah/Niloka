import { CheckoutSkeleton } from "@/components/ui/skeletons";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-24 rounded-full bg-gold-500/30 animate-pulse" />
        <div className="h-9 w-56 rounded-xl bg-cream-100/80 animate-pulse" />
      </div>
      <CheckoutSkeleton />
    </div>
  );
}
