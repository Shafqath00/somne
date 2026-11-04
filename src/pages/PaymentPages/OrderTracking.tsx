import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { Package, Truck, Check, Clock, ArrowRight, Mail, Hash, Search } from "lucide-react";
import { InlineDots, LOGO_DOTS } from "@/components/ui/SomneLoader";
import { trackOrder, TrackedOrder } from "@/api/api";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const orderStatusSteps = [
    { status: "Processing", label: "Processing", icon: Clock },
    { status: "Shipped", label: "Shipped", icon: Truck },
    { status: "Delivered", label: "Delivered", icon: Check },
];

export default function OrderTracking() {
    const [orderReference, setOrderReference] = useState("");
    const [email, setEmail] = useState("");
    const [orders, setOrders] = useState<TrackedOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderReference.trim() || !email.trim()) return;

        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const results = await trackOrder(orderReference.trim(), email.trim());
            setOrders(results);
        } catch (err) {
            setError("Failed to find order. Please check your details and try again.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => `£${price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

    const getStatusIndex = (status: string) => {
        const idx = orderStatusSteps.findIndex(s => s.status.toLowerCase() === status?.toLowerCase());
        return idx >= 0 ? idx : 0;
    };

    const isFormValid = orderReference.trim().length > 0 && email.trim().length > 0;

    return (
        <>
            <Helmet>
                <title>Track Your Order | SOMNE</title>
            </Helmet>
            <Layout>
                <div className="relative min-h-[85vh] overflow-hidden bg-background section-padding pt-16 md:pt-24">
                    <span aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-terracotta/15 blur-3xl" />
                    <span aria-hidden className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-royal/15 blur-3xl" />
                    <div className="luxury-container relative max-w-4xl">
                        {/* Header */}
                        <div className="text-center mb-10 md:mb-16">
                            <div className="mb-5 flex justify-center gap-1.5" aria-hidden>
                                {LOGO_DOTS.map((c) => <span key={c} className={cn("h-2 w-2 rounded-full", c)} />)}
                            </div>
                            <span className="text-terracotta text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 block animate-fade-in-up">Order Status</span>
                            <h1 className="font-display text-5xl md:text-7xl text-ink mb-6 animate-fade-in-up animation-delay-100 tracking-[-0.03em]">
                                Track your order
                            </h1>
                            <p className="text-ink/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                                Enter your order reference and email address to check your delivery status.
                            </p>
                        </div>

                        {/* Search Form */}
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-medium mb-12 border border-ink/5 animate-fade-in-up animation-delay-300">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Order Reference Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-ink flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-terracotta" />
                                            Order Reference
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. A1B2C3D4"
                                            value={orderReference}
                                            onChange={(e) => setOrderReference(e.target.value.toUpperCase())}
                                            className="h-14 bg-background border-0 ring-1 ring-ink/10 focus-visible:ring-terracotta/60 text-lg rounded-2xl pl-4 placeholder:text-ink/30 font-mono uppercase"
                                            maxLength={8}
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-ink flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-royal" />
                                            Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="Your order email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 bg-background border-0 ring-1 ring-ink/10 focus-visible:ring-terracotta/60 text-lg rounded-2xl pl-4 placeholder:text-ink/30"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-full bg-terracotta text-white shadow-gold hover:bg-ink transition-all duration-300 text-sm font-extrabold uppercase tracking-[0.14em] disabled:opacity-50"
                                    disabled={loading || !isFormValid}
                                >
                                    {loading ? (
                                        <InlineDots className="[&_span]:!bg-white" />
                                    ) : (
                                        <>
                                            Track order
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <p className="text-xs text-ink/50 text-center mt-4">
                                Your order reference was sent to your email after purchase
                            </p>
                        </div>

                        {/* Results */}
                        {searched && !loading && (
                            <div className="animate-fade-in-up">
                                {error && (
                                    <div className="bg-terracotta/10 border border-terracotta/20 text-terracotta-deep rounded-2xl p-6 text-center mb-8 flex flex-col items-center">
                                        <div className="w-10 h-10 bg-terracotta/15 rounded-full flex items-center justify-center mb-3">
                                            <Search className="w-5 h-5 text-terracotta" />
                                        </div>
                                        <p className="font-medium">{error}</p>
                                    </div>
                                )}

                                {orders.length === 0 && !error && (
                                    <div className="bg-white rounded-[2rem] p-12 text-center shadow-medium border border-ink/5">
                                        <div className="w-20 h-20 bg-gradient-to-br from-terracotta/15 via-saffron/15 to-royal/15 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-10 h-10 text-terracotta" />
                                        </div>
                                        <h2 className="font-display text-3xl text-ink mb-3">No orders found</h2>
                                        <p className="text-ink/60 mb-8 max-w-md mx-auto leading-relaxed">
                                            We couldn't find any orders matching your reference and email.
                                            Please double check your details.
                                        </p>
                                        <Button variant="outline" asChild className="rounded-full px-8 border-ink/15 font-bold text-ink hover:bg-ink hover:text-white">
                                            <Link to="/contact">Need Help? Contact Support</Link>
                                        </Button>
                                    </div>
                                )}

                                {orders.length > 0 && (
                                    <div className="space-y-8">
                                        {orders.map((order) => {
                                            const statusIndex = getStatusIndex(order.status);
                                            return (
                                                <div key={order.orderId} className="bg-white rounded-[2rem] overflow-hidden shadow-medium border border-ink/5 relative group">
                                                    {/* Decorative Top Accent */}
                                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta via-saffron via-jade to-royal" />

                                                    {/* Order Header */}
                                                    <div className="p-6 md:p-8 border-b border-ink/5 bg-background/60">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div>
                                                                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1 font-bold">Order reference</p>
                                                                <div className="flex items-center gap-3">
                                                                    <code className="text-2xl font-mono font-bold text-ink">
                                                                        {order.orderReference}
                                                                    </code>
                                                                    <span className="bg-jade text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="md:text-right">
                                                                <p className="text-xs uppercase tracking-wider text-ink/50 mb-1 font-bold">Placed on</p>
                                                                <p className="font-display text-xl text-ink">
                                                                    {order.createdAt
                                                                        ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric'
                                                                        })
                                                                        : 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 md:p-8">
                                                        {/* Status Progress */}
                                                        <div className="mb-12 relative px-4">
                                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-ink/10 -z-10 -translate-y-1/2 rounded-full" />
                                                            <div
                                                                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-terracotta via-saffron to-jade -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
                                                                style={{ width: `${(statusIndex / (orderStatusSteps.length - 1)) * 100}%` }}
                                                            />

                                                            <div className="flex justify-between relative">
                                                                {orderStatusSteps.map((step, idx) => {
                                                                    const isCompleted = idx <= statusIndex;
                                                                    const isCurrent = idx === statusIndex;
                                                                    return (
                                                                        <div key={step.status} className="flex flex-col items-center group/step">
                                                                            <div className={cn(
                                                                                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border-[3px]",
                                                                                isCompleted
                                                                                    ? "bg-white border-terracotta text-terracotta shadow-gold scale-110"
                                                                                    : "bg-white border-ink/10 text-ink/25 scale-100"
                                                                            )}>
                                                                                <step.icon className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform duration-500", isCurrent && "scale-110")} />
                                                                            </div>
                                                                            <div className={cn(
                                                                                "absolute -bottom-8 md:-bottom-10 text-xs md:text-sm font-medium transition-all duration-300 transform whitespace-nowrap",
                                                                                isCompleted ? "text-ink font-bold translate-y-0 opacity-100" : "text-ink/50 translate-y-1 opacity-70"
                                                                            )}>
                                                                                {step.label}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Order Items */}
                                                        <div className="space-y-6 mt-16">
                                                            <h3 className="font-display text-2xl text-ink pb-4 border-b border-dashed border-ink/15">Order summary</h3>
                                                            {order.items?.map((item, i) => (
                                                                <div key={i} className="flex gap-4 md:gap-6 group/item">
                                                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-background rounded-2xl overflow-hidden flex-shrink-0 border border-ink/5 shadow-soft">
                                                                        {item.image ? (
                                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                                                                <Package className="w-8 h-8" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                        <div className="flex justify-between items-start gap-4 mb-1">
                                                                            <h4 className="font-display text-lg md:text-xl text-ink line-clamp-2">{item.name}</h4>
                                                                            <span className="font-display text-lg md:text-xl text-ink whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                                                                        </div>
                                                                        <p className="text-sm text-ink/60 mb-2">
                                                                            <span className="inline-block mr-3">Qty: {item.quantity}</span>
                                                                            {item.selectedSize && <span className="inline-block mr-3 px-2.5 py-0.5 bg-background rounded-full text-xs font-semibold">{item.selectedSize}</span>}
                                                                            {item.selectedColor && <span className="inline-block px-2.5 py-0.5 bg-background rounded-full text-xs font-semibold">{item.selectedColor}</span>}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Order Footer (Total & Shipping) */}
                                                        <div className="mt-8 pt-8 border-t border-dashed border-ink/15 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-background/60 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8">
                                                            <div>
                                                                <h4 className="text-xs uppercase tracking-wider text-ink/50 mb-3 font-bold">Delivery address</h4>
                                                                {order.shippingDetails?.firstName ? (
                                                                    <div className="text-sm text-ink space-y-1">
                                                                        <p className="font-medium">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                                                        {order.shippingDetails.city && <p>{order.shippingDetails.city}</p>}
                                                                        {order.shippingDetails.postalCode && <p>{order.shippingDetails.postalCode}</p>}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-ink/50 italic">Standard delivery</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-baseline gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-ink/10 pt-4 md:pt-0">
                                                                <span className="text-sm uppercase tracking-widest text-ink/50 font-bold">Total paid</span>
                                                                <span className="font-display text-4xl text-terracotta">{formatPrice(order.total)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Help Link */}
                        <div className="text-center mt-8">
                            <p className="text-sm text-ink/55">
                                Can't find your order?{" "}
                                <Link to="/contact" className="font-bold text-terracotta hover:underline">Contact our support team</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
