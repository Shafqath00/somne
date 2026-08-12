import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
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

  if (isLoading) {
    return (
      <section className="bg-[#f4f4f4] py-10 md:py-16">
        <div className="luxury-container flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      </section>
    );
  }

  if (trendingProducts.length === 0) return null;

  return (
    <section className="bg-[#f4f4f4] py-10">
      <div className="luxury-container">
        <div className="mb-6 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div className="w-full text-left md:w-auto">
            <div className="flex w-full items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/60 md:mb-3 md:text-sm">Customer favourites</p>
                <h2 className="text-2xl font-black text-foreground md:text-5xl">
                  Add the customer favourites to your package.
                </h2>
              </div>
              <div className="flex gap-2 md:hidden">
                <button onClick={() => scroll('left')} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition-colors hover:bg-black hover:text-white" aria-label="Scroll left">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => scroll('right')} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition-colors hover:bg-black hover:text-white" aria-label="Scroll right">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
              Explore the designs Somne customers keep choosing as the centrepiece of their bedroom setup.
            </p> */}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black transition-colors hover:bg-black hover:text-white" aria-label="Scroll left">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => scroll('right')} className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black transition-colors hover:bg-black hover:text-white" aria-label="Scroll right">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Button variant="luxuryOutline" size="lg" className="rounded-lg border-black text-black hover:bg-black hover:text-white" asChild>
              <Link to="/beds/divan-beds">View all</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scroll-smooth md:mx-0 md:gap-5 md:px-0"
          >
            {trendingProducts.map((product: Product) => (
              <div key={product.id} className="min-w-[82%] snap-start sm:min-w-[320px] lg:min-w-[340px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 text-center md:hidden">
          <Button variant="luxuryOutline" size="lg" className="rounded-lg border-black text-black hover:bg-black hover:text-white" asChild>
            <Link to="/beds/divan-beds">View all</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
