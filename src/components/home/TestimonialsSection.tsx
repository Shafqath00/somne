import { Star, Quote } from 'lucide-react';
import { reviews } from '@/data';

export function TestimonialsSection() {
  const featuredReviews = reviews.slice(0, 3);

  return (
    <section className="section-padding bg-background">
      <div className="luxury-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
            Testimonials
          </span>
          <h2 className="luxury-heading text-foreground mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>
          <p className="luxury-body">
            Rated 4.9/5 based on 500+ reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card p-8 border rounded-xl border-border hover-lift"
            >
              <Quote className="w-8 h-8 text-accent/30 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground mb-3">{review.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                "{review.content}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-foreground">{review.author}</p>
                  <p className="font-sans text-xs text-muted-foreground">{review.date}</p>
                </div>
                {review.verified && (
                  <span className="font-sans text-xs text-accent">Verified Purchase</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
