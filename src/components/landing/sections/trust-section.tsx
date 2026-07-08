import { Card } from "@/components/ui/card";
import { StarIcon } from "@/components/ui/icons";
import { reviews } from "@/lib/mock-data";

export function TrustSection() {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="page-shell py-8" id="reviews">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Customer Voice</p>
          <h2 className="section-title">
            Dipercaya oleh
            <span className="font-accent italic text-brand-700"> komunitas</span>.
          </h2>
        </div>
        <p className="section-copy">
          Ulasan jujur dari pembeli produk nilam B2C dan B2B ampas nilam yang telah bertransaksi.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card className="review-card flex flex-col justify-between p-6 sm:p-7" key={review.id}>
            <div>
              <div className="flex gap-1 text-gold-500">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <StarIcon className="size-4" key={index} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-ink-700 italic">
                &ldquo;{review.body}&rdquo;
              </p>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-brand-950">{review.authorName}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
