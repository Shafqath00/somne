import { X, Plus, Minus, ShoppingBag, Truck, ShieldCheck, Lock, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { LOGO_DOTS } from '@/components/ui/SomneLoader';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  { label: 'Upholstered beds', href: '/beds/upholstered-beds', tone: 'bg-terracotta/10 text-terracotta-deep' },
  { label: 'Ottoman storage', href: '/beds/ottoman-divan-beds', tone: 'bg-royal/10 text-royal' },
  { label: 'Mattresses', href: '/mattresses', tone: 'bg-jade/10 text-jade' },
  { label: 'Headboards', href: '/headboards', tone: 'bg-plum/10 text-plum' },
];

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, shipping, discount, total, updateQuantity, removeItem, itemCount } = useCart();

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-ink/50 z-[80] transition-opacity duration-300 backdrop-blur-sm',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-background z-[90] shadow-2xl transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-label="Your bag"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-ink px-6 py-5 text-white md:px-8">
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-terracotta/40 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute -left-10 -bottom-16 h-32 w-32 rounded-full bg-royal/40 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="mb-1.5 flex gap-1" aria-hidden>
                {LOGO_DOTS.map((c) => (
                  <span key={c} className={cn('h-1.5 w-1.5 rounded-full', c)} />
                ))}
              </div>
              <h2 className="font-display text-3xl leading-none">
                Your bag{' '}
                <span className="align-middle text-base font-sans font-bold text-saffron">
                  ({itemCount})
                </span>
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-ink"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold backdrop-blur">
            <Truck className="h-4 w-4 text-saffron" />
            Free UK mainland delivery on every order
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="relative mb-7">
                <span aria-hidden className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-terracotta/25 via-saffron/20 to-royal/25 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-medium">
                  <ShoppingBag className="h-10 w-10 text-terracotta" />
                </div>
              </div>
              <p className="mb-2 font-display text-3xl text-ink">Your bag is empty</p>
              <p className="mb-8 max-w-xs text-sm text-ink/60">Beds, mattresses and headboards in 19 colourful fabrics are waiting.</p>
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Link
                    key={s.href}
                    to={s.href}
                    onClick={closeCart}
                    className={cn('rounded-full px-4 py-2 text-xs font-bold transition-transform hover:-translate-y-0.5', s.tone)}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
              <Link
                to="/beds/upholstered-beds"
                onClick={closeCart}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-terracotta px-8 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-gold transition-colors hover:bg-ink"
              >
                Start shopping
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = (item.product.discountPrice || item.product.price || 0) +
                  (item.selectedSize?.priceModifier || 0) +
                  (item.selectedStorage?.priceModifier || 0) +
                  (item.selectedHeadboard?.priceModifier || 0) +
                  (item.hasAssembly ? 49 : 0) +
                  (item.selectedBase?.priceModifier || 0) +
                  (item.selectedFirmness?.priceModifier || 0);

                const fallbackColor = item.product.colors?.find((color: any) => !color.disabled);
                const displayImage = item.selectedColor?.image || item.selectedColor?.productImages?.[0] || item.product.images[0] || fallbackColor?.image;

                const options = [
                  item.selectedSize?.name,
                  item.selectedColor?.name,
                  item.selectedHeadboard?.name,
                  item.selectedBase?.name,
                  item.selectedStorage?.name,
                  item.selectedFirmness?.name,
                  item.hasAssembly ? 'Assembly' : null,
                ].filter(Boolean) as string[];

                return (
                  <div key={item.cartItemId} className="flex gap-4 rounded-3xl border border-ink/5 bg-white p-3 shadow-soft">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary md:h-32 md:w-32">
                      <img src={displayImage} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pr-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-lg leading-tight text-ink line-clamp-2">{item.product.name}</h3>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="-mr-1 -mt-1 rounded-full p-1.5 text-ink/35 transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {options.map((o) => (
                            <span key={o} className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-ink/60">
                              {o}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-full bg-background">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:bg-ink hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-extrabold text-ink">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-ink/60 transition-colors hover:bg-ink hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-display text-xl text-ink">{formatPrice(itemPrice * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ink/5 bg-white px-6 pb-6 pt-5 md:px-8">
            <div className="mb-5 space-y-2.5">
              <div className="flex justify-between text-sm text-ink/60">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink/60">
                <span>Delivery</span>
                <span className="font-semibold text-jade">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-terracotta">
                  <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Discount</span>
                  <span className="font-semibold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-dashed border-ink/15 pt-3.5 font-display text-3xl text-ink">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-terracotta text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-gold transition-all hover:bg-ink active:scale-[0.99]"
              >
                <Lock className="h-4 w-4" />
                Secure checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={closeCart}
                className="h-12 w-full rounded-full text-sm font-bold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:bg-background hover:text-ink"
              >
                Continue shopping
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-5 text-[11px] font-semibold text-ink/50">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-royal" /> 5-year warranty</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-saffron" /> Made in the UK</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
