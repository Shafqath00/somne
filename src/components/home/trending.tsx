import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { getTrendingProducts } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Product } from '@/types';

export function TrendingProducts() {
    const { data: trendingProducts = [], isLoading } = useQuery({
        queryKey: ['trending-products'],
        queryFn: getTrendingProducts,
        staleTime: 1000 * 60 * 15, // 15 minutes
    });

    if (isLoading) {
        return (
            <section className="section-padding bg-white">
                <div className="luxury-container flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                </div>
            </section>
        );
    }

    if (trendingProducts.length === 0) return null;

    return (
        <section className="pb-10 bg-white">
            <div className="luxury-container">
                <div className="text-center mb-12 md:mb-16">
                    {/* <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
                        Most Popular
                    </span> */}
                    <h2 className="luxury-heading text-foreground">
                        Trending
                    </h2>
                    {/* <p className="md:luxury-body text-sm max-w-2xl mx-auto">
                        Our most sought-after pieces, loved for their exceptional comfort and style.
                    </p> */}
                </div>

                <div className="relative">
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
                        {trendingProducts.map((product: Product) => (
                            <div key={product.id} className="min-w-[280px] xs:min-w-[300px] sm:min-w-[320px] snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <Button variant="luxuryOutline" size="xl" asChild>
                        <Link to="/beds/divan-beds">Shop all</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
