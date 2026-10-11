/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import confetti from "canvas-confetti";
import { getOrderBySession, OrderBySession } from "@/api/api";
import { useCart } from "@/contexts/CartContext";

export default function PaymentSuccess() {
    const search = new URLSearchParams(useLocation().search);
    const sessionId = search.get("session_id");
    const { clearCart } = useCart();

    const [order, setOrder] = useState<OrderBySession | null>(null);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    // Fetch order data and clear cart - only once
    useEffect(() => {
        if (hasFetched.current) return;

        const fetchOrder = async () => {
            if (sessionId) {
                hasFetched.current = true;
                const orderData = await getOrderBySession(sessionId);
                setOrder(orderData);

                // Clear cart after successful payment
                clearCart();
            }
            setLoading(false);
        };

        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]); // Removed clearCart from dependencies

    const formatPrice = (price: number) => `£${price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

    return (
        <>
            <Helmet>
                <title>Order Confirmed | SOMNE</title>
            </Helmet>
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center bg-secondary/30 section-padding">
                    <div className="luxury-container max-w-2xl w-full">
                        <div className="bg-background rounded-2xl p-8 md:p-12 text-center shadow-lg border border-border/50">
                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
                            </div>

                            {/* Main Heading */}
                            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                                Thank You for Your Order!
                            </h1>

                            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                                Your payment has been successfully processed. We have sent a confirmation email to{" "}
                                {order?.shippingDetails?.email && (
                                    <span className="font-medium text-foreground">{order.shippingDetails.email}</span>
                                )}
                            </p>

                            {/* Order Reference */}
                            <div className="bg-secondary/50 rounded-lg p-4 mb-8 inline-block mx-auto">
                                <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                                ) : (
                                    <code className="text-lg font-mono font-bold text-foreground bg-background px-3 py-1.5 rounded border border-border">
                                        {order?.orderNumber ? `#${order.orderNumber}` : (order?.orderReference || sessionId?.slice(-8).toUpperCase() || "PENDING")}
                                    </code>
                                )}
                            </div>

                            {/* Order Summary */}
                            {order && (
                                <div className="bg-secondary/30 rounded-lg p-4 mb-8 text-left max-w-sm mx-auto">
                                    <h3 className="font-medium text-foreground mb-3 text-center">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="flex gap-4 py-4 border-b border-border last:border-0">
                                                {/* Product Image */}
                                                <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-border">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                                                            No Img
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 text-left">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-medium text-foreground text-base">{item.name}</span>
                                                        <span className="font-medium text-foreground ml-2">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>

                                                    <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                                                        <p>Quantity: {item.quantity}</p>
                                                        {item.selectedSize?.name && <p>Size: {item.selectedSize.name}</p>}
                                                        {item.selectedColor?.name && <p>Color: {item.selectedColor.name}</p>}
                                                        {item.selectedStorage?.name && <p>Storage: {item.selectedStorage.name}</p>}
                                                        {item.selectedHeadboard?.name && <p>Headboard: {item.selectedHeadboard.name}</p>}
                                                        {item.selectedBase?.name && <p>Base: {item.selectedBase.name}</p>}
                                                        {item.selectedFirmness?.name && <p>Firmness: {item.selectedFirmness.name}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="border-t border-border pt-2 flex justify-between font-medium">
                                            <span>Total</span>
                                            <span className="text-accent">{formatPrice(order.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Next Steps */}
                            <div className="grid gap-4 max-w-sm mx-auto">
                                <Button variant="hero" size="xl" asChild className="w-full">
                                    <Link to="/beds">
                                        Continue Shopping <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>

                                <Button variant="outline" asChild className="w-full">
                                    <Link to="/track-order">
                                        Track Your Order
                                    </Link>
                                </Button>

                                <Button variant="ghost" asChild className="w-full text-muted-foreground">
                                    <Link to="/contact">
                                        Need Help? Contact Support
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
