import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, ShoppingBag, HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { LOGO_DOTS } from "@/components/ui/SomneLoader";

export default function PaymentCancel() {
    return (
        <>
            <Helmet>
                <title>Payment Cancelled | SOMNE</title>
            </Helmet>
            <Layout>
                <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background section-padding">
                    <span aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-saffron/20 blur-3xl" />
                    <span aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-terracotta/15 blur-3xl" />
                    <div className="luxury-container relative max-w-2xl w-full">
                        <div className="rounded-[2rem] border border-ink/5 bg-white p-8 text-center shadow-medium md:p-12">
                            {/* Cancel Icon */}
                            <div className="w-20 h-20 bg-saffron/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                                <XCircle className="w-10 h-10 text-terracotta" strokeWidth={2} />
                            </div>

                            {/* Main Heading */}
                            <div className="mb-4 flex justify-center gap-1.5" aria-hidden>
                                {LOGO_DOTS.map((c) => <span key={c} className={`h-2 w-2 rounded-full ${c}`} />)}
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl text-ink mb-4 tracking-[-0.02em]">
                                Payment cancelled
                            </h1>

                            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                                Your payment was not completed. Don't worry – your cart items are still saved and ready for you to checkout when you're ready.
                            </p>

                            {/* Reassurance Message */}
                            <div className="bg-background rounded-2xl p-4 mb-8 max-w-md mx-auto">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">No charges were made.</span>{" "}
                                    Your payment details have not been processed.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid gap-4 max-w-sm mx-auto">
                                <Button asChild className="h-14 w-full rounded-full bg-terracotta text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-gold hover:bg-ink">
                                    <Link to="/checkout">
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Return to Checkout
                                    </Link>
                                </Button>

                                <Button variant="outline" asChild className="h-12 w-full rounded-full border-ink/15 font-bold text-ink hover:bg-ink hover:text-white">
                                    <Link to="/beds/upholstered-beds">
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        Continue Shopping
                                    </Link>
                                </Button>

                                <Button variant="ghost" asChild className="w-full text-muted-foreground">
                                    <Link to="/contact">
                                        <HelpCircle className="w-5 h-5 mr-2" />
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
