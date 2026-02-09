/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Star, Truck, Shield, Wrench, Minus, Plus, Check, Loader2, BedDouble, BedSingle, Ruler, Weight, Palette, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { products as staticProducts } from '@/data';
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
  }, [uniqueFabrics, selectedColor]);

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
            <Link to="/beds">Browse Products</Link>
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

  return (
    <>
      <Helmet>
        <title>{product.name} | Somne</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <Layout>
        {/* Breadcrumb */}
        <div className="bg-white backdrop-blur-sm md:sticky mt-6 top-[56px] md:top-[72px] z-10">
          <div className="luxury-container">
            <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-sans text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <p className=" text-border flex-shrink-0">/</p>
              <Link to={`/${product.categoryId}/${product.subcategoryId}`} className="hover:text-accent transition-colors capitalize">
                {product.subcategoryId}
              </Link>
              <p className=" text-border flex-shrink-0">/</p>
              <span className="text-foreground font-medium truncate max-w-[150px] md:max-w-none">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className=" pb-10 bg-white min-h-screen">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {/* Images Column */}
              <div className="space-y-4 md:space-y-6">
                <div className="md:hidden flex flex-wrap items-end my-3 gap-1">
                  <h1 className="font-serif text-2xl md:text-5xl font-bold text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <span className="text-sm md:text-xl text-muted-foreground">
                    {selectedColor?.name}
                  </span>
                </div>
                <div className="aspect-square   md:aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl bg-secondary border border-border/50 shadow-sm relative group">
                  {/* Badge */}
                  {/* <div className="absolute top-4 left-0 z-10 bg-[#00C08B] text-white px-4 py-1.5 rounded-r-lg font-bold text-sm md:text-base flex items-center gap-2 shadow-sm">
                    <span className="text-lg">☾</span> 60 Night Risk Free Trial
                  </div> */}

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
                        className="w-full h-full object-cover flex-shrink-0 snap-center transition-transform duration-700"
                      />
                    ))}
                  </div>

                  {/* Mobile Mobile Controls Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
                    {/* Expand Button */}
                    {/* <button className="bg-[#8E2458] text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 pointer-events-auto hover:bg-[#8E2458]/90 transition-colors shadow-lg">
                      <span className="text-lg">⊕</span> Click To Expand
                    </button> */}

                    {/* Dots */}
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2">
                        {galleryImages.map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-300",
                              activeImageIndex === idx ? "bg-primary w-4" : "bg-black/20"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hand Icon Hint (Visual only as per UI) */}
                  <div className="absolute bottom-6 right-6 text-black pointer-events-none hidden md:block opacity-60">
                    {/* Insert Hand SVG or icon here if available, or omit if just keeping it clean. 
                         The screenshot had it, but maybe just standard scroll is enough. 
                         I'll trust the user's intent is effectively met by the carousel. 
                     */}
                  </div>
                </div>

                {galleryImages.length > 1 && (
                  <div className="hidden md:flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                    {galleryImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={cn(
                          'flex-shrink-0 w-24 h-24 overflow-hidden rounded-xl border-2 transition-all duration-300 relative',
                          activeImageIndex === index
                            ? 'border-accent shadow-md  ring-2 ring-accent/20'
                            : 'border-transparent hover:border-border'
                        )}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                {product.categoryId === 'mattresses' || product.categoryId === 'beds' && (
                  <div className='border border-border/90 rounded-xl p-6 shadow-md flex gap-2 justify-between items-center'>
                    <div>
                      <img src="/img/icons/assembly.png" alt="mattress" className='w-14 h-auto' />
                    </div>
                    <h3 className='md:text-xl font-semibold text-sm'>Assembly by trained technicians</h3>
                    <div className='flex flex-col-reverse items-center gap-1'>
                      <Button
                        className={cn(
                          'rounded-full px-6 transition-all duration-300',
                          assemblyAdded ? '' : ''
                        )}
                        variant={"default"}
                        onClick={() => setAssemblyAdded(!assemblyAdded)}
                      >
                        {assemblyAdded ? 'Remove' : 'Add'}
                        <span className={cn('font-semibold text-center', assemblyAdded ? 'hidden' : '')}>£49</span>
                      </Button>
                      {/* <p className=' font-semibold text-center'>£49</p> */}
                    </div>

                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="flex flex-col px-1 md:px-0">
                <div className="border-b border-border pb-2">
                  {product.bestseller && (
                    <span className="inline-flex items-center gap-1 md:gap-1.5 bg-accent/10 text-accent px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold tracking-wider uppercase mb-3 md:mb-4 rounded-full border border-accent/20">
                      <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-accent" /> Bestseller
                    </span>
                  )}
                  <div className="md:flex hidden flex-wrap items-end mb-3 md:mb-4 gap-2">
                    <h1 className="font-serif text-2xl md:text-5xl font-bold text-foreground leading-tight">
                      {product.name}
                    </h1>
                    <span className="text-sm md:text-xl text-muted-foreground">
                      {selectedColor?.name}
                    </span>
                  </div>


                  {/* Price Block */}
                  <div className="flex flex-row items-center justify-between md:justify-start gap-2 md:gap-6">
                    <div className="flex items-baseline gap-2 md:gap-3">
                      <span className="font-serif text-xl md:text-5xl font-bold text-foreground">
                        £{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    {product.discountPercentage > 0 && (() => {
                      // Calculate the full price (without discount) including all add-ons
                      const fullPrice = Number(product.basePrice || 0) +
                        (selectedSize?.priceModifier || 0) +
                        (selectedStorage?.priceModifier || 0) +
                        (selectedHeadboard?.priceModifier || 0) +
                        (assemblyAdded ? 49 : 0) +
                        (selectedBase?.priceModifier || 0) +
                        mattressPrice;

                      // Calculate savings (difference between full price and total discounted price)
                      const savings = fullPrice - totalPrice;

                      return (
                        <div className="flex items-center flex-col">
                          <span className="text-sm inline-block  md:text-xl text-muted-foreground line-through decoration-destructive/50 decoration-2">
                            £{fullPrice.toLocaleString()}
                          </span>

                          <span className="inline-block bg-[#1b2232] text-white px-1 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-bold rounded-full">
                            Save £{savings.toLocaleString()}
                          </span>
                        </div>
                      );
                    })()}
                    <div className="flex items-center flex-col ">
                      <div className="flex items-center gap-1">
                        <div className='w-2 h-2 bg-[#7f285b] rounded-full'></div>
                        <span className=" hidden md:inline-block  text-black py-0.5 md:py-1 text-xs md:text-sm ">
                          <span className='text-[#7f285b] font-bold '>Almost gone! –</span> secure yours now
                        </span>
                        <span className="inline-block md:hidden  text-black py-0.5 md:py-1 text-xs   ">
                          <span className='text-[#7f285b]  '>Only a few left! –</span> don’t miss this
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Section */}
                <div className="flex-1 space-y-2 mt-4">
                  {/* Mobile Color Selection - Screenshot Style */}
                  {availableSections.some(s => s.key === 'colors') && (
                    <div className="md:hidden">
                      {/* <h3 className="font-serif text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                        Colour: <span className="text-muted-foreground font-sans text-sm font-normal">{selectedColor?.name || 'Select'}</span>
                      </h3> */}
                      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                        {(visibleColors.length > 0 ? visibleColors : product.colors).map((option: any) => {
                          const isSelected = selectedColor?.name === option.name;
                          return (
                            <button
                              key={option.name}
                              onClick={() => handleColorSelect(option)}
                              className={cn(
                                "relative flex-shrink-0 w-24 flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200 snap-center bg-background",
                                isSelected
                                  ? "border-accent shadow-md ring-1 ring-accent/20"
                                  : "border-border/50 hover:border-border"
                              )}
                            >
                              {/* Checkmark Badge */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-sm">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}

                              {/* Image Area */}
                              <div className="aspect-[4/3] w-full bg-secondary">
                                {option.image ? (
                                  <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full" style={{ backgroundColor: option.hex }}></div>
                                )}
                              </div>

                              {/* Label */}
                              <div className="p-3 text-center border-t border-border/10">
                                <span className={cn(
                                  "text-xs font-medium leading-tight line-clamp-2",
                                  isSelected ? "text-accent" : "text-muted-foreground"
                                )}>
                                  {option.name}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* <label className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Configure your bed</label> */}
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x md:flex-wrap md:overflow-visible">
                      {availableSections.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setSelected(item.key)}

                          className={cn(
                            'flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full shadow-md border border-border/50  transition-all duration-300 text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0 snap-center',
                            selected === item.key
                              ? 'border-accent bg-accent text-primary scale-105'
                              : ' bg-white  text-black hover:border-accent hover:text-accent',
                            item.key === 'colors' && 'hidden md:flex'
                          )}
                        >
                          <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>


                  {product.categoryId === 'beds' && (
                    <div className='bg-white drop-shadow-md w-full p-6 border border-border/90 rounded-xl flex justify-between items-center gap-2'>

                      <div className={`flex items-center ${selectedUpsellMattress ? 'hidden' : ''}`}>
                        <img src="/img/icons/mattress2.png" alt="mattress" className='w-24 h-auto' />
                      </div>

                      <div className="flex items-center gap-4">
                        {selectedUpsellMattress && (
                          <div className="w-16 h-10 rounded-md overflow-hidden bg-secondary border border-border">
                            <img
                              src={selectedUpsellMattress.images?.[0] || '/placeholder.jpg'}
                              alt={selectedUpsellMattress.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h1 className='md:text-2xl text-md font-bold text-foreground'>
                            {selectedUpsellMattress ? 'Mattress Selected' : 'Add Mattress & Save'}
                          </h1>
                          {selectedUpsellMattress && (
                            <div className="text-sm text-muted-foreground">
                              <p className="font-semibold text-accent line-clamp-1">{selectedUpsellMattress.name}</p>
                              {selectedUpsellFirmness && <span>{selectedUpsellFirmness.name} Firmness</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Dialog open={isMattressModalOpen} onOpenChange={setIsMattressModalOpen}>
                          <DialogTrigger asChild>
                            <div>
                              <Button className='rounded-full' variant={"default"}>
                                {selectedUpsellMattress ? 'Change Mattress' : 'Choose Mattress'}
                              </Button>
                              {selectedUpsellMattress && (
                                <p className="text-sm text-muted-foreground text-center mt-2 underline cursor-pointer" onClick={() => setSelectedUpsellMattress(null)}>Remove</p>
                              )}
                            </div>

                          </DialogTrigger>
                          <DialogContent className="max-w-4xl h-[80vh] bg-white flex flex-col p-0 gap-0 overflow-hidden">
                            <DialogHeader className="px-6 py-4 border-b border-border/50 bg-white backdrop-blur-sm z-10 shrink-0">
                              <DialogTitle className="font-serif text-xl">Select Your Mattress</DialogTitle>
                              <DialogDescription className="sr-only">Choose a mattress to add to your bed order</DialogDescription>
                            </DialogHeader>

                            <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
                              {/* Left Panel: Mattress List */}
                              <div className={`
                            flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin
                            ${selectedUpsellMattress ? 'hidden md:block' : 'block'}`}>
                                {compatibleMattresses.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                    <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                                    <p>No matching mattresses found for {selectedSize?.name} size.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                    {compatibleMattresses.map(mattress => {
                                      // console.log(mattress,"sdsds")
                                      const isSelected = selectedUpsellMattress?.id === mattress.id;
                                      const sizePrice = mattress.sizes.find(s => s.name === selectedSize?.name)?.priceModifier || 0;
                                      const basePrice = mattress.discountPrice || mattress.basePrice || mattress.price || 0;
                                      const displayPrice = basePrice + sizePrice;
                                      const hasFirmness = mattress.firmnessOptions && mattress.firmnessOptions.length > 0;

                                      return (
                                        <div
                                          key={mattress.id}
                                          className={`
                                        group relative border rounded-xl p-3 cursor-pointer flex flex-col justify-between transition-all duration-200
                                        ${isSelected
                                              ? 'border-2 border-primary bg-primary/5 ring-1 ring-primary/20'
                                              : 'border-border hover:border-accent/50 hover:bg-secondary/30'
                                            }
                                      `}
                                          onClick={() => handleMattressSelect(mattress)}
                                        >
                                          {isSelected && (
                                            <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                              <Check className="w-3 h-3" /> Selected
                                            </div>
                                          )}
                                          <div className="aspect-[4/3] bg-secondary rounded-lg mb-3 overflow-hidden">
                                            <img
                                              src={mattress.images?.[0] || '/placeholder.jpg'}
                                              alt={mattress.name}
                                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <h3 className="font-semibold text-sm md:text-base leading-tight line-clamp-2">{mattress.name}</h3>
                                            <div className="flex flex-col gap-2">
                                              <p className="text-accent font-bold text-sm">£{displayPrice.toFixed(2)}</p>

                                              {hasFirmness && (
                                                <div onClick={(e) => e.stopPropagation()}>
                                                  <select
                                                    className="w-full text-xs p-1.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                    value={isSelected && selectedUpsellFirmness ? selectedUpsellFirmness.name : ""}
                                                    onChange={(e) => {
                                                      const firmName = e.target.value;
                                                      const firm = mattress.firmnessOptions?.find(f => f.name === firmName);
                                                      if (firm) {
                                                        setSelectedUpsellMattress(mattress);
                                                        setSelectedUpsellFirmness(firm);
                                                      }
                                                    }}
                                                  >
                                                    <option value="" disabled>Select Firmness</option>
                                                    {mattress.firmnessOptions?.map(firmness => (
                                                      <option key={firmness.name} value={firmness.name}>
                                                        {firmness.name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-3 md:py-4 border-t border-border/50 bg-white backdrop-blur-sm shrink-0 gap-3">
                              {selectedUpsellMattress ? (
                                <div className="text-sm">
                                  Selected: <span className="font-semibold">{selectedUpsellMattress.name}</span>
                                  {selectedUpsellFirmness && <span className="text-muted-foreground"> • {selectedUpsellFirmness.name}</span>}
                                </div>
                              ) : <div></div>}

                              <div className="flex gap-3">
                                <Button variant="ghost" className="rounded-lg" onClick={() => setIsMattressModalOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => setIsMattressModalOpen(false)}
                                  disabled={!selectedUpsellMattress || (selectedUpsellMattress.firmnessOptions && selectedUpsellMattress.firmnessOptions.length > 0 && !selectedUpsellFirmness)}
                                  className="bg-accent text-primary rounded-lg hover:bg-accent/90"
                                >
                                  Confirm Selection
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}


                  {/* Options Grid */}
                  <div className={cn(
                    "bg-white p-2 md:p-4 rounded-xl shadow-md overflow-hidden border border-border/50",
                    selected === 'colors' && "hidden md:block"
                  )}>
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                      <h3 className="font-serif text-base md:text-lg text-foreground capitalize">{selected.replace('Options', '')} Options</h3>
                      <div className="flex items-center gap-3">
                        {selected === 'sizes' && product.categoryId === 'beds' && (
                          <Sheet>
                            <SheetTrigger asChild>
                              <button className="text-xs md:text-sm font-medium text-accent hover:text-accent/80 underline decoration-dashed underline-offset-4 flex items-center gap-1">
                                <Ruler className="w-3 h-3 md:w-4 md:h-4" />
                                View Dimensions
                              </button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                              <SheetHeader className="mb-6">
                                <SheetTitle>Bed Dimensions</SheetTitle>
                                <SheetDescription>
                                  Standard UK bed sizes and measurements.
                                </SheetDescription>
                              </SheetHeader>

                              {(() => {
                                // Helper to get dimensions based on selected size
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
                                    <div className="w-full">
                                      {/* A - Base Height */}
                                      <div className="flex justify-between items-center py-3 border-b border-border">
                                        <span className="text-muted-foreground font-medium w-1/3">A - Base Height</span>
                                        <span className="text-right w-1/3">14 inch</span>
                                        <span className="text-right w-1/3">35.5 cm</span>
                                      </div>
                                      {/* B - Length */}
                                      <div className="flex justify-between items-center py-3 border-b border-border">
                                        <span className="text-muted-foreground font-medium w-1/3">B - Length</span>
                                        <span className="text-right w-1/3">{dims.lenIn} inch</span>
                                        <span className="text-right w-1/3">{dims.lenCm} cm</span>
                                      </div>
                                      {/* C - Width */}
                                      <div className="flex justify-between items-center py-3 border-b border-border">
                                        <span className="text-muted-foreground font-medium w-1/3">C - Width</span>
                                        <span className="text-right w-1/3">{dims.widthIn} inch</span>
                                        <span className="text-right w-1/3">{dims.widthCm} cm</span>
                                      </div>
                                      {/* D - Height */}
                                      <div className="flex justify-between items-center py-3 border-b border-border">
                                        <span className="text-muted-foreground font-medium w-1/3">D - Height</span>
                                        <span className="text-right w-1/3">50 inch</span>
                                        <span className="text-right w-1/3">127 cm</span>
                                      </div>
                                    </div>

                                    <div className="flex justify-center py-4">
                                      <div className="relative w-full aspect-video bg-secondary/20 rounded-lg flex items-center justify-center border border-border/50">
                                        {/* Placeholder for the diagram if image fails */}
                                        <img
                                          src="/img/image.png"
                                          alt="Bed Dimensions Diagram"
                                          className="max-w-full max-h-full object-contain mix-blend-multiply"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerText = 'Diagram Placeholder';
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              <div className="bg-secondary/50 p-4 rounded-lg text-sm text-muted-foreground space-y-2">
                                <p className="font-medium text-foreground">Note on Dimensions:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                  <li>Please allow for a tolerance of +/- 2cm (1 inch).</li>
                                  <li>Base heights typically range from 14-16 inches depending on feet/castors.</li>
                                  <li>Headboard heights vary by design (typically 26" struts or 54" floor standing).</li>
                                </ul>
                              </div>
                              {/* </div> */}
                            </SheetContent>
                          </Sheet>
                        )}
                        <span className="text-[10px] md:text-xs text-muted-foreground">{product[selected as keyof typeof product]?.length || 0} available</span>
                      </div>
                    </div>

                    <div className={cn(
                      "flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x md:grid gap-3 md:gap-2 md:overflow-y-auto md:overflow-x-visible md:mx-0 md:px-0 md:max-h-[300px] md:pr-2 md:scrollbar-thin md:scrollbar-thumb-accent/20 md:scrollbar-track-transparent",
                      selected === 'colors' ? "md:grid-cols-4 lg:grid-cols-5" : "md:grid-cols-3"
                    )}>
                      {/* Fabric Selection UI */}
                      {selected === 'colors' && uniqueFabrics.length > 0 && (
                        <div className="col-span-full mb-2 w-full flex-shrink-0">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                            Select Material
                          </label>
                          <div className="flex gap-2 text-sm  overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
                            {uniqueFabrics.map((fabric) => (
                              <button
                                key={fabric}
                                onClick={() => setSelectedFabric(fabric)}
                                className={cn(
                                  "px-4 py-2  rounded-lg border text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0",
                                  selectedFabric === fabric
                                    ? "border-accent bg-accent/10 text-accent font-medium shadow-sm"
                                    : "border-border bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground"
                                )}
                              >
                                {fabric}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {(selected === 'colors' ? visibleColors : (selected === 'sizes' ? (product.sizes || []).sort((a: any, b: any) => {
                        const order = ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen'];
                        return order.indexOf(a.name) - order.indexOf(b.name);
                      }) : (product[selected as keyof typeof product] as any[] || []))).map((option: any) => {
                        const isSelected =
                          selected === 'colors' ? selectedColor?.name === option.name :
                            selected === 'sizes' ? selectedSize?.name === option.name :
                              selected === 'storageOptions' ? selectedStorage?.name === option.name :
                                selected === 'headboardOptions' ? selectedHeadboard?.name === option.name :
                                  selected === 'baseOptions' ? selectedBase?.name === option.name :
                                    selected === 'firmnessOptions' ? selectedFirmness?.name === option.name : false;

                        const handleSelect = () => {
                          if (selected === 'colors') handleColorSelect(option);
                          else if (selected === 'sizes') setSelectedSize(option);
                          else if (selected === 'storageOptions') setSelectedStorage(option);
                          else if (selected === 'headboardOptions') setSelectedHeadboard(option);
                          else if (selected === 'baseOptions') setSelectedBase(option);
                          else if (selected === 'firmnessOptions') setSelectedFirmness(option);
                        };

                        if (selected === 'colors') {
                          return (
                            <button
                              key={option.name}
                              onClick={handleSelect}
                              className={cn(
                                'group relative flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg w-28 flex-shrink-0 snap-center bg-white md:w-full md:flex-shrink',
                                isSelected ? 'border-accent ring-2 ring-accent/20 z-10' : 'border-border/50 hover:border-accent/50'
                              )}
                              title={option.name}
                            >
                              {/* Image Container - Fixed aspect ratio */}
                              <div className="aspect-[4/3] w-full overflow-hidden">
                                {option.image ? (
                                  <img src={option.image} alt={option.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                  <div className="w-full h-full" style={{ backgroundColor: option.hex }}></div>
                                )}
                              </div>

                              {/* Selected Checkmark */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center shadow-sm">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}

                              {/* Label Below Image */}
                              <div className={cn(
                                "px-2 py-2.5 text-center border-t",
                                isSelected ? "bg-accent/5 border-accent/20" : "bg-white border-border/30"
                              )}>
                                <span className={cn(
                                  "text-[11px] font-medium leading-tight line-clamp-2",
                                  isSelected ? "text-accent" : "text-foreground"
                                )}>
                                  {option.name}
                                </span>
                              </div>
                            </button>
                          )
                        }

                        return (
                          <button
                            key={option.name}
                            onClick={handleSelect}
                            disabled={option.inStock === false}
                            className={cn(
                              'group relative border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between flex-shrink-0 snap-center overflow-hidden',
                              selected === 'firmnessOptions'
                                ? 'p-3 h-[70px] w-32 md:h-auto md:min-h-[60px] md:w-auto'
                                : selected === 'sizes'
                                  ? 'p-4 h-[110px] w-40 md:h-auto md:min-h-[100px] md:w-auto'
                                  : 'p-4 h-[100px] w-44 md:h-auto md:min-h-[100px] md:w-auto',
                              isSelected
                                ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10 ring-2 ring-accent/30'
                                : 'border-border/70 bg-white hover:border-accent/60 hover:bg-accent/5 hover:shadow-md',
                              option.inStock === false && 'opacity-50 cursor-not-allowed grayscale'
                            )}
                          >
                            {/* Selected indicator */}
                            {isSelected && (
                              <div className="absolute top-0 right-0 w-8 h-8 bg-accent rounded-bl-xl flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1 pr-6">
                                <span className={cn(
                                  "font-semibold text-sm  block max-w-[140px]",
                                  isSelected ? "text-accent" : "text-foreground group-hover:text-accent"
                                )}>
                                  {option.name}
                                </span>
                              </div>

                              {selected === 'sizes' && option.dimensions && (
                                <span className="text-[11px] text-muted-foreground block mb-1 font-medium">{option.dimensions}</span>
                              )}

                              {option.description && (
                                <span className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{option.description}</span>
                              )}
                            </div>

                            {/* Price modifier with improved styling */}
                            {(() => {
                              const optionPrice = selected === 'headboardOptions'
                                ? getHeadboardPrice(option, selectedSize?.name)
                                : option.priceModifier;

                              return optionPrice > 0 ? (
                                <div className="mt-2 pt-2 border-t border-dashed border-border/50 flex justify-between items-center">
                                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Extra</span>
                                  <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                    +£{optionPrice}
                                  </span>
                                </div>
                              ) : (
                                <div className="mt-2 pt-2 border-t border-dashed border-border/50">
                                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    Included
                                  </span>
                                </div>
                              );
                            })()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity & Add to Cart - Fixed on mobile */}
                  <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 z-20 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:pt-8 md:mt-auto md:p-0">
                    <div className="flex flex-row justify-center items-center gap-3 md:gap-4 max-w-lg mx-auto md:max-w-none">
                      <div className="flex items-center border-2 border-border rounded-lg h-12 md:h-14 shrink-0 overflow-hidden bg-white">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 md:w-14 h-full flex items-center justify-center hover:bg-secondary hover:text-accent transition-colors active:bg-secondary/80">
                          <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <span className="w-8 md:w-12 text-center font-serif text-base md:text-lg font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-12 md:w-14 h-full flex items-center justify-center hover:bg-secondary hover:text-accent transition-colors active:bg-secondary/80"
                        >
                          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>

                      <Button
                        variant="hero"
                        size="xl"
                        className="flex-1 h-12 md:h-14 text-sm md:text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.99]"
                        onClick={handleAddToCart}
                      >
                        Add to Bag - £{(totalPrice * quantity).toLocaleString()}
                      </Button>
                    </div>
                  </div>
                  {/* Spacer for fixed bottom bar on mobile */}
                  {/* <div className="h-20 md:hidden" /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-6 md:py-10 bg-secondary/50 border border-border/50 overflow-hidden">
          <div className="luxury-container">
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
              {[

                { src: "/img/icons/icon4.png", alt: "icon2", title: "Free UK Delivery", className: "w-24 h-auto" },
                { src: "/img/icons/uk2.png", alt: "icon3", title: "Made in the UK", className: "w-20 h-auto" },
                { src: "/img/icons/icon5.png", alt: "icon1", title: "5 Year Warranty", className: "w-24 h-auto" }
              ].map((item, index) => (
                <div key={index} className={`flex items-center justify-center gap-2 border-r-2 border-black ${index === 2 ? 'border-none' : ''}`}>
                  <img src={item.src} alt={item.alt} className={item.className} />
                  <h1 className='text-2xl font-bold'>{item.title}</h1>
                </div>
              ))}
            </div>

            {/* Mobile Infinite Loop */}
            <div className="md:hidden relative w-full overflow-hidden">
              <motion.div
                className="flex w-max gap-4"
                animate={{ x: "-50%" }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {[
                  { src: "/img/icons/icon4.png", alt: "icon2", title: "Free UK Delivery", className: "w-24 h-auto" },
                  { src: "/img/icons/uk2.png", alt: "icon3", title: "Made in the UK", className: "w-20 h-auto" },
                  { src: "/img/icons/icon5.png", alt: "icon1", title: "5 Year Warranty", className: "w-24 h-auto" },
                  { src: "/img/icons/icon4.png", alt: "icon2", title: "Free UK Delivery", className: "w-24 h-auto" },
                  { src: "/img/icons/uk2.png", alt: "icon3", title: "Made in the UK", className: "w-20 h-auto" },
                  { src: "/img/icons/icon5.png", alt: "icon1", title: "5 Year Warranty", className: "w-24 h-auto" }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-center gap-2 pr-4 border-r-2 border-black ${index === 5 ? 'border-none' : ''}`}>
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
