export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-cream-200 rounded mb-8" />
          <div className="flex gap-8">
            <div className="hidden md:block w-64 shrink-0">
              <div className="h-96 bg-cream-200 rounded-2xl" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-cream-200 rounded-2xl h-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
