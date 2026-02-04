import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, ShoppingBag, HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function PaymentCancel() {
    return (
        <>
            <Helmet>
                <title>Payment Cancelled | SOMNE</title>
            </Helmet>
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center bg-secondary/30 section-padding">
                    <div className="luxury-container max-w-2xl w-full">
                        <div className="bg-background rounded-2xl p-8 md:p-12 text-center shadow-lg border border-border/50">
                            {/* Cancel Icon */}
                            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                                <XCircle className="w-10 h-10 text-amber-600" strokeWidth={2} />
                            </div>

                            {/* Main Heading */}
                            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                                Payment Cancelled
                            </h1>

                            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                                Your payment was not completed. Don't worry – your cart items are still saved and ready for you to checkout when you're ready.
                            </p>

                            {/* Reassurance Message */}
                            <div className="bg-secondary/50 rounded-lg p-4 mb-8 max-w-md mx-auto">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">No charges were made.</span>{" "}
                                    Your payment details have not been processed.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid gap-4 max-w-sm mx-auto">
                                <Button variant="hero" size="xl" asChild className="w-full">
                                    <Link to="/checkout">
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Return to Checkout
                                    </Link>
                                </Button>

                                <Button variant="outline" asChild className="w-full">
                                    <Link to="/beds">
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
