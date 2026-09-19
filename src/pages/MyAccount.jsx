import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Settings, 
  LogOut, 
  Edit3, 
  Plus, 
  FileText, 
  Truck, 
  Eye, 
  Printer, 
  RotateCcw,
  X,
  Phone
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { OrderInvoiceModal } from '../components/admin/OrderInvoiceModal';
import { PrescriptionSlipModal } from '../components/account/PrescriptionSlipModal';
import { getUserOrders, orderService } from '../services/orderService';
import { getUserAppointments, appointmentService } from '../services/appointmentService';
import { getUserPrescriptions, prescriptionService } from '../services/prescriptionService';
import { cloudSyncService } from '../services/cloudSyncService';

export const MyAccount = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');

  // Modals & Active Selections
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionModalRx, setPrescriptionModalRx] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // User-Isolated Real-time state
  const [rawOrders, setRawOrders] = useState(() => getUserOrders(user));
  const [userAppointments, setUserAppointments] = useState(() => getUserAppointments(user));
  const [userPrescriptions, setUserPrescriptions] = useState(() => getUserPrescriptions(user));

  // Listen to live updates from MongoDB, local checkout/booking and Firebase Firestore cloud
  useEffect(() => {
    const refreshLiveUserData = () => {
      setRawOrders(getUserOrders(user));
      setUserAppointments(getUserAppointments(user));
      setUserPrescriptions(getUserPrescriptions(user));
    };

    refreshLiveUserData();

    const loadMongoData = async () => {
      try {
        const [orders, appts, rxs] = await Promise.all([
          orderService.getMyPatientOrders(user),
          appointmentService.getMyPatientAppointments(user),
          prescriptionService.getMyPatientPrescriptions(user)
        ]);
        if (orders && orders.length > 0) setRawOrders(orders);
        if (appts && appts.length > 0) setUserAppointments(appts);
        if (rxs && rxs.length > 0) setUserPrescriptions(rxs);
      } catch (err) {
        // Handled by local fallback
      }
    };
    loadMongoData();

    if (typeof window !== 'undefined') {
      window.addEventListener('orders_updated', refreshLiveUserData);
      window.addEventListener('appointments_updated', refreshLiveUserData);
      window.addEventListener('prescriptions_updated', refreshLiveUserData);
      window.addEventListener('storage', refreshLiveUserData);
    }

    const unsubscribeCloud = cloudSyncService.listenToCloudOrders(() => {
      refreshLiveUserData();
      loadMongoData();
    });

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('orders_updated', refreshLiveUserData);
        window.removeEventListener('appointments_updated', refreshLiveUserData);
        window.removeEventListener('prescriptions_updated', refreshLiveUserData);
        window.removeEventListener('storage', refreshLiveUserData);
      }
      if (typeof unsubscribeCloud === 'function') unsubscribeCloud();
    };
  }, [user]);

  const userKey = (user?.email || user?._id || 'guest').toLowerCase();

  // Saved Address
  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem(`bh_address_${userKey}`);
      if (saved) return JSON.parse(saved);
      const defaultSaved = localStorage.getItem('bh_address_guest');
      if (defaultSaved) return JSON.parse(defaultSaved);
    } catch {}
    return {
      fullName: user?.name || 'Yuvasri Arumugasamy',
      phone: user?.phone || '9345865212',
      addressLine1: '201-1 S.M Kovil street Vallam',
      addressLine2: '',
      city: 'Tenkasi',
      state: 'Tamil Nadu',
      pincode: '627811',
      country: localStorage.getItem('user_country') || 'India'
    };
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Settings preferences
  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true
  });

  // Map raw user orders into UI-friendly structure
  const allOrders = useMemo(() => {
    return rawOrders.map(raw => {
      const orderId = raw.orderId || raw.orderNumber || raw.id || 'ORD-000';
      const dateStr = raw.createdAt 
        ? new Date(raw.createdAt).toISOString().slice(0, 10) 
        : (raw.date || new Date().toISOString().slice(0, 10));
      
      let itemsSummary = 'Dr. Bharathi Classical Remedy';
      let itemsCount = 1;
      if (Array.isArray(raw.items) && raw.items.length > 0) {
        itemsSummary = raw.items.map(i => `${i.name}${i.quantity > 1 ? ` (x${i.quantity})` : ''}`).join(', ');
        itemsCount = raw.items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      } else if (typeof raw.items === 'string') {
        itemsSummary = raw.items;
        itemsCount = raw.itemsCount || 1;
      }

      const amount = Number(raw.total || raw.totalAmount || raw.amount || 0);
      const status = raw.orderStatus || raw.status || 'Pending';

      return {
        ...raw,
        id: orderId,
        orderId,
        date: dateStr,
        items: itemsSummary,
        itemsList: Array.isArray(raw.items) ? raw.items : null,
        itemsCount,
        amount,
        status
      };
    });
  }, [rawOrders]);

  const handleReorder = (order) => {
    if (Array.isArray(order.itemsList) && order.itemsList.length > 0) {
      order.itemsList.forEach(item => {
        addToCart({
          id: item.id || item.productId || `HOM-${Date.now()}`,
          name: item.name || item.title || 'Classical Homeopathic Remedy',
          price: item.price || 150,
          image: item.image || '/logo.png',
          category: item.category || 'Remedy'
        }, item.quantity || 1);
      });
    } else {
      addToCart({
        id: `REORDER-${order.id}`,
        name: typeof order.items === 'string' ? order.items : 'Dr. Bharathi Homeopathic Formulation',
        price: order.amount || 250,
        image: '/logo.png',
        category: 'Prescription Refill'
      }, 1);
    }
    showToast('Items added to cart', 'success');
    navigate('/cart');
  };

  const tabs = [
    { id: 'orders', label: 'Orders', mobileLabel: 'Orders', icon: ShoppingBag, count: allOrders.length },
    { id: 'appointments', label: 'Consultations', mobileLabel: 'Consults', icon: Calendar, count: userAppointments.length },
    { id: 'prescriptions', label: 'Prescriptions', mobileLabel: 'Rx Slips', icon: FileText, count: userPrescriptions.length },
    { id: 'address', label: 'Delivery Address', mobileLabel: 'Address', icon: MapPin },
    { id: 'settings', label: 'Settings', mobileLabel: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white print:min-h-0">
      <div className={`max-w-4xl mx-auto space-y-4 sm:space-y-6 ${invoiceModalOrder || prescriptionModalRx ? 'print:hidden' : ''}`}>

        {/* User Profile Card (Clean & Responsive) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500 text-white font-bold text-base sm:text-xl flex items-center justify-center shrink-0 shadow-sm">
              {user?.picture ? (
                <img src={user.picture} alt={user?.name} className="w-full h-full object-cover rounded-xl sm:rounded-2xl" />
              ) : (
                <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 truncate">
                {user?.name || 'Patient Account'}
              </h1>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'Registered Patient'}</p>
              {user?.phone && (
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">{user.phone}</p>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {user ? (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-3 sm:px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal && openAuthModal('login')}
                className="px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation - Mobile 5-grid (No scrollbars, 100% fit) */}
        <div className="grid grid-cols-5 gap-1 bg-slate-200/60 p-1 rounded-2xl sm:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`absolute -top-1.5 -right-2 px-1 min-w-[14px] text-center rounded-full text-[9px] font-bold leading-tight ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-300 text-slate-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-tight block truncate max-w-full">
                  {tab.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Navigation - Desktop Pill Bar */}
        <div className="hidden sm:flex items-center gap-1.5 border-b border-slate-200 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200 shadow-sm">

          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Orders ({allOrders.length})</h2>
                {allOrders.length > 0 && (
                  <Link to="/shop" className="text-xs font-semibold text-amber-600 hover:underline">
                    + Shop More
                  </Link>
                )}
              </div>

              {allOrders.length === 0 ? (
                <div className="text-center py-10 sm:py-12 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No orders yet</p>
                  <p className="text-xs text-slate-400">Your remedy orders and shipments will show up here.</p>
                  <div className="pt-2">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Browse Medicines</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {allOrders.map((order) => {
                    const isProcessing = order.status === 'Processing' || order.status === 'Pending';
                    return (
                      <div 
                        key={order.id} 
                        className="rounded-xl border border-slate-200 p-3.5 sm:p-4 space-y-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              #{order.id}
                            </span>
                            <span className="text-xs text-slate-400 hidden xs:inline">•</span>
                            <span className="text-xs text-slate-500">{order.date}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isProcessing ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="font-bold text-sm text-slate-900">
                            ₹{order.amount}
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 line-clamp-1 font-medium">
                          {order.items}
                        </p>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 sm:flex sm:flex-wrap">
                          <button
                            onClick={() => setSelectedOrderForTracking(order)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Track</span>
                          </button>
                          <button
                            onClick={() => setInvoiceModalOrder(order)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Invoice</span>
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">Re-order</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONSULTATIONS */}
          {activeTab === 'appointments' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Consultations ({userAppointments.length})</h2>
                <Link
                  to="/appointment"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book</span>
                </Link>
              </div>

              {userAppointments.length === 0 ? (
                <div className="text-center py-10 sm:py-12 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No consultations scheduled</p>
                  <p className="text-xs text-slate-400">Book an appointment with Dr. Bharathi for personalized treatment.</p>
                  <div className="pt-2">
                    <Link
                      to="/appointment"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAppointments.map((apt) => (
                    <div key={apt.id} className="p-3.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{apt.doctor || 'Dr. Bharathi (Homeopath)'}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {apt.status || 'Confirmed'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          📅 {apt.date} at {apt.time} • Mode: {apt.consultationMode || apt.type || 'In-Clinic'}
                        </p>
                        {apt.concern && (
                          <p className="text-xs text-slate-600 mt-0.5">Focus: {apt.concern}</p>
                        )}
                      </div>
                      <a
                        href="tel:+919025854711"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 self-start sm:self-center w-full sm:w-auto"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Reception</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Prescriptions ({userPrescriptions.length})</h2>
              </div>

              {userPrescriptions.length === 0 ? (
                <div className="text-center py-10 sm:py-12 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No prescriptions found</p>
                  <p className="text-xs text-slate-400">Doctor prescriptions and dosage instructions will appear here after consultation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-3.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          #{rx.prescriptionId || rx.id}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 mt-0.5">
                          {rx.diagnosis || 'Constitutional Care'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Date: {rx.date} • Issued by {rx.doctor || 'Dr. Bharathi'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPrescription(rx)}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Slip</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrescription(rx);
                            setTimeout(() => window.print(), 200);
                          }}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DELIVERY ADDRESS */}
          {activeTab === 'address' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Delivery Address</h2>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingAddress ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-sm text-slate-900">{address?.fullName}</p>
                  <p className="text-xs text-slate-600">Phone: {address?.phone}</p>
                  <div className="text-xs text-slate-600 space-y-0.5 pt-1 border-t border-slate-200">
                    <p>{address?.addressLine1}</p>
                    {address?.addressLine2 && <p>{address?.addressLine2}</p>}
                    <p>{address?.city}, {address?.state} - {address?.pincode}</p>
                    <p className="text-slate-400 font-semibold">{address?.country}</p>
                  </div>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    try {
                      localStorage.setItem(`bh_address_${userKey}`, JSON.stringify(address));
                    } catch {}
                    setIsEditingAddress(false);
                    showToast('Address saved', 'success');
                  }} 
                  className="space-y-3 max-w-md"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address?.fullName || ''}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full p-2.5 text-sm sm:text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={address?.phone || ''}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-2.5 text-sm sm:text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={address?.addressLine1 || ''}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full p-2.5 text-sm sm:text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={address?.city || ''}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full p-2.5 text-sm sm:text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={address?.pincode || ''}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full p-2.5 text-sm sm:text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Notifications</h2>
              </div>

              <div className="space-y-3 max-w-md">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800">SMS Order Updates</span>
                  <input 
                    type="checkbox" 
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800">WhatsApp Appointment Reminders</span>
                  <input 
                    type="checkbox" 
                    checked={notifications.whatsapp}
                    onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer" 
                  />
                </label>

                <div className="pt-2">
                  <button
                    onClick={() => showToast('Preferences saved', 'success')}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Track #{selectedOrderForTracking.id}</h3>
                <p className="text-xs text-slate-400">{selectedOrderForTracking.courierPartner || 'ST Courier'}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700">Order Confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700">Remedy Prepared</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedOrderForTracking.status?.toLowerCase() === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-slate-700">Out for Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedOrderForTracking.status?.toLowerCase() === 'delivered' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <span className="text-slate-700">Delivered</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Prescription Slip Modal */}
      <PrescriptionSlipModal
        prescription={selectedPrescription}
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />

      {/* Medical Bill Modal */}
      <OrderInvoiceModal
        order={invoiceModalOrder}
        isOpen={!!invoiceModalOrder}
        onClose={() => setInvoiceModalOrder(null)}
      />

      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">Sign Out Confirmation</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to sign out of your account?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                No, Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  showToast('Signed out successfully', 'info');
                  navigate('/');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default MyAccount;
