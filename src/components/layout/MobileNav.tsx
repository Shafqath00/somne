import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { navigationItems, navigationItems2 } from '@/data';
import { cn } from '@/lib/utils';

export function MobileNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toggleCart, itemCount } = useCart();

    return (
        <>
            {/* Mobile Header Bar - Fixed at top */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
                <div className="flex items-center justify-between h-14 px-4">
                    {/* Menu button */}
                    <button
                        className="p-2 -ml-2"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-black text-primary">SOMNE</h1>
                    </Link>

                    {/* Cart button */}
                    <button
                        onClick={toggleCart}
                        className="relative p-2 -mr-2"
                        aria-label="Open cart"
                    >
                        <ShoppingBag className="h-6 w-6" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Full Screen Mobile Navigation Overlay */}
            <div
                className={cn(
                    'lg:hidden fixed inset-0 z-[100] transition-all duration-300',
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
            >
                {/* Backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
                        isMenuOpen ? 'opacity-100' : 'opacity-0'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Panel - Full Screen */}
                <div
                    className={cn(
                        'absolute inset-0 bg-background transition-transform duration-300 ease-out flex flex-col',
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    {/* Header with close button */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex-shrink-0">
                            <h1 className="text-3xl font-black text-primary">SOMNE</h1>
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 -mr-2 hover:bg-secondary rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Scrollable menu content */}
                    <nav className="flex-1 overflow-y-auto px-6 py-4">
                        {navigationItems.map((item, index) => (
                            <div
                                key={item.href}
                                className={cn(
                                    "border-b border-border/50 animate-in slide-in-from-left duration-300",
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link
                                    to={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between py-4 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                                >
                                    {item.label}
                                    {item.children && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </Link>
                                {item.children && (
                                    <div className="pb-4 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                to={child.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 py-2.5 pl-4 text-xl font-sans text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-all"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Secondary navigation items */}
                        <div className="pt-4 mt-4 border-t border-border">
                            {navigationItems2.map((item) => (
                                <div
                                    key={item.href}
                                    className="border-b border-border/50 last:border-b-0"
                                >
                                    <Link
                                        to={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between py-4 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                    {item.children && (
                                        <div className="pb-4 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    to={child.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 py-2.5 pl-4 text-xl font-sans text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-all"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </nav>

                    {/* Bottom CTA */}
                    <div className="p-6 border-t border-border bg-secondary/30">
                        <Button
                            variant="hero"
                            size="xl"
                            className="w-full"
                            onClick={() => {
                                setIsMenuOpen(false);
                                toggleCart();
                            }}
                        >
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            View Cart {itemCount > 0 && `(${itemCount})`}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
