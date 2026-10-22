/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useSearchParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Star, Truck, Shield, Wrench, Minus, Plus, Check, Loader2, BedDouble, BedSingle, Ruler, Weight, Palette, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';

import { useCart } from '@/contexts/CartContext';
import { ProductSize, ProductColor, StorageOption } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getProductBySlug, getMattresses } from '@/api/api';
import { BedDetails, OttomanBedDetails, UpholsteredBedDetails } from '@/components/BedDetails/BedDetails';
import { MattressDetails } from '@/components/BedDetails/MattressDetails';
import { HeadBoardDetails } from '@/components/BedDetails/HeadBoard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



const ProductPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const variantParam = searchParams.get('variant');

  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [selectedHeadboard, setSelectedHeadboard] = useState<StorageOption | null>(null);
  const [selectedBase, setSelectedBase] = useState<StorageOption | null>(null);
  const [selectedFirmness, setSelectedFirmness] = useState<StorageOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState("colors");
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);

  // Mattress Upsell State
  const [mattresses, setMattresses] = useState<Product[]>([]);
  const [isMattressModalOpen, setIsMattressModalOpen] = useState(false);
  const [selectedUpsellMattress, setSelectedUpsellMattress] = useState<Product | null>(null);
  const [selectedUpsellFirmness, setSelectedUpsellFirmness] = useState<StorageOption | null>(null);

  // Default to 'sizes' on mobile since 'colors' is handled separately
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSelected("sizes");
    }
  }, []);

  const uniqueFabrics = useMemo(() => {
    if (!product?.colors) return [];
    // Extract unique fabric names
    const fabrics = Array.from(new Set(product.colors.map((c: ProductColor) => c.fabric).filter(Boolean))) as string[];
    return fabrics;
  }, [product]);

  // Determine available sections dynamically
  const availableSections = useMemo(() => {
    if (!product) return [];
    const sections = [
      { name: 'Color', key: 'colors', icon: Palette, hasData: product.colors?.length > 0 },
      { name: 'Size', key: 'sizes', icon: Ruler, hasData: product.sizes?.length > 0 },
      { name: 'Firmness', key: 'firmnessOptions', icon: Layers, hasData: product.firmnessOptions?.length > 0 },
      { name: 'Storage', key: 'storageOptions', icon: BedSingle, hasData: product.storageOptions?.length > 0 },
      { name: 'Headboard', key: 'headboardOptions', icon: BedDouble, hasData: product.headboardOptions?.length > 0 },
      { name: 'Base', key: 'baseOptions', icon: Weight, hasData: product.baseOptions?.length > 0 },
    ];
    return sections.filter(s => s.hasData);
  }, [product]);

  // Set default selected section when product loads or changes
  useEffect(() => {
    if (availableSections.length > 0) {
      // If current selected is not available, switch to first available
      const isCurrentAvailable = availableSections.some(s => s.key === selected);
      if (!isCurrentAvailable) {
        setSelected(availableSections[0].key);
      }
    }
  }, [availableSections, selected]);

  const visibleColors = useMemo(() => {
    if (!product?.colors) return [];
    if (uniqueFabrics.length === 0) return product.colors;
    return product.colors.filter((c: ProductColor) => c.fabric === selectedFabric);
  }, [product, uniqueFabrics, selectedFabric]);

  useEffect(() => {
    if (uniqueFabrics.length > 0 && !selectedFabric) {
      // If we have a selected color from URL, try to set the fabric to match that color
      if (selectedColor && selectedColor.fabric) {
        setSelectedFabric(selectedColor.fabric);
      } else {
        setSelectedFabric(uniqueFabrics[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueFabrics]);

  // When fabric changes, reset the color if it doesn't belong to the new fabric
  useEffect(() => {
    if (!selectedFabric || !product?.colors) return;
    const colorsForFabric = product.colors.filter((c: ProductColor) => c.fabric === selectedFabric);
    // If selected color is not in this fabric, pick the first of the new fabric
    const colorStillValid = colorsForFabric.some((c: ProductColor) => c.name === selectedColor?.name);
    if (!colorStillValid && colorsForFabric.length > 0) {
      handleColorSelect(colorsForFabric[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFabric]);

  // Image State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [displayedImage, setDisplayedImage] = useState<string>('');
  const [assemblyAdded, setAssemblyAdded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const index = Math.round(scrollContainerRef.current.offsetWidth > 0 ? scrollContainerRef.current.scrollLeft / scrollContainerRef.current.offsetWidth : 0);
      if (index !== activeImageIndex) {
        setActiveImageIndex(index);
      }
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const target = activeImageIndex * el.offsetWidth;
      if (Math.abs(el.scrollLeft - target) > 10) {
        el.scrollTo({ left: target, behavior: 'smooth' });
      }
    }
  }, [activeImageIndex]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // console.log("slug", slug);
        const data = await getProductBySlug(slug);
        setProduct(data);
        // console.log(data);

        // Set initial selections with smart defaults
        if (data.sizes?.length > 0) {
          // Select smallest size by predefined order, fallback to first or lowest priceModifier
          const sizeOrder = ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen'];
          const sortedSizes = [...data.sizes].sort((a: any, b: any) => {
            const aIndex = sizeOrder.indexOf(a.name);
            const bIndex = sizeOrder.indexOf(b.name);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return (a.priceModifier || 0) - (b.priceModifier || 0);
          });
          setSelectedSize(sortedSizes[0]);
        }

        // Color selection logic with URL param support
        if (data.colors?.length > 0) {
          let colorToSelect = data.colors.find((c: ProductColor) => c.isDefault === true) || data.colors[0]; // Default to first

          if (variantParam) {
            const matchingColor = data.colors.find((c: ProductColor) =>
              c.name.toLowerCase() === variantParam.toLowerCase()
            );
            if (matchingColor) {
              colorToSelect = matchingColor;
            }
          }

          setSelectedColor(colorToSelect);
        }

        // Storage: prefer "No Drawer" or lowest priceModifier (free option)
        if (data.storageOptions?.length > 0) {
          const noDrawer = data.storageOptions.find((s: any) =>
            s.name.toLowerCase().includes('no drawer') || s.name.toLowerCase() === 'none'
          );
          const freeStorage = data.storageOptions.find((s: any) => !s.priceModifier || s.priceModifier === 0);
          setSelectedStorage(noDrawer || freeStorage || data.storageOptions[0]);
        }

        // Headboard: prefer free option (priceModifier = 0)
        if (data.headboardOptions?.length > 0) {
          const freeHeadboard = data.headboardOptions.find((h: any) => !h.priceModifier || h.priceModifier === 0);
          setSelectedHeadboard(freeHeadboard || data.headboardOptions[0]);
        }

        // Base: prefer free option (priceModifier = 0)
        if (data.baseOptions?.length > 0) {
          const freeBase = data.baseOptions.find((b: any) => !b.priceModifier || b.priceModifier === 0);
          setSelectedBase(freeBase || data.baseOptions[0]);
        }

        if (data.firmnessOptions?.length > 0) setSelectedFirmness(data.firmnessOptions[0]);

        // Set initial image based on selected color
        if (data.images?.length > 0) {
          // This will be handled by the galleryImages effect, but good to have a base
          setDisplayedImage(data.images[0]);
        }

      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [slug, variantParam]);

  // Fetch Mattresses for Upsell
  useEffect(() => {
    const fetchMattresses = async () => {
      try {
        const mattressProducts = await getMattresses();
        // Filter for mattresses
        // @ts-ignore
        // const mattressProducts = allProducts.filter(p => p.categoryId === 'mattresses' || p.category === 'mattresses');
        setMattresses(mattressProducts);
      } catch (error) {
        console.error("Failed to fetch mattresses for upsell", error);
      }
    };
    fetchMattresses();
  }, []);

  // Load persisted state (Assembly & Mattress)
  useEffect(() => {
    if (!slug || mattresses.length === 0) return;

    try {
      const saved = sessionStorage.getItem(`product_state_${slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Restore Assembly
        if (typeof parsed.assemblyAdded === 'boolean') {
          setAssemblyAdded(parsed.assemblyAdded);
        }

        // Restore Mattress Selection
        if (parsed.upsellMattressId) {
          const m = mattresses.find(p => p.id === parsed.upsellMattressId);
          if (m) {
            setSelectedUpsellMattress(m);
            if (parsed.upsellFirmnessName) {
              const f = m.firmnessOptions?.find(o => o.name === parsed.upsellFirmnessName);
              if (f) setSelectedUpsellFirmness(f);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to load persisted state", e);
    }
  }, [slug, mattresses]);

  // Save state (Assembly & Mattress)
  useEffect(() => {
    if (!slug) return;
    const state = {
      assemblyAdded,
      upsellMattressId: selectedUpsellMattress?.id,
      upsellFirmnessName: selectedUpsellFirmness?.name
    };
    sessionStorage.setItem(`product_state_${slug}`, JSON.stringify(state));
  }, [slug, assemblyAdded, selectedUpsellMattress, selectedUpsellFirmness]);

  const compatibleMattresses = useMemo(() => {
    if (!selectedSize || mattresses.length === 0) return [];
    return mattresses.filter(m => m.sizes.some(s => s.name === selectedSize.name));
  }, [selectedSize, mattresses]);

  const handleMattressSelect = (mattress: Product) => {
    if (selectedUpsellMattress?.id === mattress.id) {
      // If clicking the same mattress, maybe just keep it selected
      // or allows re-selection. 
      return;
    }

    setSelectedUpsellMattress(mattress);
    // Remove default firmness logic - force user to select
    // if (mattress.firmnessOptions && mattress.firmnessOptions.length > 0) {
    //   setSelectedUpsellFirmness(mattress.firmnessOptions[0]);
    // } else {
    setSelectedUpsellFirmness(null);
    // }
  };

  const galleryImages = useMemo(() => {
    if (!selectedColor) return product?.images || [];

    // Combine main variant image and extra variant images
    const variantImages = [
      ...(selectedColor.image ? [selectedColor.image] : []),
      ...(selectedColor.productImages || [])
    ];

    // Remove duplicates and return
    if (variantImages.length > 0) {
      return Array.from(new Set(variantImages));
    }

    return product?.images || [];
  }, [selectedColor, product]);

  // Sync displayed image when gallery changes (e.g. init or color switch)
  useEffect(() => {
    if (galleryImages.length > 0) {
      // Only reset if current displayed image is not in the new gallery
      // Or if we just switched colors (handled by handleColorSelect, but good to have safety)
      if (!displayedImage || !galleryImages.includes(displayedImage)) {
        setDisplayedImage(galleryImages[0]);
        setActiveImageIndex(0);
      }
    }
  }, [selectedColor, product]); // Depend on selectedColor so it updates when color changes

  // Handle color selection with image update
  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
    // console.log("color",color);
    // Logic handled by the derived galleryImages and useEffect above
    // But we can explicitly set it here for instant feedback if needed, 
    // though the effect will handle it.

    // If the color has a specific single image (swatch) but NO gallery images, we might want to show that?
    // Current requirement focuses on "corresponding product image", usually implying the variant gallery.
    // If no variant gallery, we fallback to main images.
  };

  const handleImageSelect = (index: number) => {
    setActiveImageIndex(index);
    setDisplayedImage(galleryImages[index]);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * scrollContainerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const mattressPrice = useMemo(() => {
    if (!selectedUpsellMattress || !selectedSize) return 0;
    const sizePrice = selectedUpsellMattress.sizes.find(s => s.name === selectedSize.name)?.priceModifier || 0;
    const base = selectedUpsellMattress.discountPrice || selectedUpsellMattress.basePrice || selectedUpsellMattress.price || 0;
    return base + sizePrice;
  }, [selectedUpsellMattress, selectedSize]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[50vh] bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="section-padding luxury-container text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
          <Button variant="luxury" asChild>
            <Link to="/beds/divan-beds">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }



  const getHeadboardPrice = (headboard: any, sizeName: string | undefined) => {
    if (!headboard || !sizeName) return headboard?.priceModifier || 0;

    const sizeMap: { [key: string]: string } = {
      "Small Single": "2FT6",
      "Single": "3FT",
      "Small Double": "4FT",
      "Double": "4FT6",
      "King": "5FT",
      "Queen": "6FT",
      "Super King": "6FT" // Fallback if 'Super King' is still used anywhere
    };

    const dimensionKey = sizeMap[sizeName];

    if (headboard.priceBySize && dimensionKey && headboard.priceBySize[dimensionKey] !== undefined) {
      return headboard.priceBySize[dimensionKey];
    }

    return headboard.priceModifier || 0;
  };

  const totalPrice = Number(product.discountPrice || product.price || 0) +
    (selectedSize?.priceModifier || 0) +
    (selectedStorage?.priceModifier || 0) +
    getHeadboardPrice(selectedHeadboard, selectedSize?.name) +
    (assemblyAdded ? 49 : 0) + // Add Assembly Cost if selected
    (selectedBase?.priceModifier || 0) +
    (selectedFirmness?.priceModifier || 0) +
    mattressPrice;

  const handleAddToCart = () => {
    // Check if size is required (if product has sizes, checking length)
    const sizeRequired = product.sizes && product.sizes.length > 0;

    if (!sizeRequired || selectedSize) {
      addItem(
        product,
        quantity,
        selectedSize || undefined,
        selectedColor || undefined,
        selectedStorage || undefined,
        selectedHeadboard || undefined,
        selectedBase || undefined,
        selectedFirmness || undefined,
        assemblyAdded
      );
      toast.success(`${product.name} added to bag`);
    }

    // Add Upsell Mattress if selected
    if (selectedUpsellMattress && selectedSize) {
      const matchingSize = selectedUpsellMattress.sizes.find(s => s.name === selectedSize.name);
      if (matchingSize) {
        addItem(
          selectedUpsellMattress,
          quantity,
          matchingSize,
          undefined, // Color
          undefined, // Storage
          undefined, // Headboard
          undefined, // Base
          selectedUpsellFirmness || undefined
        );
        toast.success(`${selectedUpsellMattress.name} added to bag`);
      }
    }
  };

  // const relatedProducts = staticProducts
  //   .filter((p) => p.category === product.categoryId && p.id !== product.id)
  //   .slice(0, 4);



  const canonicalUrl = `${window.location.origin}/product/${encodeURIComponent(product.slug || product.name)}`;
  const productImageUrl = product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${window.location.origin}${product.images[0]}`) : `${window.location.origin}/img/logo.png`;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": productImageUrl,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Somne"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "GBP",
      "price": product.discountPrice || product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Somne</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${product.name} | Somne`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={productImageUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={`${product.name} | Somne`} />
        <meta property="twitter:description" content={product.description} />
        <meta property="twitter:image" content={productImageUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <Layout>
        {/* Breadcrumb */}
        <div className="bg-white backdrop-blur-sm md:sticky mt-6 top-[56px] md:top-[72px] z-10">
          <div className="luxury-container">
            <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-sans text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <p className=" text-border flex-shrink-0">/</p>
              <Link to={`/${product.categoryId}/${product.subcategoryId}`} className={`hover:text-accent transition-colors capitalize ${product.categoryId === 'panels' ? 'hidden' : ''}`}>
                {product.subcategoryId}
              </Link>
              <p className={` text-border flex-shrink-0 ${product.categoryId === 'panels' ? 'hidden' : ''}`}>/</p>
              <span className="text-foreground font-medium truncate max-w-[150px] md:max-w-none">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="bg-white pb-20 md:pb-10">
          <div className="luxury-container pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

              {/* ─── LEFT: Image Gallery ─────────────────────────── */}
              <div className="lg:sticky lg:top-[88px] space-y-3">

                {/* Mobile product title */}
                <div className="lg:hidden">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h1 className="font-serif text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
                    {product.bestseller && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Best Seller
                      </span>
                    )}
                  </div>
                  {selectedColor?.name && (
                    <p className="text-sm text-muted-foreground">{selectedColor.name}</p>
                  )}
                </div>

                {/* Main image carousel */}
                <div className="relative overflow-hidden rounded-2xl bg-stone-100 shadow-sm aspect-square md:aspect-[4/3] group">
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory h-full w-full scrollbar-hide"
                  >
                    {(galleryImages.length > 0 ? galleryImages : [displayedImage || '']).map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover flex-shrink-0 snap-center"
                      />
                    ))}
                  </div>

                  {/* Dot indicators */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                      {galleryImages.map((_, idx) => (
                        <div key={idx} className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          activeImageIndex === idx ? "w-5 bg-white" : "w-1.5 bg-white/50"
                        )} />
                      ))}
                    </div>
                  )}

                  {/* Image count badge */}
                  {galleryImages.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {galleryImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={cn(
                          'flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-xl border-2 transition-all duration-200',
                          activeImageIndex === index
                            ? 'border-black shadow-md'
                            : 'border-transparent hover:border-stone-300 opacity-70 hover:opacity-100'
                        )}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Assembly add-on card */}
                {(product.categoryId === 'mattresses' || product.categoryId === 'beds') && (
                  <div className={cn(
                    'rounded-xl border-2 transition-all duration-300 p-4 flex items-center gap-4',
                    assemblyAdded ? 'border-black bg-stone-50' : 'border-stone-200 bg-white'
                  )}>
                    <img src="/img/icons/assembly.png" alt="Assembly" className="w-10 h-10 object-contain flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Professional Assembly</p>
                      <p className="text-xs text-muted-foreground">By trained technicians · +£49</p>
                    </div>
                    <button
                      onClick={() => setAssemblyAdded(!assemblyAdded)}
                      className={cn(
                        'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200',
                        assemblyAdded
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-foreground border-stone-300 hover:border-black'
                      )}
                    >
                      {assemblyAdded ? 'Added ✓' : 'Add £49'}
                    </button>
                  </div>
                )}
              </div>

              {/* ─── RIGHT: Product Info ───────────────────────────── */}
              <div className="flex flex-col gap-6">

                {/* Title & badge — desktop only */}
                <div className="hidden lg:block">
                  {product.bestseller && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Best Seller
                    </span>
                  )}
                  <h1 className="font-serif text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-1">{product.name}</h1>
                  {selectedColor?.name && (
                    <p className="text-base text-muted-foreground">{selectedColor.name}{selectedFabric ? ` · ${selectedFabric}` : ''}</p>
                  )}
                </div>

                {/* Price block */}
                <div className="flex items-end gap-4 py-5 border-y border-stone-100">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">From</p>
                    <span className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                      £{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  {product.discountPercentage > 0 && (() => {
                    const fullPrice = Number(product.basePrice || 0) +
                      (selectedSize?.priceModifier || 0) +
                      (selectedStorage?.priceModifier || 0) +
                      getHeadboardPrice(selectedHeadboard, selectedSize?.name) +
                      (assemblyAdded ? 49 : 0) +
                      (selectedBase?.priceModifier || 0) +
                      (selectedFirmness?.priceModifier || 0) +
                      mattressPrice;
                    const savings = fullPrice - totalPrice;
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="text-lg text-stone-400 line-through font-medium">£{fullPrice.toLocaleString()}</span>
                        <span className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full">Save £{savings.toLocaleString()}</span>
                      </div>
                    );
                  })()}
                  <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-rose-700">
                    <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                    Almost gone
                  </div>
                </div>

                {/* Mattress upsell — beds only */}
                {product.categoryId === 'beds' && (
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-300',
                    selectedUpsellMattress ? 'border-black bg-stone-50' : 'border-stone-200 bg-white'
                  )}>
                    <div className="flex items-center gap-4">
                      {selectedUpsellMattress ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0 border border-stone-200">
                          <img src={selectedUpsellMattress.images?.[0] || '/placeholder.jpg'} alt={selectedUpsellMattress.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <img src="/img/icons/mattress2.png" alt="mattress" className="w-14 h-14 object-contain flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground leading-none mb-0.5">
                          {selectedUpsellMattress ? 'Mattress Added' : 'Add a Mattress & Save'}
                        </p>
                        {selectedUpsellMattress ? (
                          <p className="text-xs text-muted-foreground line-clamp-1">{selectedUpsellMattress.name}{selectedUpsellFirmness ? ` · ${selectedUpsellFirmness.name}` : ''}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Bundle & save with a matched mattress</p>
                        )}
                      </div>
                      <Dialog open={isMattressModalOpen} onOpenChange={setIsMattressModalOpen}>
                        <DialogTrigger asChild>
                          <button className={cn(
                            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all whitespace-nowrap',
                            selectedUpsellMattress ? 'bg-black text-white border-black' : 'bg-white border-stone-300 hover:border-black text-foreground'
                          )}>
                            {selectedUpsellMattress ? 'Change' : 'Choose'}
                          </button>
                        </DialogTrigger>

                        {/* ─── Mattress modal ──────────────────────── */}
                        <DialogContent className="max-w-4xl h-[80vh] bg-white flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
                          <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle className="font-serif text-xl">Select Your Mattress</DialogTitle>
                            <DialogDescription className="sr-only">Choose a mattress</DialogDescription>
                          </DialogHeader>
                          <div className="flex-1 overflow-y-auto p-5">
                            {compatibleMattresses.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                                <p>No matching mattresses found for {selectedSize?.name} size.</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {compatibleMattresses.sort((a, b) => {
                                  const priceA = (a.discountPrice || a.basePrice || a.price || 0) + (a.sizes.find(s => s.name === selectedSize?.name)?.priceModifier || 0);
                                  const priceB = (b.discountPrice || b.basePrice || b.price || 0) + (b.sizes.find(s => s.name === selectedSize?.name)?.priceModifier || 0);
                                  return priceA - priceB;
                                }).map(mattress => {
                                  const isSelected = selectedUpsellMattress?.id === mattress.id;
                                  const sizePrice = mattress.sizes.find(s => s.name === selectedSize?.name)?.priceModifier || 0;
                                  const basePrice = mattress.discountPrice || mattress.basePrice || mattress.price || 0;
                                  const displayPrice = basePrice + sizePrice;
                                  const hasFirmness = mattress.firmnessOptions && mattress.firmnessOptions.length > 0;
                                  return (
                                    <div
                                      key={mattress.id}
                                      onClick={() => handleMattressSelect(mattress)}
                                      className={cn(
                                        'group relative border-2 rounded-xl p-3 cursor-pointer flex flex-col transition-all duration-200',
                                        isSelected ? 'border-black bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                                      )}
                                    >
                                      {isSelected && (
                                        <div className="absolute top-2 right-2 z-10 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <Check className="w-3 h-3" /> Selected
                                        </div>
                                      )}
                                      <div className="aspect-[4/3] bg-stone-100 rounded-lg mb-3 overflow-hidden">
                                        <img src={mattress.images?.[0] || '/placeholder.jpg'} alt={mattress.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                      </div>
                                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">{mattress.name}</h3>
                                      <p className="text-sm font-bold mb-2">£{displayPrice.toFixed(2)}</p>
                                      {hasFirmness && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                          <select
                                            className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-black"
                                            value={isSelected && selectedUpsellFirmness ? selectedUpsellFirmness.name : ""}
                                            onChange={(e) => {
                                              const firm = mattress.firmnessOptions?.find(f => f.name === e.target.value);
                                              if (firm) { setSelectedUpsellMattress(mattress); setSelectedUpsellFirmness(firm); }
                                            }}
                                          >
                                            <option value="" disabled>Select Firmness</option>
                                            {mattress.firmnessOptions?.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                                          </select>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center px-6 py-4 border-t bg-stone-50 gap-3">
                            {selectedUpsellMattress ? (
                              <p className="text-sm"><span className="font-semibold">{selectedUpsellMattress.name}</span>{selectedUpsellFirmness && <span className="text-muted-foreground"> · {selectedUpsellFirmness.name}</span>}</p>
                            ) : <div />}
                            <div className="flex gap-3">
                              {selectedUpsellMattress && <button className="text-sm underline text-muted-foreground" onClick={() => { setSelectedUpsellMattress(null); setIsMattressModalOpen(false); }}>Remove</button>}
                              <Button onClick={() => setIsMattressModalOpen(false)} disabled={!selectedUpsellMattress || (!!selectedUpsellMattress.firmnessOptions?.length && !selectedUpsellFirmness)} className="rounded-full px-6">Confirm</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {selectedUpsellMattress && (
                      <button className="mt-2 text-xs text-muted-foreground underline" onClick={() => setSelectedUpsellMattress(null)}>Remove mattress</button>
                    )}
                  </div>
                )}

                {/* ─── Configuration Tabs ─────────────────────────── */}
                <div className="space-y-4">
                  {/* Tab pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {availableSections.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setSelected(item.key)}
                        className={cn(
                          'flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200',
                          selected === item.key
                            ? 'border-black bg-black text-white'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        )}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        {item.name}
                      </button>
                    ))}
                  </div>

                  {/* Options panel */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    {/* Panel header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-foreground capitalize">
                        {selected === 'colors' ? 'Fabric & Colour' : `${selected.replace('Options', '')} Options`}
                      </h3>
                      {selected === 'sizes' && product.categoryId === 'beds' && (
                        <Sheet>
                          <SheetTrigger asChild>
                            <button className="text-xs font-medium text-stone-500 hover:text-black underline decoration-dashed underline-offset-4 flex items-center gap-1 transition-colors">
                              <Ruler className="w-3 h-3" /> Size guide
                            </button>
                          </SheetTrigger>
                          <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                            <SheetHeader className="mb-6">
                              <SheetTitle>Bed Dimensions</SheetTitle>
                              <SheetDescription>Standard UK bed sizes and measurements.</SheetDescription>
                            </SheetHeader>
                            {(() => {
                              const getDimensions = (sizeName: string | undefined) => {
                                switch (sizeName) {
                                  case 'Small Single': return { widthCm: 75, widthIn: '29.5', lenCm: 190, lenIn: '75' };
                                  case 'Single': return { widthCm: 90, widthIn: '35.5', lenCm: 190, lenIn: '75' };
                                  case 'Small Double': return { widthCm: 120, widthIn: '47', lenCm: 190, lenIn: '75' };
                                  case 'Double': return { widthCm: 135, widthIn: '53', lenCm: 190, lenIn: '75' };
                                  case 'King': return { widthCm: 150, widthIn: '59', lenCm: 200, lenIn: '79' };
                                  case 'Super King': return { widthCm: 180, widthIn: '71', lenCm: 200, lenIn: '79' };
                                  default: return { widthCm: 0, widthIn: '-', lenCm: 0, lenIn: '-' };
                                }
                              };
                              const dims = getDimensions(selectedSize?.name);
                              return (
                                <div className="space-y-6">
                                  <div className="w-full divide-y divide-border">
                                    {[
                                      { label: 'A - Base Height', in: '14 inch', cm: '35.5 cm' },
                                      { label: 'B - Length', in: `${dims.lenIn} inch`, cm: `${dims.lenCm} cm` },
                                      { label: 'C - Width', in: `${dims.widthIn} inch`, cm: `${dims.widthCm} cm` },
                                      { label: 'D - Height', in: '50 inch', cm: '127 cm' },
                                    ].map(row => (
                                      <div key={row.label} className="flex justify-between py-3 text-sm">
                                        <span className="text-muted-foreground font-medium">{row.label}</span>
                                        <span>{row.in}</span>
                                        <span>{row.cm}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="rounded-lg overflow-hidden bg-stone-100 aspect-video flex items-center justify-center">
                                    <img src="/img/image.png" alt="Bed Dimensions Diagram" className="max-w-full max-h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                  </div>
                                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl text-xs text-muted-foreground space-y-1">
                                    <p className="font-semibold text-foreground text-sm mb-2">Notes</p>
                                    <p>• Tolerance of ±2cm (1 inch)</p>
                                    <p>• Base heights range 14–16" depending on feet</p>
                                    <p>• Headboard heights vary by design</p>
                                  </div>
                                </div>
                              );
                            })()}
                          </SheetContent>
                        </Sheet>
                      )}
                    </div>

                    {/* ── Color + Fabric Selection ── */}
                    {selected === 'colors' && (
                      <div className="flex flex-col gap-5">
                        {uniqueFabrics.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-5 h-5 bg-black text-white rounded-full text-[10px] flex items-center justify-center font-bold">1</span>
                                Fabric
                              </p>
                              <span className="text-xs text-stone-400">{uniqueFabrics.length} options</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {uniqueFabrics.map((fabric) => (
                                <button
                                  key={fabric}
                                  onClick={() => setSelectedFabric(fabric)}
                                  className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200",
                                    selectedFabric === fabric
                                      ? "bg-black text-white border-black shadow-md"
                                      : "bg-white text-foreground border-stone-300 hover:border-black"
                                  )}
                                >
                                  {fabric}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {uniqueFabrics.length > 0 && <div className="h-px bg-stone-200" />}

                        <div className={cn("transition-opacity duration-300", uniqueFabrics.length > 0 && !selectedFabric ? "opacity-40 pointer-events-none" : "opacity-100")}>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                              <span className={cn("w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold", uniqueFabrics.length > 0 && !selectedFabric ? "bg-stone-300 text-stone-500" : "bg-black text-white")}>
                                {uniqueFabrics.length > 0 ? '2' : '1'}
                              </span>
                              Colour
                            </p>
                            {selectedFabric && <span className="text-xs text-stone-400">{visibleColors.length} colours</span>}
                          </div>

                          {uniqueFabrics.length > 0 && !selectedFabric ? (
                            <p className="text-sm text-stone-400 italic">← Select a fabric first</p>
                          ) : visibleColors.length === 0 ? (
                            <p className="text-sm text-stone-400 italic">No colours available.</p>
                          ) : (
                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent">
                              {visibleColors.map((option: any) => {
                                const isSel = selectedColor?.name === option.name;
                                return (
                                  <button
                                    key={option.name}
                                    onClick={() => handleColorSelect(option)}
                                    className={cn(
                                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200",
                                      isSel ? "border-black bg-white shadow-sm" : "border-stone-200 bg-white hover:border-stone-400"
                                    )}
                                  >
                                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                                      {option.image ? <img src={option.image} alt={option.name} className="w-full h-full object-cover" /> : <div className="w-full h-full" style={{ backgroundColor: option.hex }} />}
                                    </div>
                                    <span className={cn("flex-1 text-sm font-medium", isSel ? "text-black" : "text-stone-700")}>{option.name}</span>
                                    {isSel && <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Other Options (Size / Storage / etc.) ── */}
                    {selected !== 'colors' && (
                      <div className="flex overflow-x-auto pb-2 -mx-1 px-1 gap-2 scrollbar-hide snap-x md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 md:max-h-72 md:overflow-y-auto">
                        {(selected === 'sizes'
                          ? (product.sizes || []).sort((a: any, b: any) => {
                              const order = ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen'];
                              return order.indexOf(a.name) - order.indexOf(b.name);
                            })
                          : (product[selected as keyof typeof product] as any[] || [])
                        ).map((option: any) => {
                          const isSel =
                            selected === 'sizes' ? selectedSize?.name === option.name :
                            selected === 'storageOptions' ? selectedStorage?.name === option.name :
                            selected === 'headboardOptions' ? selectedHeadboard?.name === option.name :
                            selected === 'baseOptions' ? selectedBase?.name === option.name :
                            selected === 'firmnessOptions' ? selectedFirmness?.name === option.name : false;

                          const handleSelect = () => {
                            if (selected === 'sizes') setSelectedSize(option);
                            else if (selected === 'storageOptions') setSelectedStorage(option);
                            else if (selected === 'headboardOptions') setSelectedHeadboard(option);
                            else if (selected === 'baseOptions') setSelectedBase(option);
                            else if (selected === 'firmnessOptions') setSelectedFirmness(option);
                          };

                          const optionPrice = selected === 'headboardOptions'
                            ? getHeadboardPrice(option, selectedSize?.name)
                            : option.priceModifier;

                          return (
                            <button
                              key={option.name}
                              onClick={handleSelect}
                              disabled={option.inStock === false}
                              className={cn(
                                'relative border-2 rounded-xl text-left transition-all duration-200 flex flex-col justify-between p-3 flex-shrink-0 snap-center min-w-[130px]',
                                selected === 'firmnessOptions' ? 'min-h-[60px] md:min-w-0' : 'min-h-[90px] md:min-w-0',
                                isSel ? 'border-black bg-white shadow-sm' : 'border-stone-200 bg-white hover:border-stone-400',
                                option.inStock === false && 'opacity-40 cursor-not-allowed'
                              )}
                            >
                              {isSel && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div className="pr-5">
                                <span className={cn("font-semibold text-sm block leading-tight", isSel ? "text-black" : "text-stone-800")}>{option.name}</span>
                                {selected === 'sizes' && option.dimensions && <span className="text-[11px] text-stone-400 mt-0.5 block">{option.dimensions}</span>}
                                {option.description && <span className="text-[11px] text-stone-400 line-clamp-2 mt-0.5 block">{option.description}</span>}
                              </div>
                              <div className="mt-2 pt-2 border-t border-dashed border-stone-200">
                                {optionPrice > 0
                                  ? <span className="text-xs font-bold text-stone-700">+£{optionPrice}</span>
                                  : <span className="text-xs font-semibold text-emerald-600">Included</span>
                                }
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── Add to Cart — desktop ──────────────────────── */}
                <div className="hidden md:flex items-center gap-3 pt-2">
                  <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden bg-white">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-stone-50 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-base">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-stone-50 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    variant="hero"
                    className="flex-1 h-12 text-base font-semibold rounded-xl shadow-lg"
                    onClick={handleAddToCart}
                  >
                    Add to Bag · £{(totalPrice * quantity).toLocaleString()}
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="hidden md:flex items-center gap-6 text-xs text-stone-400 pt-1">
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free delivery</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 5-year warranty</span>
                  <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Expert assembly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mobile sticky CTA ──────────────────────────────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <Button
              variant="hero"
              className="flex-1 h-11 text-sm font-semibold rounded-xl"
              onClick={handleAddToCart}
            >
              Add to Bag · £{(totalPrice * quantity).toLocaleString()}
            </Button>
          </div>
        </div>

        <section className="py-6 bg-black border border-border/50 overflow-hidden">

          <div className="luxury-container">
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
              {[

                { src: "/img/icons/1.png", alt: "icon2", title: "Free UK Delivery", className: "w-[90px] h-auto" },
                { src: "/img/icons/2.png", alt: "icon3", title: "Made in the UK", className: "w-[60px] h-auto" },
                { src: "/img/icons/3.png", alt: "icon1", title: "5 Year Warranty", className: "w-[70px] h-auto" }
              ].map((item, index) => (
                <div key={index} className={`flex items-center flex-col justify-center gap-2 border-r-2 border-black ${index === 2 ? 'border-none' : ''}`}>
                  <img src={item.src} alt={item.alt} className={item.className} />
                  <h1 className='text-2xl font-bold text-white'>{item.title}</h1>
                </div>
              ))}
            </div>

            {/* Mobile Infinite Loop */}
            <div className="md:hidden relative w-full overflow-hidden">
              <motion.div
                className="flex w-max gap-10"
                animate={{ x: "-50%" }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {[
                  { src: "/img/icons/1.png", alt: "icon2", title: "Free UK Delivery", className: "w-[90px] h-auto" },
                  { src: "/img/icons/2.png", alt: "icon3", title: "Made in the UK", className: "w-[60px] h-auto" },
                  { src: "/img/icons/3.png", alt: "icon1", title: "5 Year Warranty", className: "w-[70px] h-auto" },
                  { src: "/img/icons/1.png", alt: "icon2", title: "Free UK Delivery", className: "w-[90px] h-auto" },
                  { src: "/img/icons/2.png", alt: "icon3", title: "Made in the UK", className: "w-[60px] h-auto" },
                  { src: "/img/icons/3.png", alt: "icon1", title: "5 Year Warranty", className: "w-[70px] h-auto" }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center flex-col justify-center gap-2 pr-10 border-r-2 border-black ${index === 5 ? 'border-none' : ''}`}>
                    <img src={item.src} alt={item.alt} className={item.className} />
                    <h1 className='text-xl font-bold whitespace-nowrap'>{item.title}</h1>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {
          product.categoryId === 'mattresses' ? <MattressDetails /> :
            product.categoryId === 'beds' ? (
              product.subcategoryId?.includes('ottoman') ? <OttomanBedDetails /> :
                product.subcategoryId?.includes('upholstered') ? <UpholsteredBedDetails /> :
                  <BedDetails />
            ) :
              product.categoryId === 'headboards' ? <HeadBoardDetails /> :
                null
        }

        {/* Related Products */}
        {/* {relatedProducts.length > 0 && (
          <section className="section-padding bg-secondary/30 border-t border-border">
            <div className="luxury-container">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground">
                  You May Also Like
                </h2>
                <Button variant="link" asChild className="text-accent underline-offset-4 hidden sm:inline-flex">
                  <Link to="/beds">View Collection</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )} */}
      </Layout >
    </>
  );
};

export default ProductPage;
