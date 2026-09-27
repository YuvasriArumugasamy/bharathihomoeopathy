import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Boxes,
  Plus,
  Activity,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  Filter,
  Package,
  Layers,
  Phone,
  Palette,
  Bell,
  BellOff
} from 'lucide-react';
import { adminDashboardData } from '../../data/adminDashboardData';
import { demoProducts } from '../../data/products';
import { orderService, getStoredOrders } from '../../services/orderService';
import { productService } from '../../services/productService';
import { appointmentService, getStoredAppointments } from '../../services/appointmentService';
import { customerService, getStoredCustomers } from '../../services/customerService';
import { enquiryService, getStoredEnquiries } from '../../services/enquiryService';
import { cloudSyncService } from '../../services/cloudSyncService';
import { assets } from '../../assets';
import { 
  initializeNotifications, 
  listenForNotifications, 
  showNewOrderNotification,
  showNewAppointmentNotification,
  areNotificationsEnabled,
  getNotificationPermission
} from '../../services/notificationService';

export const AdminDashboard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };
  const [timeFilter, setTimeFilter] = useState('7 Days');
  const [metricView, setMetricView] = useState('revenue'); // 'revenue' | 'orders'
  const [chartTheme, setChartTheme] = useState('teal'); // 'teal' | 'indigo' | 'purple' | 'amber'
  const [orders, setOrders] = useState(() => (typeof getStoredOrders === 'function' ? getStoredOrders() : []));
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_products_store');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [appointments, setAppointments] = useState(() => (typeof getStoredAppointments === 'function' ? getStoredAppointments() : []));
  const [customers, setCustomers] = useState(() => (typeof getStoredCustomers === 'function' ? getStoredCustomers() : []));
  const [enquiries, setEnquiries] = useState(() => (typeof getStoredEnquiries === 'function' ? getStoredEnquiries() : []));
  const [reviews, setReviews] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_reviews_store');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(areNotificationsEnabled());
  const [showNotificationBanner, setShowNotificationBanner] = useState(
    !areNotificationsEnabled() && getNotificationPermission() !== 'denied'
  );

  // Initialize notifications on mount
  useEffect(() => {
    const unsubscribe = listenForNotifications();
    setNotificationsEnabled(areNotificationsEnabled());

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Monitor for new orders/appointments and trigger push notifications
  useEffect(() => {
    let previousOrderCount = orders.length;
    let previousAppointmentCount = appointments.length;

    const checkForNew = () => {
      const currentOrderCount = orders.length;
      const currentAppointmentCount = appointments.length;

      if (currentOrderCount > previousOrderCount && notificationsEnabled) {
        const newOrder = orders[0];
        showNewOrderNotification(newOrder);
      }

      if (currentAppointmentCount > previousAppointmentCount && notificationsEnabled) {
        const newAppointment = appointments[0];
        showNewAppointmentNotification(newAppointment);
      }

      previousOrderCount = currentOrderCount;
      previousAppointmentCount = currentAppointmentCount;
    };

    if (orders.length > 0 || appointments.length > 0) {
      checkForNew();
    }
  }, [orders, appointments, notificationsEnabled]);

  const handleEnableNotifications = async () => {
    const token = await initializeNotifications();
    if (token) {
      setNotificationsEnabled(true);
      setShowNotificationBanner(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      if (typeof getStoredOrders === 'function') setOrders(getStoredOrders());
      if (typeof getStoredAppointments === 'function') setAppointments(getStoredAppointments());
      if (typeof getStoredCustomers === 'function') setCustomers(getStoredCustomers());
      if (typeof getStoredEnquiries === 'function') setEnquiries(getStoredEnquiries());

      try {
        const rawReviews = localStorage.getItem('admin_reviews_store');
        if (rawReviews) setReviews(JSON.parse(rawReviews));
      } catch {}

      const [liveOrders, liveProducts, liveApts] = await Promise.all([
        orderService.getAdminOrders().catch(() => []),
        productService.getAdminProducts().catch(() => []),
        appointmentService.getAdminAppointments().catch(() => [])
      ]);
      if (Array.isArray(liveOrders) && liveOrders.length > 0) setOrders(liveOrders);
      if (Array.isArray(liveProducts) && liveProducts.length > 0) setProducts(liveProducts);
      if (Array.isArray(liveApts) && liveApts.length > 0) setAppointments(liveApts);
    } catch (err) {
      console.warn("Failed to load dashboard dynamic data:", err.message);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // 1. Live Cloud Firestore Stream for Orders across all devices
    const unsubscribeCloudOrders = cloudSyncService.listenToCloudOrders((liveOrders) => {
      if (Array.isArray(liveOrders)) {
        setOrders(liveOrders);
      }
    });

    // 2. Live Cloud Firestore Stream for Appointments across all devices
    const unsubscribeCloudApts = cloudSyncService.listenToCloudAppointments((liveApts) => {
      if (Array.isArray(liveApts)) {
        setAppointments(liveApts);
      }
    });

    const handleSync = () => {
      loadDashboardData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('appointments_updated', handleSync);
    window.addEventListener('orders_updated', handleSync);
    window.addEventListener('enquiries_updated', handleSync);
    window.addEventListener('products_updated', handleSync);
    window.addEventListener('admin_inventory_updated', handleSync);
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);

    // Periodic live cloud polling every 10s to guarantee cross-device real-time sync
    const pollInterval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      if (typeof unsubscribeCloudOrders === 'function') unsubscribeCloudOrders();
      if (typeof unsubscribeCloudApts === 'function') unsubscribeCloudApts();
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('appointments_updated', handleSync);
      window.removeEventListener('orders_updated', handleSync);
      window.removeEventListener('enquiries_updated', handleSync);
      window.removeEventListener('products_updated', handleSync);
      window.removeEventListener('admin_inventory_updated', handleSync);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
    };
  }, []);

  // Helper to reliably find crystal-clear bundled product photography
  const getProductImage = (item) => {
    const itemName = (item.name || item.title || '').trim().toLowerCase();
    const itemId = String(item.id || item._id || item.productId || '').trim().toLowerCase();

    // 1. Check live products list for non-blob clean image
    const foundInProducts = (Array.isArray(products) ? products : []).find(p => 
      (p.name && p.name.trim().toLowerCase() === itemName) ||
      (p.id && String(p.id).trim().toLowerCase() === itemId)
    );
    if (foundInProducts?.image && typeof foundInProducts.image === 'string' && !foundInProducts.image.includes('blob:') && !foundInProducts.image.includes('/@fs/') && foundInProducts.image !== '/logo.png') {
      return foundInProducts.image;
    }

    // 2. Check demoProducts catalog
    const foundInCatalog = demoProducts.find(p => 
      (p.name && p.name.trim().toLowerCase() === itemName) ||
      (p.id && String(p.id).trim().toLowerCase() === itemId)
    );
    if (foundInCatalog?.image) {
      return foundInCatalog.image;
    }

    // 3. Name-based match to authentic high-resolution homeopathic remedy images
    if (itemName.includes('urtica')) return assets.p1;
    if (itemName.includes('cantharis')) return assets.p2;
    if (itemName.includes('alfalfa')) return assets.p3;
    if (itemName.includes('carduus')) return assets.p4;
    if (itemName.includes('arnica')) return assets.p1;
    if (itemName.includes('berberis')) return assets.p5;
    if (itemName.includes('thuja')) return assets.p6;
    if (itemName.includes('calendula')) return assets.p7;
    if (itemName.includes('echinacea')) return assets.p8;
    if (itemName.includes('rhus')) return assets.p9;
    if (itemName.includes('nux')) return assets.p10;
    if (itemName.includes('ocimum') || itemName.includes('tulsi')) return assets.p11;

    // 4. Valid image URL fallback
    if (item.image && typeof item.image === 'string' && !item.image.includes('blob:') && !item.image.includes('/@fs/') && item.image !== '/logo.png') {
      return item.image;
    }

    return assets.product1 || assets.p1;
  };

  // Real-Time Analytics Calculations from orders
  const chartPoints = useMemo(() => {
    const validOrders = Array.isArray(orders) ? orders : [];
    
    if (timeFilter === '7 Days') {
      const points = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

        const matching = validOrders.filter(o => {
          if (!o.createdAt) return false;
          const oDate = new Date(o.createdAt);
          if (isNaN(oDate.getTime())) return false;
          const oKey = `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}-${String(oDate.getDate()).padStart(2, '0')}`;
          return oKey === dateKey;
        });

        const rev = matching.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        points.push({
          label: dayLabel,
          revenue: Math.round(rev * 100) / 100,
          orders: matching.length
        });
      }
      return points;
    }

    if (timeFilter === '30 Days') {
      const points = [];
      const now = new Date();
      for (let b = 5; b >= 0; b--) {
        const startDay = new Date(now);
        startDay.setDate(startDay.getDate() - (b * 5 + 4));
        startDay.setHours(0, 0, 0, 0);

        const endDay = new Date(now);
        endDay.setDate(endDay.getDate() - (b * 5));
        endDay.setHours(23, 59, 59, 999);

        const label = `${startDay.getDate()} ${startDay.toLocaleDateString('en-US', { month: 'short' })} - ${endDay.getDate()} ${endDay.toLocaleDateString('en-US', { month: 'short' })}`;

        const matching = validOrders.filter(o => {
          if (!o.createdAt) return false;
          const oDate = new Date(o.createdAt);
          return oDate >= startDay && oDate <= endDay;
        });

        const rev = matching.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        points.push({
          label,
          revenue: Math.round(rev * 100) / 100,
          orders: matching.length
        });
      }
      return points;
    }

    if (timeFilter === '90 Days') {
      const points = [];
      const now = new Date();
      for (let m = 2; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const y = d.getFullYear();
        const mon = d.getMonth();

        const matching = validOrders.filter(o => {
          if (!o.createdAt) return false;
          const oDate = new Date(o.createdAt);
          return oDate.getFullYear() === y && oDate.getMonth() === mon;
        });

        const rev = matching.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        points.push({
          label: monthLabel,
          revenue: Math.round(rev * 100) / 100,
          orders: matching.length
        });
      }
      return points;
    }

    return [];
  }, [orders, timeFilter]);

  // Real Orders pipeline calculation
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;

  // Real Low Stock Items calculation
  const lowStockItems = useMemo(() => {
    let inv = [];
    try {
      const saved = localStorage.getItem('admin_inventory_store');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) inv = parsed;
      }
    } catch {}

    if (inv.length > 0) {
      const low = inv.filter(i => (Number(i.currentStock) || 0) <= (Number(i.lowStockThreshold) || 10));
      if (low.length > 0) {
        return low.slice(0, 5).map(item => ({
          id: item.id || item.productId,
          name: item.productName || item.name,
          currentStock: Number(item.currentStock) || 0,
          threshold: Number(item.lowStockThreshold) || 10,
          status: (Number(item.currentStock) || 0) === 0 ? 'Out of Stock' : 'Low Stock'
        }));
      }
    }

    if (Array.isArray(products) && products.length > 0) {
      const low = products.filter(p => (Number(p.stock) || 0) <= (Number(p.lowStockThreshold) || 5));
      if (low.length > 0) {
        return low.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          currentStock: Number(p.stock) || 0,
          threshold: Number(p.lowStockThreshold) || 5,
          status: (Number(p.stock) || 0) === 0 ? 'Out of Stock' : 'Low Stock'
        }));
      }
    }

    return [];
  }, [products]);

  const lowStockCount = lowStockItems.length;

  // Real Enquiries & Average Rating calculation
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New' || !e.isRead).length;

  const averageRating = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) return '4.9 / 5';
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = sum / reviews.length;
    return `${avg.toFixed(1)} / 5`;
  }, [reviews]);

  const dynamicKpiStats = adminDashboardData.kpiStats.map((kpi) => {
    if (kpi.id === 'rev') return { ...kpi, value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` };
    if (kpi.id === 'orders') return { ...kpi, value: totalOrdersCount.toString() };
    if (kpi.id === 'pending_ord') return { ...kpi, value: pendingOrders.toString() };
    if (kpi.id === 'low_stock') return { ...kpi, value: lowStockCount.toString() };
    if (kpi.id === 'apt') return { ...kpi, value: appointments.length.toString() };
    if (kpi.id === 'cust') return { ...kpi, value: customers.length.toString() };
    if (kpi.id === 'enq') return { ...kpi, value: newEnquiriesCount.toString() };
    if (kpi.id === 'rev_rate') return { ...kpi, value: averageRating };
    return kpi;
  });

  const recentOrdersList = orders.length > 0 ? orders.slice(0, 5).map(ord => ({
    id: ord.orderId || ord.id,
    customer: ord.customer?.name || ord.shippingAddress?.fullName || 'Patient',
    amount: Number(ord.total) || 0,
    status: ord.orderStatus || 'Pending'
  })) : adminDashboardData.recentOrders;

  // Real-Time Top Selling Products: Properly aggregated by product name with crisp imagery
  const topSellingProducts = useMemo(() => {
    const productSalesMap = {};

    orders.forEach(order => {
      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach(item => {
        const rawName = (item.name || item.title || item.productName || 'Classical Homeopathic Remedy').trim();
        const normKey = rawName.toLowerCase();
        if (!normKey) return;

        if (!productSalesMap[normKey]) {
          productSalesMap[normKey] = {
            id: normKey,
            name: rawName,
            image: getProductImage(item),
            unitsSold: 0,
            revenue: 0
          };
        }
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        productSalesMap[normKey].unitsSold += qty;
        productSalesMap[normKey].revenue += (price * qty);
      });
    });

    const salesList = Object.values(productSalesMap);

    if (salesList.length > 0) {
      salesList.sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);
      return salesList.slice(0, 5).map((p, idx) => ({
        ...p,
        rank: idx + 1,
        revenue: `₹${p.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }));
    }

    const catalogList = Array.isArray(products) && products.length > 0 ? products : demoProducts;
    return catalogList.slice(0, 5).map((p, idx) => ({
      id: p.id || idx,
      rank: idx + 1,
      name: p.name,
      unitsSold: Number(p.salesCount) || Math.max(1, (5 - idx) * 2),
      revenue: `₹${((Number(p.salePrice || p.price) || 120) * (Number(p.salesCount) || Math.max(1, (5 - idx) * 2))).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      image: getProductImage(p)
    }));
  }, [orders, products]);

  // Real-Time Appointments for Today / Upcoming
  const todayAppointments = useMemo(() => {
    if (!Array.isArray(appointments) || appointments.length === 0) return [];
    
    const today = new Date().toISOString().slice(0, 10);
    const todays = appointments.filter(a => {
      if (!a.date) return false;
      const aDate = new Date(a.date).toISOString().slice(0, 10);
      return aDate === today;
    });

    const listToDisplay = todays.length > 0 ? todays : appointments.slice(0, 4);

    return listToDisplay.map((apt, idx) => ({
      id: apt.id || apt.appointmentId || `apt-${idx}`,
      patient: apt.patient?.name || apt.patientName || apt.fullName || 'Patient',
      doctor: apt.doctor || 'Dr. Bharathi',
      type: apt.consultationMode || apt.type || apt.concern || 'Consultation',
      time: apt.time || '10:00 AM',
      date: apt.date || today,
      isToday: todays.includes(apt),
      status: apt.status || 'Confirmed'
    }));
  }, [appointments]);

  const pipelineStatuses = [
    { 
      label: 'Pending Confirmation', 
      count: orders.filter(o => o.orderStatus === 'Pending').length, 
      color: 'from-amber-400 to-orange-500', 
      barBg: 'bg-amber-500', 
      dot: 'bg-amber-500' 
    },
    { 
      label: 'Confirmed / Paid', 
      count: orders.filter(o => o.orderStatus === 'Confirmed' || (o.paymentStatus === 'Paid' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled')).length, 
      color: 'from-sky-400 to-blue-500', 
      barBg: 'bg-sky-500', 
      dot: 'bg-sky-500' 
    },
    { 
      label: 'Dispensary Packing', 
      count: orders.filter(o => o.orderStatus === 'Processing').length, 
      color: 'from-purple-400 to-violet-500', 
      barBg: 'bg-purple-500', 
      dot: 'bg-purple-500' 
    },
    { 
      label: 'Out with Courier', 
      count: orders.filter(o => o.orderStatus === 'Shipped').length, 
      color: 'from-indigo-400 to-blue-600', 
      barBg: 'bg-indigo-500', 
      dot: 'bg-indigo-500' 
    },
    { 
      label: 'Delivered to Patient', 
      count: orders.filter(o => o.orderStatus === 'Delivered').length, 
      color: 'from-emerald-400 to-teal-500', 
      barBg: 'bg-emerald-500', 
      dot: 'bg-emerald-500' 
    },
    { 
      label: 'Cancelled / Refunded', 
      count: orders.filter(o => o.orderStatus === 'Cancelled').length, 
      color: 'from-rose-400 to-red-500', 
      barBg: 'bg-rose-500', 
      dot: 'bg-rose-500' 
    }
  ];

  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  const chartThemes = {
    teal: {
      name: 'Ocean Teal',
      bar: 'from-[#0f766e] via-[#0d9488] to-[#2dd4bf]',
      peak: 'from-[#047857] via-[#0d9488] to-[#34d399]',
      glow: 'shadow-teal-500/25',
      dot: 'bg-teal-400',
      legend: 'from-[#0f766e] to-[#2dd4bf]',
      pill: 'bg-teal-50 text-teal-800 border-teal-200',
      swatch: 'bg-teal-500'
    },
    indigo: {
      name: 'Royal Blue',
      bar: 'from-[#3730a3] via-[#4f46e5] to-[#38bdf8]',
      peak: 'from-[#312e81] via-[#4338ca] to-[#818cf8]',
      glow: 'shadow-indigo-500/25',
      dot: 'bg-sky-400',
      legend: 'from-[#3730a3] to-[#38bdf8]',
      pill: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      swatch: 'bg-indigo-600'
    },
    purple: {
      name: 'Amethyst',
      bar: 'from-[#6b21a8] via-[#9333ea] to-[#c084fc]',
      peak: 'from-[#581c87] via-[#7e22ce] to-[#d8b4fe]',
      glow: 'shadow-purple-500/25',
      dot: 'bg-purple-400',
      legend: 'from-[#6b21a8] to-[#c084fc]',
      pill: 'bg-purple-50 text-purple-800 border-purple-200',
      swatch: 'bg-purple-600'
    },
    amber: {
      name: 'Warm Sunset',
      bar: 'from-[#ea580c] via-[#f97316] to-[#fbbf24]',
      peak: 'from-[#c2410c] via-[#ea580c] to-[#fde047]',
      glow: 'shadow-orange-500/25',
      dot: 'bg-amber-400',
      legend: 'from-[#ea580c] to-[#fbbf24]',
      pill: 'bg-amber-50 text-amber-800 border-amber-200',
      swatch: 'bg-amber-500'
    }
  };

  const activeChartTheme = chartThemes[chartTheme] || chartThemes['teal'];

  const iconMap = {
    IndianRupee,
    ShoppingBag,
    Users,
    Calendar,
    Clock,
    AlertTriangle,
    MessageSquare,
    Star
  };

  const kpiCardStyles = {
    'rev': {
      gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
      border: 'border-amber-200/90 hover:border-amber-400',
      iconGradient: 'from-amber-500 to-brandOrange-600',
      iconShadow: 'shadow-amber-500/25',
      accentColor: 'text-amber-600',
      topLine: 'bg-gradient-to-r from-amber-400 to-brandOrange-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'orders': {
      gradient: 'from-sky-500/15 via-blue-500/5 to-transparent',
      border: 'border-sky-200/90 hover:border-sky-400',
      iconGradient: 'from-sky-500 to-blue-600',
      iconShadow: 'shadow-sky-500/25',
      accentColor: 'text-sky-600',
      topLine: 'bg-gradient-to-r from-sky-400 to-blue-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'cust': {
      gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      border: 'border-emerald-200/90 hover:border-emerald-400',
      iconGradient: 'from-emerald-500 to-teal-600',
      iconShadow: 'shadow-emerald-500/25',
      accentColor: 'text-emerald-600',
      topLine: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'apt': {
      gradient: 'from-purple-500/15 via-violet-500/5 to-transparent',
      border: 'border-purple-200/90 hover:border-purple-400',
      iconGradient: 'from-purple-500 to-violet-600',
      iconShadow: 'shadow-purple-500/25',
      accentColor: 'text-purple-600',
      topLine: 'bg-gradient-to-r from-purple-400 to-violet-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'pending_ord': {
      gradient: 'from-orange-500/15 via-amber-500/5 to-transparent',
      border: 'border-orange-200/90 hover:border-orange-400',
      iconGradient: 'from-orange-500 to-amber-600',
      iconShadow: 'shadow-orange-500/25',
      accentColor: 'text-orange-600',
      topLine: 'bg-gradient-to-r from-orange-400 to-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    'low_stock': {
      gradient: 'from-rose-500/15 via-red-500/5 to-transparent',
      border: 'border-rose-200/90 hover:border-rose-400',
      iconGradient: 'from-rose-500 to-red-600',
      iconShadow: 'shadow-rose-500/25',
      accentColor: 'text-rose-600',
      topLine: 'bg-gradient-to-r from-rose-400 to-red-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    'enq': {
      gradient: 'from-cyan-500/15 via-teal-500/5 to-transparent',
      border: 'border-cyan-200/90 hover:border-cyan-400',
      iconGradient: 'from-cyan-500 to-blue-600',
      iconShadow: 'shadow-cyan-500/25',
      accentColor: 'text-cyan-600',
      topLine: 'bg-gradient-to-r from-cyan-400 to-teal-500',
      badge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    'rev_rate': {
      gradient: 'from-amber-400/15 via-yellow-500/5 to-transparent',
      border: 'border-amber-200/90 hover:border-amber-400',
      iconGradient: 'from-amber-400 to-yellow-500',
      iconShadow: 'shadow-yellow-500/25',
      accentColor: 'text-amber-500',
      topLine: 'bg-gradient-to-r from-amber-400 to-yellow-400',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-serif">

      {/* Push Notification Banner */}
      {showNotificationBanner && (
        <div className="bg-gradient-to-r from-brandOrange-500 to-amber-500 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 shrink-0 animate-bounce" />
            <div>
              <p className="font-bold text-sm">Enable Instant Notifications</p>
              <p className="text-xs text-orange-100">Get notified immediately when new orders or appointments are placed</p>
            </div>
          </div>
          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 bg-white text-brandOrange-600 rounded-xl font-bold text-xs hover:bg-orange-50 transition-all cursor-pointer shadow-md shrink-0 ml-4"
          >
            Enable Now
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#ffe8d6] via-[#fff1e6] to-[#f8f9fa] border border-[#f0cbb5] p-6 sm:p-8 lg:p-10 shadow-[0_10px_35px_-5px_rgba(234,88,12,0.12)]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-amber-200/40 via-orange-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Real-Time Clinical Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
              {getGreeting()}, Dr. Bharathi
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-serif">
              Live operational dispensary metrics, consultations, and patient order flow across Tamil Nadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brandOrange-500" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/admin/appointments"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Appointments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Bespoke KPI Grid: 8 Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {dynamicKpiStats.map((kpi) => {
          const IconComponent = iconMap[kpi.icon] || ShoppingBag;
          const style = kpiCardStyles[kpi.id] || kpiCardStyles['orders'];

          return (
            <div 
              key={kpi.id} 
              className={`relative bg-gradient-to-br ${style.gradient} bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-[2rem] border ${style.border} shadow-[0_4px_20px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col justify-between`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${style.topLine}`} />

              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">
                  {kpi.title}
                </span>
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${style.iconGradient} text-white flex items-center justify-center shadow-lg ${style.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display mb-1.5 truncate">
                  {kpi.value}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10.5px] font-black border ${style.badge}`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {kpi.subtext}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Real-Time Revenue & Order Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Analytics Interactive Chart */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-brandOrange-600 border border-orange-200/70">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                    Revenue & Order Analytics
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Consolidated dispensary sales & online doctor consultation revenue</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Metric View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold border border-slate-200/70 shrink-0">
                <button
                  onClick={() => setMetricView('revenue')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    metricView === 'revenue' 
                      ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Revenue (₹)
                </button>
                <button
                  onClick={() => setMetricView('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    metricView === 'orders' 
                      ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Orders
                </button>
              </div>

              {/* Palette Switcher */}
              <div className="flex items-center bg-slate-100 p-1.5 rounded-xl gap-1.5 border border-slate-200/70 shrink-0" title="Choose Chart Color Palette">
                <Palette className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
                {Object.keys(chartThemes).map((key) => (
                  <button
                    key={key}
                    onClick={() => setChartTheme(key)}
                    className={`w-4 h-4 rounded-full ${chartThemes[key].swatch} transition-all cursor-pointer ${
                      chartTheme === key ? 'ring-2 ring-offset-1 ring-slate-800 scale-125 shadow-xs' : 'opacity-60 hover:opacity-100 hover:scale-110'
                    }`}
                    title={chartThemes[key].name}
                  />
                ))}
              </div>

              {/* Time Range Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold border border-slate-200/70 shrink-0">
                {['7 Days', '30 Days', '90 Days'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                      timeFilter === t 
                        ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Chart Container */}
          <div className="relative h-60 sm:h-64 flex items-end gap-2 sm:gap-4 lg:gap-6 pt-10 pb-3 border-b border-slate-100">
            {/* Background reference lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
            </div>

            {chartPoints && chartPoints.length > 0 ? (
              chartPoints.map((pt, i) => {
                const currentVal = metricView === 'revenue' ? (pt.revenue || 0) : (pt.orders || 0);
                const maxVal = Math.max(1, ...chartPoints.map(p => metricView === 'revenue' ? (p.revenue || 0) : (p.orders || 0)));
                const heightPercent = currentVal > 0 ? Math.max(16, Math.round((currentVal / maxVal) * 100)) : 4;
                const isPeak = currentVal === maxVal && maxVal > 0;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 h-full justify-end group relative z-10">
                    {/* Interactive Floating Tooltip */}
                    <div className="absolute -top-10 bg-slate-900 text-white text-[10px] sm:text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl z-30 whitespace-nowrap flex items-center gap-1.5 border border-slate-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeChartTheme.dot}`} />
                      <span className="font-bold">{pt.label}:</span>
                      <span className="font-black text-amber-300">
                        {metricView === 'revenue' ? `₹${(pt.revenue || 0).toLocaleString('en-IN')}` : `${pt.orders || 0} orders`}
                      </span>
                    </div>

                    {/* Slot Background & Pillar */}
                    <div className="w-full h-full flex items-end justify-center bg-slate-100/50 hover:bg-slate-100/80 rounded-t-lg sm:rounded-t-xl transition-colors p-0.5 sm:p-1">
                      {/* Gradient Pillar Bar */}
                      <div
                        className={`w-full bg-gradient-to-t ${isPeak ? activeChartTheme.peak : activeChartTheme.bar} rounded-t-md sm:rounded-t-lg transition-all duration-500 group-hover:brightness-110 group-hover:scale-x-105 shadow-sm ${isPeak ? activeChartTheme.glow : ''} relative overflow-hidden`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                      </div>
                    </div>
                    
                    {/* Label */}
                    <span className={`text-[10px] sm:text-[11px] font-bold mt-1 truncate ${isPeak ? 'text-slate-900 font-black' : 'text-slate-500'}`}>
                      {pt.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs font-medium z-10 py-12">
                <TrendingUp className="w-8 h-8 stroke-1 text-slate-300 mb-2" />
                <span>No analytics recorded yet for this period</span>
              </div>
            )}
          </div>

          {/* Chart Footer Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2.5 pt-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] sm:text-xs">
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r ${activeChartTheme.legend} rounded-full shrink-0 shadow-2xs`} />
              <span className="text-slate-700 font-bold truncate">Dispensary & Booking Volume ({activeChartTheme.name})</span>
            </div>

            <div className="flex items-center">
              <div className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold ${activeChartTheme.pill}`}>
                {chartPoints && chartPoints.some(pt => (metricView === 'revenue' ? pt.revenue : pt.orders) > 0) ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Peak: {chartPoints.reduce((max, pt) => ((metricView === 'revenue' ? (pt?.revenue || 0) : (pt?.orders || 0)) > (metricView === 'revenue' ? (max?.revenue || 0) : (max?.orders || 0)) ? pt : max), chartPoints[0])?.label || 'Today'}</span>
                  </>
                ) : (
                  <span>Live order volume monitoring active</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Pipeline */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                Fulfillment Pipeline
              </h3>
              <span className="text-[10.5px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 shadow-2xs">
                {activeOrdersCount} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Live order status distribution across dispensary</p>
          </div>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {pipelineStatuses.map((st, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${st.dot} shrink-0`} />
                    <span className="text-slate-700 font-bold">{st.label}</span>
                  </span>
                  <span className="font-black text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 text-[11.5px] shrink-0 border border-slate-200/50">{st.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className={`bg-gradient-to-r ${st.color} h-full rounded-full transition-all duration-700 shadow-2xs`} 
                    style={{ width: `${totalOrdersCount > 0 ? Math.max(4, Math.round((st.count / totalOrdersCount) * 100)) : 0}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/orders"
            className="w-full py-3.5 bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-extrabold text-xs rounded-2xl text-center shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-white/20 active:scale-[0.99]"
          >
            <span>{totalOrdersCount > 0 ? `Manage All ${totalOrdersCount} Orders` : 'Manage Orders'}</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* 4. Today's Consultations & Inventory Alert Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Consultations */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/70">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Today's Appointments</h3>
                <p className="text-xs text-slate-400 font-medium">Scheduled patient consultations</p>
              </div>
            </div>

            <Link to="/admin/appointments" className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>View Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No appointments scheduled for today
              </div>
            ) : (
              todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-navy-950 to-purple-800 text-white font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
                      <span className="text-[10px] leading-none">{apt.time ? apt.time.split(' ')[0] : '10:00'}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-brandOrange-600 transition-colors">
                        {apt.patient}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {apt.type} • {apt.doctor}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/70">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Inventory Alerts</h3>
                <p className="text-xs text-slate-400 font-medium">Remedies requiring immediate replenishment</p>
              </div>
            </div>

            <Link to="/admin/inventory" className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline">
              <span>Restock all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                All dispensary inventory levels are optimal
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-50/80 border border-rose-200/70 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                      <Boxes className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Threshold: {item.threshold} units • Status: <span className="font-bold text-rose-600">{item.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-rose-600 font-display">
                      {item.currentStock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 5. Tables Section: Recent Orders & Top Selling Remedies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider font-display">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-400 font-medium">Latest patient orders placed in dispensary</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrdersList.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              No orders recorded yet. Live orders will appear here in real-time.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto hidden sm:block">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-100">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 pl-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {recentOrdersList.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 pr-4 font-mono font-black text-slate-900 group-hover:text-brandOrange-600 transition-colors">
                          {ord.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          <span>{ord.customer}</span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-brandOrange-600">
                          ₹{Number(ord.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 pl-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                            ord.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : ord.status === 'Processing'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Recent Orders Cards */}
              <div className="sm:hidden flex flex-col gap-2.5 pt-3">
                {recentOrdersList.map((ord) => (
                  <div
                    key={ord.id + '-card'}
                    className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-slate-900">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          ord.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : ord.status === 'Processing'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1">{ord.customer}</p>
                    </div>
                    <span className="font-black text-sm text-brandOrange-600 font-display">
                      ₹{Number(ord.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Selling Remedies */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider font-display">
                Top Selling Remedies
              </h3>
              <p className="text-xs text-slate-400 font-medium">Most requested homeopathic products</p>
            </div>
            <Link to="/admin/products" className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topSellingProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No sales data recorded yet
              </div>
            ) : (
              topSellingProducts.map((p) => (
                <div key={p.id || p.rank} className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                  <div className="flex items-center gap-3 truncate">
                    <span className={`font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      p.rank === 1 ? 'bg-amber-100 text-amber-800' : p.rank === 2 ? 'bg-slate-200 text-slate-700' : 'text-slate-400'
                    }`}>
                      {p.rank}
                    </span>
                    <img 
                      src={p.image || assets.p1} 
                      alt={p.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.p1 || assets.product1;
                      }}
                      className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200/80 shrink-0 shadow-xs p-0.5 group-hover:scale-105 transition-transform" 
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-brandOrange-600 transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">{p.unitsSold} units sold</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 shrink-0 bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200/60 font-display">
                    {p.revenue}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
