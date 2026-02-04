import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, shipping, discount, total, updateQuantity, removeItem, itemCount } = useCart();
  // console.log(items);

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-foreground/40 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-serif text-xl">Your Bag ({itemCount})</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-secondary transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="font-serif text-lg text-muted-foreground mb-4">Your bag is empty</p>
              <Button variant="luxury" onClick={closeCart} asChild>
                <Link to="/beds">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const itemPrice = (item.product.discountPrice || item.product.price || 0) +
                  (item.selectedSize?.priceModifier || 0) +
                  (item.selectedStorage?.priceModifier || 0) +
                  (item.selectedHeadboard?.priceModifier || 0) +
                  (item.selectedBase?.priceModifier || 0);

                // Image Logic: Prefer variant image, fallback to product image
                const displayImage = item.selectedColor?.image || item.selectedColor?.productImages?.[0] || item.product.images[0] || item.product.colors?.[0]?.image;

                return (
                  <div key={item.cartItemId} className="flex gap-4 pb-6 border-b border-border">
                    <div className="w-24 h-24 bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={displayImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.selectedSize?.name}
                        {item.selectedColor && ` • ${item.selectedColor.name}`}
                        {item.selectedHeadboard && ` • ${item.selectedHeadboard.name}`}
                        {item.selectedBase && ` • ${item.selectedBase.name}`}
                        {item.selectedStorage && ` • ${item.selectedStorage.name}`}
                        {item.selectedFirmness && ` • ${item.selectedFirmness.name}`}
                      </p>
                      {item.selectedStorage && (
                        <p className="text-sm text-muted-foreground">{item.selectedStorage.name}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-sans">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 hover:bg-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-sans font-medium">{formatPrice(itemPrice * item.quantity)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="p-1 hover:text-destructive transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-secondary/30">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-muted-foreground">Delivery</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-sans text-accent">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/checkout" onClick={closeCart}>Checkout</Link>
              </Button>
              <Button variant="luxuryOutline" size="lg" className="w-full" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Free UK mainland delivery on orders over £500
            </p>
          </div>
        )}
      </div>
    </>
  );
}
