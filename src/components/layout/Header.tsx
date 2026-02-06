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

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // 13 hour cycle in milliseconds
      const cycleDuration = 13 * 60 * 60 * 1000;
      // Calculate remaining time in the current cycle based on UTC timestamp
      const elapsed = now.getTime() % cycleDuration;
      const remaining = cycleDuration - elapsed;

      const hours = Math.floor((remaining / (1000 * 60 * 60)));
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Initial update
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      "md:fixed top-0 left-0 right-0 z-40 border-b bg-white transition-all duration-300",
      hasScrolled ? "shadow-lg" : "shadow-none"
    )}>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="luxury-container text-center text-xs tracking-widest uppercase font-sans flex flex-col md:flex-row items-center justify-center gap-2">
          <span>NEW YEAR SALE - EXTRA 25% OFF | ENDS IN</span>
          <span className="font-bold tabular-nums min-w-[60px]">{timeLeft}</span>
          <div className='border p-2 rounded-md'>
            <span>USE CODE </span>
            <span className="font-bold">SOMNE25</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="luxury-container relative md:mr-[150px] mr-0">
        <div className="flex items-center justify-between h-20 w-full">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}


          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigationItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-sm font-sans tracking-wide text-foreground hover:text-white hover:bg-primary transition-colors py-2 px-4 rounded-full"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </Link>
                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2  animate-fade-in">
                    <div className="bg-card  rounded-lg overflow-hidden  min-w-[240px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-5 py-2.5 text-sm font-sans text-foreground hover:bg-primary hover:text-white transition-colors"
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

          <nav className="hidden lg:flex items-center gap-2">
            {navigationItems2.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-sm font-sans tracking-wide text-foreground hover:text-white hover:bg-primary transition-colors py-2 px-4 rounded-full"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2  animate-fade-in">
                    <div className="bg-card  rounded-lg overflow-hidden  min-w-[240px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-5 py-2.5 text-sm font-sans text-foreground hover:bg-primary hover:text-white transition-colors"
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

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative block lg:hidden   p-2 hover:text-accent transition-colors"
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
        <button
          onClick={toggleCart}
          className="absolute -right-6 top-[20px] hidden lg:block p-2 hover:text-accent transition-colors"
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
                      '#857c78'              // 4
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
                  'bg-[#857c78]'  // 4
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
            <div className="pt-4 mt-4 border-t border-border">
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
