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
