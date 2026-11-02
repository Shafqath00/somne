/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, EyeOff, Palette } from 'lucide-react';
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

  const productHref = `/product/${product.slug || product.name}${displayColorName ? `?variant=${encodeURIComponent(displayColorName)}` : ''}`;
  const hoverImage = !selectedColor ? product.images?.find((img) => img && img !== displayImage) : undefined;
  const saving = product.basePrice > product.price ? product.basePrice - product.price : 0;
  const swatches = enabledColors.filter((c: any) => c.hex).slice(0, 5);

  return (
    <div className="group flex h-full flex-col">
      {/* Image */}
      <Link to={productHref} className="relative block aspect-square overflow-hidden rounded-[1.75rem] bg-secondary">
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${hoverImage ? 'group-hover:opacity-0' : ''}`}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isTestUrl && (
            <span className={`inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${product.active !== false ? 'text-green-600' : 'text-red-600'}`}>
              {product.active !== false ? (<><Eye className="mr-1 h-3 w-3" />Live</>) : (<><EyeOff className="mr-1 h-3 w-3" />Not Live</>)}
            </span>
          )}
          {saving > 0 && (
            <span className="inline-flex items-center rounded-full bg-terracotta px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">
              Save £{saving.toLocaleString()}
            </span>
          )}
          {product.bestseller && (
            <span className="inline-flex items-center rounded-full bg-saffron px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink">
              <Star className="mr-1 h-3 w-3 fill-ink" />
              Bestseller
            </span>
          )}
        </div>

        {displayColorName && (
          <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            <Palette className="mr-1 h-3 w-3 text-terracotta" />
            {displayColorName}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ShoppingBag className="h-4 w-4" />
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={productHref} className="min-w-0">
            <h3 className="font-display text-lg leading-tight text-ink transition-colors group-hover:text-terracotta sm:text-xl">
              {product.name}
            </h3>
          </Link>
          <div className="shrink-0 text-right">
            <span className="block text-base font-extrabold text-ink sm:text-lg">{formatPrice(product.price)}</span>
            {saving > 0 && (
              <span className="text-xs text-ink/45 line-through">{formatPrice(product.basePrice)}</span>
            )}
          </div>
        </div>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-1 text-sm text-ink/55">{product.shortDescription}</p>
        )}
        {enabledColors.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            {swatches.map((c: any) => (
              <span
                key={c.name}
                title={c.name}
                className="h-4 w-4 rounded-full ring-1 ring-ink/10 ring-offset-1"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="ml-1 text-xs font-semibold text-ink/55">
              {enabledColors.length} colours
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
