export function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] animate-in fade-in duration-300">
      {/* Sidebar Skeleton (Desktop only) */}
      <div className="hidden lg:flex flex-col gap-6 rounded-[28px] border border-line/50 bg-white-soft p-5 h-fit">
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded bg-cream-100/80 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-full rounded-xl bg-cream-100/50 animate-pulse" />
            <div className="h-8 w-full rounded-xl bg-cream-100/50 animate-pulse" />
            <div className="h-8 w-full rounded-xl bg-cream-100/50 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-1/4 rounded bg-cream-100/80 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-5/6 rounded bg-cream-100/50 animate-pulse" />
            <div className="h-6 w-4/6 rounded bg-cream-100/50 animate-pulse" />
            <div className="h-6 w-3/4 rounded bg-cream-100/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="space-y-6">
        {/* Toolbar Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-9 w-28 rounded-full bg-cream-100/80 animate-pulse" />
          <div className="h-9 w-36 rounded-full bg-cream-100/80 animate-pulse" />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[28px] border border-line bg-white-soft p-4 space-y-4"
            >
              {/* Product Image */}
              <div className="aspect-[4/3] w-full rounded-2xl bg-cream-100/60 animate-pulse" />
              {/* Product Info */}
              <div className="space-y-2.5">
                <div className="h-3 w-1/4 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-3.5 w-1/3 rounded bg-cream-100/80 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PassportSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner Skeleton */}
      <div className="rounded-2xl border border-line/40 bg-cream-100/30 p-5 h-20 animate-pulse" />

      {/* Search & Filter Toolbar Skeleton */}
      <div className="rounded-[28px] border border-line bg-white-soft p-5 sm:p-6 space-y-4">
        <div className="h-11 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-cream-100/80 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-full bg-cream-100/50 animate-pulse" />
            <div className="h-7 w-24 rounded-full bg-cream-100/50 animate-pulse" />
            <div className="h-7 w-20 rounded-full bg-cream-100/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Registry Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[28px] border border-line bg-white-soft p-5 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 rounded bg-cream-100/80 animate-pulse" />
              <div className="h-4 w-12 rounded-full bg-cream-100/80 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-16 w-16 rounded-2xl bg-cream-100/60 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-12 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-4 w-full rounded bg-cream-100/80 animate-pulse" />
              </div>
            </div>
            <hr className="border-line/60" />
            <div className="space-y-2">
              <div className="h-3 w-1/3 rounded bg-cream-100/80 animate-pulse" />
              <div className="h-3.5 w-1/2 rounded bg-cream-100/80 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export function AmpasSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] animate-in fade-in duration-300">
      {/* Sidebar Bulk Calculator Skeleton */}
      <div className="rounded-[32px] border border-line bg-white-soft p-5 h-fit space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-1/2 rounded bg-cream-100/80 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-cream-100/80 animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-10 w-full rounded-xl bg-cream-100/50 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-cream-100/50 animate-pulse" />
        </div>
        <div className="h-11 w-full rounded-xl bg-cream-100/70 animate-pulse" />
      </div>

      {/* Main Listings Skeleton */}
      <div className="space-y-6">
        {/* Banner Penafian */}
        <div className="h-16 w-full rounded-2xl bg-cream-100/30 animate-pulse" />

        {/* Toolbar Filter */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-full bg-cream-100/80 animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-cream-100/80 animate-pulse" />
          </div>
          <div className="h-8 w-24 rounded-xl bg-cream-100/80 animate-pulse" />
        </div>

        {/* Table/List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-white-soft p-5 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/4 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-5 w-1/2 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-cream-100/80 animate-pulse" />
              </div>
              <div className="h-10 w-28 rounded-xl bg-cream-100/60 animate-pulse md:self-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] animate-in fade-in duration-300">
      {/* Left Column: Cart items + Shipping fields */}
      <div className="space-y-6">
        <div className="rounded-[32px] border border-line bg-white-soft p-6 space-y-4">
          <div className="h-6 w-1/4 rounded bg-cream-100/80 animate-pulse" />
          <div className="space-y-3">
            <div className="h-16 w-full rounded-2xl bg-cream-100/40 animate-pulse" />
            <div className="h-16 w-full rounded-2xl bg-cream-100/40 animate-pulse" />
          </div>
        </div>

        <div className="rounded-[32px] border border-line bg-white-soft p-6 space-y-6">
          <div className="h-6 w-1/3 rounded bg-cream-100/80 animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 w-full rounded-xl bg-cream-100/50 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-cream-100/50 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-cream-100/50 animate-pulse sm:col-span-2" />
          </div>
        </div>
      </div>

      {/* Right Column: Checkout Summary sticky card */}
      <div className="rounded-[32px] border border-line bg-white-soft p-6 h-fit space-y-6">
        <div className="h-5 w-1/2 rounded bg-cream-100/80 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-cream-100/50 animate-pulse" />
          <div className="h-4 w-full rounded bg-cream-100/50 animate-pulse" />
        </div>
        <hr className="border-line/60" />
        <div className="h-12 w-full rounded-2xl bg-cream-100/80 animate-pulse" />
      </div>
    </div>
  );
}

export function SellerDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title Header Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-28 rounded bg-cream-100/80 animate-pulse" />
        <div className="h-8 w-64 rounded bg-cream-100/80 animate-pulse" />
      </div>

      {/* Tabs Row Skeleton */}
      <div className="flex gap-2 border-b border-line pb-px">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 rounded-t-lg bg-cream-100/50 animate-pulse" />
        ))}
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-line bg-white-soft p-5 space-y-2">
            <div className="h-3 w-1/2 rounded bg-cream-100/50 animate-pulse" />
            <div className="h-6 w-3/4 rounded bg-cream-100/80 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Large Content Block Skeleton */}
      <div className="rounded-3xl border border-line bg-white-soft p-6 space-y-4">
        <div className="h-5 w-1/4 rounded bg-cream-100/80 animate-pulse" />
        <div className="space-y-3">
          <div className="h-12 w-full rounded-xl bg-cream-100/40 animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-cream-100/40 animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-cream-100/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function AdminShellSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
        <div className="h-8 w-72 rounded bg-white/10 animate-pulse" />
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
            <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
            <div className="h-7 w-3/4 rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-px">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-28 rounded-t-lg bg-white/5 animate-pulse" />
        ))}
      </div>

      {/* Table rows */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 w-full rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function BundleSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="mx-auto h-5 w-32 rounded-full bg-cream-100/80 animate-pulse" />
        <div className="mx-auto h-9 w-64 rounded-xl bg-cream-100/80 animate-pulse" />
        <div className="mx-auto h-4 w-full rounded bg-cream-100/60 animate-pulse" />
      </div>

      {/* Recommended Bundles Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border border-line bg-white-soft p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-20 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-5 w-3/4 rounded bg-cream-100/80 animate-pulse" />
              </div>
              <div className="h-7 w-16 rounded bg-cream-100/80 animate-pulse" />
            </div>
            <div className="h-14 w-full rounded-xl bg-cream-100/40 animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-full rounded-xl bg-cream-100/40 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-cream-100/40 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
