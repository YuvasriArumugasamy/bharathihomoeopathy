import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Common & Route Guards
import { ProtectedRoute, AdminProtectedRoute } from './components/common/ProtectedRoute';
import { ScrollToTop } from './components/common/ScrollToTop';

// Customer Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { BestSellers } from './pages/BestSellers';
import { Offers } from './pages/Offers';
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
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminOffers } from './pages/admin/AdminOffers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSeo } from './pages/admin/AdminSeo';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Patient & Customer Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="best-sellers" element={<BestSellers />} />
        <Route path="offers" element={<Offers />} />
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
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="seo" element={<AdminSeo />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
