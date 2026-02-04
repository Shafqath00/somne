import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { Search, Package, Truck, Check, Clock, Loader2, ArrowRight, Mail, Hash } from "lucide-react";
import { trackOrder, TrackedOrder } from "@/api/api";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const orderStatusSteps = [
    { status: "Processing", label: "Processing", icon: Clock },
    { status: "Shipped", label: "Shipped", icon: Truck },
    { status: "Delivered", label: "Delivered", icon: Check },
];

export default function OrderTracking() {
    const [searchType, setSearchType] = useState<"reference" | "email">("reference");
    const [searchValue, setSearchValue] = useState("");
    const [orders, setOrders] = useState<TrackedOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const results = await trackOrder(
                searchType === "reference" ? searchValue.trim() : undefined,
                searchType === "email" ? searchValue.trim() : undefined
            );
            setOrders(results);
        } catch (err) {
            setError("Failed to find order. Please try again.");
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

    return (
        <>
            <Helmet>
                <title>Track Your Order | SOMNE</title>
            </Helmet>
            <Layout>
                <div className="min-h-[85vh] bg-[#fafafa] section-padding pt-16 md:pt-24">
                    <div className="luxury-container max-w-4xl">
                        {/* Header */}
                        <div className="text-center mb-10 md:mb-16">
                            <span className="text-accent text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 block animate-fade-in-up">Order Status</span>
                            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6 animate-fade-in-up animation-delay-100 font-medium">
                                Track Your Order
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                                Enter your details below to check the real-time status of your delivery.
                            </p>
                        </div>

                        {/* Search Form */}
                        <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-black/5 mb-12 border border-black/5 animate-fade-in-up animation-delay-300 transform transition-all hover:shadow-3xl duration-500">
                            <div className="flex flex-col md:flex-row gap-2">
                                {/* Search Type Toggle */}
                                <div className="flex bg-secondary/30 rounded-2xl p-1.5 md:w-auto shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => { setSearchType("reference"); setSearchValue(""); }}
                                        className={cn(
                                            "flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300",
                                            searchType === "reference"
                                                ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                        )}
                                    >
                                        <Hash className="w-4 h-4" />
                                        <span className="hidden md:inline">Reference</span>
                                        <span className="md:hidden">Ref</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSearchType("email"); setSearchValue(""); }}
                                        className={cn(
                                            "flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300",
                                            searchType === "email"
                                                ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                        )}
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </button>
                                </div>

                                <form onSubmit={handleSearch} className="flex-1 flex flex-col md:flex-row gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                                            {searchType === "reference" ? <Hash className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                                        </div>
                                        <Input
                                            type={searchType === "email" ? "email" : "text"}
                                            placeholder={searchType === "reference" ? "Enter Order Reference (e.g. A1B2C3D4)" : "Enter Email Address"}
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(searchType === "reference" ? e.target.value.toUpperCase() : e.target.value)}
                                            className="w-full bg-transparent border-0 ring-1 ring-black/5 focus-visible:ring-accent/50 text-lg h-[54px] rounded-2xl pl-12 placeholder:text-muted-foreground/40 font-light"
                                            maxLength={searchType === "reference" ? 8 : undefined}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="h-[54px] px-8 rounded-2xl bg-foreground text-background hover:bg-accent hover:text-foreground transition-all duration-300 text-base font-medium min-w-[140px]"
                                        disabled={loading || !searchValue.trim()}
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Track
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Results */}
                        {searched && !loading && (
                            <div className="animate-fade-in-up">
                                {error && (
                                    <div className="bg-red-50/50 backdrop-blur border border-red-100 text-red-600 rounded-2xl p-6 text-center mb-8 flex flex-col items-center">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                            <Search className="w-5 h-5 text-red-500" />
                                        </div>
                                        <p className="font-medium">{error}</p>
                                    </div>
                                )}

                                {orders.length === 0 && !error && (
                                    <div className="bg-white rounded-3xl p-12 text-center shadow-xl shadow-black/5 border border-black/5">
                                        <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-10 h-10 text-muted-foreground/40" />
                                        </div>
                                        <h2 className="font-serif text-2xl font-medium text-foreground mb-3">No Orders Found</h2>
                                        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed font-light">
                                            We couldn't find any orders matching your {searchType === "reference" ? "reference" : "email"}.
                                            Please double check your details.
                                        </p>
                                        <Button variant="outline" asChild className="rounded-full px-8">
                                            <Link to="/contact">Need Help? Contact Support</Link>
                                        </Button>
                                    </div>
                                )}

                                {orders.length > 0 && (
                                    <div className="space-y-8">
                                        {orders.map((order) => {
                                            const statusIndex = getStatusIndex(order.status);
                                            return (
                                                <div key={order.orderId} className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 border border-black/5 relative group">
                                                    {/* Decorative Top Accent */}
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />

                                                    {/* Order Header */}
                                                    <div className="p-6 md:p-8 border-b border-border/40 bg-secondary/5">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div>
                                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">Order Reference</p>
                                                                <div className="flex items-center gap-3">
                                                                    <code className="text-2xl font-mono font-bold text-foreground">
                                                                        {order.orderReference}
                                                                    </code>
                                                                    <span className="bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                        {order.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="md:text-right">
                                                                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">Placed On</p>
                                                                <p className="font-serif text-lg text-foreground">
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
                                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary -z-10 -translate-y-1/2 rounded-full" />
                                                            <div
                                                                className="absolute top-1/2 left-0 h-0.5 bg-accent -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
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
                                                                                    ? "bg-white border-accent text-accent shadow-lg shadow-accent/20 scale-110"
                                                                                    : "bg-white border-secondary text-muted-foreground/30 scale-100"
                                                                            )}>
                                                                                <step.icon className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform duration-500", isCurrent && "scale-110")} />
                                                                            </div>
                                                                            <div className={cn(
                                                                                "absolute -bottom-8 md:-bottom-10 text-xs md:text-sm font-medium transition-all duration-300 transform whitespace-nowrap",
                                                                                isCompleted ? "text-foreground translate-y-0 opacity-100" : "text-muted-foreground translate-y-1 opacity-60"
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
                                                            <h3 className="font-serif text-xl text-foreground pb-4 border-b border-dashed border-border/60">Order Summary</h3>
                                                            {order.items?.map((item, i) => (
                                                                <div key={i} className="flex gap-4 md:gap-6 group/item">
                                                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-secondary/20 rounded-xl overflow-hidden flex-shrink-0 border border-black/5 shadow-sm">
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
                                                                            <h4 className="font-serif text-base md:text-lg font-medium text-foreground line-clamp-2">{item.name}</h4>
                                                                            <span className="font-serif text-base md:text-lg font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground mb-2">
                                                                            <span className="inline-block mr-3">Qty: {item.quantity}</span>
                                                                            {item.selectedSize && <span className="inline-block mr-3 px-2 py-0.5 bg-secondary/50 rounded text-xs">{item.selectedSize}</span>}
                                                                            {item.selectedColor && <span className="inline-block px-2 py-0.5 bg-secondary/50 rounded text-xs">{item.selectedColor}</span>}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Order Footer (Total & Shipping) */}
                                                        <div className="mt-8 pt-8 border-t border-dashed border-border/60 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-secondary/5 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8">
                                                            <div>
                                                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-bold">Delivery Address</h4>
                                                                {order.shippingDetails?.firstName ? (
                                                                    <div className="text-sm text-foreground space-y-1 font-light">
                                                                        <p className="font-medium">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                                                        {order.shippingDetails.city && <p>{order.shippingDetails.city}</p>}
                                                                        {order.shippingDetails.postalCode && <p>{order.shippingDetails.postalCode}</p>}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-muted-foreground italic">Standard Delivery</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-baseline gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
                                                                <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Total Paid</span>
                                                                <span className="font-serif text-3xl font-medium text-accent">{formatPrice(order.total)}</span>
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
                            <p className="text-sm text-muted-foreground">
                                Can't find your order?{" "}
                                <Link to="/contact" className="text-accent hover:underline">Contact our support team</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
