export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-cream-200 rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-12 bg-cream-200 rounded-lg" />
              <div className="h-12 bg-cream-200 rounded-lg" />
              <div className="h-12 bg-cream-200 rounded-lg" />
            </div>
            <div className="h-64 bg-cream-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
