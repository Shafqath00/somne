import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SomneLoader } from '@/components/ui/SomneLoader';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/products/ProductCard';
import { getTrendingProducts } from '@/api/api';
import { Product } from '@/types';

export function TrendingProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: trendingProducts = [], isLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: getTrendingProducts,
    staleTime: 1000 * 60 * 15,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.82;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const arrowClass =
    'flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-ink hover:text-white';

  if (isLoading) {
    return (
      <section className="py-20">
        <SomneLoader size="md" label="Loading bestsellers" />
      </section>
    );
  }

  if (trendingProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-terracotta">Bestsellers</p>
            <h2 className="font-display text-4xl leading-[0.98] text-ink md:text-6xl">
              The ones everyone <em className="italic text-terracotta">sleeps on.</em>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className={arrowClass} aria-label="Scroll left">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll('right')} className={arrowClass} aria-label="Scroll right">
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/beds/upholstered-beds"
              className="ml-2 hidden rounded-full bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-terracotta sm:inline-flex"
            >
              View all
            </Link>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 scroll-smooth md:mx-0 md:px-0"
        >
          {trendingProducts.map((product: Product) => (
            <div key={product.id} className="w-[78%] shrink-0 snap-start sm:w-[320px] lg:w-[calc((100%-60px)/4)]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
