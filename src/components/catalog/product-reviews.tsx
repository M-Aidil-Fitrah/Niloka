import { StarIcon } from "@/components/ui/icons";
import type { Review } from "@/lib/contracts";

type ProductReviewsProps = {
  reviews: Review[];
};

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const ratingAverage =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-5">
        <div>
          <h3 className="text-lg font-bold text-brand-950">Ulasan Pelanggan</h3>
          <p className="text-xs text-ink-600">Pendapat jujur mereka yang telah mencoba produk ini</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-950">{ratingAverage.toFixed(1)}</span>
            <div className="flex flex-col">
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < Math.round(ratingAverage) ? "text-gold-500" : "text-line"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-ink-600 mt-0.5">{reviews.length} ulasan</span>
            </div>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="mt-6 divide-y divide-line">
          {reviews.map((review) => (
            <div key={review.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-bold text-brand-950">{review.authorName}</span>
                  <div className="mt-1 flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "text-gold-500" : "text-line"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-ink-600">
                  {new Date(review.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-800">{review.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 py-8 text-center">
          <p className="text-sm text-ink-600">Belum ada ulasan untuk produk ini.</p>
        </div>
      )}
    </div>
  );
}
