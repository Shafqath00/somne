import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { navigationItems, navigationItems2 } from '@/data';
import { cn } from '@/lib/utils';

export function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMobileMenu();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { toggleCart, itemCount } = useCart();

  // Logo rotation state
  const logos = [
    '/img/logo/logo1.png',
    '/img/logo/logo2.png',
    '/img/logo/logo3.png',
    '/img/logo/logo4.png', // Placeholder for Gold
    '/img/logo/logo5.png', // Placeholder for Black
  ];
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Rotate logos every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
        setIsAnimating(false);
      }, 300); // Duration of exit animation
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [logos.length]);

  // Scroll detection
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed left-3 right-3 top-[calc(var(--daily-deal-bar-height)+0.75rem)] z-50 rounded-full border bg-white transition-all duration-300 md:left-1/2 md:right-auto md:top-[calc(var(--daily-deal-bar-height)+1rem)] md:w-[95%] md:max-w-7xl md:-translate-x-1/2",
      hasScrolled ? "top-[calc(var(--daily-deal-bar-height)+0.5rem)] shadow-lg md:top-[calc(var(--daily-deal-bar-height)+0.75rem)]" : "shadow-md"
    )}>
      {/* Main header */}
      <div className="px-6 md:px-8 relative">
        <div className="flex items-center justify-between h-16 md:h-20 w-full">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo (Left) */}
          <Link to="/" className="flex-shrink-0 flex items-center flex-col relative overflow-hidden translate-y-1">
            <h1
              key={currentLogoIndex}
              className={`text-4xl font-black transition-all duration-300  ease-out ${isAnimating
                ? 'opacity-0 translate-y-full'
                : 'opacity-100 translate-y-0 animate-slide-down-logo'
                }`}
              style={
                {
                  color: [
                    'hsl(var(--primary))', // 0
                    '#C0C0C0',             // 1
                    '#0466c8',                    // 2 (Handled above)
                    '#F5E7C6',             // 3
                    '#005F02'              // 4
                  ][currentLogoIndex] || 'hsl(var(--primary))'
                }
              }
            >
              SOMNE
            </h1>
            <div className="flex justify-between items-start w-full h-6 ">
              {[
                'bg-primary', // 0
                'bg-[#C0C0C0]', // 1
                'bg-[#0466c8]', // 2
                'bg-[#F5E7C6]', // 3
                'bg-[#005F02]'  // 4
              ].map((colorClass, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    if (currentLogoIndex === index) return;
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentLogoIndex(index);
                      setIsAnimating(false);
                    }, 300);
                  }}
                >
                  <div className={`w-full h-2 ${colorClass} transition-all duration-300 rounded-sm`} />
                  <div className={`w-1 h-1 ${colorClass} rounded-full mt-1 transition-all duration-300 ${currentLogoIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                </div>
              ))}
            </div>
          </Link>
          {/* Desktop navigation (Center) */}
          <nav className="hidden lg:flex items-center justify-center gap-6 absolute left-1/2 -translate-x-1/2">
            {[...navigationItems, ...navigationItems2].map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <span className="flex items-center gap-1 text-sm font-sans tracking-wide text-foreground hover:text-gray-500 transition-colors cursor-pointer py-2">
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 text-sm font-sans tracking-wide text-foreground hover:text-gray-500 transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 animate-fade-in">
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden min-w-[200px] border border-gray-100 p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2 text-sm font-sans text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>


          {/* Mobile Cart button */}
          <button
            onClick={toggleCart}
            className="relative block lg:hidden p-2 hover:text-gray-500 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Right Icons */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 n hidden lg:flex items-center gap-4">
          <button className="p-2 hover:text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
          <button className="p-2 hover:text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
          <button className="p-2 hover:text-gray-500 transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            <span className="absolute 1 top-0 right-0 bg-black text-white text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <button
            onClick={toggleCart}
            className="relative p-2 hover:text-gray-500 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute 1 top-0 right-0 bg-black text-white text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation - Full screen overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-[100] transition-all duration-300',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 z-[100] bg-black/20 backdrop-blur-sm transition-opacity duration-300",
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-full z-[101] bg-background shadow-2xl transition-transform duration-300 ease-out flex flex-col',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Link to="/" className="flex-shrink-0 flex items-center flex-col relative overflow-hidden translate-y-1">
              <h1
                key={currentLogoIndex}
                className={`text-6xl font-black transition-all duration-300  ease-out ${isAnimating
                  ? 'opacity-0 translate-y-full'
                  : 'opacity-100 translate-y-0 animate-slide-down-logo'
                  }`}
                style={
                  {
                    color: [
                      'hsl(var(--primary))', // 0
                      '#C0C0C0',             // 1
                      '#0466c8',                    // 2 (Handled above)
                      '#F5E7C6',             // 3
                      '#005F02'              // 4
                    ][currentLogoIndex] || 'hsl(var(--primary))'
                  }
                }
              >
                SOMNE
              </h1>
              <div className="flex justify-between items-start w-full h-6 ">
                {[
                  'bg-primary', // 0
                  'bg-[#C0C0C0]', // 1
                  'bg-[#0466c8]', // 2
                  'bg-[#F5E7C6]', // 3
                  'bg-[#005F02]'  // 4
                ].map((colorClass, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 group cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      if (currentLogoIndex === index) return;
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentLogoIndex(index);
                        setIsAnimating(false);
                      }, 300);
                    }}
                  >
                    <div className={`w-full h-2 ${colorClass} transition-all duration-300 rounded-sm`} />
                    <div className={`w-1 h-1 ${colorClass} rounded-full mt-1 transition-all duration-300 ${currentLogoIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                  </div>
                ))}
              </div>
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
                {item.children ? (
                  // Parent item with children - clickable to toggle dropdown
                  <>
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                      className="flex items-center justify-between py-4 w-full text-left text-2xl font-serif text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-200",
                          expandedItem === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        expandedItem === item.label ? "max-h-96 pb-4" : "max-h-0"
                      )}
                    >
                      <div className="space-y-1">
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
                    </div>
                  </>
                ) : (
                  // Simple link without children
                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-4 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Secondary navigation items */}
            <div className="border-border">
              {navigationItems2.map((item) => (
                <div
                  key={item.href}
                  className="border-b border-border/50 last:border-b-0"
                >
                  {item.children ? (
                    // Parent item with children - clickable to toggle dropdown
                    <>
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                        className="flex items-center justify-between py-4 w-full text-left text-2xl font-serif text-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-200",
                            expandedItem === item.label && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          expandedItem === item.label ? "max-h-96 pb-4" : "max-h-0"
                        )}
                      >
                        <div className="space-y-1">
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
                      </div>
                    </>
                  ) : (
                    // Simple link without children
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-4 text-2xl font-serif text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
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
    </header>
  );
}
