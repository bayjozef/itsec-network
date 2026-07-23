import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

// Layouts
import { MainLayout } from '@/components/layouts/MainLayout';
import { UserLayout } from '@/components/layouts/UserLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DealerLayout } from '@/components/layouts/DealerLayout';

// Public pages
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ComparePage from '@/pages/ComparePage';
import CartPage from '@/pages/CartPage';
import AuthPage from '@/pages/AuthPage';
import ToolsPage from '@/pages/ToolsPage';
import { BlogListPage, BlogPostPage } from '@/pages/BlogPage';
import ContactPage from '@/pages/ContactPage';
import TrackOrderPage from '@/pages/TrackOrderPage';

// User panel
import UserDashboard from '@/pages/user/UserDashboard';
import OrdersPage from '@/pages/user/OrdersPage';
import WishlistPage from '@/pages/user/WishlistPage';
import ProfilePage from '@/pages/user/ProfilePage';
import MessagesPage from '@/pages/user/MessagesPage';
import QuotesPage from '@/pages/user/QuotesPage';
import DealerApplicationPage from '@/pages/user/DealerApplicationPage';

// Dealer panel
import DealerDashboard from '@/pages/dealer/DealerDashboard';

// Admin panel
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminBanners from '@/pages/admin/AdminBanners';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminPromoKits from '@/pages/admin/AdminPromoKits';
import AdminQuotes from '@/pages/admin/AdminQuotes';
import AdminReports from '@/pages/admin/AdminReports';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminTools from '@/pages/admin/AdminTools';
import AdminTheme from '@/pages/admin/AdminTheme';

import FloatingSocialButtons from '@/components/common/FloatingSocialButtons';
import InitialLoader from '@/components/common/InitialLoader';
import { SettingsProvider } from '@/contexts/SettingsContext';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
      <LanguageProvider>
      <SettingsProvider>
      <AuthProvider>
        <CompareProvider>
        <CartProvider>
          <InitialLoader />
          <IntersectObserver />
          <FloatingSocialButtons />
          <Routes>
            {/* ── Public routes (with header/footer) ── */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/products/:slug" element={<MainLayout><ProductDetailPage /></MainLayout>} />
            <Route path="/compare" element={<MainLayout><ComparePage /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
            <Route path="/track-order" element={<MainLayout><TrackOrderPage /></MainLayout>} />
            <Route path="/auth" element={<MainLayout><AuthPage /></MainLayout>} />
            <Route path="/tools" element={<MainLayout><ToolsPage /></MainLayout>} />
            <Route path="/blog" element={<MainLayout><BlogListPage /></MainLayout>} />
            <Route path="/blog/:slug" element={<MainLayout><BlogPostPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

            {/* ── User panel (auth required) ── */}
            <Route path="/user" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><UserDashboard /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/orders" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><OrdersPage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/orders/:id" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><OrdersPage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/wishlist" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><WishlistPage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><ProfilePage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/messages" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><MessagesPage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/quotes" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><QuotesPage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/user/dealer" element={
              <ProtectedRoute>
                <MainLayout><UserLayout><DealerApplicationPage /></UserLayout></MainLayout>
              </ProtectedRoute>
            } />

            {/* ── Dealer panel (dealer/admin role required) ── */}
            <Route path="/dealer" element={
              <ProtectedRoute requireDealer>
                <DealerLayout><DealerDashboard /></DealerLayout>
              </ProtectedRoute>
            } />
            <Route path="/dealer/orders" element={
              <ProtectedRoute requireDealer>
                <DealerLayout><OrdersPage /></DealerLayout>
              </ProtectedRoute>
            } />
            <Route path="/dealer/credit" element={
              <ProtectedRoute requireDealer>
                <DealerLayout><DealerDashboard /></DealerLayout>
              </ProtectedRoute>
            } />
            <Route path="/dealer/stats" element={
              <ProtectedRoute requireDealer>
                <DealerLayout><DealerDashboard /></DealerLayout>
              </ProtectedRoute>
            } />
            <Route path="/dealer/export" element={
              <ProtectedRoute requireDealer>
                <DealerLayout><DealerDashboard /></DealerLayout>
              </ProtectedRoute>
            } />

            {/* ── Admin panel ── */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdminPanelAccess>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminProducts /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminCategories /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminOrders /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminCustomers /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/banners" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminBanners /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminBlog /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/promo-kits" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminPromoKits /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/quotes" element={
              <ProtectedRoute allowModOrSeller>
                <AdminLayout><AdminQuotes /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminReports /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminSettings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/theme" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminTheme /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/tools" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AdminTools /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </CartProvider>
        </CompareProvider>
      </AuthProvider>
      </SettingsProvider>
      </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
