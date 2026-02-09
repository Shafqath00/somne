/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

// Environment variable handling would go here, falling back for now  https://bedshowroom2-3duyqbp4qa-uc.a.run.app
const API_BASE_URL = "http://127.0.0.1:5001/somne-f5b59/us-central1/bedshowroom2";

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
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const BedCategory = async (categoryId: string, type: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/collection/${type}/${categoryId}`);
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
    try {
        const response = await axios.get(`${API_BASE_URL}/products/name/${encodeURIComponent(slug)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

export const getAllProducts = async (filters?: { category?: string; subcategory?: string }) => {
    try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.subcategory) params.append('subcategory', filters.subcategory);

        const response = await axios.get(`${API_BASE_URL}/products/admin`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const updateProduct = async (productData: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/products/update/${productData.id}`, productData);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    forceRefresh: boolean = false,
    limit: number = 10,
    lastCreatedAt?: string
) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
            params: { limit, lastCreatedAt }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const updateOrderStatus = async (id: string, status: string) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
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

export const deleteDiscount = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/discounts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting discount:", error);
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
    try {
        const response = await axios.get(`${API_BASE_URL}/collection/mattresses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching mattresses:", error);
        throw error;
    }
};

// Smart fetch: Try slug first, then fallback to name
export const getTrendingProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/trending`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trending products:", error);
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
        image?: string;
        selectedSize?: { name: string; priceModifier?: number };
        selectedColor?: { name: string };
        selectedStorage?: { name: string; priceModifier?: number };
        selectedHeadboard?: { name: string; priceModifier?: number };
        selectedBase?: { name: string; priceModifier?: number };
        selectedFirmness?: { name: string; priceModifier?: number };
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

export const trackOrder = async (orderReference: string, email: string): Promise<TrackedOrder[]> => {
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

// --- Contact Form API ---

export interface ContactForm {
    id: string;
    refNo?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    isRead?: boolean;
    createdAt: string | { _seconds: number; _nanoseconds: number };
}

export const getAllContactForms = async (): Promise<ContactForm[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/contact`);
        return response.data;
    } catch (error) {
        console.error("Error fetching contact forms:", error);
        throw error;
    }
};

export const updateContactFormStatus = async (id: string, status: string) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/contact/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating contact form status:", error);
        throw error;
    }
};

export const markContactFormAsRead = async (id: string) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/contact/${id}/read`);
        return response.data;
    } catch (error) {
        console.error("Error marking contact form as read:", error);
        throw error;
    }
};

export const submitContactForm = async (data: { name: string; email: string; phone: string; message: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact`, data);
        return response.data;
    } catch (error) {
        console.error("Error submitting contact form:", error);
        throw error;
    }
};