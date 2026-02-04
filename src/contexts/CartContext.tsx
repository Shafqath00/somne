import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Cart, CartItem, Product, ProductSize, ProductColor, StorageOption } from '@/types';

interface CartState extends Cart {
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: number }
  | { type: 'LOAD_CART'; payload: CartState };

const CART_STORAGE_KEY = 'somne-cart';

const initialState: CartState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  isOpen: false,
};

// Calculate totals helper - defined BEFORE loadCartFromStorage uses it
function calculateTotals(items: CartItem[], discount: number = 0): Pick<Cart, 'subtotal' | 'shipping' | 'total'> {
  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.product.discountPrice || item.product.price || 0;
    const sizeModifier = item.selectedSize?.priceModifier || 0;
    const storageModifier = item.selectedStorage?.priceModifier || 0;
    const headboardModifier = item.selectedHeadboard?.priceModifier || 0;

    const baseModifier = item.selectedBase?.priceModifier || 0;
    const firmnessModifier = item.selectedFirmness?.priceModifier || 0;
    const assemblyCost = item.hasAssembly ? 49 : 0;
    return sum + (basePrice + sizeModifier + storageModifier + headboardModifier + baseModifier + firmnessModifier + assemblyCost) * item.quantity;
  }, 0);

  const shipping = 0; // Free shipping for all orders
  const total = Math.max(0, subtotal - discount + shipping);

  return { subtotal, shipping, total };
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Recalculate totals to ensure consistency
      const totals = calculateTotals(parsed.items || [], parsed.discount || 0);
      return {
        ...initialState,
        items: parsed.items || [],
        discount: parsed.discount || 0,
        ...totals,
        isOpen: false, // Always start closed
      };
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return initialState;
};

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    const dataToSave = {
      items: state.items,
      discount: state.discount,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.selectedSize?.name === action.payload.selectedSize?.name &&
          item.selectedColor?.name === action.payload.selectedColor?.name &&
          item.selectedStorage?.name === action.payload.selectedStorage?.name &&
          item.selectedHeadboard?.name === action.payload.selectedHeadboard?.name &&
          item.selectedBase?.name === action.payload.selectedBase?.name &&
          item.selectedFirmness?.name === action.payload.selectedFirmness?.name &&
          item.hasAssembly === action.payload.hasAssembly
      );

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Ensure cartItemId is present if not already (safeguard)
        const itemToAdd = {
          ...action.payload,
          cartItemId: action.payload.cartItemId || crypto.randomUUID()
        };
        newItems = [...state.items, itemToAdd];
      }

      const totals = calculateTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals, isOpen: true };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.cartItemId !== action.payload);
      const totals = calculateTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map((item) =>
        item.cartItemId === action.payload.cartItemId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter((item) => item.quantity > 0);
      const totals = calculateTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals };
    }

    case 'CLEAR_CART':
      return { ...initialState };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'APPLY_DISCOUNT': {
      const totals = calculateTotals(state.items, action.payload);
      return { ...state, discount: action.payload, ...totals };
    }

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (
    product: Product,
    quantity: number,
    size?: ProductSize,
    color?: ProductColor,
    storage?: StorageOption,
    headboard?: StorageOption,
    base?: StorageOption,
    firmness?: StorageOption,
    hasAssembly?: boolean
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (amount: number) => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    // Initialize from localStorage on first render
    if (typeof window !== 'undefined') {
      return loadCartFromStorage();
    }
    return initialState;
  });

  // Save to localStorage whenever cart changes (but not isOpen)
  useEffect(() => {
    saveCartToStorage(state);
  }, [state.items, state.discount]);

  const addItem = (
    product: Product,
    quantity: number,
    size?: ProductSize,
    color?: ProductColor,
    storage?: StorageOption,
    headboard?: StorageOption,
    base?: StorageOption,
    firmness?: StorageOption,
    hasAssembly?: boolean
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity,
        selectedSize: size,
        selectedColor: color,
        selectedStorage: storage,
        selectedHeadboard: headboard,
        selectedBase: base,
        selectedFirmness: firmness,
        hasAssembly: hasAssembly,
        cartItemId: crypto.randomUUID(),
      },
    });
  };

  const removeItem = (cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const applyDiscount = (amount: number) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: amount });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        applyDiscount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
