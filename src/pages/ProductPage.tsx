/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Star, Truck, Shield, Wrench, Minus, Plus, Check,
  Loader2, Ruler, ChevronLeft, ChevronRight, Sparkles,
  Moon, Archive, BedDouble, Maximize, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { USPStrip } from '@/components/home/USPStrip';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ProductSize, ProductColor, StorageOption } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getProductBySlug, getMattresses } from '@/api/api';
import { BedDetails, OttomanBedDetails, UpholsteredBedDetails } from '@/components/BedDetails/BedDetails';
import { MattressDetails } from '@/components/BedDetails/MattressDetails';
import { HeadBoardDetails } from '@/components/BedDetails/HeadBoard';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Product } from '@/types';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { ComingSoon } from '@/components/ui/coming-soon';
import { shouldShowOttomanComingSoon } from '@/lib/ottomanAvailability';

// ─── Cylinder Tile ─────────────────────────────────────────────────────────────
const CylinderTile = ({ label, subtitle, price, isSelected, isIncluded, onClick, disabled, icon }: {
  label: string; subtitle?: string; price?: number | string; isSelected: boolean;
  isIncluded?: boolean; onClick: () => void; disabled?: boolean; icon?: React.ReactNode;
}) => (
  <button onClick={onClick} disabled={disabled}
    className={cn(
      'relative flex flex-col items-center justify-between p-3 transition-all duration-300 flex-shrink-0',
      'w-[86px] h-[166px]',
      isSelected
        ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[42px] scale-105 z-10'
        : 'bg-stone-100 hover:bg-stone-200 rounded-[42px] z-0',
      disabled && 'opacity-40 cursor-not-allowed hidden',
    )}
  >
    {isSelected && (
      <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1 z-10 shadow-sm border-[2.5px] border-white">
        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
      </div>
    )}
    <div className="mt-1 flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-sm flex-shrink-0 text-stone-200">
      {icon ?? <div className="w-8 h-8 rounded-full bg-stone-200" />}
    </div>
    <div className="w-full mt-auto mb-1.5 flex flex-col items-center">
      <div className="text-[11px] font-medium text-stone-400 mb-0.5 h-4 flex items-center justify-center">
        {isIncluded || !price || price === 0 || price === 'Included' || price === 'Free'
          ? 'Free'
          : typeof price === 'number' ? `+£${price}` : price}
      </div>
      <div className="text-[11px] font-bold text-stone-100 leading-tight text-center w-full px-1 h-7 flex items-center justify-center">
        <span className="line-clamp-2">{label}</span>
      </div>
      {subtitle && (
        <div className="text-[8.5px] font-normal text-stone-400 mt-0.5 text-center w-full px-0.5 whitespace-nowrap overflow-hidden text-ellipsis h-3">
          {subtitle}
        </div>
      )}
    </div>
  </button>
);

// ─── Colour Swatch dot ────────────────────────────────────────────────────────
const ColourSwatch = ({ color, isSelected, onClick }: { color: ProductColor; isSelected: boolean; onClick: () => void }) => {
  const getDisplayName = (name: string) => {
    let dName = name.replace(/\s*plush\s*/i, '').trim();
    if (dName.toLowerCase() === 'cream') return 'Beige';
    if (dName.toLowerCase() === 'emerald') return 'Green';
    return dName;
  };

  return (
    <button onClick={onClick} title={color.name}
      className={cn(
        'relative flex flex-col transition-all duration-200 flex-shrink-0 w-22 rounded overflow-hidden border',
        isSelected
          ? 'border-black bg-[#021526] shadow-md ring-1 ring-black/50 scale-105'
          : 'border-white/20 bg-white text-black hover:border-black hover:shadow-sm'
      )}
    >
      <div className="w-full h-[90px] bg-stone-100">
        {color.image
          ? <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ backgroundColor: color.hex || '#d4c4b0' }} />}
      </div>
      <div className="w-full py-2.5 px-2 flex items-center justify-center min-h-[44px]">
        <span className={cn(
          "text-[13px] text-center leading-tight",
          isSelected ? "text-white font-medium" : "text-black font-normal"
        )}>
          {getDisplayName(color.name)}
        </span>
      </div>
    </button>
  );
};

// ─── Section icon tab ─────────────────────────────────────────────────────────
const AccBtn = ({ icon, label, isSelected, onClick }: { icon: React.ReactNode; label: string; isSelected: boolean; onClick: () => void }) => (
  <div className='text-center'>
    <button onClick={onClick} title={label}
      className={cn(
        'w-20 h-14 rounded flex items-center justify-center border-1 transition-all duration-200 relative',
        isSelected ? 'border-l-red-500 border-l-4 bg-gray-200 shadow-lg' : 'bg-white hover:border-stone-300',
      )}
    >
      {icon}
    </button>
    <span className="text-[9px] uppercase text-center font-bold tracking-wider text-stone-400 truncate w-full px-1">{label}</span>
  </div>


);

const sizeDisplayNames: Record<string, string> = {
  'Small Single': '2FT6 Small Single',
  Single: '3FT Single',
  'Small Double': '4FT Small Double',
  Double: '4FT6 Double',
  King: '5FT Kingsize',
  Queen: '6FT Queensize',
  'Super King': '6FT Super Kingsize',
};

const getSizeDisplayName = (size: ProductSize) => sizeDisplayNames[size.name] || size.name;

const getPriceLabel = (price?: number | string, isIncluded?: boolean) => {
  if (isIncluded || !price || price === 0 || price === 'Included' || price === 'Free') return 'Included';
  return typeof price === 'number' ? `+£${price}` : price;
};

const OptionBox = ({
  label,
  detail,
  price,
  isSelected,
  isIncluded,
  onClick,
  disabled,
}: {
  label: string;
  detail?: string;
  price?: number | string;
  isSelected: boolean;
  isIncluded?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'relative min-h-[64px] rounded-xl border px-3 py-3 text-center transition-all duration-200 backdrop-blur-md',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2',
      isSelected 
        ? 'border-stone-900 bg-[#021526] shadow-md ring-1 ring-stone-900 scale-[1.02]' 
        : 'border-white/60 bg-white/40 shadow-sm hover:bg-white/60 hover:border-white/80 hover:shadow-md hover:scale-[1.02]',
      disabled && 'cursor-not-allowed opacity-45 hover:border-white/60 hover:bg-white/40 hover:shadow-sm hover:scale-100',
    )}
  >
    <span className={`block text-[15px] font-bold leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>{label}</span>
    {(detail || price !== undefined || isIncluded) && (
      <span className={`mt-1 block text-[11px] font-medium leading-tight ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
        {[detail, getPriceLabel(price, isIncluded)].filter(Boolean).join(' · ')}
      </span>
    )}
  </button>
);

const OptionDropdown = ({
  icon,
  label,
  summary,
  isOpen,
  onToggle,
  children,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  summary?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-stone-50"
      aria-expanded={isOpen}
    >
      <span className={cn(
        'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
        isOpen ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'
      )}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          {label}
        </span>
        {summary && (
          <span className="mt-1 block truncate text-sm font-bold text-stone-900">
            {summary}
          </span>
        )}
      </span>
      {action && (
        <span onClick={(event) => event.stopPropagation()} className="flex-shrink-0">
          {action}
        </span>
      )}
      <ChevronRight className={cn('h-5 w-5 flex-shrink-0 text-stone-400 transition-transform', isOpen && 'rotate-90 text-stone-900')} />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="border-t border-stone-100 px-4 pb-4 pt-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const mattressDialogClassName =
  '!bottom-2 !left-2 !right-2 !top-auto flex h-[88svh] w-auto !translate-x-0 !translate-y-0 flex-col gap-0 overflow-hidden rounded-3xl bg-white p-0 sm:!bottom-auto sm:!left-[50%] sm:!right-auto sm:!top-[50%] sm:h-[80vh] sm:w-full sm:max-w-4xl sm:!translate-x-[-50%] sm:!translate-y-[-50%] sm:rounded-2xl';

const ProductPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const variantParam = searchParams.get('variant');
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // selections
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [selectedHeadboard, setSelectedHeadboard] = useState<StorageOption | null>(null);
  const [selectedBase, setSelectedBase] = useState<StorageOption | null>(null);
  const [selectedFirmness, setSelectedFirmness] = useState<StorageOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  const [activeAcc, setActiveAcc] = useState('size');

  // mattress
  const [mattresses, setMattresses] = useState<Product[]>([]);
  const [isMattressModalOpen, setIsMattressModalOpen] = useState(false);
  const [selectedUpsellMattress, setSelectedUpsellMattress] = useState<Product | null>(null);
  const [selectedUpsellFirmness, setSelectedUpsellFirmness] = useState<StorageOption | null>(null);
  const [assemblyAdded, setAssemblyAdded] = useState(false);

  // gallery
  const [heroImage, setHeroImage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // ── derived ──
  const enabledColors = useMemo(() => {
    if (!product?.colors) return [];
    return product.colors.filter((c: ProductColor) => !c.disabled);
  }, [product]);

  const uniqueFabrics = useMemo(() => {
    if (!enabledColors.length) return [];
    return Array.from(new Set(enabledColors.map((c: ProductColor) => c.fabric).filter(Boolean))) as string[];
  }, [enabledColors]);

  const visibleColors = useMemo(() => {
    if (!enabledColors.length) return [];
    if (uniqueFabrics.length === 0) return enabledColors;
    return enabledColors.filter((c: ProductColor) => c.fabric === selectedFabric);
  }, [enabledColors, uniqueFabrics, selectedFabric]);

  const galleryImages = useMemo(() => {
    if (!selectedColor) return product?.images || [];
    const v = [...(selectedColor.image ? [selectedColor.image] : []), ...(selectedColor.productImages || [])];
    return v.length > 0 ? Array.from(new Set(v)) as string[] : product?.images || [];
  }, [selectedColor, product]);
  const disabledColorImages = useMemo(() => {
    if (!product?.colors?.length) return [];
    return product.colors
      .filter((c: ProductColor) => c.disabled)
      .flatMap((c: ProductColor) => [
        ...(c.image ? [c.image] : []),
        ...(c.productImages || [])
      ]);
  }, [product]);

  // sync hero when colour changes
  useEffect(() => {
    if (galleryImages.length > 0) { setHeroImage(galleryImages[0]); setActiveImageIndex(0); }
  }, [selectedColor, product]);

  const showGalleryImage = (index: number) => {
    if (galleryImages.length === 0) return;
    const nextIndex = (index + galleryImages.length) % galleryImages.length;
    setActiveImageIndex(nextIndex);
    setHeroImage(galleryImages[nextIndex]);
  };

  const stepGalleryImage = (direction: -1 | 1) => {
    showGalleryImage(activeImageIndex + direction);
  };

  // ── colour change handler: updates both selectedColor & carousel index ──
  const handleColorChange = (newColor: ProductColor) => {
    if (!newColor || newColor.name === selectedColor?.name) return;
    const idx = visibleColors.findIndex((c: ProductColor) => c.name === newColor.name);
    if (idx !== -1) setActiveColorIndex(idx);
    setSelectedColor(newColor);
  };

  // ── data fetching ──
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await getProductBySlug(slug);

        setProduct(data);
        if (data.sizes?.length > 0) {
          const order = ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen'];
          setSelectedSize([...data.sizes].sort((a: any, b: any) => order.indexOf(a.name) - order.indexOf(b.name))[0]);
        }
        const enabledDataColors = data.colors?.filter((c: ProductColor) => !c.disabled) || [];
        if (enabledDataColors.length > 0) {
          let c = enabledDataColors.find((c: ProductColor) => c.isDefault) || enabledDataColors[0];
          if (variantParam) { const m = enabledDataColors.find((c: ProductColor) => c.name.toLowerCase() === variantParam.toLowerCase()); if (m) c = m; }
          setSelectedColor(c);
          setActiveColorIndex(enabledDataColors.indexOf(c) || 0);
        }
        if (data.storageOptions?.length > 0) {
          const nd = data.storageOptions.find((s: any) => s.name.toLowerCase().includes('no drawer') || s.name.toLowerCase() === 'none');
          const fr = data.storageOptions.find((s: any) => !s.priceModifier || s.priceModifier === 0);
          setSelectedStorage(nd || fr || data.storageOptions[0]);
        }
        if (data.headboardOptions?.length > 0) { const fr = data.headboardOptions.find((h: any) => !h.priceModifier || h.priceModifier === 0); setSelectedHeadboard(fr || data.headboardOptions[0]); }
        if (data.baseOptions?.length > 0) { const fr = data.baseOptions.find((b: any) => !b.priceModifier || b.priceModifier === 0); setSelectedBase(fr || data.baseOptions[0]); }
        if (data.firmnessOptions?.length > 0) setSelectedFirmness(data.firmnessOptions[0]);
        if (data.coverImage || data.images?.length > 0) setHeroImage(data.coverImage || data.images[0]);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [slug, variantParam]);

  useEffect(() => { getMattresses().then(setMattresses).catch(console.error); }, []);

  useEffect(() => {
    if (!slug || mattresses.length === 0) return;
    try {
      const s = sessionStorage.getItem(`product_state_${slug}`);
      if (s) {
        const p = JSON.parse(s);
        if (typeof p.assemblyAdded === 'boolean') setAssemblyAdded(p.assemblyAdded);
        if (p.upsellMattressId) {
          const m = mattresses.find(x => x.id === p.upsellMattressId);
          if (m) { setSelectedUpsellMattress(m); if (p.upsellFirmnessName) { const f = m.firmnessOptions?.find((o: any) => o.name === p.upsellFirmnessName); if (f) setSelectedUpsellFirmness(f); } }
        }
      }
    } catch (e) { console.error(e); }
  }, [slug, mattresses]);

  useEffect(() => {
    if (!slug) return;
    sessionStorage.setItem(`product_state_${slug}`, JSON.stringify({ assemblyAdded, upsellMattressId: selectedUpsellMattress?.id, upsellFirmnessName: selectedUpsellFirmness?.name }));
  }, [slug, assemblyAdded, selectedUpsellMattress, selectedUpsellFirmness]);

  useEffect(() => { if (uniqueFabrics.length > 0 && !selectedFabric) setSelectedFabric(selectedColor?.fabric || uniqueFabrics[0]); }, [uniqueFabrics]);
  useEffect(() => {
    if (!selectedFabric || !enabledColors.length) return;
    const cols = enabledColors.filter((c: ProductColor) => c.fabric === selectedFabric);
    if (!cols.some((c: ProductColor) => c.name === selectedColor?.name) && cols.length > 0) { setSelectedColor(cols[0]); setActiveColorIndex(0); }
  }, [selectedFabric, enabledColors]);

  // keep activeColorIndex in sync when visibleColors changes
  useEffect(() => {
    if (!selectedColor || visibleColors.length === 0) return;
    const idx = visibleColors.findIndex((c: ProductColor) => c.name === selectedColor.name);
    if (idx !== -1 && idx !== activeColorIndex) setActiveColorIndex(idx);
  }, [visibleColors]);

  const compatibleMattresses = useMemo(() => {
    if (!selectedSize || !mattresses.length) return [];
    return mattresses.filter(m => m.sizes.some(s => s.name === selectedSize.name));
  }, [selectedSize, mattresses]);

  const mattressPrice = useMemo(() => {
    if (!selectedUpsellMattress || !selectedSize) return 0;
    const sp = selectedUpsellMattress.sizes.find(s => s.name === selectedSize.name)?.priceModifier || 0;
    return (selectedUpsellMattress.discountPrice || selectedUpsellMattress.basePrice || selectedUpsellMattress.price || 0) + sp;
  }, [selectedUpsellMattress, selectedSize]);

  const getHeadboardPrice = (h: any, sn: string | undefined) => {
    if (!h || !sn) return h?.priceModifier || 0;
    const map: Record<string, string> = { 'Small Single': '2FT6', 'Single': '3FT', 'Small Double': '4FT', 'Double': '4FT6', 'King': '5FT', 'Queen': '6FT', 'Super King': '6FT' };
    const k = map[sn]; if (h.priceBySize && k && h.priceBySize[k] !== undefined) return h.priceBySize[k]; return h.priceModifier || 0;
  };

  const totalPrice = Number(product?.discountPrice || product?.price || 0)
    + (selectedSize?.priceModifier || 0) + (selectedStorage?.priceModifier || 0)
    + getHeadboardPrice(selectedHeadboard, selectedSize?.name)
    + (assemblyAdded ? 49 : 0) + (selectedBase?.priceModifier || 0)
    + (selectedFirmness?.priceModifier || 0) + mattressPrice;

  const handleAddToCart = () => {
    if (!product) return;
    if (!product.sizes?.length || selectedSize) {
      addItem(product, quantity, selectedSize || undefined, selectedColor || undefined, selectedStorage || undefined, selectedHeadboard || undefined, selectedBase || undefined, selectedFirmness || undefined, assemblyAdded);
      toast.success(`${product.name} added to bag`);
    }
    if (selectedUpsellMattress && selectedSize) {
      const ms = selectedUpsellMattress.sizes.find(s => s.name === selectedSize.name);
      if (ms) { addItem(selectedUpsellMattress, quantity, ms, undefined, undefined, undefined, undefined, selectedUpsellFirmness || undefined); toast.success(`${selectedUpsellMattress.name} added to bag`); }
    }
  };
  // console.log("product.subcategoryId", product.subcategoryId);
  const accSections = useMemo(() => {
    if (!product) return [];
    const s = [];
    if (product.sizes?.length > 0) s.push({ key: 'size', label: 'Size', icon: <Ruler className="w-5 h-5 text-stone-200" /> });
    if (product.firmnessOptions?.length > 0) s.push({ key: 'firmness', label: 'Firmness', icon: <Moon className="w-5 h-5 text-stone-200" /> });
    if (product.storageOptions?.length > 0) s.push({ key: 'storage', label: 'Storage', icon: <Archive className="w-5 h-5 text-stone-200" /> });
    if (product.headboardOptions?.length > 0) s.push({ key: 'headboard', label: 'Headboard', icon: <BedDouble className="w-5 h-5 text-stone-200" /> });
    if (product.baseOptions?.length > 0) s.push({ key: 'base', label: 'Base', icon: <Wrench className="w-5 h-5 text-stone-200" /> });
    return s;
  }, [product]);

  // ── guards ──
  if (loading) return (
    <Layout>
      <div className="min-h-screen bg-[#f4f3f0] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    </Layout>
  );

  if (!product) return (
    <Layout>
      <div className="min-h-screen bg-[#f4f3f0] flex items-center justify-center">
        <h1 className="font-serif text-3xl text-stone-100 mb-4">Product Not Found</h1>
      </div>
    </Layout>
  );

  const productSubcategory = product.subcategoryId || product.subcategory;
  const isComingSoonProduct = shouldShowOttomanComingSoon(productSubcategory);

  if (isComingSoonProduct) return (
    <>
      <Helmet>
        <title>{`${product.name} - Coming Soon | Somne`}</title>
        <meta
          name="description"
          content={`${product.name} is coming soon to Somne. Explore our currently available bed collection.`}
        />
      </Helmet>
      <Layout>
        <ComingSoon
          title={`${product.name} is coming soon`}
          description="This Ottoman design is currently being prepared for launch. Discover our available beds while we add the final details."
        />
      </Layout>
    </>
  );

  const canonicalUrl = `${window.location.origin}/product/${encodeURIComponent(product.slug || product.name)}`;
  const productImage = product.coverImage && !disabledColorImages.includes(product.coverImage)
    ? product.coverImage
    : galleryImages[0] || product.images?.[0] || '/img/logo.png';
  const productImageUrl = productImage?.startsWith('http') ? productImage : `${window.location.origin}${productImage}`;
  const currentGalleryImage = heroImage || galleryImages[activeImageIndex] || galleryImages[0] || product.coverImage || product.images?.[0] || '/placeholder.jpg';
  console.log("product.subcategoryId", product.subcategoryId);
  return (
    <>
      <Helmet>
        <title>{product.name} | Somne</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="product" /><meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${product.name} | Somne`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={productImageUrl} />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org/', '@type': 'Product', name: product.name, image: productImageUrl, description: product.description, sku: product.id, brand: { '@type': 'Brand', name: 'Somne' }, offers: { '@type': 'Offer', url: canonicalUrl, priceCurrency: 'GBP', price: product.discountPrice || product.price, availability: 'https://schema.org/InStock' } })}</script>
      </Helmet>

      <Layout>
        {/* Breadcrumb */}
        <div className="bg-white border-b border-white/10 top-[56px] md:top-[72px] z-10">
          <div className="luxury-container">
            <nav className="flex items-center gap-2 py-3 text-xs text-stone-400 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <Link to="/" className="hover:text-stone-200 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/${product.categoryId}/${product.subcategoryId}`} className={cn('hover:text-stone-200 transition-colors capitalize', product.categoryId === 'panels' && 'hidden')}>{product.subcategoryId}</Link>
              <ChevronRight className={cn('w-3 h-3', product.categoryId === 'panels' && 'hidden')} />
              <span className="text-stone-200 font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ══ MAIN TWO-COLUMN LAYOUT ══ */}
        <section className="min-h-[calc(100vh-120px)] bg-[#edede9] pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
          <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:min-h-[calc(100vh-120px)] lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px]">

              {/* ══ LEFT: Title + 3-D Carousel + Price ══ */}
              <div className="relative z-0 flex flex-col justify-between pt-3 pb-4 lg:sticky lg:top-[88px] lg:self-start lg:py-8 lg:pr-8">

                {/* Title */}
                <div className="mb-2 lg:mb-0">

                  <div className='flex  items-end gap-4'>
                    <h1 className="font-serif text-[2rem] leading-none tracking-normal text-stone-900 sm:text-4xl md:text-5xl">
                      {product.name}
                    </h1>
                    <div className='flex flex-col gap-2 text-center'>
                      {product.bestseller && (
                        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Best Seller
                        </div>
                      )}
                      {selectedColor?.name && (
                        <motion.p
                          key={selectedColor.name}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-stone-400  font-medium"
                        >
                          {selectedColor.name}{selectedFabric ? ` · ${selectedFabric}` : ''}
                        </motion.p>
                      )}
                    </div>

                  </div>
                  <div className="hidden lg:flex items-baseline gap-2 mb-2">
                    <motion.span
                      key={totalPrice}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-serif text-5xl text-stone-900"
                    >
                      £{totalPrice.toLocaleString()}
                    </motion.span>
                    {product.discountPercentage > 0 && (
                      <span className="text-lg text-stone-600 line-through font-light">
                        £{(Number(product.basePrice || 0) + (selectedSize?.priceModifier || 0)).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Mobile Price under Title */}
                  <div className="mt-3 flex items-baseline gap-2 lg:hidden">
                    <motion.span
                      key={totalPrice}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-serif text-3xl text-stone-900 sm:text-4xl"
                    >
                      £{totalPrice.toLocaleString()}
                    </motion.span>
                    {product.discountPercentage > 0 && (
                      <span className="text-base text-stone-400 line-through font-light">
                        £{(Number(product.basePrice || 0) + (selectedSize?.priceModifier || 0)).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product image gallery */}
                  <div className="relative flex flex-col items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="relative block w-full max-w-[640px] overflow-hidden rounded-2xl bg-stone-100 aspect-[4/3] cursor-zoom-in group lg:max-w-[600px] xl:max-w-[640px]">
                          <img
                            src={currentGalleryImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[92vw] h-[92vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center [&>button]:text-white [&>button]:bg-black/30 [&>button]:rounded-full [&>button]:p-2 [&>button]:top-4 [&>button]:right-4">
                        <DialogTitle className="sr-only">{product.name} - full view</DialogTitle>
                        <DialogDescription className="sr-only">Fullscreen product image</DialogDescription>
                        <img src={currentGalleryImage} alt={product.name} className="max-w-full max-h-full object-contain rounded-2xl" />
                      </DialogContent>
                    </Dialog>

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => stepGalleryImage(-1)}
                          className="absolute left-2 top-[calc(50%-1.5rem)] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md transition hover:bg-white md:left-4"
                          aria-label="Previous product image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepGalleryImage(1)}
                          className="absolute right-2 top-[calc(50%-1.5rem)] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md transition hover:bg-white md:right-4"
                          aria-label="Next product image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 mt-6 z-10 max-w-full overflow-x-auto pb-1 scrollbar-hide">
                        {galleryImages.map((img, i) => (
                          <button
                            key={`${img}-${i}`}
                            type="button"
                            onClick={() => showGalleryImage(i)}
                            className={cn(
                              'w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0',
                              activeImageIndex === i
                                ? 'border-stone-900 scale-105 shadow-md'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-stone-300',
                            )}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                {/* Desktop price + CTA */}
                <div className="hidden lg:flex items-center justify-between mt-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={totalPrice}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="font-serif text-5xl text-stone-900"
                      >
                        £{totalPrice.toLocaleString()}
                      </motion.span>
                      {product.discountPercentage > 0 && (
                        <span className="text-lg text-stone-400 line-through font-light">
                          £{(Number(product.basePrice || 0) + (selectedSize?.priceModifier || 0)).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden bg-white">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-700"><Minus className="w-4 h-4" /></button>
                      <span className="w-10 text-center font-bold text-stone-900 text-sm">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-700"><Plus className="w-4 h-4" /></button>
                    </div>
                    <Button onClick={handleAddToCart} className="h-11 px-6 rounded-xl bg-[#021526] text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-[0.98] border-0">
                      Add to bag
                    </Button>
                  </div>
                </div>
              </div>

              {/* ══ RIGHT: Config panel ══ */}
              <div className="flex flex-col border-stone-100 lg:min-h-full lg:border-l ">
                <div className="-mx-4 flex flex-col gap-5 rounded-t-[28px] px-4 pb-6 pt-5 shadow-[0_-12px_30px_rgba(0,0,0,0.05)] md:mx-0 md:rounded-2xl md:px-5 lg:rounded-none lg:bg-transparent lg:p-8 lg:shadow-none min-h-full">

                  {/* Price (right panel, hidden on mobile since it's now under the title) */}
                  {/* <div className="hidden lg:flex items-baseline gap-2">
                    <motion.span
                      key={totalPrice}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-serif text-5xl text-white"
                    >
                      £{totalPrice.toLocaleString()}
                    </motion.span>
                    {product.discountPercentage > 0 && (
                      <span className="text-lg text-stone-300 line-through font-light">
                        £{(Number(product.basePrice || 0) + (selectedSize?.priceModifier || 0)).toLocaleString()}
                      </span>
                    )}
                  </div> */}

                  {/* Colour & Fabric section */}
                  {enabledColors.length > 0 && (
                    <div className="">
                      {/* {uniqueFabrics.length  && ( */}
                        <div className=" flex items-center">
                          <p className="text-[12px] uppercase tracking-[0.18em] text-black font-bold mr-2">
                            Fabric - Plush
                          </p>
                          {/* <div className="flex flex-wrap gap-2 ">
                            {uniqueFabrics.map(f => (
                              <button
                                key={f}
                                onClick={() => setSelectedFabric(f)}
                                className={cn(
                                  'px-2 py-1 text-xs rounded-3xl font-semibold border transition-all',
                                  selectedFabric === f
                                    ? 'bg-white text-white border-white'
                                    : 'bg-white text-stone-300 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                                )}
                              >
                                {f}
                              </button>
                            ))}
                          </div> */}
                        </div>
                      {/* )} */}

                      <div>
                        {/* <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">
                          Color {selectedColor && <span className="text-stone-100 ml-1 normal-case tracking-normal font-bold">— {selectedColor.name}</span>}
                        </p> */}

                        <div className="grid grid-cols-4 gap-2 pt-2 pb-2">
                          {visibleColors.map((c: ProductColor) => (
                            <ColourSwatch
                              key={c.name}
                              color={c}
                              isSelected={selectedColor?.name === c.name}
                              onClick={() => handleColorChange(c)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stacked option sections */}
                  {accSections.length > 0 && (
                    <div className="space-y-6 pt-2 ">
                      {product.sizes?.length > 0 && (
                        <div>
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="text-base font-normal uppercase tracking-normal text-stone-900">Size</p>
                            {product.categoryId === 'beds' && (
                              <Sheet>
                                <SheetTrigger asChild>
                                  <button className="flex items-center gap-1 text-xs text-stone-400 underline decoration-dashed underline-offset-2 hover:text-stone-200">
                                    <Ruler className="w-3 h-3" /> Guide
                                  </button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                                  <SheetHeader className="mb-6"><SheetTitle>Bed Dimensions</SheetTitle><SheetDescription>Standard UK sizes.</SheetDescription></SheetHeader>
                                  {(() => {
                                    const dims: Record<string, any> = { 'Small Single': { w: '75cm', l: '190cm' }, 'Single': { w: '90cm', l: '190cm' }, 'Small Double': { w: '120cm', l: '190cm' }, 'Double': { w: '135cm', l: '190cm' }, 'King': { w: '150cm', l: '200cm' }, 'Super King': { w: '180cm', l: '200cm' } };
                                    const d = dims[selectedSize?.name || ''] || {};
                                    return (
                                      <div className="divide-y">
                                        {[['Width', d.w], ['Length', d.l], ['Base Height', '35.5cm'], ['Total Height', '127cm']].map(([l, v]) => (
                                          <div key={l} className="flex justify-between py-3 text-sm"><span className="text-stone-400">{l}</span><span className="font-semibold">{v || '-'}</span></div>
                                        ))}
                                      </div>
                                    );
                                  })()}
                                </SheetContent>
                              </Sheet>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 bg-white/60 backdrop-blur-md border border-white/60 p-3 rounded-xl shadow-sm">
                            {([...product.sizes].sort((a: any, b: any) => ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen', 'Super King'].indexOf(a.name) - ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen', 'Super King'].indexOf(b.name))).map((o: ProductSize) => (
                              <OptionBox
                                key={o.name}
                                label={getSizeDisplayName(o)}
                                // detail={o.dimensions}
                                price={o.priceModifier}
                                isSelected={selectedSize?.name === o.name}
                                isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedSize(o)}
                                disabled={o.inStock === false}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {product.firmnessOptions?.length > 0 && (
                        <div>
                          <p className="mb-4 text-base font-normal uppercase tracking-normal text-stone-900">Firmness</p>
                          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 bg-white/60 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-sm">
                            {product.firmnessOptions.map((o: any) => (
                              <OptionBox
                                key={o.name}
                                label={o.name}
                                price={o.priceModifier}
                                isSelected={selectedFirmness?.name === o.name}
                                isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedFirmness(o)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {product.storageOptions?.length > 0 && (
                        <div>
                          <p className="mb-4 text-base font-normal uppercase tracking-normal text-stone-900">Storage</p>
                          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 bg-white/60 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-sm">
                            {product.storageOptions.map((o: any) => (
                              <OptionBox
                                key={o.name}
                                label={o.name}
                                // detail={o.description}
                                price={o.priceModifier}
                                isSelected={selectedStorage?.name === o.name}
                                isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedStorage(o)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {product.headboardOptions?.length > 0 && (
                        <div>
                          <p className="mb-4 text-base font-normal uppercase tracking-normal text-stone-900">Headboard</p>
                          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 bg-white/60 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-sm">
                            {product.headboardOptions.map((o: any) => {
                              const price = getHeadboardPrice(o, selectedSize?.name);
                              return (
                                <OptionBox
                                  key={o.name}
                                  label={o.name}
                                  detail={o.description}
                                  price={price}
                                  isSelected={selectedHeadboard?.name === o.name}
                                  isIncluded={!price || price === 0}
                                  onClick={() => setSelectedHeadboard(o)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {product.baseOptions?.length > 0 && (
                        <div>
                          <p className="mb-4 text-base font-normal uppercase tracking-normal text-stone-900">Base</p>
                          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 bg-white/60 backdrop-blur-md border border-white/60 p-3 rounded-2xl shadow-sm">
                            {product.baseOptions.map((o: any) => (
                              <OptionBox
                                key={o.name}
                                label={o.name}
                                detail={o.description}
                                price={o.priceModifier}
                                isSelected={selectedBase?.name === o.name}
                                isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedBase(o)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section icon tabs */}
                  {false && accSections.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">Options</p>
                      <div className="flex gap-2 flex-wrap">
                        {accSections.map(s => (
                          <AccBtn key={s.key} icon={s.icon} label={s.label} isSelected={activeAcc === s.key} onClick={() => setActiveAcc(s.key)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="hidden">
                    <AnimatePresence mode="wait">
                      {/* Size */}
                      {activeAcc === 'size' && product.sizes?.length > 0 && (
                        <motion.div key="size" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold">Size — {product.sizes.length} options</p>
                            {product.categoryId === 'beds' && (
                              <Sheet>
                                <SheetTrigger asChild>
                                  <button className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 underline decoration-dashed underline-offset-2">
                                    <Ruler className="w-3 h-3" /> Guide
                                  </button>
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                                  <SheetHeader className="mb-6"><SheetTitle>Bed Dimensions</SheetTitle><SheetDescription>Standard UK sizes.</SheetDescription></SheetHeader>
                                  {(() => {
                                    const dims: Record<string, any> = { 'Small Single': { w: '75cm', l: '190cm' }, 'Single': { w: '90cm', l: '190cm' }, 'Small Double': { w: '120cm', l: '190cm' }, 'Double': { w: '135cm', l: '190cm' }, 'King': { w: '150cm', l: '200cm' }, 'Super King': { w: '180cm', l: '200cm' } };
                                    const d = dims[selectedSize?.name || ''] || {};
                                    return (
                                      <div className="divide-y">
                                        {[['Width', d.w], ['Length', d.l], ['Base Height', '35.5cm'], ['Total Height', '127cm']].map(([l, v]) => (
                                          <div key={l} className="flex justify-between py-3 text-sm"><span className="text-stone-400">{l}</span><span className="font-semibold">{v || '—'}</span></div>
                                        ))}
                                      </div>
                                    );
                                  })()}
                                </SheetContent>
                              </Sheet>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 pt-2 pb-4">
                            {([...product.sizes].sort((a: any, b: any) => ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen'].indexOf(a.name) - ['Small Single', 'Single', 'Small Double', 'Double', 'King', 'Queen'].indexOf(b.name))).map((o: any) => (
                              <CylinderTile key={o.name} label={o.name} subtitle={o.dimensions} price={o.priceModifier}
                                isSelected={selectedSize?.name === o.name} isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedSize(o)} disabled={o.inStock === false}
                                icon={<Maximize className="w-6 h-6 text-stone-700" />} />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeAcc === 'firmness' && product.firmnessOptions?.length > 0 && (
                        <motion.div key="firmness" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">Firmness</p>
                          <div className="flex flex-wrap gap-4 pt-2 pb-4">
                            {product.firmnessOptions.map((o: any) => (
                              <CylinderTile key={o.name} label={o.name} price={!o.priceModifier || o.priceModifier === 0 ? 'Included' : o.priceModifier}
                                isSelected={selectedFirmness?.name === o.name} onClick={() => setSelectedFirmness(o)} icon={<Moon className="w-6 h-6 text-stone-700" />} />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeAcc === 'storage' && product.storageOptions?.length > 0 && (
                        <motion.div key="storage" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">Storage</p>
                          <div className="flex flex-wrap gap-4 pt-2 pb-4">
                            {product.storageOptions.map((o: any) => (
                              <CylinderTile key={o.name} label={o.name} price={o.priceModifier}
                                isSelected={selectedStorage?.name === o.name} isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedStorage(o)} icon={<Archive className="w-6 h-6 text-stone-700" />} />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeAcc === 'headboard' && product.headboardOptions?.length > 0 && (
                        <motion.div key="headboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">Headboard</p>
                          <div className="flex flex-wrap gap-4 pt-2 pb-4">
                            {product.headboardOptions.map((o: any) => {
                              const price = getHeadboardPrice(o, selectedSize?.name);
                              return <CylinderTile key={o.name} label={o.name} price={price}
                                isSelected={selectedHeadboard?.name === o.name} isIncluded={!price || price === 0}
                                onClick={() => setSelectedHeadboard(o)} icon={<BedDouble className="w-6 h-6 text-stone-700" />} />;
                            })}
                          </div>
                        </motion.div>
                      )}

                      {activeAcc === 'base' && product.baseOptions?.length > 0 && (
                        <motion.div key="base" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">Base</p>
                          <div className="flex flex-wrap gap-4 pt-2 pb-4">
                            {product.baseOptions.map((o: any) => (
                              <CylinderTile key={o.name} label={o.name} price={o.priceModifier}
                                isSelected={selectedBase?.name === o.name} isIncluded={!o.priceModifier || o.priceModifier === 0}
                                onClick={() => setSelectedBase(o)} icon={<Layers className="w-6 h-6 text-stone-700" />} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mattress add-on */}
                  {product.categoryId === 'beds' && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold mb-3">Add Mattress</p>
                      {selectedUpsellMattress ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-stone-900 bg-stone-50">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#021526] flex-shrink-0">
                            <img src={selectedUpsellMattress.images?.[0] || '/placeholder.jpg'} alt={selectedUpsellMattress.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stone-900 leading-tight truncate">{selectedUpsellMattress.name}</p>
                            <p className="text-[10px] text-stone-400">{selectedUpsellFirmness?.name || 'Select firmness'}</p>
                          </div>
                          <Dialog open={isMattressModalOpen} onOpenChange={setIsMattressModalOpen}>
                            <DialogTrigger asChild>
                              <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-stone-900 text-white">Change</button>
                            </DialogTrigger>
                            <DialogContent className={mattressDialogClassName}>
                              <DialogHeader className="px-6 py-5 border-b"><DialogTitle className="font-serif text-xl font-light">Select Mattress</DialogTitle><DialogDescription className="sr-only">Choose a mattress</DialogDescription></DialogHeader>
                              <div className="flex-1 overflow-y-auto p-5">
                                {compatibleMattresses.length === 0
                                  ? <div className="flex flex-col items-center justify-center h-full text-stone-400"><Sparkles className="w-8 h-8 mb-3 opacity-20" /><p className="text-sm">No mattresses for {selectedSize?.name}.</p></div>
                                  : <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-3">{compatibleMattresses.sort((a, b) => { const pa = (a.discountPrice || a.price || 0) + (a.sizes.find((s: any) => s.name === selectedSize?.name)?.priceModifier || 0); const pb = (b.discountPrice || b.price || 0) + (b.sizes.find((s: any) => s.name === selectedSize?.name)?.priceModifier || 0); return pa - pb; }).map(m => { const isSel = selectedUpsellMattress?.id === m.id; const sp = m.sizes.find((s: any) => s.name === selectedSize?.name)?.priceModifier || 0; const dp = (m.discountPrice || m.price || 0) + sp; const hasFirm = m.firmnessOptions?.length > 0; return (<div key={m.id} onClick={() => { setSelectedUpsellMattress(m); setSelectedUpsellFirmness(null); }} className={cn('relative border-2 rounded-xl p-3 cursor-pointer flex flex-col transition-all', isSel ? 'border-white bg-stone-50' : 'border-stone-200 hover:border-stone-400')}>{isSel && <div className="absolute top-2 right-2 w-5 h-5 bg-white text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>}<div className="aspect-[4/3] bg-stone-100 rounded-lg mb-3 overflow-hidden"><img src={m.images?.[0] || '/placeholder.jpg'} alt={m.name} className="w-full h-full object-cover" /></div><h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{m.name}</h3><p className="text-sm font-bold mb-2">£{dp.toFixed(2)}</p>{hasFirm && <div onClick={e => e.stopPropagation()}><select className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-white" value={isSel && selectedUpsellFirmness ? selectedUpsellFirmness.name : ''} onChange={e => { const f = m.firmnessOptions?.find((f: any) => f.name === e.target.value); if (f) { setSelectedUpsellMattress(m); setSelectedUpsellFirmness(f); } }}><option value="" disabled>Select Firmness</option>{m.firmnessOptions?.map((f: any) => <option key={f.name} value={f.name}>{f.name}</option>)}</select></div>}</div>); })}</div>
                                }
                              </div>
                              <div className="flex justify-between items-center px-6 py-4 border-t bg-stone-50">{selectedUpsellMattress ? <p className="text-sm font-medium">{selectedUpsellMattress.name}{selectedUpsellFirmness && <span className="text-stone-400"> · {selectedUpsellFirmness.name}</span>}</p> : <div />}<div className="flex gap-3 items-center">{selectedUpsellMattress && <button className="text-xs text-stone-400 underline" onClick={() => { setSelectedUpsellMattress(null); setIsMattressModalOpen(false); }}>Remove</button>}<Button onClick={() => setIsMattressModalOpen(false)} disabled={!selectedUpsellMattress || (!!selectedUpsellMattress.firmnessOptions?.length && !selectedUpsellFirmness)} className="rounded-full px-6">Confirm</Button></div></div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <Dialog open={isMattressModalOpen} onOpenChange={setIsMattressModalOpen}>
                          <DialogTrigger asChild>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-stone-400 hover:border-stone-400 transition-all text-left group">
                              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center"><BedDouble className="w-5 h-5 text-stone-700" /></div>
                              <div><p className="text-xs font-bold text-stone-700">Bundle with a mattress</p><p className="text-[10px] text-stone-400">Save more when you add a mattress</p></div>
                              <Plus className="w-4 h-4 text-stone-400 ml-auto group-hover:text-stone-700 transition-colors" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className={mattressDialogClassName}>
                            <DialogHeader className="px-6 py-5 border-b"><DialogTitle className="font-serif text-xl font-light">Select Mattress</DialogTitle><DialogDescription className="sr-only">Choose</DialogDescription></DialogHeader>
                            <div className="flex-1 overflow-y-auto p-5">{compatibleMattresses.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-stone-400"><Sparkles className="w-8 h-8 mb-3 opacity-20" /><p className="text-sm">No mattresses for {selectedSize?.name}.</p></div> : <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 md:grid-cols-3">{compatibleMattresses.map(m => { const isSel = selectedUpsellMattress?.id === m.id; const sp = m.sizes.find((s: any) => s.name === selectedSize?.name)?.priceModifier || 0; const dp = (m.discountPrice || m.price || 0) + sp; const hasFirm = m.firmnessOptions?.length > 0; return (<div key={m.id} onClick={() => { setSelectedUpsellMattress(m); setSelectedUpsellFirmness(null); }} className={cn('relative border-2 rounded-xl p-3 cursor-pointer flex flex-col transition-all', isSel ? 'border-white bg-stone-50' : 'border-stone-200 hover:border-stone-400')}>{isSel && <div className="absolute top-2 right-2 w-5 h-5 bg-white text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>}<div className="aspect-[4/3] bg-stone-100 rounded-lg mb-3 overflow-hidden"><img src={m.images?.[0] || '/placeholder.jpg'} alt={m.name} className="w-full h-full object-cover" /></div><h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{m.name}</h3><p className="text-sm font-bold mb-2">£{dp.toFixed(2)}</p>{hasFirm && <div onClick={e => e.stopPropagation()}><select className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-white focus:outline-none" value={isSel && selectedUpsellFirmness ? selectedUpsellFirmness.name : ''} onChange={e => { const f = m.firmnessOptions?.find((f: any) => f.name === e.target.value); if (f) { setSelectedUpsellMattress(m); setSelectedUpsellFirmness(f); } }}><option value="" disabled>Select Firmness</option>{m.firmnessOptions?.map((f: any) => <option key={f.name} value={f.name}>{f.name}</option>)}</select></div>}</div>); })}</div>}</div>
                            <div className="flex justify-end items-center px-6 py-4 border-t bg-stone-50 gap-3">{selectedUpsellMattress && <button className="text-xs text-stone-400 underline" onClick={() => { setSelectedUpsellMattress(null); setIsMattressModalOpen(false); }}>Remove</button>}<Button onClick={() => setIsMattressModalOpen(false)} disabled={!selectedUpsellMattress || (!!selectedUpsellMattress.firmnessOptions?.length && !selectedUpsellFirmness)} className="rounded-full px-6">Confirm</Button></div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  )}

                  {/* Assembly */}
                  {(product.categoryId === 'mattresses' || product.categoryId === 'beds') && (
                    <button onClick={() => setAssemblyAdded(!assemblyAdded)}
                      className={cn('w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all duration-200',
                        assemblyAdded ? 'border-white bg-white' : 'border-stone-200 bg-white hover:border-stone-400')}>
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', assemblyAdded ? 'bg-[#021526]' : 'bg-[#021526]')}><Wrench className={cn('w-5 h-5', assemblyAdded ? 'text-white' : 'text-white')} /></div>
                      <div className="flex-1"><p className={cn('text-sm font-bold', assemblyAdded ? 'text-[#021526]' : 'text-[#021526]')}>Professional Assembly</p><p className={cn('text-xs mt-0.5', assemblyAdded ? 'text-black/60' : 'text-stone-400')}>By trained technicians · +£49</p></div>
                      <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0', assemblyAdded ? 'bg-[#021526] border-black' : 'border-stone-300')}>{assemblyAdded && <Check className="w-3.5 h-3.5 text-white" />}</div>
                    </button>
                  )}

                  {/* Mobile price + CTA */}
                  <div className="hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div><p className="text-[10px] text-stone-400 uppercase tracking-widest">Price</p><p className="font-serif text-3xl font-light text-white">£{totalPrice.toLocaleString()}</p></div>
                      <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <button onClick={handleAddToCart} className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                      Add to bag · £{(totalPrice * quantity).toLocaleString()} <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {product.subcategoryId === "divan-beds" && (
          <div className="container mx-auto px-4 py-6 md:px-6">
            <div className='text-center mb-6'>
              <h1 className='luxury-heading'>
                Extra Storage Options for Refined Living
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                {
                  title: "Extra Storage Options for Refined Living",
                  src: "/video/box/grok-video-6bfd8951-0907-4f63-81a5-01814fb720be.mp4",
                },
                {
                  title: "Sustainably Sourced & Handcrafted in the UK",
                  src: "/video/box/grok-video-b7e9227c-6c18-43b3-bb01-bce1df5b5e16.mp4",
                },
              ].map((video) => (
                <div key={video.src} className="">
                  {/* <h2 className="mb-3 text-center font-serif text-xl font-bold leading-tight text-white md:text-2xl">
                    {video.title}
                  </h2> */}
                  <div className="h-56 md:h-64 lg:h-72 overflow-hidden rounded-2xl bg-stone-100">
                    <video
                      className="h-full w-full object-cover"
                      src={video.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust banner */}
        <USPStrip />

        {/* Category sections */}
        {product.categoryId === 'mattresses' ? <MattressDetails /> : product.categoryId === 'beds' ? (product.subcategoryId?.includes('ottoman') ? <OttomanBedDetails /> : product.subcategoryId?.includes('upholstered') ? <UpholsteredBedDetails /> : <BedDetails />) : product.categoryId === 'headboards' ? <HeadBoardDetails /> : null}

        {/* Mobile sticky bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-100 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex items-center border-2 border-stone-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 h-11 rounded-xl bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              Add to bag · £{(totalPrice * quantity).toLocaleString()}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductPage;

