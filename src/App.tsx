import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import ScrollToTop from "./components/layout/ScrollToTop";
import { Loader2 } from "lucide-react";

// Lazy load pages
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CustomizePage = lazy(() => import("./pages/CustomizePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AdminContactForms = lazy(() => import("./pages/admin/AdminContactForms"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const ProductAdd = lazy(() => import("./pages/admin/ProductAdd"));
const AdminProductEdit = lazy(() => import("./pages/admin/AdminProductEdit"));
const Checkout = lazy(() => import("./pages/PaymentPages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentPages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentPages/PaymentCancel"));
const DiscountPage = lazy(() => import("./pages/admin/DiscountPage"));
const OrderTracking = lazy(() => import("./pages/PaymentPages/OrderTracking"));
const BlogsPage = lazy(() => import("./pages/blogs/BlogsPage"));
const BlogDetailPage = lazy(() => import("./pages/blogs/BlogDetailPage"));
const AdminBlogManager = lazy(() => import("./pages/admin/AdminBlogManager"));

// Configure React Query with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache for 30 minutes (formerly cacheTime)
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
});

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="font-serif text-lg text-gray-500">Loading Somne...</p>
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  {/* <Route path="/beds" element={<CategoryPage />} /> */}

                  <Route path="/product/:slug" element={<ProductPage />} />
                  {/* <Route path="/customize" element={<CustomizePage />} />
                  <Route path="/about" element={<AboutPage />} /> */}
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/returns" element={<DeliveryPage />} />
                  {/* <Route path="/faq" element={<FAQPage />} /> */}

                  {/* Admin Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin" element={
                    <PrivateRoute>
                      <AdminHome />
                      {/* <AdminPage /> */}
                    </PrivateRoute>
                  } />
                  <Route path="/admin/products" element={
                    <PrivateRoute>
                      {/* <AdminHome /> */}
                      <AdminPage />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/contact-forms" element={
                    <PrivateRoute>
                      <AdminContactForms />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/orders/:id" element={
                    <PrivateRoute>
                      <AdminOrderDetail />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/discount" element={
                    <PrivateRoute>
                      <DiscountPage />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/add" element={
                    <PrivateRoute>
                      <ProductAdd />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/edit/:id" element={
                    <PrivateRoute>
                      <AdminProductEdit />
                    </PrivateRoute>
                  } />
                  <Route path="/admin/blogs" element={
                    <PrivateRoute>
                      <AdminBlogManager />
                    </PrivateRoute>
                  } />

                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/success" element={<PaymentSuccess />} />
                  <Route path="/cancel" element={<PaymentCancel />} />
                  <Route path="/track-order" element={<OrderTracking />} />

                  {/* Blog Routes - Must be before generic category routes */}
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/:category" element={<BlogsPage />} />
                  <Route path="/blogs/:category/:slug" element={<BlogDetailPage />} />

                  {/* Generic Category Routes - Must be after specific routes */}
                  <Route path="/:category" element={<CategoryPage />} />
                  <Route path="/:category/:subcategory" element={<CategoryPage />} />

                  {/* 404 Not Found - explicit route for redirects */}
                  <Route path="/404" element={<NotFound />} />
                  {/* Catch-all for any other unmatched routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
