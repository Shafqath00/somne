/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, EyeOff, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useMemo } from 'react';

interface ProductCardProps {
  product: Product;
  selectedColor?: string | null;
}

const getCleanColorName = (name: string): string => {
  let cleaned = name.replace(/\s*plush\s*/i, '').trim();
  if (cleaned.toLowerCase() === 'cream') return 'Beige';
  if (cleaned.toLowerCase() === 'emerald') return 'Green';
  return cleaned;
};

export function ProductCard({ product, selectedColor }: ProductCardProps) {
  const isTestUrl = window.location.hostname === 'somne-f5b59.web.app' || new URLSearchParams(window.location.search).get('test') === 'true';
  const { addItem } = useCart();
  const enabledColors = useMemo(
    () => product.colors?.filter((color: any) => !color.disabled) || [],
    [product.colors]
  );
  const disabledColorImages = useMemo(
    () => product.colors
      ?.filter((color: any) => color.disabled)
      .flatMap((color: any) => [
        ...(color.image ? [color.image] : []),
        ...(color.productImages || [])
      ]) || [],
    [product.colors]
  );
  const safeCoverImage = product.coverImage && !disabledColorImages.includes(product.coverImage)
    ? product.coverImage
    : undefined;

  // Get the image based on selected color filter
  const displayImage = useMemo(() => {
    if (selectedColor && enabledColors.length > 0) {
      // Find the color variant that matches the selected filter
      const matchingColor = enabledColors.find(
        (c: any) => c.name && getCleanColorName(c.name).toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchingColor?.image) {
        return matchingColor.image;
      }
    }
    // Default: show the product's main image or default color's image
    return safeCoverImage || product.image || product.images?.[0] || "";
  }, [selectedColor, enabledColors, safeCoverImage, product.image, product.images]);

  // Get the display color name (for showing which variant is displayed)
  const displayColorName = useMemo(() => {
    if (selectedColor && enabledColors.length > 0) {
      const matchingColor = enabledColors.find(
        (c: any) => c.name && getCleanColorName(c.name).toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchingColor) {
        return matchingColor.name;
      }
    }
    return null;
  }, [selectedColor, enabledColors]);

  // console.log(product);

  const handleAddToCart = () => {
    if (product.sizes.length > 0) {
      addItem(product, 1, product.sizes[0], enabledColors[0], product.storageOptions?.[0]);
      toast.success(`${product.name} added to bag`);
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '£0';
    return `£${price.toLocaleString()}`;
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-border/50 hover:border-accent/40 rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-md duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
      {/* Image */}
      <Link
        to={`/product/${product.slug || product.name}${displayColorName ? `?variant=${encodeURIComponent(displayColorName)}` : ''}`}
        className="block relative aspect-[4/3] overflow-hidden bg-secondary/20"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-2">
          {isTestUrl && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-black/5 text-[10px] font-bold tracking-wider uppercase ${product.active !== false ? 'text-green-600' : 'text-red-600'}`}>
              {product.active !== false ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Live
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Not Live
                </>
              )}
            </span>
          )}
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
        <Link
          to={`/product/${product.slug || product.name}${displayColorName ? `?variant=${encodeURIComponent(displayColorName)}` : ''}`}
          className="block mb-2 sm:mb-3"
        >
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

          <div className="hidden items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/50 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-accent/20 group-hover:bg-accent/5 group-hover:text-accent sm:flex sm:px-3 sm:py-1.5 sm:text-xs">
            <Palette className="w-3.5 h-3.5" />
            <span>{enabledColors.length} Colors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
