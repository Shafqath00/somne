import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, Navigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BedCategory } from '@/api/api';

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

const categoryInfo: Record<string, { title: string; description: string }> = {
  beds: {
    title: 'Luxury Beds',
    description: 'Handcrafted beds in a variety of styles, from elegant upholstered designs to practical storage solutions.',
  },
  "upholstered-beds": {
    title: 'Upholstered Beds',
    description: 'Elegant fabric-covered beds featuring tall, padded headboards and premium upholstery.',
  },
  "divan-beds": {
    title: 'Divan Beds',
    description: 'Complete bed sets combining a sturdy divan base with a luxury mattress, available with storage options.',
  },
  "ottoman-divan-beds": {
    title: 'Ottoman Divan Beds',
    description: 'Maximize your space with our ottoman beds featuring gas-lift storage and stylish designs.',
  },
  "upholstered-ottoman-bed": {
    title: 'Ottoman Upholstered Beds',
    description: 'Elegant fabric-covered beds featuring tall, padded headboards and premium upholstery.',
  },
  mattresses: {
    title: 'Mattresses',
    description: 'From memory foam to natural pocket sprung, find your perfect mattress for restful sleep.',
  },
  'memory-foam': {
    title: 'Memory Foam Mattresses',
    description: 'Pressure-relieving comfort with responsive memory foam that contours to your body.',
  },
  "orthopaedic-mattress": {
    title: 'Orthopaedic Mattresses',
    description: 'Firm support designed to promote proper spinal alignment and relieve back pain.',
  },
  "pocket-sprung-mattress": {
    title: 'Pocket Sprung Mattresses',
    description: 'Individual pocket springs provide targeted support and minimal motion transfer.',
  },
  "pillow-top-mattress": {
    title: 'Pillow Top Mattresses',
    description: 'Soft and comfortable pillow top mattresses with a plush texture.',
  },
  headboards: {
    title: 'Headboards',
    description: 'Transform your bedroom with our collection of statement headboards.',
  },
};

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(useParams());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null);
  const [selectedFirmness, setSelectedFirmness] = useState<string | null>(null);

  const selectedColor = searchParams.get('color');

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

  const [sortBy, setSortBy] = useState('featured');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Validate category - if not valid, redirect to NotFound
  const isValidCategory = category && validCategories.includes(category);
  const isValidSubcategory = !subcategory || validCategories.includes(subcategory);

  const currentCategory = subcategory || category || 'beds';
  const info = categoryInfo[currentCategory] || categoryInfo.beds;

  // Extract unique colors from all products
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, { name: string; hex: string }>();
    products.forEach((product) => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach((color: { name: string; hex: string }) => {
          if (color.name && color.hex) {
            colorMap.set(color.name.toLowerCase(), { name: color.name, hex: color.hex });
          }
        });
      }
    });
    return Array.from(colorMap.values());
  }, [products]);

  useEffect(() => {
    // Don't fetch if category is invalid
    if (!isValidCategory || !isValidSubcategory) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await BedCategory(subcategory || 'all', category || 'beds');
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, isValidCategory, isValidSubcategory, category, subcategory]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
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
      result = result.filter((p) => {
        if (p.colors && Array.isArray(p.colors)) {
          return p.colors.some(
            (c: { name: string }) => c.name.toLowerCase() === selectedColor.toLowerCase()
          );
        }
        return false;
      });
    }

    // Size filter
    if (selectedSize) {
      result = result.filter((p) => {
        if (p.sizes && Array.isArray(p.sizes)) {
          return p.sizes.some((s: { name: string }) => s.name === selectedSize);
        }
        return false;
      });
    }

    // Price filter
    if (selectedPrice) {
      result = result.filter((p) => {
        const price = p.basePrice || p.price || 0;
        return price >= selectedPrice.min && price <= selectedPrice.max;
      });
    }

    // Firmness filter (for mattresses)
    if (selectedFirmness) {
      result = result.filter((p) => p.firmness === selectedFirmness);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

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
        <title>{info.title} | Somne</title>
        <meta name="description" content={info.description} />
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
        <div className="bg-primary md:py-12 py-8">
          <div className="luxury-container text-center">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-cream ">
              {info.title}
            </h1>
            <p className="font-sans md:text-lg text-sm text-cream/80 max-w-2xl mx-auto">
              {info.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="md:section-padding py-6 bg-white">
          <div className="luxury-container">
            {/* Toolbar */}
            <div className="flex flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
              <div className="flex items-center justify-between md:justify-start w-full  gap-4">
                <Button
                  variant="luxuryOutline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden rounded-lg "
                >
                  <SlidersHorizontal className="w-4 h-4 md:mr-2" />
                  Filters
                </Button>
                <p className="hidden md:block font-sans text-sm text-muted-foreground">
                  {products.length} products
                </p>

              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-sans text-sm rounded-lg border-2 border-black px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <aside
                className={cn(
                  'fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto bg-background lg:bg-transparent w-full lg:w-64 flex-shrink-0 transition-transform lg:transition-none duration-300',
                  showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
              >
                <div className="h-full lg:h-auto overflow-y-auto p-6 lg:p-0">
                  {/* Mobile header */}
                  <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h2 className="font-serif text-xl">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Color filter - hide for mattresses */}
                  {availableColors.length > 0 && category !== 'mattresses' && (
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-serif text-lg font-medium text-foreground">Color</h3>
                        {selectedColor && (
                          <p className="text-sm text-muted-foreground">Selected: <span className="font-medium text-foreground">{selectedColor}</span></p>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        {availableColors.map((color) => (
                          <div key={color.name} className='flex items-center ml-4 gap-2 cursor-pointer' onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}>
                            <button

                              className={cn(
                                'group relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110',
                                selectedColor === color.name
                                  ? 'border-accent ring-2 ring-accent ring-offset-2 scale-110'
                                  : 'border-border hover:border-accent/50'
                              )}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            >
                              {selectedColor === color.name && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                            <p>{color.name}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="font-sans text-sm text-accent hover:underline"
                    >
                      Clear all
                    </button>
                  )}

                  {/* Size filter */}
                  {/* <div className="mb-8">
                    <h3 className="font-serif text-lg font-medium text-foreground mb-4">Size</h3>
                    <div className="space-y-2">
                      {sizeFilters.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={cn(
                            'block w-full text-left px-3 py-2 font-sans text-sm transition-colors',
                            selectedSize === size
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:bg-secondary'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* Price filter */}
                  {/* <div className="mb-8">
                    <h3 className="font-serif text-lg font-medium text-foreground mb-4">Price</h3>
                    <div className="space-y-2">
                      {priceFilters.map((price) => (
                        <button
                          key={price.label}
                          onClick={() =>
                            setSelectedPrice(
                              selectedPrice?.min === price.min && selectedPrice?.max === price.max ? null : { min: price.min, max: price.max }
                            )
                          }
                          className={cn(
                            'block w-full text-left px-3 py-2 font-sans text-sm transition-colors',
                            selectedPrice?.min === price.min && selectedPrice?.max === price.max
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:bg-secondary'
                          )}
                        >
                          {price.label}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* Mattress Type filter (for mattresses) */}
                  {category === 'mattresses' && (
                    <div className="mb-8">
                      <h3 className="font-serif text-lg font-medium text-foreground mb-4">Mattress Type</h3>
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
                                'block w-full text-left px-3 py-2 font-sans text-sm transition-colors rounded-md',
                                isActive
                                  ? 'bg-accent text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-secondary'
                              )}
                            >
                              {type.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Firmness filter (for mattresses) */}
                  {/* {category === 'mattresses' && (
                    <div className="mb-8">
                      <h3 className="font-serif text-lg font-medium text-foreground mb-4">Firmness</h3>
                      <div className="space-y-2">
                        {firmnessFilters.map((firmness) => (
                          <button
                            key={firmness}
                            onClick={() => setSelectedFirmness(selectedFirmness === firmness ? null : firmness)}
                            className={cn(
                              'block w-full text-left px-3 py-2 font-sans text-sm transition-colors',
                              selectedFirmness === firmness
                                ? 'bg-accent text-foreground'
                                : 'text-muted-foreground hover:bg-secondary'
                            )}
                          >
                            {firmness}
                          </button>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </aside>
              {/* Products Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 xl:grid-cols-3 md:gap-6 gap-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} selectedColor={selectedColor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="font-serif text-xl text-muted-foreground mb-4">
                      No products match your filters
                    </p>
                    <Button variant="luxury" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CategoryPage;
