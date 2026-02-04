// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: ProductCategory;
  subcategory?: string;
  price: number;
  basePrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  sizes: ProductSize[];
  colors?: ProductColor[];
  storageOptions?: StorageOption[];
  headboardStyles?: string[];
  headboardOptions?: StorageOption[];
  baseOptions?: StorageOption[];
  firmnessOptions?: StorageOption[];
  firmness?: 'Soft' | 'Medium' | 'Medium-Firm' | 'Firm' | 'Extra Firm';
  features: string[];
  materials: string[];
  warranty: string;
  deliveryTime: string;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  rating: number;
  reviewCount: number;
}

export type ProductCategory = 'beds' | 'mattresses' | 'headboards' | 'panels';

export type ProductSubcategory =
  | 'upholstered-beds'
  | 'divan-beds'
  | 'ottoman-beds'
  | 'memory-foam'
  | 'orthopaedic'
  | 'pocket-sprung'
  | 'natural';

export interface ProductSize {
  name: string;
  dimensions: string;
  priceModifier: number;
  inStock: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  productImages?: string[];
  isDefault?: boolean;
  fabric?: string;
}

export interface StorageOption {
  name: string;
  description: string;
  priceModifier: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  selectedColor?: ProductColor;
  selectedStorage?: StorageOption;
  selectedHeadboard?: StorageOption;
  selectedBase?: StorageOption;
  selectedFirmness?: StorageOption;
  hasAssembly?: boolean;
  cartItemId: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

// Review Types
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  productId?: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: number;
}

// Form Types
export interface CustomizeFormData {
  name: string;
  email: string;
  phone: string;
  bedSize: string;
  notes: string;
  images: File[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
