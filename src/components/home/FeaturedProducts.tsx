import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { products } from '@/data';

export function FeaturedProducts() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="section-padding bg-background">
      <div className="luxury-container">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
            Bestsellers
          </span>
          <h2 className="luxury-heading text-foreground mb-4">
            Featured Products
          </h2>
          <p className="luxury-body max-w-2xl mx-auto">
            Discover our most loved pieces, chosen by customers for their
            exceptional quality and timeless design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="luxuryOutline" size="xl" asChild>
            <Link to="/beds">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
