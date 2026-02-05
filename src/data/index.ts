import { Product, Review, BlogPost, NavItem } from '@/types';

// Import category images
import categoryUpholstered from '@/assets/category-upholstered.jpg';

import categoryDivan from '@/assets/category-divan.jpg';
import categoryOttoman from '@/assets/category-ottoman.jpg';
import categoryMattress from '@/assets/category-mattress.jpg';
import categoryHeadboard from '@/assets/category-headboard.jpg';

// Navigation Data
export const navigationItems: NavItem[] = [
  {
    label: 'Beds',
    href: '/beds/divan-beds',
    children: [
      { label: 'Divan Beds', href: '/beds/divan-beds' },
      { label: 'Upholstered Beds', href: '/beds/upholstered-beds' },
      // { label: 'Kids divan Beds', href: '/beds/kids-divan-beds' },
    ],
  },
  {
    label: 'Ottoman Beds',
    href: '/beds/ottoman-divan-beds',
    children: [
      { label: 'Ottoman Divan Beds', href: '/beds/ottoman-divan-beds' },
      { label: 'Ottoman Upholstered Beds', href: '/beds/upholstered-ottoman-bed' }
    ],
  },
  {
    label: 'Mattresses',
    href: '/mattresses/memory-foam',
    children: [
      { label: 'Memory Foam Mattress', href: '/mattresses/memory-foam' },
      { label: 'Orthopaedic Mattress', href: '/mattresses/orthopaedic-mattress' },
      { label: 'Pocket Sprung Mattress', href: '/mattresses/pocket-sprung-mattress' },
      { label: 'Pillowtop Mattress', href: '/mattresses/pillow-top-mattress' },
      { label: 'All Mattresses', href: '/mattresses' },
    ],
  },
  // { label: 'Headboards', href: '/headboards' },
  // { label: 'About', href: '/about' },
  // { label: 'Contact', href: '/contact' },
];

export const navigationItems2: NavItem[] = [
  { label: 'Headboards', href: '/headboards' },
  {
    label: 'Panels', href: '/product/bathroom-pvc-wall-panels-pack-of-4', children: [
      { label: 'Bathroom Panels', href: '/product/bathroom-pvc-wall-panels-pack-of-4' },
      { label: 'Wall Panels', href: '/product/acoustic-wall-panel-pack-of-4' },
      { label: 'Outdoor Panels', href: '/product/outdoor-panels-pack-of-4' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

// Category Data
export const categories = [
  {
    id: 'divan',
    name: 'Divan Beds',
    description: 'Complete bed sets with storage options',
    image: "/img/beds/green.png",
    href: '/beds/divan-beds',
  },
  {
    id: 'upholstered',
    name: 'Upholstered Beds',
    description: 'Elegant fabric beds with padded headboards',
    image: "/img/beds/black.png",
    href: '/beds/upholstered-beds',
  },
  {
    id: 'ottoman',
    name: 'Ottoman Beds',
    description: 'Maximum storage with hydraulic lift',
    image: "/img/beds/pink.png",
    href: '/beds/ottoman-divan-beds',
  },
  {
    id: 'mattresses',
    name: 'Mattresses',
    description: 'Premium comfort for restful sleep',
    image: categoryMattress,
    href: '/mattresses',
  },
  {
    id: 'headboards',
    name: 'Headboards',
    description: 'Standalone headboards to transform your bed',
    image: "/img/beds/headboard.jpeg",
    href: '/headboards',
  },
];

// USP Data
export const usps = [
  {
    icon: '/img/icons/icon4.png',
    title: 'Free Delivery',
    description: 'UK Mainland',
  },
  {
    icon: '/img/icons/uk2.png',
    title: 'Made in UK',
    description: 'Handcrafted in the UK',
  },
  {
    icon: '/img/icons/icon6.png',
    title: '5-Year Warranty',
    description: 'Peace of mind',
  },
  // {
  //   icon: 'Recycle',
  //   title: 'Old Bed Collection',
  //   description: 'Available on request',
  // },
];

// Process Steps
export const processSteps = [
  {
    step: 1,
    title: 'Choose Your Product',
    description: 'Browse our handcrafted collection and select your perfect bed or mattress. Customize size, fabric, and storage options.',
  },
  {
    step: 2,
    title: 'Easy Payment',
    description: 'Secure checkout with multiple payment options. Split payments available with Klarna and Clearpay.',
  },
  {
    step: 3,
    title: 'Free Delivery',
    description: 'Our two-man team delivers to your room of choice, assembles your new bed.',
  },
];

// Sample Products
export const products: Product[] = [
  {
    id: 'bed-001',
    name: 'The Westminster',
    slug: 'westminster-upholstered-bed',
    category: 'beds',
    subcategory: 'upholstered-beds',
    price: 1299,
    description: 'The Westminster is our signature upholstered bed, featuring a tall, elegantly panelled headboard crafted from premium velvet. Hand-built in our UK workshop, this bed combines timeless design with exceptional comfort.',
    shortDescription: 'Signature velvet upholstered bed with panelled headboard',
    images: [categoryUpholstered],
    sizes: [
      { name: 'Double', dimensions: '135cm x 190cm', priceModifier: 0, inStock: true },
      { name: 'King', dimensions: '150cm x 200cm', priceModifier: 200, inStock: true },
      { name: 'Super King', dimensions: '180cm x 200cm', priceModifier: 400, inStock: true },
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#1a1f3c' },
      { name: 'Silver Grey', hex: '#9ca3af' },
      { name: 'Champagne', hex: '#f5f0e8' },
      { name: 'Forest Green', hex: '#2d4739' },
    ],
    storageOptions: [
      { name: 'No Storage', description: 'Standard frame', priceModifier: 0 },
      { name: '2 Drawers', description: 'Two side drawers', priceModifier: 150 },
      { name: '4 Drawers', description: 'Four side drawers', priceModifier: 250 },
    ],
    features: [
      'Hand-built in the UK',
      'Premium velvet upholstery',
      'Solid hardwood frame',
      'Sprung slatted base included',
      'Floor protector feet',
    ],
    materials: ['Solid kiln-dried hardwood', 'High-density foam padding', 'Premium velvet fabric'],
    warranty: '5 years',
    deliveryTime: '7-14 days',
    inStock: true,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 127,
  },
  {
    id: 'bed-002',
    name: 'The Kensington',
    slug: 'kensington-ottoman-bed',
    category: 'beds',
    subcategory: 'ottoman-beds',
    price: 1499,
    description: 'The Kensington Ottoman combines luxury with practicality. The gas-lift mechanism reveals a generous storage compartment, perfect for bedding, luggage, or seasonal items. Upholstered in soft-touch fabric with a contemporary wing headboard.',
    shortDescription: 'Luxury ottoman bed with wing headboard and full storage',
    images: [categoryOttoman],
    sizes: [
      { name: 'Double', dimensions: '135cm x 190cm', priceModifier: 0, inStock: true },
      { name: 'King', dimensions: '150cm x 200cm', priceModifier: 250, inStock: true },
      { name: 'Super King', dimensions: '180cm x 200cm', priceModifier: 450, inStock: true },
    ],
    colors: [
      { name: 'Charcoal', hex: '#36454f' },
      { name: 'Stone', hex: '#d4c5b9' },
      { name: 'Blush Pink', hex: '#e8c4c4' },
    ],
    features: [
      'Gas-lift ottoman storage',
      'Contemporary wing headboard',
      'Premium soft-touch fabric',
      'Reinforced base for durability',
      'Easy-access storage area',
    ],
    materials: ['Engineered wood base', 'Steel gas-lift mechanism', 'Premium woven fabric'],
    warranty: '5 years',
    deliveryTime: '10-14 days',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: 'bed-003',
    name: 'The Mayfair Divan',
    slug: 'mayfair-divan-set',
    category: 'beds',
    subcategory: 'divan-beds',
    price: 899,
    description: 'The Mayfair Divan Set offers exceptional value without compromising on quality. Includes a luxury pocket sprung mattress and fabric-covered divan base. Available with optional drawer storage.',
    shortDescription: 'Complete divan set with pocket sprung mattress',
    images: [categoryDivan],
    sizes: [
      { name: 'Single', dimensions: '90cm x 190cm', priceModifier: -200, inStock: true },
      { name: 'Double', dimensions: '135cm x 190cm', priceModifier: 0, inStock: true },
      { name: 'King', dimensions: '150cm x 200cm', priceModifier: 200, inStock: true },
      { name: 'Super King', dimensions: '180cm x 200cm', priceModifier: 350, inStock: true },
    ],
    colors: [
      { name: 'Cream', hex: '#f5f0e8' },
      { name: 'Grey', hex: '#6b7280' },
      { name: 'Charcoal', hex: '#374151' },
    ],
    storageOptions: [
      { name: 'No Drawers', description: 'Platform base only', priceModifier: 0 },
      { name: '2 Drawers (Same Side)', description: 'Two drawers on one side', priceModifier: 100 },
      { name: '4 Drawers', description: 'Two drawers each side', priceModifier: 180 },
    ],
    features: [
      'Complete set with mattress',
      '1000 pocket springs',
      'Matching fabric headboard available',
      'Split base for easy access',
      'Castors for easy movement',
    ],
    materials: ['Sturdy divan base', 'Pocket sprung mattress', 'Soft-touch fabric cover'],
    warranty: '5 years',
    deliveryTime: '5-10 days',
    inStock: true,
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: 'mattress-001',
    name: 'The Belgravia',
    slug: 'belgravia-pocket-sprung-mattress',
    category: 'mattresses',
    subcategory: 'pocket-sprung',
    price: 799,
    description: 'The Belgravia features 2000 individual pocket springs, each responding independently to your body movements. Topped with layers of natural wool and cotton for temperature regulation and breathability.',
    shortDescription: '2000 pocket sprung mattress with natural fillings',
    images: [categoryMattress],
    sizes: [
      { name: 'Single', dimensions: '90cm x 190cm', priceModifier: -200, inStock: true },
      { name: 'Double', dimensions: '135cm x 190cm', priceModifier: 0, inStock: true },
      { name: 'King', dimensions: '150cm x 200cm', priceModifier: 150, inStock: true },
      { name: 'Super King', dimensions: '180cm x 200cm', priceModifier: 300, inStock: true },
    ],
    firmness: 'Medium-Firm',
    features: [
      '2000 individual pocket springs',
      'Natural wool and cotton layers',
      'Hand-tufted for durability',
      'Breathable border for airflow',
      'No-turn design with regular rotation',
    ],
    materials: ['Pocket springs', 'Natural wool', 'Egyptian cotton', 'Hypoallergenic fillings'],
    warranty: '10 years',
    deliveryTime: '5-7 days',
    inStock: true,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 342,
  },
  {
    id: 'mattress-002',
    name: 'The Chelsea Memory',
    slug: 'chelsea-memory-foam-mattress',
    category: 'mattresses',
    subcategory: 'memory-foam',
    price: 649,
    description: 'The Chelsea combines responsive memory foam with a supportive pocket spring core. The foam contours to your body while the springs provide essential support, giving you the best of both worlds.',
    shortDescription: 'Hybrid memory foam and pocket spring mattress',
    images: [categoryMattress],
    sizes: [
      { name: 'Single', dimensions: '90cm x 190cm', priceModifier: -150, inStock: true },
      { name: 'Double', dimensions: '135cm x 190cm', priceModifier: 0, inStock: true },
      { name: 'King', dimensions: '150cm x 200cm', priceModifier: 100, inStock: true },
      { name: 'Super King', dimensions: '180cm x 200cm', priceModifier: 200, inStock: true },
    ],
    firmness: 'Medium',
    features: [
      'Cooling gel memory foam',
      '1000 pocket spring base',
      'Pressure-relieving comfort',
      'Motion isolation technology',
      'Removable washable cover',
    ],
    materials: ['Gel-infused memory foam', 'Pocket springs', 'Breathable knit cover'],
    warranty: '10 years',
    deliveryTime: '3-5 days',
    inStock: true,
    rating: 4.7,
    reviewCount: 189,
  },
  {
    id: 'headboard-001',
    name: 'The Buckingham',
    slug: 'buckingham-headboard',
    category: 'headboards',
    price: 399,
    description: 'The Buckingham is a statement headboard featuring deep button tufting on a tall, curved frame. Hand-upholstered in your choice of premium velvet or linen.',
    shortDescription: 'Tall button-tufted headboard in premium fabric',
    images: [categoryHeadboard],
    sizes: [
      { name: 'Double', dimensions: '135cm wide', priceModifier: 0, inStock: true },
      { name: 'King', dimensions: '150cm wide', priceModifier: 50, inStock: true },
      { name: 'Super King', dimensions: '180cm wide', priceModifier: 100, inStock: true },
    ],
    colors: [
      { name: 'Oyster', hex: '#e8e4df' },
      { name: 'Dove Grey', hex: '#9ca3af' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Blush', hex: '#e8c4c4' },
    ],
    features: [
      'Deep button tufting',
      'Wall-mounted or floor-standing',
      'Height: 135cm from floor',
      'Solid timber frame',
      'Easy assembly',
    ],
    materials: ['Kiln-dried hardwood frame', 'High-density foam', 'Premium upholstery fabric'],
    warranty: '5 years',
    deliveryTime: '7-10 days',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 67,
  },
];

// Sample Reviews
export const reviews: Review[] = [
  {
    id: 'review-001',
    author: 'Sarah M.',
    rating: 5,
    date: '2024-11-15',
    title: 'Absolutely stunning bed',
    content: 'The Westminster bed exceeded all my expectations. The quality is incredible and the delivery team were professional and careful. Worth every penny for such a beautiful piece.',
    verified: true,
    productId: 'bed-001',
  },
  {
    id: 'review-002',
    author: 'James T.',
    rating: 5,
    date: '2024-11-10',
    title: 'Best sleep I\'ve ever had',
    content: 'After years of poor sleep, the Belgravia mattress has been life-changing. The pocket springs provide perfect support and I wake up completely refreshed.',
    verified: true,
    productId: 'mattress-001',
  },
  {
    id: 'review-003',
    author: 'Emma L.',
    rating: 5,
    date: '2024-11-05',
    title: 'Fantastic storage solution',
    content: 'The Kensington Ottoman is both beautiful and practical. The storage space is huge and the lifting mechanism is smooth. Transformed my small bedroom.',
    verified: true,
    productId: 'bed-002',
  },
  {
    id: 'review-004',
    author: 'Michael R.',
    rating: 4,
    date: '2024-10-28',
    title: 'Great value divan set',
    content: 'Excellent quality for the price. The mattress is very comfortable and the drawers are sturdy. Only reason for 4 stars is delivery took slightly longer than expected.',
    verified: true,
    productId: 'bed-003',
  },
  {
    id: 'review-005',
    author: 'Charlotte H.',
    rating: 5,
    date: '2024-10-20',
    title: 'Hotel-quality at home',
    content: 'We wanted to recreate that luxury hotel feeling and this bed delivers. The craftsmanship is evident and the velvet is so soft. Highly recommend!',
    verified: true,
    productId: 'bed-001',
  },
];

// Sample Blog Posts
export const blogPosts: BlogPost[] = [
  {
    id: 'blog-001',
    slug: 'ultimate-guide-choosing-mattress',
    title: 'The Ultimate Guide to Choosing Your Perfect Mattress',
    excerpt: 'Discover how to select the ideal mattress for your sleep style, body type, and preferences.',
    content: '',
    author: 'Sleep Expert Team',
    date: '2024-11-20',
    image: categoryMattress,
    category: 'Buying Guides',
    readTime: 8,
  },
  {
    id: 'blog-002',
    slug: 'bedroom-styling-tips-2024',
    title: 'Bedroom Styling Tips for 2024',
    excerpt: 'Transform your bedroom into a sanctuary with these interior design trends and tips.',
    content: '',
    author: 'Design Team',
    date: '2024-11-15',
    image: categoryUpholstered,
    category: 'Interior Design',
    readTime: 5,
  },
  {
    id: 'blog-003',
    slug: 'benefits-ottoman-storage-beds',
    title: 'The Benefits of Ottoman Storage Beds',
    excerpt: 'Maximise your space with clever storage solutions that don\'t compromise on style.',
    content: '',
    author: 'Product Team',
    date: '2024-11-10',
    image: categoryOttoman,
    category: 'Product Guides',
    readTime: 4,
  },
];

// Filters
export const sizeFilters = ['Single', 'Small Double', 'Double', 'King', 'Super King'];
export const priceFilters = [
  { label: 'Under £500', min: 0, max: 500 },
  { label: '£500 - £1000', min: 500, max: 1000 },
  { label: '£1000 - £1500', min: 1000, max: 1500 },
  { label: 'Over £1500', min: 1500, max: 999999 },
];
export const firmnessFilters = ['Soft', 'Medium', 'Medium-Firm', 'Firm', 'Extra Firm'];
export const storageFilters = ['No Storage', 'Drawers', 'Ottoman'];
