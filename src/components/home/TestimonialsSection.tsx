import { Quote, Star } from 'lucide-react';
import { reviews } from '@/data';

export function TestimonialsSection() {
  const featuredReviews = reviews.slice(0, 3);

  return (
    <section className="bg-white pt-10 md:pb-14">
      <div className="luxury-container">
        <div className="mb-8 grid gap-5 md:mb-14 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/60 md:mb-3 md:text-sm">Customer reviews</p>
            <h2 className="text-2xl font-black text-foreground md:text-5xl">
              Real homes, complete Somne setups.
            </h2>
          </div>
          <div className="md:justify-self-end">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-black text-black" />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Rated 4.9/5 by Somne customers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <article key={review.id} className=" border border-black/10 bg-white p-5 md:rounded-lg md:p-8">
              <Quote className="mb-5 h-8 w-8 text-black" />
              <div className="mb-5 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-black text-black" />
                ))}
              </div>
              <h3 className="text-xl font-black text-foreground">{review.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">"{review.content}"</p>
              <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
                <p className="text-sm font-bold text-foreground">{review.author}</p>
                {review.verified && (
                  <span className="text-xs font-semibold text-black/60">Verified purchase</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
