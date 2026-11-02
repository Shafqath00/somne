import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown, Search, User, Heart, ArrowUpRight, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { navigationItems, navigationItems2 } from '@/data';
import { navFeatures } from '@/data/revamp';
import { cn } from '@/lib/utils';

const LOGO_DOTS = ['bg-terracotta', 'bg-saffron', 'bg-jade', 'bg-royal', 'bg-plum'];

export function SomneLogo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-end gap-1.5 leading-none', className)}>
      <span
        className={cn(
          'font-display text-[1.9rem] font-semibold italic tracking-[-0.04em] transition-colors md:text-[2.15rem]',
          light ? 'text-white' : 'text-ink'
        )}
      >
        somne
      </span>
      <span className="mb-[0.42rem] flex gap-[3px]" aria-hidden>
        {LOGO_DOTS.map((c) => (
          <span key={c} className={cn('h-[5px] w-[5px] rounded-full', c)} />
        ))}
      </span>
    </span>
  );
}

export function Header() {
  const { isMenuOpen, setIsMenuOpen } = useMobileMenu();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { toggleCart, itemCount } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  // Over the homepage hero the header is transparent with light text
  const solid = !isHome || hasScrolled || activeDropdown !== null;
  const allItems = [...navigationItems, ...navigationItems2];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-[var(--daily-deal-bar-height)] transition-all duration-500',
        isMenuOpen ? 'z-[70]' : 'z-50',
        solid
          ? 'border-b border-ink/5 bg-[hsl(var(--background)/0.92)] shadow-[0_8px_30px_-20px_rgba(20,16,40,0.35)] backdrop-blur-xl'
          : 'bg-gradient-to-b from-black/45 to-transparent'
      )}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="mx-auto grid h-[4.5rem] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-10">
        {/* Left: menu toggle (mobile) / logo (desktop) */}
        <div className="flex items-center">
          <button
            className={cn('-ml-2 rounded-full p-2 lg:hidden', solid ? 'text-ink' : 'text-white')}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" aria-label="Somne home" className="hidden lg:block">
            <SomneLogo light={!solid} />
          </Link>
        </div>

        {/* Centre: logo (mobile) / primary nav (desktop) */}
        <div className="flex justify-center">
          <Link to="/" aria-label="Somne home" className="lg:hidden">
            <SomneLogo light={!solid} />
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex">
            {allItems.map((item) => (
              <div key={item.href} onMouseEnter={() => setActiveDropdown(item.children ? item.label : null)}>
                <Link
                  to={item.href}
                  className={cn(
                    'group relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold tracking-wide transition-colors xl:px-3.5',
                    solid ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10',
                    activeDropdown === item.label && (solid ? 'bg-ink/5' : 'bg-white/10')
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn('h-3.5 w-3.5 transition-transform duration-300', activeDropdown === item.label && 'rotate-180')}
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Right: utilities */}
        <div className={cn('flex items-center justify-end gap-0.5', solid ? 'text-ink' : 'text-white')}>
          <Link
            to="/beds/divan-beds"
            className={cn(
              'mr-2 hidden items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-all xl:inline-flex',
              solid ? 'bg-ink text-white hover:bg-terracotta' : 'bg-white text-ink hover:bg-saffron'
            )}
          >
            Shop the sale
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button className="hidden rounded-full p-2.5 transition-colors hover:bg-current/10 sm:block" aria-label="Search">
            <Search className="h-[19px] w-[19px]" />
          </button>
          <Link to="/track-order" className="hidden rounded-full p-2.5 sm:block" aria-label="Track your order">
            <User className="h-[19px] w-[19px]" />
          </Link>
          <button className="hidden rounded-full p-2.5 md:block" aria-label="Wishlist">
            <Heart className="h-[19px] w-[19px]" />
          </button>
          <button onClick={toggleCart} className="relative rounded-full p-2.5" aria-label="Open cart">
            <ShoppingBag className="h-[21px] w-[21px]" />
            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-white ring-2 ring-background">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop mega menu */}
      {allItems.map((item) =>
        item.children && activeDropdown === item.label ? (
          <div key={item.label} className="absolute inset-x-0 top-full hidden animate-fade-in lg:block">
            <div className="border-t border-ink/5 bg-background shadow-[0_30px_60px_-30px_rgba(20,16,40,0.35)]">
              <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-10 py-10">
                <div className="col-span-4">
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-terracotta">{item.label}</p>
                  <ul className="space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          to={child.href}
                          className="group flex items-center justify-between rounded-xl px-3 py-3 font-display text-2xl text-ink transition-colors hover:bg-white"
                        >
                          {child.label}
                          <ArrowUpRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-3 flex flex-col justify-end gap-4 border-l border-ink/10 pl-10 text-sm text-ink/70">
                  <p className="flex items-center gap-3"><Truck className="h-5 w-5 text-jade" /> Free UK mainland delivery</p>
                  <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-royal" /> 5-year frame warranty</p>
                  <p className="font-display text-xl italic text-ink">Handmade in the UK, in 19 fabrics.</p>
                </div>
                {navFeatures[item.label] && (
                  <Link
                    to={navFeatures[item.label].href}
                    className="group relative col-span-5 overflow-hidden rounded-3xl"
                  >
                    <img
                      src={navFeatures[item.label].image}
                      alt={navFeatures[item.label].title}
                      className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6 text-white">
                      <p className="font-display text-3xl">{navFeatures[item.label].title}</p>
                      <p className="mt-1 text-sm text-white/80">{navFeatures[item.label].caption}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Mobile navigation */}
      <div
        className={cn(
          'fixed inset-0 z-[100] transition-all duration-300 lg:hidden',
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-500 ease-out',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <SomneLogo />
            <button onClick={() => setIsMenuOpen(false)} className="rounded-full bg-ink p-2 text-white" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            {allItems.map((item) => (
              <div key={item.href} className="border-b border-ink/10">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between py-4 font-display text-[1.65rem] text-ink"
                    >
                      {item.label}
                      <ChevronDown className={cn('h-5 w-5 transition-transform', expandedItem === item.label && 'rotate-180')} />
                    </button>
                    <div
                      className={cn(
                        'grid transition-all duration-300',
                        expandedItem === item.label ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        {navFeatures[item.label] && (
                          <Link to={navFeatures[item.label].href} className="relative mb-3 block overflow-hidden rounded-2xl">
                            <img src={navFeatures[item.label].image} alt="" className="h-36 w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <p className="absolute bottom-3 left-4 font-display text-xl text-white">{navFeatures[item.label].title}</p>
                          </Link>
                        )}
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-ink/75"
                          >
                            {child.label}
                            <ArrowUpRight className="h-4 w-4 text-terracotta" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-4 font-display text-[1.65rem] text-ink"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="m-5 rounded-3xl bg-gradient-to-br from-terracotta to-plum p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Today only</p>
            <p className="mt-1 font-display text-2xl">25% off every bed</p>
            <p className="mt-1 text-sm text-white/80">Use code <b>SOMNE25</b> at checkout</p>
          </div>
        </div>
      </div>
    </header>
  );
}
