import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Check, Lock, Truck, Tag, X, Loader2, Box, MapPin, Plus, Minus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CheckOutHandler, createCheckoutSession, validateDiscountCode, DiscountValidationResult, getAutoApplyDiscount } from '@/api/api';

const CHECKOUT_FORM_KEY = 'somne-checkout-form';

// Load saved form data from localStorage
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

// Save form data to localStorage
const saveFormData = (data: object) => {
    try {
        localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save checkout form data:', error);
    }
};

export default function Checkout() {
    const { items, subtotal, shipping, discount, total, clearCart, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize form with saved data or defaults
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

    // Discount code state
    const [discountCode, setDiscountCode] = useState('');
    const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidationResult | null>(null);
    const [discountError, setDiscountError] = useState<string | null>(null);

    // Save form data whenever it changes
    useEffect(() => {
        saveFormData(formData);
    }, [formData]);

    // Auto-apply discount effect
    useEffect(() => {
        const checkAutoApply = async () => {
            // Only apply if no discount is manually applied or entered
            if (!appliedDiscount && !discountCode && subtotal > 0) {
                const autoDiscount = await getAutoApplyDiscount();
                if (autoDiscount && autoDiscount.code) {
                    // console.log("Found auto-apply discount:", autoDiscount.code);
                    setDiscountCode(autoDiscount.code);
                    handleApplyDiscount(autoDiscount.code);

                }
            }
        };

        // Check once subtotal is ready
        if (subtotal > 0) {
            checkAutoApply();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtotal]); // Run when subtotal changes (initially 0 -> X)


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle discount code validation
    const handleApplyDiscount = async (codeToApply?: string) => {
        const code = codeToApply || discountCode;
        if (!code.trim()) {
            if (!codeToApply) setDiscountError('Please enter a discount code');
            return;
        }

        setIsValidatingDiscount(true);
        setDiscountError(null);

        try {
            // Calculate subtotal for beds only and count beds
            let bedQuantity = 0;
            const bedsSubtotal = items.reduce((sum, item) => {
                if (item.product.categoryId === 'beds') {
                    const itemPrice = (item.product.discountPrice || item.product.price || 0) +
                        (item.selectedSize?.priceModifier || 0) +
                        (item.selectedStorage?.priceModifier || 0) +
                        (item.selectedHeadboard?.priceModifier || 0) +
                        (item.hasAssembly ? 49 : 0) +
                        (item.selectedBase?.priceModifier || 0);

                    bedQuantity += item.quantity;
                    return sum + (itemPrice * item.quantity);
                }
                return sum;
            }, 0);

            // If no beds, cannot apply discount (or effectively 0)
            if (bedsSubtotal === 0) {
                setDiscountError('Discount codes are only applicable to beds');
                setAppliedDiscount(null);
                return;
            }

            const result = await validateDiscountCode(code.trim(), bedsSubtotal);

            if (result.valid) {
                // For fixed discounts, multiply by bed quantity
                if (result.type === 'fixed' && bedQuantity > 1) {
                    const totalDiscount = (result.value || 0) * bedQuantity;
                    // Adjust the result object to reflect the per-bed discount
                    result.discountAmount = totalDiscount;
                    // Optional: Update validation message
                    result.message = `£${result.value} off per bed applied! (x${bedQuantity})`;
                }

                setAppliedDiscount(result);
                setDiscountError(null);
                if (!codeToApply) toast.success(result.message || 'Discount applied!');
            } else {
                setDiscountError(result.error || 'Invalid discount code');
                setAppliedDiscount(null);
            }
        } catch (error) {
            setDiscountError('Failed to validate discount code');
            setAppliedDiscount(null);
        } finally {
            setIsValidatingDiscount(false);
        }
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode('');
        setDiscountError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Create Order in Database
            const orderItems = items.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                image: item.selectedColor?.image || item.selectedColor?.productImages?.[0] || item.product.colors?.[0]?.image || item.product.images[0],
                quantity: item.quantity,
                price: (item.product.discountPrice || item.product.price || 0) +
                    (item.selectedSize?.priceModifier || 0) +
                    (item.selectedStorage?.priceModifier || 0) +
                    (item.selectedHeadboard?.priceModifier || 0) +

                    (item.hasAssembly ? 49 : 0) +
                    (item.selectedBase?.priceModifier || 0), // Calculate unit price accurately
                hasAssembly: item.hasAssembly,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                selectedStorage: item.selectedStorage,
                selectedHeadboard: item.selectedHeadboard,
                selectedBase: item.selectedBase,
            }));

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

            // 2. Create Stripe Checkout Session (pass discount code if applied)
            const sessionResponse = await createCheckoutSession(
                orderItems,
                orderData,
                formData.email,
                appliedDiscount?.code || undefined
            );

            // 3. Redirect to Stripe
            if (sessionResponse.session && sessionResponse.session.url) {
                window.location.href = sessionResponse.session.url;
            } else {
                toast.error("Failed to start payment session.");
                setIsProcessing(false);
            }

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error('Failed to process checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <Layout>
                <div className="section-padding luxury-container text-center min-h-[60vh] flex flex-col items-center justify-center">
                    <h1 className="font-serif text-3xl mb-4">Your bag is empty</h1>
                    <p className="text-muted-foreground mb-8">Add some luxurious items to your bag to proceed to checkout.</p>
                    <Button variant="luxury" asChild>
                        <Link to="/beds">Browse Products</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    const formatPrice = (price: number) => `£${price.toLocaleString()}`;

    return (
        <>
            <Helmet>
                <title>Checkout | Bed Showroom</title>

            </Helmet>
            <Layout>
                <div className="bg-white min-h-screen pb-12">
                    {/* Checkout Header */}
                    <div className="bg-background border-b border-border py-4 md:py-6 mb-6 md:mb-8">
                        <div className="luxury-container flex items-center justify-between gap-4">
                            <Link to="/beds" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <ArrowLeft className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
                                <span className="hidden md:inline">Continue Shopping</span>
                            </Link>
                            <h1 className="font-serif text-xl md:text-2xl font-medium absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">Checkout</h1>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Lock className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                    <div className="luxury-container">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Left Column: Details */}
                            <div className="lg:col-span-7 space-y-4">
                                {/* Contact Info */}
                                <div className="bg-white shadow-md p-6 md:p-8 rounded-lg border border-border">
                                    <h2 className="font-serif text-xl border-b border-border pb-4 mb-6">Contact Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                className="bg-secondary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone</label>
                                            <Input
                                                required
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+44 7000 000000"
                                                className="bg-secondary/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white shadow-md p-6 md:p-8 rounded-lg border border-border">
                                    <h2 className="font-serif text-xl border-b border-border pb-4 mb-6">Shipping Address</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input
                                                required
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                className="bg-secondary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input
                                                required
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                className="bg-secondary/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <label className="text-sm font-medium">Address</label>
                                        <Input
                                            required
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Luxury Lane"
                                            className="bg-secondary/20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-sm font-medium">City</label>
                                            <Input
                                                required
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="London"
                                                className="bg-secondary/20"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-sm font-medium">Postal Code</label>
                                            <Input
                                                required
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                placeholder="SW1A 1AA"
                                                className="bg-secondary/20"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-sm font-medium">Country</label>
                                            <Input
                                                disabled
                                                value={formData.country}
                                                className="bg-secondary/50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Method */}
                                <div className="bg-white shadow-md p-6 md:p-8 rounded-lg border border-border">
                                    <h2 className="font-serif text-xl border-b border-border pb-4 mb-6">Delivery Method</h2>
                                    <div className="flex items-center justify-between p-4 border border-accent/30 bg-accent/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-accent/10 rounded-full">
                                                <Truck className="w-5 h-5 text-accent" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Standard Delivery</p>
                                                <p className="text-sm text-muted-foreground">3-5 weeks</p>
                                            </div>
                                        </div>
                                        <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                    </div>
                                    <div className="mt-8 border-t border-border pt-6">
                                        <div className="relative flex justify-between  md:mx-10">
                                            {/* Progress Bar Background */}
                                            <div className="absolute top-8 left-0 w-full border bg-black" />

                                            {/* Step 1: Ordered */}
                                            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                                <div className="w-16 h-16 flex items-center justify-center">
                                                    <img src="/img/icons/Ordered1.png" alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-serif text-sm font-medium text-foreground">Ordered</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Step 2: Order Ready */}
                                            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                                {/* Active Line Segment (Partial) - Optional visual flair */}
                                                {/* <div className="absolute top-[1.2rem] right-[50%] w-[100%] h-0.5 bg-accent -z-20" /> */}

                                                <div className="w-20 h-16 flex items-center justify-center">
                                                    <img src="/img/icons/delivered1.png" alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-serif text-sm font-medium text-foreground">Order Ready</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {(() => {
                                                            const start = new Date();
                                                            start.setDate(start.getDate() + 4);
                                                            const end = new Date();
                                                            end.setDate(end.getDate() + 8);
                                                            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Step 3: Delivered */}
                                            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                                <div className="w-20 h-16 flex items-center justify-center">
                                                    <img src="/img/icons/shipped1.png" alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-serif text-sm font-medium text-foreground">Delivered</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {(() => {
                                                            const start = new Date();
                                                            start.setDate(start.getDate() + 9);
                                                            const end = new Date();
                                                            end.setDate(end.getDate() + 18);
                                                            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Order Summary */}
                            <div className="lg:col-span-5">
                                <div className="bg-white shadow-md p-6 md:p-8 rounded-lg border border-border sticky top-8">
                                    <h2 className="font-serif text-xl border-b border-border pb-4 mb-6">Order Summary</h2>

                                    {/* Items List */}
                                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                                        {items.map((item) => {
                                            const itemPrice = (item.product.discountPrice || item.product.price || 0) +
                                                (item.selectedSize?.priceModifier || 0) +
                                                (item.selectedStorage?.priceModifier || 0) +

                                                (item.selectedHeadboard?.priceModifier || 0) +
                                                (item.hasAssembly ? 49 : 0) +
                                                (item.selectedBase?.priceModifier || 0);


                                            // Image Logic: Prefer variant image, fallback to product image
                                            const displayImage = item.selectedColor?.image || item.selectedColor?.productImages?.[0] || item.product.colors?.[0]?.image || item.product.images[0];

                                            return (
                                                <div key={item.cartItemId} className="flex gap-4">
                                                    <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={displayImage}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {item.selectedSize?.name}
                                                        </p>

                                                        {item.selectedColor && (
                                                            <p className="text-xs text-muted-foreground">Color: {item.selectedColor.name}</p>
                                                        )}
                                                        {item.selectedStorage && (
                                                            <p className="text-xs text-muted-foreground">Storage: {item.selectedStorage.name}</p>
                                                        )}
                                                        {item.selectedHeadboard && (
                                                            <p className="text-xs text-muted-foreground">Headboard: {item.selectedHeadboard.name}</p>
                                                        )}
                                                        {item.selectedBase && (
                                                            <p className="text-xs text-muted-foreground">Base: {item.selectedBase.name}</p>
                                                        )}
                                                        {item.selectedFirmness && (
                                                            <p className="text-xs text-muted-foreground">Firmness: {item.selectedFirmness.name}</p>
                                                        )}
                                                        {item.hasAssembly && (
                                                            <p className="text-xs text-emerald-600 font-medium">+ Assembly (£49)</p>
                                                        )}
                                                        <div className="flex justify-between items-center mt-2">
                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                                    className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-secondary transition-colors"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </button>
                                                                <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                                    className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-secondary transition-colors"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.cartItemId)}
                                                                    className="w-6 h-6 flex items-center justify-center rounded border border-red-200 hover:bg-red-50 text-red-500 transition-colors ml-2"
                                                                    aria-label="Remove item"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <span className="font-medium text-sm">{formatPrice(itemPrice * item.quantity)}</span>
                                                        </div>

                                                        {/* Individual Item Discount Tag */}
                                                        {appliedDiscount && item.product.categoryId === 'beds' && (
                                                            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 font-medium">
                                                                <Tag className="w-3 h-3" />
                                                                <span>
                                                                    {appliedDiscount.code} APPLIED
                                                                    {appliedDiscount.type === 'percentage' ? ` - ${appliedDiscount.value}% OFF` : ''}
                                                                    {' '}(-{formatPrice(
                                                                        (appliedDiscount.type === 'percentage'
                                                                            ? (itemPrice * appliedDiscount.value / 100)
                                                                            : appliedDiscount.value) * item.quantity
                                                                    )})
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Discount Code Section */}
                                    <div className="mb-6 pt-4 border-t border-border">
                                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            Discount Code
                                        </h3>

                                        {appliedDiscount ? (
                                            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-emerald-600" />
                                                    <div>
                                                        <span className="font-medium text-emerald-700">{appliedDiscount.code}</span>
                                                        <p className="text-xs text-emerald-600">
                                                            {appliedDiscount.message || (appliedDiscount.type === 'percentage'
                                                                ? `${appliedDiscount.value}% off`
                                                                : `£${appliedDiscount.value} off`)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveDiscount}
                                                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
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
                                                        className="flex-1 bg-secondary/20 uppercase"
                                                        disabled={isValidatingDiscount}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="luxuryOutline"
                                                        size="sm"
                                                        onClick={() => handleApplyDiscount()}
                                                        disabled={isValidatingDiscount || !discountCode.trim()}
                                                    >
                                                        {isValidatingDiscount ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            'Apply'
                                                        )}
                                                    </Button>
                                                </div>
                                                {discountError && (
                                                    <p className="text-xs text-red-500">{discountError}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-3 pt-6 border-t border-border">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        {/* <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Delivery</span>
                                            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                        </div> */}
                                        {appliedDiscount && appliedDiscount.discountAmount && (
                                            <div className="flex justify-between text-sm text-emerald-600">
                                                <span>Discount ({appliedDiscount.code})</span>
                                                <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                                            </div>
                                        )}
                                        {discount > 0 && !appliedDiscount && (
                                            <div className="flex justify-between text-sm text-accent">
                                                <span>Discount</span>
                                                <span>-{formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-serif text-xl border-t border-border pt-4 mt-4">
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

                                    <Button
                                        type="submit"
                                        variant="hero"
                                        size="xl"
                                        className="w-full mt-8"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : 'Place Order'}
                                    </Button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                        <Lock className="w-3 h-3" />
                                        <span>Transactions are 100% Secure and Encypted</span>
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
