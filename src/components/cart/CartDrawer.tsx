import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, shipping, discount, total, updateQuantity, removeItem, itemCount } = useCart();

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-stone-900/60 z-50 transition-opacity duration-300 backdrop-blur-sm',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-100">
          <div className="flex items-center gap-3 text-stone-900">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-serif text-2xl">Your Bag ({itemCount})</h2>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-stone-200 mb-6" />
              <p className="font-serif text-2xl font-light text-stone-900 mb-2">Your bag is empty</p>
              <p className="text-stone-500 mb-8">Ready to add something beautiful?</p>
              <Link
                to="/beds"
                onClick={closeCart}
                className="h-12 px-8 flex items-center justify-center bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors rounded-xl"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => {
                const itemPrice = (item.product.discountPrice || item.product.price || 0) +
                  (item.selectedSize?.priceModifier || 0) +
                  (item.selectedStorage?.priceModifier || 0) +
                  (item.selectedHeadboard?.priceModifier || 0) +
                  (item.selectedBase?.priceModifier || 0);

                const fallbackColor = item.product.colors?.find((color: any) => !color.disabled);
                const displayImage = item.selectedColor?.image || item.selectedColor?.productImages?.[0] || item.product.images[0] || fallbackColor?.image;

                return (
                  <div key={item.cartItemId} className="flex gap-5 pb-8 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={displayImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-lg font-medium text-stone-900 truncate leading-none">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="p-1 hover:text-red-500 transition-colors text-stone-400"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                          {item.selectedSize?.name}
                          {item.selectedColor && ` • ${item.selectedColor.name}`}
                          {item.selectedHeadboard && ` • ${item.selectedHeadboard.name}`}
                          {item.selectedBase && ` • ${item.selectedBase.name}`}
                          {item.selectedStorage && ` • ${item.selectedStorage.name}`}
                          {item.selectedFirmness && ` • ${item.selectedFirmness.name}`}
                        </p>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-stone-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-xl font-light text-stone-900">
                          {formatPrice(itemPrice * item.quantity)}
                        </p>
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
          <div className="p-6 md:p-8 border-t border-stone-100 bg-stone-50/50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal</span>
                <span className="text-stone-900 font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Delivery</span>
                <span className="text-stone-900 font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Discount</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-2xl pt-4 border-t border-stone-200 text-stone-900 mt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full h-14 bg-[#ef4444] hover:bg-[#d92626] text-white font-bold text-base flex items-center justify-center rounded-xl transition-all active:scale-[0.99] shadow-lg shadow-stone-900/10"
              >
                Go to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="w-full h-14 bg-white border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-900 font-bold text-base flex items-center justify-center rounded-xl transition-all active:scale-[0.99]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
