/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useMemo } from 'react';

interface ProductCardProps {
  product: Product;
  selectedColor?: string | null;
}

export function ProductCard({ product, selectedColor }: ProductCardProps) {
  const { addItem } = useCart();

  // Get the image based on selected color filter
  const displayImage = useMemo(() => {
    if (selectedColor && product.colors && Array.isArray(product.colors)) {
      // Find the color variant that matches the selected filter
      const matchingColor = product.colors.find(
        (c: any) => c.name?.toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchingColor?.image) {
        return matchingColor.image;
      }
    }
    // Default: show the product's main image or default color's image
    return product.image || "";
  }, [selectedColor, product.colors, product.image]);

  // Get the display color name (for showing which variant is displayed)
  const displayColorName = useMemo(() => {
    if (selectedColor && product.colors && Array.isArray(product.colors)) {
      const matchingColor = product.colors.find(
        (c: any) => c.name?.toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchingColor) {
        return matchingColor.name;
      }
    }
    return null;
  }, [selectedColor, product.colors]);

  const handleAddToCart = () => {
    if (product.sizes.length > 0) {
      addItem(product, 1, product.sizes[0], product.colors?.[0], product.storageOptions?.[0]);
      toast.success(`${product.name} added to bag`);
    }
  };

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <div className="group flex flex-col h-full bg-white border border-border/50 hover:border-accent/40 rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-md duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
      {/* Image */}
      <Link
        to={`/product/${product.slug || product.name}?variant=${encodeURIComponent(displayColorName || product.colors?.[0]?.name || '')}`}
        className="block relative aspect-[4/3] overflow-hidden bg-secondary/20"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-2">
          {product.bestseller && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-black/5 text-[10px] font-bold tracking-wider uppercase text-foreground">
              <Star className="w-3 h-3 mr-1 fill-accent text-accent" />
              Bestseller
            </span>
          )}
        </div>

        {/* Selected Color Badge */}
        {displayColorName && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-black/5 text-[10px] font-bold tracking-wider uppercase text-foreground">
              <Palette className="w-3 h-3 mr-1 text-accent" />
              {displayColorName}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <Link to={`/product/${product.slug || product.name}`} className="block mb-2 sm:mb-3">
          <h3 className="font-serif text-base sm:text-xl font-medium text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
              {product.shortDescription}
            </p>
          )}
        </Link>

        {/* Bottom Section: Price & Action */}
        <div className="mt-auto pt-3 sm:pt-4 flex items-end justify-between gap-2 border-t border-border/40">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-serif text-base sm:text-xl font-medium text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.basePrice > product.price && (
                <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/40 decoration-1">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>
            {product.basePrice > product.price && (
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                Save £{(product.basePrice - product.price).toLocaleString()}
              </span>
            )}
          </div>

          <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:bg-accent/5 group-hover:text-accent group-hover:border-accent/20 transition-colors">
            <Palette className="w-3.5 h-3.5" />
            <span>{product.colors?.length || 0} Colors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
