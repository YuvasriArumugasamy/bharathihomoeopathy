import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Common & Route Guards
import { ProtectedRoute, AdminProtectedRoute } from './components/common/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';
import { SeoManager } from './components/common/SeoManager';

// Customer Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { BestSellers } from './pages/BestSellers';
import { Blog } from './pages/Blog';
import { Appointment } from './pages/Appointment';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyAccount } from './pages/MyAccount';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBrands } from './pages/admin/AdminBrands';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSeo } from './pages/admin/AdminSeo';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { useFCM } from './hooks/useFCM';

export default function App() {
  const location = useLocation();

  // Initialize Firebase Cloud Messaging Push Notifications
  useFCM();

  React.useEffect(() => {
    const isPathAdmin = location.pathname.toLowerCase().startsWith('/admin');
    const manifestEl = document.getElementById('app-manifest') || document.querySelector('link[rel="manifest"]');
    if (manifestEl) {
      manifestEl.setAttribute('href', isPathAdmin ? '/manifest-admin.json' : '/manifest.json');
    }
    if (isPathAdmin) {
      localStorage.setItem('dr_bharathi_pwa_mode', 'admin');
    }
  }, [location.pathname]);

  React.useEffect(() => {
    // Neutralize any body displacement or top margin injected by Google Translate or browser plugins
    const resetBodyShift = () => {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
      }
      if (document.body.style.position === 'relative') {
        document.body.style.setProperty('position', 'static', 'important');
      }
      if (document.documentElement.style.top && document.documentElement.style.top !== '0px') {
        document.documentElement.style.setProperty('top', '0px', 'important');
      }
    };

    resetBodyShift();
    const observer = new MutationObserver(resetBodyShift);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <SeoManager />
      <PwaInstallPrompt />
      <Routes>
      {/* Patient & Customer Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="best-sellers" element={<BestSellers />} />
        <Route path="blog" element={<Blog />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-account"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="blog" element={<Navigate to="/admin" replace />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="seo" element={<Navigate to="/admin" replace />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  );
}
