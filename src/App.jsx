import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';

// Layouts
import { MainLayout } from './layouts/MainLayout';
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));

// Common & Route Guards
import { ProtectedRoute, AdminProtectedRoute } from './components/common/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';
import { SeoManager } from './components/common/SeoManager';

// Load only the page a visitor opens instead of downloading the full customer
// and admin portal before the first screen can render.
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Shop = React.lazy(() => import('./pages/Shop').then(module => ({ default: module.Shop })));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails').then(module => ({ default: module.ProductDetails })));
const BestSellers = React.lazy(() => import('./pages/BestSellers').then(module => ({ default: module.BestSellers })));
const Blog = React.lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const Appointment = React.lazy(() => import('./pages/Appointment').then(module => ({ default: module.Appointment })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = React.lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const MyAccount = React.lazy(() => import('./pages/MyAccount').then(module => ({ default: module.MyAccount })));
const Cart = React.lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })));
const Wishlist = React.lazy(() => import('./pages/Wishlist').then(module => ({ default: module.Wishlist })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts').then(module => ({ default: module.AdminProducts })));
const AdminSizes = React.lazy(() => import('./pages/admin/AdminSizes').then(module => ({ default: module.AdminSizes })));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories').then(module => ({ default: module.AdminCategories })));
const AdminBrands = React.lazy(() => import('./pages/admin/AdminBrands').then(module => ({ default: module.AdminBrands })));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders').then(module => ({ default: module.AdminOrders })));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers').then(module => ({ default: module.AdminCustomers })));
const AdminAppointments = React.lazy(() => import('./pages/admin/AdminAppointments').then(module => ({ default: module.AdminAppointments })));
const AdminInventory = React.lazy(() => import('./pages/admin/AdminInventory').then(module => ({ default: module.AdminInventory })));
const AdminPayments = React.lazy(() => import('./pages/admin/AdminPayments').then(module => ({ default: module.AdminPayments })));
const AdminReviews = React.lazy(() => import('./pages/admin/AdminReviews').then(module => ({ default: module.AdminReviews })));
const AdminEnquiries = React.lazy(() => import('./pages/admin/AdminEnquiries').then(module => ({ default: module.AdminEnquiries })));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminNotifications = React.lazy(() => import('./pages/admin/AdminNotifications').then(module => ({ default: module.AdminNotifications })));
const AdminVisitors = React.lazy(() => import('./pages/admin/AdminVisitors').then(module => ({ default: module.AdminVisitors })));
import { useVisitorTracker } from './hooks/useVisitorTracker';
import { useFCM } from './hooks/useFCM';

export default function App() {
  const location = useLocation();

  // Initialize Firebase Cloud Messaging Push Notifications
  useFCM();

  // Automatic Anonymous Visitor Tracking on public pages
  useVisitorTracker();

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
      <React.Suspense fallback={<div className="min-h-[40vh] grid place-items-center text-sm font-semibold text-slate-500" role="status">Loading page…</div>}>
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
        <Route path="sizes" element={<AdminSizes />} />
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
        <Route path="visitors" element={<AdminVisitors />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </React.Suspense>
    </ErrorBoundary>
  );
}
