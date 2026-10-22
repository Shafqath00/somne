import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Check, Lock, Truck, Tag, X, Loader2, Plus, Minus, Trash2, Info } from 'lucide-react';
import { createCheckoutSession, validateDiscountCode, DiscountValidationResult } from '@/api/api';

const CHECKOUT_FORM_KEY = 'somne-checkout-form';
const checkoutPanelClass = 'rounded-lg border border-black/10 bg-white p-5 shadow-sm md:p-7';
const checkoutTitleClass = 'mb-5 border-b border-black/10 pb-4 text-lg font-black text-black md:text-xl';
const checkoutInputClass = 'h-12 rounded-lg border-black/10 bg-[#f4f4f4] text-sm font-semibold text-black placeholder:text-black/35 focus-visible:ring-black';

const loadFormData = () => {
    try {
        const saved = localStorage.getItem(CHECKOUT_FORM_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load checkout form data:', error);
    }
    return null;
};

const saveFormData = (data: object) => {
    try {
        localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save checkout form data:', error);
    }
};

export default function Checkout() {
    const { items, subtotal, discount, updateQuantity, removeItem } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
    const [showDeliveryTerms, setShowDeliveryTerms] = useState(false);

    const [formData, setFormData] = useState(() => {
        const saved = loadFormData();
        return saved || {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'United Kingdom',
        };
    });

    const [discountCode, setDiscountCode] = useState('');
    const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidationResult | null>(null);
    const [discountError, setDiscountError] = useState<string | null>(null);
    const [couponRequest, setCouponRequest] = useState<{ code: string } | null>(null);

    const formatPrice = (price: number) => `\u00a3${price.toLocaleString()}`;

    useEffect(() => {
        saveFormData(formData);
    }, [formData]);

    const postalCode = formData.postalCode?.trim().toUpperCase() || '';
    const chargeablePrefixes = ['AB', 'DD', 'DG', 'FK', 'TD', 'TR', 'PA', 'PH', 'IV', 'KW', 'KY'];
    const isChargeableShipping = chargeablePrefixes.some(prefix => postalCode.startsWith(prefix));
    const shipping = isChargeableShipping ? 80 : 0;
    const total = subtotal + shipping - discount;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyDiscount = () => {
        const code = discountCode;
        if (!code.trim()) {
            setDiscountError('Please enter a discount code');
            return;
        }
        setCouponRequest({ code: code.trim() });
    };

    // Revalidate on cart changes and ignore responses for an older cart or coupon.
    useEffect(() => {
        if (!couponRequest) {
            setIsValidatingDiscount(false);
            return;
        }
        let cancelled = false;
        setIsValidatingDiscount(true);
        setDiscountError(null);
        setAppliedDiscount(null);
        const cartItems = items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedStorage: item.selectedStorage,
            selectedHeadboard: item.selectedHeadboard,
            selectedBase: item.selectedBase,
            selectedFirmness: item.selectedFirmness,
            hasAssembly: item.hasAssembly,
        }));
        validateDiscountCode(couponRequest.code, cartItems).then(result => {
            if (cancelled) return;
            if (result.valid) {
                setAppliedDiscount(result);
                setDiscountError(null);
            } else {
                setDiscountError(result.error || 'Invalid discount code');
            }
        }).catch(() => {
            if (cancelled) return;
            setDiscountError('Failed to validate discount code');
        }).finally(() => {
            if (!cancelled) setIsValidatingDiscount(false);
        });
        return () => { cancelled = true; };
    }, [items, couponRequest]);

    const handleRemoveDiscount = () => {
        setCouponRequest(null);
        setAppliedDiscount(null);
        setDiscountCode('');
        setDiscountError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasAcceptedPolicies) {
            toast.error('Please accept our policies before placing your order.');
            return;
        }
        setIsProcessing(true);

        try {
            const orderItems = items.map(item => {
                const fallbackColor = item.product.colors?.find(color => !color.disabled);
                return {
                    productId: item.product.id,
                    name: item.product.name,
                    image: item.selectedColor?.image || item.selectedColor?.productImages?.[0] || fallbackColor?.image || item.product.images[0],
                    quantity: item.quantity,
                    price: (item.product.discountPrice || item.product.price || 0) +
                        (item.selectedSize?.priceModifier || 0) +
                        (item.selectedStorage?.priceModifier || 0) +
                        (item.selectedHeadboard?.priceModifier || 0) +
                        (item.hasAssembly ? 49 : 0) +
                        (item.selectedBase?.priceModifier || 0) +
                        (item.selectedFirmness?.priceModifier || 0),
                    hasAssembly: item.hasAssembly,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor,
                    selectedStorage: item.selectedStorage,
                    selectedHeadboard: item.selectedHeadboard,
                    selectedBase: item.selectedBase,
                    selectedFirmness: item.selectedFirmness,
                };
            });

            const orderData = {
                items: orderItems,
                shippingDetails: formData,
                subtotal,
                shippingCost: shipping,
                discount: appliedDiscount?.discountAmount || 0,
                total: appliedDiscount?.discountAmount ? total - appliedDiscount.discountAmount : total,
                status: 'Pending',
                paymentStatus: 'Pending'
            };

            const sessionResponse = await createCheckoutSession(
                orderItems,
                orderData,
                formData.email,
                appliedDiscount?.code || undefined
            );

            if (sessionResponse.session && sessionResponse.session.url) {
                window.location.href = sessionResponse.session.url;
            } else {
                toast.error('Failed to start payment session.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error?.response?.data?.error || 'Failed to process checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <Layout>
                <div className="min-h-[70vh] bg-[#f4f4f4]">
                    <div className="bg-black py-10 text-white md:py-14">
                        <div className="luxury-container">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">Secure checkout</p>
                            <h1 className="text-3xl font-black md:text-5xl">Your bag is empty</h1>
                        </div>
                    </div>
                    <div className="luxury-container flex min-h-[42vh] flex-col items-center justify-center px-4 py-16 text-center">
                        <p className="mb-7 max-w-md text-sm leading-6 text-black/60">
                            Add your favourite Somne pieces to your bag before continuing to checkout.
                        </p>
                        <Link
                            to="/beds"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            {showDeliveryTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDeliveryTerms(false)}>
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                                    <Truck className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-lg font-black text-black">Delivery Information</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeliveryTerms(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/55 transition-colors hover:bg-black hover:text-white"
                                aria-label="Close delivery information"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 px-6 py-5 text-sm">
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                <p className="mb-1 font-bold text-emerald-800">Free Delivery - Mainland UK</p>
                                <p className="text-xs leading-relaxed text-emerald-700">
                                    Free delivery is available to Mainland UK addresses only.
                                </p>
                            </div>
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <p className="mb-2 font-bold text-amber-900">{formatPrice(80)} Delivery Charge - Remote Areas</p>
                                <p className="mb-3 text-xs leading-relaxed text-amber-800">
                                    The following postcode prefixes do not qualify for free delivery:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {chargeablePrefixes.map(code => (
                                        <span
                                            key={code}
                                            className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${isChargeableShipping && formData.postalCode.trim().toUpperCase().startsWith(code)
                                                ? 'bg-black text-white'
                                                : 'bg-white text-amber-900'
                                                }`}
                                        >
                                            {code}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-lg border border-black/10 bg-[#f4f4f4] p-4">
                                <p className="mb-1 font-bold text-black">No Off-Shore Island Delivery</p>
                                <p className="text-xs leading-relaxed text-black/60">
                                    We do not deliver to off-shore islands, including <span className="font-semibold text-black">Northern Ireland, Jersey,</span> and the <span className="font-semibold text-black">Channel Islands</span>.
                                </p>
                            </div>
                        </div>

                        <div className="px-6 pb-5">
                            <button type="button" onClick={() => setShowDeliveryTerms(false)} className="h-11 w-full rounded-full bg-black text-sm font-bold text-white transition-colors hover:bg-zinc-800">
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Helmet>
                <title>Checkout | Somne</title>
            </Helmet>
            <Layout>
                <div className="min-h-screen bg-[#f4f4f4] pb-12">
                    <div className="bg-black py-8 text-white md:py-12">
                        <div className="luxury-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">Secure checkout</p>
                                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">Checkout</h1>
                            </div>
                            <div className="flex items-center justify-between gap-4 md:justify-end">
                                <Link to="/beds" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-white">
                                    <ArrowLeft className="h-4 w-4" />
                                    Continue Shopping
                                </Link>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                                    <Lock className="h-3.5 w-3.5" />
                                    Secure
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="luxury-container -mt-5">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
                            <div className="space-y-5 lg:col-span-7">
                                <div className={checkoutPanelClass}>
                                    <h2 className={checkoutTitleClass}>Contact Information</h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Email</label>
                                            <Input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={checkoutInputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Phone</label>
                                            <Input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+44 7000 000000" className={checkoutInputClass} />
                                        </div>
                                    </div>
                                </div>

                                <div className={checkoutPanelClass}>
                                    <h2 className={checkoutTitleClass}>Shipping Address</h2>
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">First Name</label>
                                            <Input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className={checkoutInputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Last Name</label>
                                            <Input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className={checkoutInputClass} />
                                        </div>
                                    </div>
                                    <div className="mb-4 space-y-2">
                                        <label className="text-sm font-bold text-black">Address</label>
                                        <Input required name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Luxury Lane" className={checkoutInputClass} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">City</label>
                                            <Input required name="city" value={formData.city} onChange={handleInputChange} placeholder="London" className={checkoutInputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-1.5 text-sm font-bold text-black">
                                                Postal Code
                                                <button type="button" onClick={() => setShowDeliveryTerms(true)} className="text-black/45 transition-colors hover:text-black" aria-label="View delivery terms">
                                                    <Info className="h-3.5 w-3.5" />
                                                </button>
                                            </label>
                                            <Input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="SW1A 1AA" className={checkoutInputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-black">Country</label>
                                            <Input disabled value={formData.country} className="h-12 cursor-not-allowed rounded-lg border-black/10 bg-black/5 text-sm font-semibold text-black/60" />
                                        </div>
                                    </div>
                                </div>

                                <div className={checkoutPanelClass}>
                                    <h2 className={checkoutTitleClass}>Delivery Method</h2>
                                    <div className="flex items-center justify-between rounded-lg border border-black/10 bg-[#f4f4f4] p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                                                <Truck className="h-5 w-5 text-black" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">Standard Delivery</p>
                                                <p className="text-sm text-black/55">3-5 weeks</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                    </div>

                                    <div className="mt-7 border-t border-black/10 pt-6">
                                        <div className="relative flex justify-between gap-2 md:mx-6">
                                            <div className="absolute left-6 right-6 top-8 h-px bg-black/15" />
                                            {[
                                                {
                                                    title: 'Ordered',
                                                    icon: '/img/icons/Ordered1.png',
                                                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                                },
                                                {
                                                    title: 'Order Ready',
                                                    icon: '/img/icons/delivered1.png',
                                                    date: (() => {
                                                        const start = new Date();
                                                        start.setDate(start.getDate() + 4);
                                                        const end = new Date();
                                                        end.setDate(end.getDate() + 8);
                                                        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                    })(),
                                                },
                                                {
                                                    title: 'Delivered',
                                                    icon: '/img/icons/shipped1.png',
                                                    date: (() => {
                                                        const start = new Date();
                                                        start.setDate(start.getDate() + 9);
                                                        const end = new Date();
                                                        end.setDate(end.getDate() + 18);
                                                        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                    })(),
                                                },
                                            ].map((step) => (
                                                <div key={step.title} className="relative z-10 flex flex-1 flex-col items-center gap-2 bg-white px-1">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f4f4]">
                                                        <img src={step.icon} alt="" className="h-10 w-10 object-contain" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs font-black text-black md:text-sm">{step.title}</p>
                                                        <p className="mt-0.5 text-[11px] text-black/50">{step.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="sticky top-8 rounded-lg border border-black/10 bg-white p-5 shadow-sm md:p-7">
                                    <div className="mb-5 flex items-end justify-between border-b border-black/10 pb-4">
                                        <div>
                                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-black/45">Your bag</p>
                                            <h2 className="text-xl font-black text-black">Order Summary</h2>
                                        </div>
                                        <span className="rounded-full bg-[#f4f4f4] px-3 py-1 text-xs font-bold text-black/55">
                                            {items.length} {items.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>

                                    <div className="mb-7 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                                        {items.map((item) => {
                                            const itemPrice = (item.product.discountPrice || item.product.price || 0) +
                                                (item.selectedSize?.priceModifier || 0) +
                                                (item.selectedStorage?.priceModifier || 0) +
                                                (item.selectedHeadboard?.priceModifier || 0) +
                                                (item.hasAssembly ? 49 : 0) +
                                                (item.selectedBase?.priceModifier || 0) +
                                                (item.selectedFirmness?.priceModifier || 0);

                                            const fallbackColor = item.product.colors?.find(color => !color.disabled);
                                            const displayImage = item.selectedColor?.image || item.selectedColor?.productImages?.[0] || fallbackColor?.image || item.product.images[0];

                                            return (
                                                <div key={item.cartItemId} className="rounded-lg border border-black/10 bg-[#f4f4f4] p-3">
                                                    <div className="flex gap-3">
                                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-white">
                                                            <img src={displayImage} alt={item.product.name} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <h3 className="line-clamp-2 text-sm font-black leading-tight text-black">{item.product.name}</h3>
                                                                <span className="whitespace-nowrap text-sm font-black text-black">{formatPrice(itemPrice * item.quantity)}</span>
                                                            </div>
                                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                                {item.selectedSize && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black/60">{item.selectedSize.name}</span>}
                                                                {item.selectedColor && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black/60">Color: {item.selectedColor.name}</span>}
                                                                {item.selectedStorage && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black/60">Storage: {item.selectedStorage.name}</span>}
                                                                {item.selectedHeadboard && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black/60">Headboard: {item.selectedHeadboard.name}</span>}
                                                                {item.selectedBase && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black/60">Base: {item.selectedBase.name}</span>}
                                                                {item.selectedFirmness && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-black/60">Firmness: {item.selectedFirmness.name}</span>}
                                                                {item.hasAssembly && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">+ Assembly ({formatPrice(49)})</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                                                        <div className="flex items-center overflow-hidden rounded-full border border-black/10 bg-white">
                                                            <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-black/60 transition-colors hover:bg-black hover:text-white" aria-label="Decrease quantity">
                                                                <Minus className="h-3.5 w-3.5" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-black text-black">{item.quantity}</span>
                                                            <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-black/60 transition-colors hover:bg-black hover:text-white" aria-label="Increase quantity">
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                        <button type="button" onClick={() => removeItem(item.cartItemId)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 text-xs font-bold text-red-500 transition-colors hover:bg-red-50" aria-label="Remove item">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Remove
                                                        </button>
                                                    </div>

                                                    {appliedDiscount?.eligibleProductIds?.includes(item.product.id) && (
                                                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                                                            <Tag className="h-3.5 w-3.5" />
                                                            <span>
                                                                {appliedDiscount.code} applied
                                                                {appliedDiscount.type === 'percentage' ? ` - ${appliedDiscount.value}% off` : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mb-6 border-t border-black/10 pt-5">
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-black">
                                            <Tag className="h-4 w-4" />
                                            Discount Code
                                        </h3>

                                        {appliedDiscount ? (
                                            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                                <div className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-emerald-600" />
                                                    <div>
                                                        <span className="font-bold text-emerald-700">{appliedDiscount.code}</span>
                                                        <p className="text-xs text-emerald-600">
                                                            {appliedDiscount.message || (appliedDiscount.type === 'percentage'
                                                                ? `${appliedDiscount.value}% off`
                                                                : `${formatPrice(appliedDiscount.value)} off`)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={handleRemoveDiscount} className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-white hover:text-black" aria-label="Remove discount">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter code"
                                                        value={discountCode}
                                                        onChange={(e) => {
                                                            setDiscountCode(e.target.value.toUpperCase());
                                                            setDiscountError(null);
                                                        }}
                                                        className={`${checkoutInputClass} flex-1 uppercase`}
                                                        disabled={isValidatingDiscount}
                                                    />
                                                    <button type="button" onClick={() => handleApplyDiscount()} disabled={isValidatingDiscount || !discountCode.trim()} className="h-12 rounded-full bg-black px-5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50">
                                                        {isValidatingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                                                    </button>
                                                </div>
                                                {discountError && <p className="text-xs font-semibold text-red-500">{discountError}</p>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 border-t border-black/10 pt-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-black/55">Subtotal</span>
                                            <span className="font-bold text-black">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-black/55">Delivery</span>
                                            <span className="font-bold text-black">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                        </div>
                                        {appliedDiscount && appliedDiscount.discountAmount && (
                                            <div className="flex justify-between text-sm font-bold text-emerald-600">
                                                <span>Discount ({appliedDiscount.code})</span>
                                                <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                                            </div>
                                        )}
                                        {discount > 0 && !appliedDiscount && (
                                            <div className="flex justify-between text-sm font-bold text-red-500">
                                                <span>Discount</span>
                                                <span>-{formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-2xl font-black text-black">
                                            <span>Total</span>
                                            <span>
                                                {formatPrice(
                                                    appliedDiscount && appliedDiscount.discountAmount
                                                        ? total - appliedDiscount.discountAmount
                                                        : total
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-start gap-3">
                                        <Checkbox
                                            id="accept-policies"
                                            name="acceptPolicies"
                                            required
                                            checked={hasAcceptedPolicies}
                                            onCheckedChange={(checked) => setHasAcceptedPolicies(checked === true)}
                                            className="mt-1"
                                        />
                                        <label htmlFor="accept-policies" className="text-sm leading-6 text-black/70">
                                            I have read and agree to the{' '}
                                            <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline underline-offset-2">Privacy Policy</Link>
                                            {' '}and{' '}
                                            <Link to="/returns" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline underline-offset-2">Returns &amp; Refunds policy</Link>.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing || isValidatingDiscount || !hasAcceptedPolicies}
                                        className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-[#C0392B] text-base font-black text-white shadow-lg shadow-[#C0392B]/20 transition-all hover:bg-[#a93226] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Processing...</span>
                                        ) : 'Place Order'}
                                    </button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-black/45">
                                        <Lock className="h-3.5 w-3.5" />
                                        <span>Transactions are 100% Secure and Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}
