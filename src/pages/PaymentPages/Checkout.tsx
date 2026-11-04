import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Lock, Truck, Tag, X, Plus, Minus, Trash2, Info, ShieldCheck, ShoppingBag, Factory, ClipboardCheck, PackageCheck } from 'lucide-react';
import { SomneLoader, InlineDots, LOGO_DOTS } from '@/components/ui/SomneLoader';
import { cn } from '@/lib/utils';
import { createCheckoutSession, validateDiscountCode, DiscountValidationResult } from '@/api/api';

const CHECKOUT_FORM_KEY = 'somne-checkout-form';
const checkoutPanelClass = 'rounded-[1.75rem] border border-ink/5 bg-white p-5 shadow-soft md:p-8';
const checkoutLabelClass = 'text-[13px] font-bold text-ink';
const checkoutInputClass = 'h-12 rounded-2xl border-ink/10 bg-background px-4 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-ink/35 focus-visible:border-terracotta focus-visible:ring-terracotta/40';

const STEP_TONES = ['bg-terracotta', 'bg-saffron', 'bg-jade', 'bg-royal'];

function PanelTitle({ step, children }: { step: number; children: React.ReactNode }) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <span className={cn('flex h-9 w-9 items-center justify-center rounded-full font-display text-lg text-white', STEP_TONES[(step - 1) % STEP_TONES.length])}>
                {step}
            </span>
            <h2 className="font-display text-2xl text-ink md:text-3xl">{children}</h2>
        </div>
    );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className={checkoutLabelClass}>{label}</label>
            {children}
        </div>
    );
}

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

    const itemUnitPrice = (item: (typeof items)[number]) =>
        (item.product.discountPrice || item.product.price || 0) +
        (item.selectedSize?.priceModifier || 0) +
        (item.selectedStorage?.priceModifier || 0) +
        (item.selectedHeadboard?.priceModifier || 0) +
        (item.hasAssembly ? 49 : 0) +
        (item.selectedBase?.priceModifier || 0) +
        (item.selectedFirmness?.priceModifier || 0);

    const grandTotal = appliedDiscount && appliedDiscount.discountAmount ? total - appliedDiscount.discountAmount : total;

    const hero = (title: string, eyebrow: string, activeStep: 0 | 1 | 2) => (
        <div className="relative overflow-hidden bg-ink pb-16 pt-10 text-white md:pb-20 md:pt-14">
            <span aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-terracotta/35 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-royal/35 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
            <div className="luxury-container relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur">
                        <Lock className="h-3 w-3 text-saffron" /> {eyebrow}
                    </p>
                    <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">{title}</h1>
                </div>
                <div className="flex flex-col gap-4 md:items-end">
                    <ol className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] sm:gap-2 sm:text-xs sm:tracking-[0.14em]">
                        {['Bag', 'Details', 'Payment'].map((label, i) => {
                            const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'todo';
                            return (
                                <li key={label} className="flex items-center gap-1.5 sm:gap-2">
                                    <span
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 sm:gap-2 sm:px-3.5 sm:py-2',
                                            state === 'active' && 'bg-white text-ink',
                                            state === 'done' && 'bg-white/15 text-white',
                                            state === 'todo' && 'border border-white/20 text-white/50'
                                        )}
                                    >
                                        {state === 'done' ? <Check className="h-3.5 w-3.5 text-saffron" /> : <span className={cn('h-2 w-2 rounded-full', state === 'active' ? LOGO_DOTS[i] : 'bg-white/30')} />}
                                        {label}
                                    </span>
                                    {i < 2 && <span className="hidden h-px w-4 bg-white/25 sm:block" />}
                                </li>
                            );
                        })}
                    </ol>
                    <Link to="/beds/upholstered-beds" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );

    if (items.length === 0) {
        return (
            <Layout>
                <div className="min-h-[70vh] bg-background">
                    {hero('Your bag is empty', 'Secure checkout', 0)}
                    <div className="luxury-container relative z-10 -mt-10">
                        <div className={cn(checkoutPanelClass, 'mx-auto flex max-w-2xl flex-col items-center py-14 text-center')}>
                            <div className="relative mb-6">
                                <span aria-hidden className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-terracotta/25 via-saffron/20 to-royal/25 blur-xl" />
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background">
                                    <ShoppingBag className="h-9 w-9 text-terracotta" />
                                </div>
                            </div>
                            <p className="mb-8 max-w-md text-ink/60">
                                Add your favourite Somne pieces to your bag before continuing to checkout.
                            </p>
                            <Link
                                to="/beds/upholstered-beds"
                                className="group inline-flex h-14 items-center gap-2 rounded-full bg-terracotta px-9 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-gold transition-colors hover:bg-ink"
                            >
                                Browse beds
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const pill = 'rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/60';

    return (
        <>
            {isProcessing && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/90 backdrop-blur-md" role="alert" aria-live="assertive">
                    <SomneLoader label="Taking you to secure payment" />
                </div>
            )}

            {showDeliveryTerms && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={() => setShowDeliveryTerms(false)}>
                    <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-ink/5 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta">
                                    <Truck className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="font-display text-2xl text-ink">Delivery information</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeliveryTerms(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-ink/55 transition-colors hover:bg-ink hover:text-white"
                                aria-label="Close delivery information"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 px-6 py-5 text-sm">
                            <div className="rounded-2xl bg-jade/10 p-4">
                                <p className="mb-1 font-bold text-jade">Free delivery - Mainland UK</p>
                                <p className="text-xs leading-relaxed text-ink/65">
                                    Free delivery is available to Mainland UK addresses only.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-saffron/15 p-4">
                                <p className="mb-2 font-bold text-ink">{formatPrice(80)} delivery charge - remote areas</p>
                                <p className="mb-3 text-xs leading-relaxed text-ink/65">
                                    The following postcode prefixes do not qualify for free delivery:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {chargeablePrefixes.map(code => (
                                        <span
                                            key={code}
                                            className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${isChargeableShipping && formData.postalCode.trim().toUpperCase().startsWith(code)
                                                ? 'bg-ink text-white'
                                                : 'bg-white text-ink'
                                                }`}
                                        >
                                            {code}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl bg-background p-4">
                                <p className="mb-1 font-bold text-ink">No off-shore island delivery</p>
                                <p className="text-xs leading-relaxed text-ink/65">
                                    We do not deliver to off-shore islands, including <span className="font-semibold text-ink">Northern Ireland, Jersey,</span> and the <span className="font-semibold text-ink">Channel Islands</span>.
                                </p>
                            </div>
                        </div>

                        <div className="px-6 pb-6">
                            <button type="button" onClick={() => setShowDeliveryTerms(false)} className="h-12 w-full rounded-full bg-ink text-sm font-bold text-white transition-colors hover:bg-terracotta">
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
                <div className="min-h-screen bg-background pb-16">
                    {hero('Checkout', 'Secure checkout', 1)}

                    <div className="luxury-container relative z-10 -mt-10">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
                            <div className="space-y-6 lg:col-span-7">
                                <div className={checkoutPanelClass}>
                                    <PanelTitle step={1}>Contact</PanelTitle>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Field label="Email">
                                            <Input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={checkoutInputClass} />
                                        </Field>
                                        <Field label="Phone">
                                            <Input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+44 7000 000000" className={checkoutInputClass} />
                                        </Field>
                                    </div>
                                </div>

                                <div className={checkoutPanelClass}>
                                    <PanelTitle step={2}>Delivery address</PanelTitle>
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Field label="First name">
                                            <Input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className={checkoutInputClass} />
                                        </Field>
                                        <Field label="Last name">
                                            <Input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className={checkoutInputClass} />
                                        </Field>
                                    </div>
                                    <div className="mb-4">
                                        <Field label="Address">
                                            <Input required name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Luxury Lane" className={checkoutInputClass} />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <Field label="City">
                                            <Input required name="city" value={formData.city} onChange={handleInputChange} placeholder="London" className={checkoutInputClass} />
                                        </Field>
                                        <Field
                                            label={
                                                <span className="flex items-center gap-1.5">
                                                    Postal code
                                                    <button type="button" onClick={() => setShowDeliveryTerms(true)} className="text-ink/40 transition-colors hover:text-terracotta" aria-label="View delivery terms">
                                                        <Info className="h-3.5 w-3.5" />
                                                    </button>
                                                </span>
                                            }
                                        >
                                            <Input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="SW1A 1AA" className={checkoutInputClass} />
                                        </Field>
                                        <Field label="Country">
                                            <Input disabled value={formData.country} className="h-12 cursor-not-allowed rounded-2xl border-ink/10 bg-ink/5 px-4 text-sm font-semibold text-ink/55" />
                                        </Field>
                                    </div>
                                </div>

                                <div className={checkoutPanelClass}>
                                    <PanelTitle step={3}>Delivery method</PanelTitle>
                                    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-jade/10 to-royal/10 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft">
                                                <Truck className="h-5 w-5 text-jade" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-ink">Standard delivery</p>
                                                <p className="text-sm text-ink/55">3-10 days</p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                    </div>

                                    <div className="mt-7 border-t border-dashed border-ink/15 pt-6">
                                        <div className="relative flex justify-between gap-2 md:mx-6">
                                            <div className="absolute left-6 right-6 top-8 h-px bg-gradient-to-r from-terracotta/50 via-saffron/50 to-royal/50" />
                                            {[
                                                {
                                                    title: 'Ordered',
                                                    icon: ClipboardCheck,
                                                    tone: 'bg-terracotta shadow-[0_10px_24px_-10px_hsl(var(--terracotta)/0.7)]',
                                                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                                },
                                                {
                                                    title: 'Order Ready',
                                                    icon: PackageCheck,
                                                    tone: 'bg-saffron shadow-[0_10px_24px_-10px_hsl(var(--saffron)/0.8)]',
                                                    date: (() => {
                                                        const start = new Date();
                                                        start.setDate(start.getDate() + 2);
                                                        const end = new Date();
                                                        end.setDate(end.getDate() + 5);
                                                        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                    })(),
                                                },
                                                {
                                                    title: 'Delivered',
                                                    icon: Truck,
                                                    tone: 'bg-jade shadow-[0_10px_24px_-10px_hsl(var(--emerald)/0.7)]',
                                                    date: (() => {
                                                        const start = new Date();
                                                        start.setDate(start.getDate() + 3);
                                                        const end = new Date();
                                                        end.setDate(end.getDate() + 10);
                                                        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                    })(),
                                                },
                                            ].map((step) => (
                                                <div key={step.title} className="relative z-10 flex flex-1 flex-col items-center gap-2 bg-white px-1">
                                                    <div className={cn('flex h-14 w-14 items-center justify-center rounded-full ring-4 ring-white', step.tone)}>
                                                        <step.icon className="h-6 w-6 text-white" strokeWidth={2.2} />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs font-extrabold text-ink md:text-sm">{step.title}</p>
                                                        <p className="mt-0.5 text-[11px] text-ink/50">{step.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="sticky top-32 overflow-hidden rounded-[1.75rem] border border-ink/5 bg-white shadow-medium">
                                    <div className="flex gap-1 px-5 pt-5 md:px-7" aria-hidden>
                                        {LOGO_DOTS.map((c) => <span key={c} className={cn('h-1.5 w-1.5 rounded-full', c)} />)}
                                    </div>
                                    <div className="p-5 pt-3 md:p-7 md:pt-3">
                                        <div className="mb-5 flex items-end justify-between border-b border-dashed border-ink/15 pb-4">
                                            <h2 className="font-display text-3xl text-ink">Order summary</h2>
                                            <span className="rounded-full bg-background px-3 py-1 text-xs font-bold text-ink/60">
                                                {items.length} {items.length === 1 ? 'item' : 'items'}
                                            </span>
                                        </div>

                                        <div className="mb-6 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                                            {items.map((item) => {
                                                const itemPrice = itemUnitPrice(item);
                                                const fallbackColor = item.product.colors?.find(color => !color.disabled);
                                                const displayImage = item.selectedColor?.image || item.selectedColor?.productImages?.[0] || fallbackColor?.image || item.product.images[0];

                                                return (
                                                    <div key={item.cartItemId} className="rounded-2xl bg-background p-3">
                                                        <div className="flex gap-3">
                                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                                                                <img src={displayImage} alt={item.product.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <h3 className="line-clamp-2 font-display text-lg leading-tight text-ink">{item.product.name}</h3>
                                                                    <span className="whitespace-nowrap font-display text-lg text-ink">{formatPrice(itemPrice * item.quantity)}</span>
                                                                </div>
                                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                                    {item.selectedSize && <span className={pill}>{item.selectedSize.name}</span>}
                                                                    {item.selectedColor && <span className={pill}>Colour: {item.selectedColor.name}</span>}
                                                                    {item.selectedStorage && <span className={pill}>Storage: {item.selectedStorage.name}</span>}
                                                                    {item.selectedHeadboard && <span className={pill}>Headboard: {item.selectedHeadboard.name}</span>}
                                                                    {item.selectedBase && <span className={pill}>Base: {item.selectedBase.name}</span>}
                                                                    {item.selectedFirmness && <span className={pill}>Firmness: {item.selectedFirmness.name}</span>}
                                                                    {item.hasAssembly && <span className="rounded-full bg-jade/10 px-2.5 py-1 text-[11px] font-bold text-jade">+ Assembly ({formatPrice(49)})</span>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between border-t border-ink/5 pt-3">
                                                            <div className="flex items-center overflow-hidden rounded-full bg-white">
                                                                <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:bg-ink hover:text-white" aria-label="Decrease quantity">
                                                                    <Minus className="h-3.5 w-3.5" />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-extrabold text-ink">{item.quantity}</span>
                                                                <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:bg-ink hover:text-white" aria-label="Increase quantity">
                                                                    <Plus className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                            <button type="button" onClick={() => removeItem(item.cartItemId)} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-ink/45 transition-colors hover:bg-terracotta/10 hover:text-terracotta" aria-label="Remove item">
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Remove
                                                            </button>
                                                        </div>

                                                        {appliedDiscount?.eligibleProductIds?.includes(item.product.id) && (
                                                            <div className="mt-3 flex items-center gap-2 rounded-xl bg-jade/10 px-3 py-2 text-xs font-bold text-jade">
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

                                        <div className="mb-6 border-t border-dashed border-ink/15 pt-5">
                                            <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-ink">
                                                <Tag className="h-4 w-4 text-terracotta" />
                                                Discount code
                                            </h3>

                                            {appliedDiscount ? (
                                                <div className="flex items-center justify-between rounded-2xl bg-jade/10 p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-jade" />
                                                        <div>
                                                            <span className="font-bold text-jade">{appliedDiscount.code}</span>
                                                            <p className="text-xs text-ink/60">
                                                                {appliedDiscount.message || (appliedDiscount.type === 'percentage'
                                                                    ? `${appliedDiscount.value}% off`
                                                                    : `${formatPrice(appliedDiscount.value)} off`)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button type="button" onClick={handleRemoveDiscount} className="flex h-8 w-8 items-center justify-center rounded-full text-ink/45 transition-colors hover:bg-white hover:text-ink" aria-label="Remove discount">
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
                                                        <button type="button" onClick={() => handleApplyDiscount()} disabled={isValidatingDiscount || !discountCode.trim()} className="flex h-12 min-w-[5.5rem] items-center justify-center rounded-full bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-50">
                                                            {isValidatingDiscount ? <InlineDots className="[&_span]:!bg-white" /> : 'Apply'}
                                                        </button>
                                                    </div>
                                                    {discountError && <p className="text-xs font-semibold text-terracotta">{discountError}</p>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 border-t border-dashed border-ink/15 pt-5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-ink/55">Subtotal</span>
                                                <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-ink/55">Delivery</span>
                                                <span className={cn('font-bold', shipping === 0 ? 'text-jade' : 'text-ink')}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                            </div>
                                            {appliedDiscount && appliedDiscount.discountAmount && (
                                                <div className="flex justify-between text-sm font-bold text-jade">
                                                    <span>Discount ({appliedDiscount.code})</span>
                                                    <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                                                </div>
                                            )}
                                            {discount > 0 && !appliedDiscount && (
                                                <div className="flex justify-between text-sm font-bold text-terracotta">
                                                    <span>Discount</span>
                                                    <span>-{formatPrice(discount)}</span>
                                                </div>
                                            )}
                                            <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4 font-display text-4xl text-ink">
                                                <span>Total</span>
                                                <span>{formatPrice(grandTotal)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-background p-4">
                                            <Checkbox
                                                id="accept-policies"
                                                name="acceptPolicies"
                                                required
                                                checked={hasAcceptedPolicies}
                                                onCheckedChange={(checked) => setHasAcceptedPolicies(checked === true)}
                                                className="mt-1"
                                            />
                                            <label htmlFor="accept-policies" className="text-sm leading-6 text-ink/70">
                                                I have read and agree to the{' '}
                                                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-terracotta underline-offset-2">Privacy Policy</Link>
                                                {' '}and{' '}
                                                <Link to="/returns" target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-terracotta underline-offset-2">Returns &amp; Refunds policy</Link>.
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isProcessing || isValidatingDiscount || !hasAcceptedPolicies}
                                            className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-terracotta text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-gold transition-all hover:bg-ink active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-terracotta"
                                        >
                                            <Lock className="h-4 w-4" />
                                            Place order
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </button>

                                        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-ink/55">
                                            <span className="flex flex-col items-center gap-1.5 rounded-2xl bg-background px-2 py-3"><ShieldCheck className="h-4 w-4 text-royal" />Secure &amp; encrypted</span>
                                            <span className="flex flex-col items-center gap-1.5 rounded-2xl bg-background px-2 py-3"><Truck className="h-4 w-4 text-jade" />Free UK delivery</span>
                                            <span className="flex flex-col items-center gap-1.5 rounded-2xl bg-background px-2 py-3"><Factory className="h-4 w-4 text-terracotta" />Made in the UK</span>
                                        </div>
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
