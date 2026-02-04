/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

const API_BASE_URL = "https://bedshowroom2-3duyqbp4qa-uc.a.run.app";
//http://127.0.0.1:5001/somne-f5b59/us-central1/bedshowroom2
// --- Session Storage Caching Utilities ---
const CACHE_VERSION = 'v2'; // Increment this to invalidate all caches on deploy

interface CacheEntry<T> {
    data: T;
    expiry: number;
    version: string;
}

const getCache = <T>(key: string): T | null => {
    try {
        const cached = sessionStorage.getItem(key);
        if (!cached) return null;
        const entry: CacheEntry<T> = JSON.parse(cached);
        // Check version and expiry
        if (entry.version !== CACHE_VERSION || Date.now() > entry.expiry) {
            sessionStorage.removeItem(key);
            return null;
        }
        return entry.data;
    } catch {
        // If parsing fails, remove corrupted cache
        try { sessionStorage.removeItem(key); } catch { console.log("Error clearing cache"); }
        return null;
    }
};

const setCache = <T>(key: string, data: T, ttlMinutes: number = 5): void => {
    try {
        const entry: CacheEntry<T> = {
            data,
            expiry: Date.now() + ttlMinutes * 60 * 1000,
            version: CACHE_VERSION
        };
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        // Session storage full - clear old entries and retry
        console.warn("Session storage issue, clearing old entries:", e);
        clearExpiredCache();
        try {
            const entry: CacheEntry<T> = {
                data,
                expiry: Date.now() + ttlMinutes * 60 * 1000,
                version: CACHE_VERSION
            };
            sessionStorage.setItem(key, JSON.stringify(entry));
        } catch {
            // If still fails, just skip caching - intentionally empty
        }
    }
};

const clearCache = (keyPrefix?: string): void => {
    try {
        if (keyPrefix) {
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith(keyPrefix)) {
                    sessionStorage.removeItem(key);
                }
            });
        } else {
            // Only clear our cache keys, not other session data
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('cache_')) {
                    sessionStorage.removeItem(key);
                }
            });
        }
    } catch { console.log("Error clearing cache"); }
};

const clearExpiredCache = (): void => {
    try {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                try {
                    const cached = sessionStorage.getItem(key);
                    if (cached) {
                        const entry = JSON.parse(cached);
                        if (entry.version !== CACHE_VERSION || Date.now() > entry.expiry) {
                            sessionStorage.removeItem(key);
                        }
                    }
                } catch {
                    // Parse failed, remove corrupted entry
                    sessionStorage.removeItem(key);
                }
            }
        });
    } catch { console.log("Error clearing cache"); }
};

// Clear expired cache on module load
clearExpiredCache();
// --- End Caching Utilities ---

export async function resizeImageFile(file: File, maxWidth = 1200, outputType = 'image/webp', quality = 0.8): Promise<Blob> {
    const img = await createImageBitmap(file);
    const { width, height } = img;
    if (width <= maxWidth) {
        // if smaller, return original file as Blob (optionally convert to webp)
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(img, 0, 0);
        return canvas.convertToBlob({ type: outputType, quality });
    }
    const scale = maxWidth / width;
    const canvas = new OffscreenCanvas(Math.round(width * scale), Math.round(height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.convertToBlob({ type: outputType, quality });
}

export const uploadImage = async (file: File, folder: string = 'products'): Promise<string> => {
    try {
        const blob = await resizeImageFile(file);
        const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}.webp`;
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob, { contentType: 'image/webp' });
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export const postProduct = async (productData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/products`, productData);
        // Invalidate relevant caches after adding new product
        clearCache('cache_product');
        clearCache('cache_all_products');
        clearCache('cache_category');
        clearCache('cache_mattress');
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const BedCategory = async (categoryId: string, type: string) => {
    // Include both categoryId AND type in cache key to prevent wrong data
    const cacheKey = `cache_category_${type}_${categoryId}`;
    const cached = getCache<any>(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(`${API_BASE_URL}/collection/${type}/${categoryId}`);
        setCache(cacheKey, response.data, 5); // Cache for 5 minutes
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Fallback/Legacy
export const getProductByName = async (name: string) => {
    return getProductBySlug(name);
};

export const getProductBySlug = async (slug: string) => {
    const cacheKey = `cache_product_${slug}`;
    const cached = getCache<any>(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(`${API_BASE_URL}/products/name/${encodeURIComponent(slug)}`);
        setCache(cacheKey, response.data, 10); // Cache for 10 minutes
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

export const getAllProducts = async () => {
    const cacheKey = 'cache_all_products';
    const cached = getCache<any>(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(`${API_BASE_URL}/products/admin`);
        setCache(cacheKey, response.data, 5); // Cache for 5 minutes
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const updateProduct = async (productData: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/products/update/${productData.id}`, productData);
        clearCache('cache_product'); // Invalidate product caches
        clearCache('cache_all_products');
        clearCache('cache_category');
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/getProduct/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

// --- Order API ---

export const createOrder = async (orderData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const getAllOrders = async (
    forceRefresh: boolean = false,
    limit: number = 10,
    lastCreatedAt?: string
) => {
    // Only use cache if no pagination is requested (fetching default first page)
    const canCache = !lastCreatedAt && limit === 10;
    const cacheKey = 'cache_all_orders_page1';

    if (canCache && !forceRefresh) {
        const cached = getCache<any>(cacheKey);
        if (cached) return cached;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
            params: { limit, lastCreatedAt }
        });

        if (canCache) {
            setCache(cacheKey, response.data, 1); // Cache for 1 minute
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const updateOrderStatus = async (id: string, status: string) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
        clearCache('cache_all_orders'); // Invalidate orders cache
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

export const getOrderById = async (id: string) => {
    try {
        // Try direct fetch first
        try {
            const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
            return response.data;
        } catch (error: any) {
            // If endpoint doesn't exist or order not found via direct link, 
            // fallback to fetching all orders (robustness for non-deployed backend)
            console.warn("Direct fetch failed, falling back to getAllOrders", error);
            const allOrders = await getAllOrders();
            const order = allOrders.find((o: any) => o.id === id);
            if (order) return order;
            throw error;
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
};

export const CheckOutHandler = async (orderData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

// --- Discount Code API ---

export interface DiscountValidationResult {
    valid: boolean;
    discountId?: string;
    code?: string;
    type?: 'percentage' | 'fixed';
    value?: number;
    discountAmount?: number;
    message?: string;
    error?: string;
}

export const validateDiscountCode = async (code: string, orderTotal: number): Promise<DiscountValidationResult> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/discounts/validate`, {
            code,
            orderTotal
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            return error.response.data;
        }
        return { valid: false, error: "Failed to validate discount code" };
    }
};

export const createDiscount = async (discountData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/discounts`, discountData);
        return response.data;
    } catch (error: any) {
        console.error("Error creating discount:", error);
        throw error.response?.data || { error: "Failed to create discount" };
    }
};

export const getAllDiscounts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/discounts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching discounts:", error);
        throw error;
    }
};

export const getAutoApplyDiscount = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/discounts/auto`);
        return response.data;
    } catch (error) {
        console.error("Error fetching auto-apply discount:", error);
        return null; // Fail silently for auto-apply
    }
};

export const createCheckoutSession = async (
    items: any[],
    payload: any, // Can be orderId (string) or orderData (object)
    email: string,
    discountCode?: string
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/stripe/create-checkout-session`, {
            items,
            payload,
            email,
            discountCode
        });
        return response.data;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
};

export const getMattresses = async () => {
    const cacheKey = 'cache_mattresses_all';
    const cached = getCache<any>(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(`${API_BASE_URL}/collection/mattresses`);
        setCache(cacheKey, response.data, 5); // Cache for 5 minutes
        return response.data;
    } catch (error) {
        console.error("Error fetching mattresses:", error);
        throw error;
    }
};

// Fetch order by Stripe session ID (for success page)
export interface OrderBySession {
    orderId: string;
    orderNumber?: number; // Add friendly ID
    orderReference: string;
    status: string;
    paymentStatus: string;
    total: number;
    itemCount: number;
    items: {
        name: string;
        quantity: number;
        price: number;
        selectedSize?: string;
        selectedColor?: string;
    }[];
    shippingDetails: {
        firstName?: string;
        email?: string;
    };
    createdAt?: string;
}

export const getOrderBySession = async (sessionId: string): Promise<OrderBySession | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/session/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order by session:", error);
        return null;
    }
};

// Track order by reference or email
export interface TrackedOrder {
    orderId: string;
    orderReference: string;
    status: string;
    paymentStatus: string;
    total: number;
    itemCount: number;
    items: {
        name: string;
        quantity: number;
        price: number;
        image?: string;
        selectedSize?: string;
        selectedColor?: string;
        selectedStorage?: string;
        selectedHeadboard?: string;
    }[];
    shippingDetails: {
        firstName?: string;
        lastName?: string;
        city?: string;
        postalCode?: string;
    };
    createdAt?: string;
}

export const trackOrder = async (orderReference?: string, email?: string): Promise<TrackedOrder[]> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders/track`, {
            orderReference,
            email
        });
        return response.data.orders;
    } catch (error: any) {
        console.error("Error tracking order:", error);
        if (error.response?.status === 404) {
            return [];
        }
        throw error;
    }
};