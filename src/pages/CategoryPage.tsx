import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, Navigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BedCategory } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { ComingSoon } from '@/components/ui/coming-soon';
import { shouldShowOttomanComingSoon } from '@/lib/ottomanAvailability';

const CatalogueSkeleton = () => (
  <div className="flex animate-pulse gap-5 lg:gap-8" aria-label="Loading products" role="status">
    <div className="hidden w-64 flex-shrink-0 lg:block">
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="h-6 w-24 rounded-full bg-black/10" />
        <div className="mt-7 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-black/10" />
              <div className="h-4 w-28 rounded-full bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="grid flex-1 grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl bg-white">
          <div className="aspect-[4/5] bg-black/10" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded-full bg-black/10" />
            <div className="h-4 w-1/3 rounded-full bg-black/10" />
          </div>
        </div>
      ))}
    </div>
    <span className="sr-only">Loading the product catalogue</span>
  </div>
);

// Valid category slugs that are allowed
const validCategories = [
  'beds',
  'upholstered-beds',
  'divan-beds',
  'ottoman-divan-beds',
  'upholstered-ottoman-bed',
  'mattresses',
  'memory-foam',
  'orthopaedic-mattress',
  'pocket-sprung-mattress',
  'pillow-top-mattress',
  'headboards',
];

const categoryInfo: Record<string, { title: string; description: string; seoTitle?: string; seoDescription?: string }> = {
  beds: {
    title: 'Luxury Beds',
    description: 'Handcrafted beds in a variety of styles, from elegant upholstered designs to practical storage solutions.',
    seoTitle: 'Luxury Beds & Bed Frames | Handcrafted in UK | Somne',
    seoDescription: 'Discover our collection of handcrafted luxury beds. From statement upholstered frames to practical storage solutions, find the perfect centerpiece for your bedroom.',
  },
  "upholstered-beds": {
    title: 'Upholstered Beds',
    description: 'Elegant fabric-covered beds featuring tall, padded headboards and premium upholstery.',
    seoTitle: 'Upholstered Beds | Fabric Bed Frames & Headboards | Somne',
    seoDescription: 'Shop our range of premium upholstered beds. Available in a wide variety of luxury fabrics and colors to match your style. Handcrafted in the UK.',
  },
  "divan-beds": {
    title: 'Divan Beds',
    description: 'Complete bed sets combining a sturdy divan base with a luxury mattress, available with storage options.',
    seoTitle: 'Divan Beds with Storage | Luxury Bases & Mattresses | Somne UK',
    seoDescription: 'Maximize your bedroom storage with our versatile divan beds. Choose from various drawer configurations and fabric finishes. Includes luxury mattress options.',
  },
  "ottoman-divan-beds": {
    title: 'Ottoman Divan Beds',
    description: 'Maximize your space with our ottoman beds featuring gas-lift storage and stylish designs.',
    seoTitle: 'Ottoman Divan Beds | Gas Lift Storage Beds | Somne UK',
    seoDescription: 'The ultimate space-saving solution. Our ottoman divan beds offer full under-bed storage with easy gas-lift access. Stylish, practical, and built to last.',
  },
  "upholstered-ottoman-bed": {
    title: 'Ottoman Upholstered Beds',
    description: 'Elegant fabric-covered beds featuring tall, padded headboards and premium upholstery.',
    seoTitle: 'Upholstered Ottoman Beds | Fabric Storage Beds | Somne',
    seoDescription: 'Combine luxury style with practical storage. Our upholstered ottoman beds feature premium fabrics and spacious gas-lift storage compartments.',
  },
  mattresses: {
    title: 'Mattresses',
    description: 'From memory foam to natural pocket sprung, find your perfect mattress for restful sleep.',
    seoTitle: 'Premium Mattresses | Pocket Sprung, Memory Foam & Orthopaedic | Somne',
    seoDescription: 'Experience the perfect night\'s sleep with our range of premium mattresses. Choose from pocket sprung, memory foam, and hybrid options. 100-night trial available.',
  },
  'memory-foam': {
    title: 'Memory Foam Mattresses',
    description: 'Pressure-relieving comfort with responsive memory foam that contours to your body.',
    seoTitle: 'Memory Foam Mattresses | Pressure Relief & Comfort | Somne',
    seoDescription: 'Sink into comfort with our high-quality memory foam mattresses. Designed to contour to your body and relieve pressure points for a restful sleep.',
  },
  "orthopaedic-mattress": {
    title: 'Orthopaedic Mattresses',
    description: 'Firm support designed to promote proper spinal alignment and relieve back pain.',
    seoTitle: 'Orthopaedic Mattresses | Back Support & Firm Comfort | Somne',
    seoDescription: 'Get the support you need with our orthopaedic mattresses. Expertly designed to promote healthy spinal alignment and alleviate back pain.',
  },
  "pocket-sprung-mattress": {
    title: 'Pocket Sprung Mattresses',
    description: 'Individual pocket springs provide targeted support and minimal motion transfer.',
    seoTitle: 'Pocket Sprung Mattresses | Individual Support & Comfort | Somne',
    seoDescription: 'Enjoy tailored support with our pocket sprung mattresses. Individual springs move independently to contour to your body and minimize partner disturbance.',
  },
  "pillow-top-mattress": {
    title: 'Pillow Top Mattresses',
    description: 'Soft and comfortable pillow top mattresses with a plush texture.',
    seoTitle: 'Pillow Top Mattresses | Luxury Soft Top Layers | Somne',
    seoDescription: 'Experience cloud-like comfort with our pillow top mattresses. Featuring an extra layer of plush cushioning for the ultimate luxury sleep experience.',
  },
  headboards: {
    title: 'Headboards',
    description: 'Transform your bedroom with our collection of statement headboards.',
    seoTitle: 'Luxury Headboards | Upholstered & Floor Standing | Somne',
    seoDescription: 'Complete your bed with a stylish headboard. Browse our collection of upholstered, floor-standing, and strutted headboards in varying designs and fabrics.',
  },
};

const getCleanColorName = (name: string): string => {
  let cleaned = name.replace(/\s*plush\s*/i, '').trim();
  if (cleaned.toLowerCase() === 'cream') return 'Beige';
  if (cleaned.toLowerCase() === 'emerald') return 'Green';
  return cleaned;
};

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  // console.log("category, subcategory", { category, subcategory });
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(useParams());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
  const [selectedFirmness, setSelectedFirmness] = useState<string | null>(null);

  const selectedColor = searchParams.get('color');
  const isTestUrl = window.location.hostname === 'somne-f5b59.web.app' || searchParams.get('test') === 'true';

  const setSelectedColor = (color: string | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (color) {
        newParams.set('color', color);
      } else {
        newParams.delete('color');
      }
      return newParams;
    });
  };

  // Default to price-low for mattresses (including subcategories), featured for others
  // Default to price-low for mattresses (including subcategories), featured for others
  // const isMattress =
  //   category === 'mattresses' ||
  //   category?.includes('mattress') ||
  //   category === 'memory-foam' ||
  //   subcategory?.includes('mattress') ||
  //   subcategory === 'memory-foam';

  // Initialize state
  const [sortBy, setSortBy] = useState(`${category === 'mattresses' ? 'price-low' : 'featured'}`);

  // Reset sorting when category changes
  useEffect(() => {
    setSortBy(`${category === 'mattresses' ? 'price-low' : 'featured'}`);
  }, [category, subcategory]);

  // Validate category - if not valid, redirect to NotFound
  const isValidCategory = category && validCategories.includes(category);
  const isValidSubcategory = !subcategory || validCategories.includes(subcategory);

  const currentCategory = subcategory || category || 'beds';
  const info = categoryInfo[currentCategory] || categoryInfo.beds;
  console.log(currentCategory);
  const isComingSoonCategory = shouldShowOttomanComingSoon(currentCategory);
  console.log(isComingSoonCategory,"sss")

  // React Query Fetch Data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: products = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ['category', category, subcategory, isTestUrl],
    queryFn: () => BedCategory(subcategory || 'all', category || 'beds', isTestUrl),
    enabled: !!isValidCategory && !!isValidSubcategory && !isComingSoonCategory,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  // Extract unique colors from all products
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, { name: string; hex: string }>();
    products.forEach((product: any) => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.filter((color: any) => !color.disabled).forEach((color: { name: string; hex: string }) => {
          if (color.name && color.hex) {
            const cleanName = getCleanColorName(color.name);
            const key = cleanName.toLowerCase();
            if (!colorMap.has(key)) {
              colorMap.set(key, { name: cleanName, hex: color.hex });
            }
          }
        });
      }
    });
    return Array.from(colorMap.values()).filter(c => c.name.toLowerCase() !== 'silver');
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: any) => {
      if (category === 'beds') {
        if (subcategory) {
          return p.category === 'beds' && p.subcategory === subcategory;
        }
        return p.category === 'beds';
      }
      if (category === 'mattresses') {
        if (subcategory) {
          return p.category === 'mattresses' && p.subcategory === subcategory;
        }
        return p.category === 'mattresses';
      }
      if (category === 'headboards') {
        return p.category === 'headboards';
      }
      return true;
    });

    // Color filter
    if (selectedColor) {
      result = result.filter((p: any) => {
        if (p.colors && Array.isArray(p.colors)) {
          return p.colors.some(
            (c: { name: string; disabled?: boolean }) => !c.disabled && getCleanColorName(c.name).toLowerCase() === selectedColor.toLowerCase()
          );
        }
        return false;
      });
    }

    // Size filter
    if (selectedSize) {
      result = result.filter((p: any) => {
        if (p.sizes && Array.isArray(p.sizes)) {
          return p.sizes.some((s: { name: string }) => s.name === selectedSize);
        }
        return false;
      });
    }

    // Price filter
    if (selectedPrice) {
      result = result.filter((p: any) => {
        const price = p.basePrice || p.price || 0;
        return price >= selectedPrice.min && price <= selectedPrice.max;
      });
    }

    // Firmness filter (for mattresses)
    if (selectedFirmness) {
      result = result.filter((p: any) => p.firmness === selectedFirmness);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a: any, b: any) => (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0));
        break;
      case 'price-high':
        result.sort((a: any, b: any) => (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0));
        break;
      case 'rating':
        result.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort((a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Force test products (price <= 1) to the bottom
    result.sort((a: any, b: any) => {
      const isTestA = (a.basePrice || a.price || 0) <= 1;
      const isTestB = (b.basePrice || b.price || 0) <= 1;
      if (isTestA && !isTestB) return 1;
      if (!isTestA && isTestB) return -1;
      return 0;
    });

    return result;
  }, [products, category, subcategory, selectedColor, selectedSize, selectedPrice, selectedFirmness, sortBy]);

  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedPrice(null);
    setSelectedFirmness(null);
    setSelectedColor(null);
  };

  const hasActiveFilters = selectedSize || selectedPrice || selectedFirmness || selectedColor;

  // Move the redirect AFTER all hooks
  if (!isValidCategory || !isValidSubcategory) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{info.seoTitle || `${info.title} | Somne`}</title>
        <meta name="description" content={info.seoDescription || info.description} />
        <link rel="canonical" href={`https://somne.co.uk/${category}${subcategory ? `/${subcategory}` : ''}`} />
        <meta property="og:title" content={info.seoTitle || `${info.title} | Somne`} />
        <meta property="og:description" content={info.seoDescription || info.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://somne.co.uk/img/logo.png" />
      </Helmet>
      <Layout>
        {/* Breadcrumb */}
        {/* <div className="bg-secondary py-4 border-b border-border">
          <div className="luxury-container">
            <nav className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              {subcategory ? (
                <>
                  <Link to={`/${category}`} className="hover:text-accent transition-colors capitalize">
                    {category}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground">{info.title}</span>
                </>
              ) : (
                <span className="text-foreground">{info.title}</span>
              )}
            </nav>
          </div>
        </div> */}

        {/* Header */}
        <div className="bg-black py-9 text-white">
          <div className="luxury-container">
            {/* <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Somne collection
            </p> */}
            <h1 className="max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">
              {info.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 md:text-base">
              {info.description}
            </p>
          </div>
        </div>

        {isComingSoonCategory ? (
          <ComingSoon
            title={`${info.title} are almost here`}
            description="We are putting the finishing touches on this collection. Explore our available beds while we prepare these new storage designs."
          />
        ) : (
        /* Content */
        <div className="bg-[#f4f4f4] py-7 md:py-12">
          <div className="luxury-container">
            {/* Toolbar */}
            <div className="mb-7 flex items-center justify-between gap-3 border-b border-black/10 pb-5 md:mb-10 md:pb-6">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10 rounded-full border border-black/20 bg-transparent px-4 text-xs font-bold uppercase tracking-[0.08em] text-black shadow-none hover:bg-black hover:text-white lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                {loading ? (
                  <div className="h-4 w-24 animate-pulse rounded-full bg-black/10" aria-hidden="true" />
                ) : (
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55 md:text-sm">
                    {filteredProducts.length} products
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2">
                <span className="hidden text-xs font-bold uppercase tracking-[0.12em] text-black/45 sm:inline">
                  Sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  disabled={loading}
                  className="h-10 rounded-full border border-black/20 bg-white px-4 text-sm font-semibold text-black shadow-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/10"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </label>
            </div>

            {loading ? <CatalogueSkeleton /> : (
            <div className="flex gap-5 lg:gap-8">
              {/* Filters Sidebar */}
              <aside
                className={cn(
                  'fixed inset-0 z-[70] w-full flex-shrink-0 bg-white transition-transform duration-300 lg:sticky lg:inset-auto lg:top-[calc(var(--daily-deal-bar-height)+7rem)] lg:z-10 lg:h-fit lg:max-h-[calc(100vh-var(--daily-deal-bar-height)-8rem)] lg:w-64 lg:self-start lg:overflow-hidden lg:rounded-3xl lg:border lg:border-black/5 lg:bg-white lg:shadow-[0_14px_40px_rgba(0,0,0,0.07)] lg:transition-none',
                  showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
              >
                <div className="h-full overflow-y-auto p-6 lg:max-h-[calc(100vh-var(--daily-deal-bar-height)-8rem)] lg:p-6">
                  {/* Mobile header */}
                  <div className="mb-8 flex items-center justify-between lg:hidden">
                    <h2 className="text-2xl font-black text-black">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black hover:text-white"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Color filter - hide for mattresses */}
                  {availableColors.length > 0 && category !== 'mattresses' && (
                    <div className="mb-8 border-b border-black/10 pb-8 lg:border-b-0">
                      <div className="mb-4 flex items-baseline justify-between gap-4">
                        <h3 className="text-lg font-black text-black">Color</h3>
                        {selectedColor && (
                          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/50">
                            {selectedColor}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {availableColors.map((color) => (
                          <div
                            key={color.name}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-full px-2 py-1.5 transition-colors',
                              selectedColor === color.name ? 'bg-black text-white' : 'text-black hover:bg-white'
                            )}
                            onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                          >
                            <button

                              className={cn(
                                'group relative h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
                                selectedColor === color.name
                                  ? 'scale-110 border-white ring-2 ring-black ring-offset-2'
                                  : 'border-black/15 hover:border-black/45'
                              )}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                              aria-label={`Filter by ${color.name}`}
                            >
                              {selectedColor === color.name && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <svg className="h-4 w-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                            <p className="text-sm font-semibold">{color.name}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mb-8 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-black/55 underline-offset-4 transition-colors hover:text-black hover:underline"
                    >
                      Clear all
                    </button>
                  )}

                  {/* Mattress Type filter (for mattresses) */}
                  {category === 'mattresses' && (
                    <div className="mb-8">
                      <h3 className="mb-4 text-lg font-black text-black">Mattress Type</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'All Mattresses', href: '/mattresses' },
                          { label: 'Memory Foam', href: '/mattresses/memory-foam' },
                          { label: 'Orthopaedic', href: '/mattresses/orthopaedic-mattress' },
                          { label: 'Pocket Sprung', href: '/mattresses/pocket-sprung-mattress' },
                          { label: 'Pillow Top', href: '/mattresses/pillow-top-mattress' },
                        ].map((type) => {
                          const isActive =
                            (type.href === '/mattresses' && !subcategory) ||
                            (subcategory && type.href.includes(subcategory));
                          return (
                            <Link
                              key={type.label}
                              to={type.href}
                              className={cn(
                                'block w-full rounded-full px-4 py-2.5 text-left text-sm font-semibold transition-colors',
                                isActive
                                  ? 'bg-black text-white'
                                  : 'text-black/60 hover:bg-white hover:text-black'
                              )}
                            >
                              {type.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
              {/* Products Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex min-h-[420px] items-center justify-center bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-black/35" />
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-3">
                    {filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} selectedColor={selectedColor} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white px-4 py-20 text-center">
                    <p className="mb-5 text-2xl font-black text-black">
                      No products match your filters
                    </p>
                    <Button
                      onClick={clearFilters}
                      className="rounded-full border border-black bg-transparent px-7 text-xs font-bold uppercase tracking-[0.08em] text-black shadow-none hover:bg-black hover:text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}

              </div>
            </div>
            )}
          </div>
        </div>
        )}
      </Layout>
    </>
  );
};

export default CategoryPage;
