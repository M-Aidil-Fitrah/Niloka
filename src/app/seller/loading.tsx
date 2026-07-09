export default function SellerLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="animate-pulse">
        <div className="h-16 bg-cream-200" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-cream-200 rounded mb-6" />
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-cream-200 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-cream-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
