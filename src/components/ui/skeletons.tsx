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

export function LandingPageSkeleton() {
  return (
    <main className="min-h-screen bg-cream-50 text-ink-900 animate-in fade-in duration-300">
      <div className="page-shell pt-4">
        <div className="mb-4 h-16 rounded-[28px] border border-line/50 bg-white-soft/80 animate-pulse" />
        <div className="grid min-h-[calc(100vh-6rem)] gap-3 overflow-hidden rounded-[32px] bg-brand-950 p-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between gap-8 p-4 sm:p-8">
            <div className="h-8 w-28 rounded-xl bg-white/15 animate-pulse" />
            <div className="max-w-xl space-y-5">
              <div className="h-4 w-28 rounded-full bg-gold-500/30 animate-pulse" />
              <div className="h-12 w-full rounded-2xl bg-white/15 animate-pulse sm:h-16" />
              <div className="h-12 w-4/5 rounded-2xl bg-white/10 animate-pulse sm:h-16" />
              <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-11 w-36 rounded-full bg-gold-500/40 animate-pulse" />
                <div className="h-11 w-28 rounded-full bg-white/15 animate-pulse" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 rounded-2xl bg-white/10 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="hidden rounded-[28px] bg-cream-100/40 animate-pulse lg:block" />
        </div>
      </div>
      <div className="page-shell grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-44 rounded-[28px] border border-line bg-white-soft animate-pulse" />
        ))}
      </div>
    </main>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-6 h-5 w-40 rounded bg-cream-100/80 animate-pulse" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] w-full rounded-[28px] border border-line bg-cream-100/70 animate-pulse" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square rounded-2xl bg-cream-100/60 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8">
            <div className="mb-4 h-4 w-24 rounded-full bg-cream-100/80 animate-pulse" />
            <div className="mb-3 h-9 w-4/5 rounded-xl bg-cream-100/80 animate-pulse" />
            <div className="mb-6 h-5 w-1/3 rounded bg-cream-100/60 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-cream-100/50 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-cream-100/50 animate-pulse" />
            </div>
            <div className="mt-8 h-12 w-full rounded-2xl bg-brand-900/20 animate-pulse" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-2xl border border-line bg-white-soft animate-pulse" />
            <div className="h-24 rounded-2xl border border-line bg-white-soft animate-pulse" />
          </div>
        </div>
      </div>
      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="h-72 rounded-[28px] border border-line bg-white-soft animate-pulse" />
        <div className="h-72 rounded-[28px] border border-line bg-white-soft animate-pulse" />
      </div>
    </div>
  );
}

export function AmpasDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-6 h-5 w-44 rounded bg-cream-100/80 animate-pulse" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] w-full rounded-[28px] border border-line bg-cream-100/70 animate-pulse" />
        </div>
        <div className="space-y-5 lg:col-span-6">
          <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8">
            <div className="mb-4 h-4 w-32 rounded-full bg-cream-100/80 animate-pulse" />
            <div className="mb-4 h-9 w-4/5 rounded-xl bg-cream-100/80 animate-pulse" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-20 rounded-2xl bg-cream-100/50 animate-pulse" />
              ))}
            </div>
            <div className="mt-6 h-12 w-full rounded-2xl bg-brand-900/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-36 rounded-full bg-gold-500/30 animate-pulse" />
        <div className="h-9 w-72 rounded-xl bg-cream-100/80 animate-pulse" />
        <div className="h-4 w-full max-w-lg rounded bg-cream-100/60 animate-pulse" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="overflow-hidden rounded-3xl border border-line bg-white-soft">
            <div className="aspect-video bg-cream-100/70 animate-pulse" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 rounded bg-gold-500/30 animate-pulse" />
              <div className="h-5 w-full rounded bg-cream-100/80 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-cream-100/60 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-8 h-5 w-44 rounded bg-cream-100/80 animate-pulse" />
      <header className="mb-8 space-y-5">
        <div className="flex gap-3">
          <div className="h-6 w-28 rounded-full bg-brand-100 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-cream-100/70 animate-pulse" />
        </div>
        <div className="h-12 w-full rounded-2xl bg-cream-100/80 animate-pulse sm:h-16" />
        <div className="h-12 w-4/5 rounded-2xl bg-cream-100/60 animate-pulse sm:h-16" />
        <div className="h-16 border-y border-line/45 py-3">
          <div className="h-10 w-56 rounded-xl bg-cream-100/70 animate-pulse" />
        </div>
      </header>
      <div className="mb-10 aspect-video w-full rounded-3xl border border-line bg-cream-100/70 animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-4 w-full rounded bg-cream-100/70 animate-pulse" />
        ))}
        <div className="h-4 w-3/4 rounded bg-cream-100/70 animate-pulse" />
      </div>
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded-full bg-gold-500/30 animate-pulse" />
          <div className="h-9 w-56 rounded-xl bg-cream-100/80 animate-pulse" />
        </div>
        <div className="h-4 w-full max-w-sm rounded bg-cream-100/60 animate-pulse" />
      </div>
      <div className="mx-auto max-w-2xl space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-2xl border border-line bg-white-soft p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-44 rounded bg-cream-100/80 animate-pulse" />
                <div className="h-3 w-32 rounded bg-cream-100/60 animate-pulse" />
                <div className="h-4 w-40 rounded bg-cream-100/60 animate-pulse" />
              </div>
              <div className="h-6 w-16 rounded-full bg-cream-100/80 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded-full bg-gold-500/30 animate-pulse" />
          <div className="h-9 w-52 rounded-xl bg-cream-100/80 animate-pulse" />
        </div>
        <div className="h-4 w-full max-w-sm rounded bg-cream-100/60 animate-pulse" />
      </div>
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-3xl border border-line bg-white-soft p-5 space-y-3">
          <div className="h-5 w-1/2 rounded bg-cream-100/80 animate-pulse" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-20 rounded-2xl bg-cream-100/50 animate-pulse" />
            <div className="h-20 rounded-2xl bg-cream-100/50 animate-pulse" />
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white-soft p-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-14 rounded-2xl bg-cream-100/50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream-50 animate-in fade-in duration-300">
      <div className="hidden h-full shrink-0 flex-col justify-between overflow-hidden bg-brand-950 p-10 lg:flex lg:w-[40%]">
        <div className="h-8 w-28 rounded-xl bg-white/15 animate-pulse" />
        <div className="max-w-xs space-y-4">
          <div className="h-10 w-full rounded-2xl bg-white/15 animate-pulse" />
          <div className="h-10 w-4/5 rounded-2xl bg-white/10 animate-pulse" />
          <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
        </div>
        <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
      </div>
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md rounded-[32px] border border-line bg-white-soft p-6 shadow-sm sm:p-8">
          <div className="mb-8 space-y-3 text-center">
            <div className="mx-auto h-10 w-28 rounded-xl bg-cream-100/80 animate-pulse" />
            <div className="mx-auto h-5 w-56 rounded bg-cream-100/60 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-12 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
            <div className="h-12 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
            <div className="h-12 w-full rounded-full bg-brand-900/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SellerApplySkeleton() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-cream-50 animate-in fade-in duration-300">
      <div className="h-20 border-b border-line/40 bg-white-soft/80 animate-pulse" />
      <div className="flex-grow px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-8 flex items-center justify-between">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-1 items-center last:flex-initial">
                <div className="h-8 w-8 rounded-full bg-cream-100/80 animate-pulse" />
                {item < 4 ? <div className="mx-2 h-px flex-1 bg-line/45" /> : null}
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-line/35 bg-white-soft p-6 shadow-sm sm:p-8">
            <div className="mb-6 h-6 w-44 rounded bg-cream-100/80 animate-pulse" />
            <div className="space-y-4">
              <div className="h-11 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
              <div className="h-11 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
              <div className="h-11 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
            </div>
            <div className="mt-8 flex justify-end border-t border-line/25 pt-4">
              <div className="h-10 w-28 rounded-full bg-brand-900/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-28 bg-brand-950/10 animate-pulse" />
    </main>
  );
}

export function ChatPageSkeleton() {
  return (
    <main className="page-shell min-h-[90vh] bg-cream-50/20 pb-16 pt-32 animate-in fade-in duration-300">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-line bg-white-soft shadow-sm lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-line/60 p-5 lg:block">
          <div className="mb-5 h-8 w-36 rounded-xl bg-cream-100/80 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-14 rounded-2xl bg-cream-100/50 animate-pulse" />
            ))}
          </div>
        </aside>
        <section className="flex min-h-[520px] flex-col">
          <div className="border-b border-line/60 p-5">
            <div className="h-6 w-48 rounded bg-cream-100/80 animate-pulse" />
          </div>
          <div className="flex-1 space-y-4 p-5">
            <div className="h-16 w-2/3 rounded-2xl bg-cream-100/60 animate-pulse" />
            <div className="ml-auto h-16 w-2/3 rounded-2xl bg-brand-900/15 animate-pulse" />
            <div className="h-20 w-3/4 rounded-2xl bg-cream-100/60 animate-pulse" />
          </div>
          <div className="border-t border-line/60 p-5">
            <div className="h-12 w-full rounded-2xl bg-cream-100/60 animate-pulse" />
          </div>
        </section>
      </div>
    </main>
  );
}
