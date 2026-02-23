/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import { getAuth } from "firebase/auth";

// Environment variable handling
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bedshowroom2-3duyqbp4qa-uc.a.run.app";

// Helper to get Firebase Auth Token
const getAuthToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated. Please log in.");
    }
    return await user.getIdToken();
};

// Helper for Admin Authenticated Requests
const adminAxios = async (method: string, endpoint: string, data?: any, params?: any) => {
    try {
        const token = await getAuthToken();
        const config = {
            method,
            url: `${API_BASE_URL}/admin${endpoint}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data,
            params,
        };
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        console.error(`Admin API Error [${method} ${endpoint}]:`, error);
        throw error.response?.data || error;
    }
};

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

// --- Product API (Admin) ---

export const postProduct = async (productData: any) => {
    return adminAxios('POST', '/products', productData);
};

export const updateProduct = async (productData: any) => {
    return adminAxios('PUT', `/products/${productData.id}`, productData);
};

export const getAllProducts = async (filters?: { category?: string; subcategory?: string }) => {
    // Note: Admin route /admin/products supports filtering
    return adminAxios('GET', '/products', null, filters);
};

// --- Product API (Public) ---

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

export const getProductById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/getProduct/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
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

export const getTrendingProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/trending`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trending products:", error);
        throw error;
    }
};

// --- Order API ---

// Public: Create Order (Guest/User)
export const createOrder = async (orderData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

// Public: Alias for createOrder
export const CheckOutHandler = async (orderData: any) => {
    return createOrder(orderData);
};

// Admin: Get All Orders
export const getAllOrders = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    forceRefresh: boolean = false,
    limit: number = 10,
    lastCreatedAt?: string
) => {
    return adminAxios('GET', '/orders', null, { limit, lastCreatedAt });
};

// Admin: Update Order Status
export const updateOrderStatus = async (id: string, status: string) => {
    return adminAxios('PUT', `/orders/${id}/status`, { status });
};

// Public: Get Order by ID (Try direct -> fallback to admin list if fails/auth'd?)
// Actually, public users usually use trackOrder or session lookup. 
// This function seems to be used by admin mostly, but let's keep the fallback logic for safety if user is admin.
export const getOrderById = async (id: string) => {
    try {
        // Try admin route first if authenticated? No, let's try public session-like fetch if possible?
        // Backend `routes/orders.js` doesn't have GET /:id except for session.
        // Backend `routes/admin.js` HAS GET /orders/:id.

        // If we are in admin context, we should use adminAxios
        // But this function might be used in general context.
        // Let's try the admin route if we have a user, or fail.
        // Assuming this is used in Admin Dashboard:
        return adminAxios('GET', `/orders/${id}`);
    } catch (error) {
        // Fallback for public/guest? 
        // Public can only fetch by session ID or track by ref+email.
        // If this is for admin dashboard, the above adminAxios is correct.
        console.error("Error fetching order (requires admin):", error);
        throw error;
    }
};

// Public: Fetch order by Stripe session ID (Success Page)
export interface OrderBySession {
    orderId: string;
    orderNumber?: number;
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

// Public: Track order
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

// Public: Validate Discount
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

// Public: Auto Apply
export const getAutoApplyDiscount = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/discounts/auto`);
        return response.data;
    } catch (error) {
        console.error("Error fetching auto-apply discount:", error);
        return null;
    }
};

// Admin: Create Discount
export const createDiscount = async (discountData: any) => {
    return adminAxios('POST', '/discounts', discountData);
};

// Admin: Get All Discounts
export const getAllDiscounts = async () => {
    return adminAxios('GET', '/discounts');
};

// Admin: Delete Discount
export const deleteDiscount = async (id: string) => {
    return adminAxios('DELETE', `/discounts/${id}`);
};

// --- Stripe ---

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

// Admin: Get All Contact Forms
export const getAllContactForms = async (): Promise<ContactForm[]> => {
    return adminAxios('GET', '/contact');
};

// Admin: Update Contact Status
export const updateContactFormStatus = async (id: string, status: string) => {
    return adminAxios('PUT', `/contact/${id}`, { status });
};

// Admin: Mark Read
export const markContactFormAsRead = async (id: string) => {
    return adminAxios('PATCH', `/contact/${id}/read`);
};

// Public: Submit Form
export const submitContactForm = async (data: { name: string; email: string; phone: string; message: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contact`, data);
        return response.data;
    } catch (error) {
        console.error("Error submitting contact form:", error);
        throw error;
    }
};

// --- Blog API ---

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    order: number;
    createdAt?: string;
}

export interface BlogContentBlock {
    type: 'heading' | 'paragraph' | 'image' | 'list' | 'product-link' | 'quote' | 'divider';
    level?: number;
    text?: string;
    url?: string;
    alt?: string;
    caption?: string;
    style?: 'bullet' | 'numbered';
    items?: string[];
    productSlug?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    categorySlug: string;
    featuredImage: string;
    excerpt: string;
    author: string;
    readTime: string;
    status: 'draft' | 'published';
    tags: string[];
    content: BlogContentBlock[];
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    relatedPosts?: BlogPost[];
}

// Public: Get blog categories
export const getPublicBlogCategories = async (): Promise<BlogCategory[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/blogs/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        throw error;
    }
};

// Public: Get published blogs (optional category filter)
export const getPublicBlogs = async (category?: string): Promise<BlogPost[]> => {
    try {
        const params = category ? { category } : {};
        const response = await axios.get(`${API_BASE_URL}/blogs`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw error;
    }
};

// Public: Get single blog by slug
export const getPublicBlogBySlug = async (slug: string): Promise<BlogPost> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog:", error);
        throw error;
    }
};

// Admin: Get all blogs (including drafts)
export const adminGetAllBlogs = async (): Promise<BlogPost[]> => {
    return adminAxios('GET', '/blogs');
};

// Admin: Create blog
export const adminCreateBlog = async (data: any) => {
    return adminAxios('POST', '/blogs', data);
};

// Admin: Update blog
export const adminUpdateBlog = async (id: string, data: any) => {
    return adminAxios('PUT', `/blogs/${id}`, data);
};

// Admin: Delete blog
export const adminDeleteBlog = async (id: string) => {
    return adminAxios('DELETE', `/blogs/${id}`);
};

// Admin: Get blog categories
export const adminGetBlogCategories = async (): Promise<BlogCategory[]> => {
    return adminAxios('GET', '/blogs/categories');
};

// Admin: Create blog category
export const adminCreateBlogCategory = async (data: { name: string; description?: string }) => {
    return adminAxios('POST', '/blogs/categories', data);
};

// Admin: Update blog category
export const adminUpdateBlogCategory = async (id: string, data: any) => {
    return adminAxios('PUT', `/blogs/categories/${id}`, data);
};

// Admin: Delete blog category
export const adminDeleteBlogCategory = async (id: string) => {
    return adminAxios('DELETE', `/blogs/categories/${id}`);
};
