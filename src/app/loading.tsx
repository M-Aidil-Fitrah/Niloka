export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-900" />
        <p className="text-sm text-ink-500">Memuat...</p>
      </div>
    </div>
  );
}
