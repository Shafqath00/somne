import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CustomizePage from "./pages/CustomizePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DeliveryPage from "./pages/DeliveryPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/admin/AdminPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import ProductAdd from "./pages/admin/ProductAdd";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ScrollToTop from "./components/layout/ScrollToTop";
import DiscountPage from "./pages/DiscountPage";
import OrderTracking from "./pages/OrderTracking";

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
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/beds" element={<CategoryPage />} /> */}

                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/customize" element={<CustomizePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/delivery" element={<DeliveryPage />} />
                <Route path="/faq" element={<FAQPage />} />

                {/* Admin Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={
                  <PrivateRoute>
                    <AdminPage />
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

                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<PaymentSuccess />} />
                <Route path="/cancel" element={<PaymentCancel />} />
                <Route path="/track-order" element={<OrderTracking />} />

                {/* Generic Category Routes - Must be after specific routes */}
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/:category/:subcategory" element={<CategoryPage />} />

                {/* 404 Not Found - explicit route for redirects */}
                <Route path="/404" element={<NotFound />} />
                {/* Catch-all for any other unmatched routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
