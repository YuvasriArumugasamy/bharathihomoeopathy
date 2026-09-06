import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Settings, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Package, 
  ShieldCheck,
  ChevronRight,
  Plus,
  FileText,
  Truck,
  Download,
  PhoneCall,
  Activity,
  Award,
  Sparkles,
  Edit3,
  ExternalLink,
  X,
  Search,
  Filter,
  Check,
  Stethoscope,
  Eye,
  AlertCircle,
  QrCode,
  Share2,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAccountData } from '../data/accountData';
import { useToast } from '../context/ToastContext';

export const MyAccount = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');

  // Modals & Active Selections
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'Processing' | 'Delivered'

  // Editable Profile & Address States
  const [address, setAddress] = useState(() => mockAccountData?.savedAddress || {
    fullName: user?.name || 'Bharathi Patient',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: '123 Healthcare Avenue, 2nd Cross',
    addressLine2: 'Near City Botanical Garden',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    country: 'India'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Demo Customer',
    email: user?.email || 'patient.google@example.com',
    phone: user?.phone || '+91 98765 43210',
    bloodGroup: 'O+',
    allergies: 'None Reported',
    constitutionalType: 'Calcarea Carb (Constitutional)',
    joinedDate: 'June 2026'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Settings preferences state
  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true,
    newsletter: false,
    refillReminders: true
  });

  const navTabs = [
    { id: 'orders', label: 'Order History & Shipments', icon: ShoppingBag, count: 3 },
    { id: 'appointments', label: 'Doctor Consultations', icon: Stethoscope, count: 1 },
    { id: 'address', label: 'Delivery Address Book', icon: MapPin },
    { id: 'medical', label: 'Prescription Vault', icon: FileText, count: 2 },
    { id: 'settings', label: 'Account & Privacy', icon: Settings },
  ];

  // Filtering recent orders
  const allOrders = mockAccountData?.recentOrders || [];
  const filteredOrders = allOrders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status.toLowerCase() === orderFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full overflow-x-hidden">
        
        {/* ========================================================================= */}
        {/* 1. HERO BANNER - LUXURY DARK MEDICAL TEAL GRADIENT WITH GLASS BADGES */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#072538] via-[#0d4567] to-[#061826] text-white shadow-2xl border border-white/15 p-6 sm:p-10">
          
          {/* Ambient Lighting & Glow FX */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brandOrange-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Patient Avatar & Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 w-full lg:w-auto">
              
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black text-4xl sm:text-5xl flex items-center justify-center shadow-2xl ring-4 ring-white/20 shrink-0 overflow-hidden transform group-hover:scale-105 transition-all duration-300">
                  {user?.picture ? (
                    <img src={user.picture} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'D'}</span>
                  )}
                </div>
                {/* Active Live Pulse Badge */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 ring-4 ring-[#072538] flex items-center justify-center" title="Verified Active Patient">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
                    {user?.name || profileData.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-300/40 rounded-full text-[11px] font-black text-amber-300 uppercase tracking-widest backdrop-blur-md shadow-inner">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    REGISTERED PATIENT
                  </span>
                </div>
                
                <p className="text-sm text-cyan-100 font-medium">{user?.email || profileData.email}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-200">
                  <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/15 font-mono text-cyan-200 backdrop-blur-sm">
                    ID: <strong className="text-white font-bold">#BH-PATIENT-88902</strong>
                  </span>
                  <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/15 text-amber-300 font-semibold backdrop-blur-sm">
                    Constitutional Homeopathy
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Interactive Stat Cards & Account Action */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
              
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 text-center sm:text-left space-y-1 hover:border-amber-400/40 hover:bg-white/15 transition-all shadow-lg group">
                <div className="flex items-center justify-between text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-brandOrange-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-xl font-black text-white">3 Orders</div>
                <span className="text-[10px] font-bold text-amber-300 block">1 Processing</span>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 text-center sm:text-left space-y-1 hover:border-amber-400/40 hover:bg-white/15 transition-all shadow-lg group">
                <div className="flex items-center justify-between text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  <span>Consultations</span>
                  <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-xl font-black text-amber-300">1 Upcoming</div>
                <span className="text-[10px] font-bold text-emerald-300 block">Dr. Bharathi</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/15 flex flex-col justify-between hover:border-rose-400/40 hover:bg-white/15 transition-all shadow-lg">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Account Session</span>
                {user ? (
                  <button
                    onClick={logout}
                    className="w-full mt-2 py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal && openAuthModal('login')}
                    className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:scale-105"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 2. MAIN DASHBOARD CONTENT GRID (SIDEBAR + CONTENT PANELS) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xl space-y-2 sticky top-24">
            <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 mb-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">PATIENT PORTAL MENU</span>
              <Sparkles className="w-3.5 h-3.5 text-brandOrange-500" />
            </div>
            
            <div className="space-y-1.5">
              {navTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-brandOrange-500 via-amber-500 to-brandOrange-600 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-navy-950 hover:pl-5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span>{tab.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {tab.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white text-brandOrange-600 shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-300'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Helpline Footer Box in Sidebar */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <div className="bg-gradient-to-br from-amber-50 to-brandOrange-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-brandOrange-700 font-extrabold text-xs">
                  <PhoneCall className="w-4 h-4 text-brandOrange-500 animate-bounce" />
                  <span>24/7 Homeo Helpline</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">Need prescription advice or dispatch assistance?</p>
                <a 
                  href="tel:+919876543210" 
                  className="inline-block text-xs font-black text-navy-950 hover:text-brandOrange-600 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>

          </aside>

          {/* RIGHT CONTENT PANEL */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: RECENT ORDERS & MEDICINE SHIPMENTS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                
                {/* Header Strip & Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-brandOrange-500" />
                      Recent Orders & Medicine Shipments
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Track your constitutional remedies and order dispatches</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600 w-full sm:w-auto">
                    <button
                      onClick={() => setOrderFilter('all')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        orderFilter === 'all' ? 'bg-white text-navy-950 shadow-xs font-black' : 'hover:text-navy-950'
                      }`}
                    >
                      All ({allOrders.length})
                    </button>
                    <button
                      onClick={() => setOrderFilter('Processing')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        orderFilter === 'Processing' ? 'bg-amber-400 text-amber-950 shadow-xs font-black' : 'hover:text-navy-950'
                      }`}
                    >
                      Processing (1)
                    </button>
                    <button
                      onClick={() => setOrderFilter('Delivered')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        orderFilter === 'Delivered' ? 'bg-emerald-500 text-white shadow-xs font-black' : 'hover:text-navy-950'
                      }`}
                    >
                      Delivered (2)
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const isProcessing = order.status === 'Processing';
                    return (
                      <div 
                        key={order.id} 
                        className="rounded-3xl bg-slate-50/80 border border-slate-200/90 p-6 space-y-5 hover:border-brandOrange-400/80 hover:shadow-lg transition-all duration-200"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-base text-navy-950 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                                #{order.id}
                              </span>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                isProcessing 
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300/80 animate-pulse' 
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300/80'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium pl-0.5">Placed on {order.date}</p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Paid</span>
                              <span className="font-black text-xl text-brandOrange-600">₹{order.amount}</span>
                            </div>
                            
                            <button
                              onClick={() => setSelectedOrderForTracking(order)}
                              className="px-4 py-2.5 bg-gradient-to-r from-navy-950 to-navy-900 hover:from-brandOrange-500 hover:to-amber-500 text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2 group"
                            >
                              <Truck className="w-4 h-4 text-amber-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                              <span>Track Live Order</span>
                            </button>
                          </div>
                        </div>

                        {/* Prescribed Items Banner */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-slate-800 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-brandOrange-500" />
                            </div>
                            <div>
                              <h4 className="text-navy-950 font-extrabold text-sm">{order.items}</h4>
                              <p className="text-[11px] text-slate-400 font-medium">{order.itemsCount} Constitutional Remedies Enclosed</p>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedPrescription(order)}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-brandOrange-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Medicines</span>
                          </button>
                        </div>

                        {/* Interactive Step Progress Stepper */}
                        <div className="pt-2 space-y-2">
                          <div className="flex justify-between text-[11px] font-black text-slate-500">
                            <span className="text-emerald-700">1. Order Placed ✓</span>
                            <span className="text-emerald-700">2. Remedy Formulated ✓</span>
                            <span className={isProcessing ? 'text-amber-600 font-black animate-pulse' : 'text-emerald-700'}>
                              {isProcessing ? '3. Out for Dispatch 🚚' : '3. Dispatched ✓'}
                            </span>
                            <span className={isProcessing ? 'text-slate-400' : 'text-emerald-700 font-black'}>
                              {isProcessing ? '4. Delivery Expected' : '4. Delivered 🏡'}
                            </span>
                          </div>

                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isProcessing 
                                  ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 w-3/4 animate-pulse' 
                                  : 'bg-emerald-500 w-full'
                              }`}
                            />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: MY CONSULTATIONS & DOCTOR NOTES */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-brandOrange-500" />
                      Doctor Consultations & Rx Notes
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Your appointments & medical records with Dr. Bharathi</p>
                  </div>

                  <button
                    onClick={() => showToast('Navigating to consultation booking system...', 'info')}
                    className="px-5 py-2.5 bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book New Consultation</span>
                  </button>
                </div>

                {/* Main Upcoming Appointment Spotlight Card */}
                {mockAccountData?.upcomingAppointment && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0b344d] via-[#124d70] to-[#0b344d] text-white space-y-6 shadow-2xl border border-white/10 relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/15 pb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white flex items-center justify-center font-black text-2xl shadow-xl ring-2 ring-white/20">
                          👩‍⚕️
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">CHIEF HOMEOPATH CONSULTATION</span>
                          <h3 className="font-black text-xl text-white">{mockAccountData.upcomingAppointment.doctor}</h3>
                          <p className="text-xs text-slate-300 font-medium">B.H.M.S, M.D. (Homeopathy) • 15+ Yrs Exp</p>
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 bg-amber-400/20 border border-amber-300/40 rounded-full text-xs font-black text-amber-300 uppercase tracking-wider backdrop-blur-md">
                        {mockAccountData.upcomingAppointment.status}
                      </span>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">📅 Date</span>
                        <p className="font-extrabold text-base text-white">{mockAccountData.upcomingAppointment.date}</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">⏰ Scheduled Time</span>
                        <p className="font-extrabold text-base text-amber-300">{mockAccountData.upcomingAppointment.time}</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">🏥 Consultation Mode</span>
                        <p className="font-extrabold text-base text-white">{mockAccountData.upcomingAppointment.type}</p>
                      </div>
                    </div>

                    <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 font-medium leading-relaxed">
                      <strong className="text-amber-300">Consultation Focus:</strong> {mockAccountData.upcomingAppointment.notes}
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => showToast('Digital Prescription PDF download started', 'success')}
                        className="px-5 py-2.5 bg-white hover:bg-slate-100 text-navy-950 text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-brandOrange-500" />
                        <span>Download Prescription PDF</span>
                      </button>
                      
                      <button
                        onClick={() => showToast('Clinic Helpline: +91 98765 43210', 'info')}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4 text-amber-300" />
                        <span>Contact Clinic Reception</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: DELIVERY ADDRESS BOOK */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'address' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                
                <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brandOrange-500" />
                      Delivery Address Book
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Manage default shipping destination for medicine dispatches</p>
                  </div>

                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="px-4 py-2.5 rounded-2xl bg-brandOrange-50 hover:bg-brandOrange-100 text-brandOrange-700 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 border border-brandOrange-200/60"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditingAddress ? 'Cancel Edit' : 'Edit Address'}</span>
                  </button>
                </div>

                {!isEditingAddress ? (
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4 relative">
                    <span className="absolute top-6 right-6 px-3.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[11px] rounded-full uppercase tracking-wider border border-emerald-300">
                      PRIMARY SHIPPING ADDRESS
                    </span>

                    <div className="space-y-1">
                      <h3 className="font-black text-lg text-navy-950">{address?.fullName}</h3>
                      <p className="text-xs font-bold text-slate-600">📞 Phone: {address?.phone}</p>
                    </div>

                    <div className="text-xs text-slate-700 font-medium leading-relaxed pt-2 border-t border-slate-200/60 space-y-1">
                      <p>{address?.addressLine1}</p>
                      {address?.addressLine2 && <p>{address?.addressLine2}</p>}
                      <p className="font-bold text-navy-950">{address?.city}, {address?.state} - {address?.pincode}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">{address?.country}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setIsEditingAddress(false);
                    showToast('Delivery address updated successfully', 'success');
                  }} className="space-y-4 max-w-xl bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Recipient Name</label>
                      <input
                        type="text"
                        value={address?.fullName || ''}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-brandOrange-500 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number for Courier Contact</label>
                      <input
                        type="text"
                        value={address?.phone || ''}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-brandOrange-500 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Door / Street Address</label>
                      <input
                        type="text"
                        value={address?.addressLine1 || ''}
                        onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-brandOrange-500 font-semibold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          value={address?.city || ''}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-brandOrange-500 font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={address?.pincode || ''}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-brandOrange-500 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Save Address Details
                    </button>
                  </form>
                )}

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: PRESCRIPTION VAULT & MEDICAL PROFILE */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'medical' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                
                <div className="pb-5 border-b border-slate-100">
                  <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brandOrange-500" />
                    Prescription Vault & Medical Profile
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Your health profile and Dr. Bharathi's digital prescription wallet</p>
                </div>

                {/* Health Metrics Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">BLOOD GROUP</span>
                    <p className="text-xl font-black text-emerald-950">{profileData.bloodGroup}</p>
                    <span className="text-[10px] text-emerald-700 font-medium block">Verified Medical File</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">KNOWN ALLERGIES</span>
                    <p className="text-base font-black text-amber-950">{profileData.allergies}</p>
                    <span className="text-[10px] text-amber-700 font-medium block">Safe for Homeo Dilutions</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 space-y-1">
                    <span className="text-[10px] font-black text-cyan-800 uppercase tracking-wider block">CONSTITUTIONAL TYPE</span>
                    <p className="text-xs font-black text-cyan-950">{profileData.constitutionalType}</p>
                    <span className="text-[10px] text-cyan-700 font-medium block">Assessed by Dr. Bharathi</span>
                  </div>
                </div>

                {/* Prescriptions Wallet List */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider">Active Digital Prescriptions</h3>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-navy-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                          #RX-2026-08
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                          ACTIVE REMEDY
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">Arnica Montana 30C + Five Phos 6X</p>
                      <p className="text-[11px] text-slate-400 font-medium">Issued by Dr. Bharathi on 20 Aug 2026</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPrescription({ items: 'Arnica Montana 30C + Five Phos 6X', id: 'DEMO-1001', date: '2026-08-20' })}
                        className="px-4 py-2 bg-white border border-slate-200 hover:border-brandOrange-400 text-navy-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-brandOrange-500" />
                        <span>View Slip</span>
                      </button>
                      <button
                        onClick={() => showToast('Prescription PDF download initiated', 'success')}
                        className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 5: ACCOUNT & PRIVACY SETTINGS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                
                <div className="pb-5 border-b border-slate-100">
                  <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brandOrange-500" />
                    Account & Security Preferences
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Manage notifications and patient communication channels</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors border border-slate-200/60">
                    <div className="space-y-0.5">
                      <span className="font-black text-sm text-navy-950 block">SMS Dispatch Alerts</span>
                      <span className="text-xs text-slate-500">Receive tracking updates & courier numbers on mobile</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                      className="w-5 h-5 text-brandOrange-500 accent-brandOrange-500 rounded cursor-pointer" 
                    />
                  </label>

                  <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors border border-slate-200/60">
                    <div className="space-y-0.5">
                      <span className="font-black text-sm text-navy-950 block">WhatsApp Doctor Reminders</span>
                      <span className="text-xs text-slate-500">Receive consultation reminders 1 hour prior to appointment</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.whatsapp}
                      onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                      className="w-5 h-5 text-brandOrange-500 accent-brandOrange-500 rounded cursor-pointer" 
                    />
                  </label>

                  <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors border border-slate-200/60">
                    <div className="space-y-0.5">
                      <span className="font-black text-sm text-navy-950 block">Prescription Dose Refill Alerts</span>
                      <span className="text-xs text-slate-500">Notify when 30-day remedy supply is running low</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.refillReminders}
                      onChange={(e) => setNotifications({ ...notifications, refillReminders: e.target.checked })}
                      className="w-5 h-5 text-brandOrange-500 accent-brandOrange-500 rounded cursor-pointer" 
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => showToast('Preferences updated successfully', 'success')}
                    className="px-6 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white text-xs font-black rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE MODAL 1: LIVE ORDER TRACKING MODAL */}
      {/* ========================================================================= */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            
            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-brandOrange-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-navy-950">Order Tracking #{selectedOrderForTracking.id}</h3>
                <p className="text-xs text-slate-500 font-medium">BlueDart Express Waybill: <strong className="font-mono text-navy-950">BD-998234-IN</strong></p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-6 pl-2 relative before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              
              <div className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black z-10 shrink-0 ring-4 ring-white shadow-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-xs text-navy-950">Order Received & Payment Verified</h4>
                  <p className="text-[11px] text-slate-400">August 20, 2026 • 10:30 AM</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black z-10 shrink-0 ring-4 ring-white shadow-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-xs text-navy-950">Formulated by Dr. Bharathi Clinic</h4>
                  <p className="text-[11px] text-slate-400">August 21, 2026 • 02:15 PM</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black z-10 shrink-0 ring-4 ring-white shadow-md animate-pulse">
                  🚚
                </div>
                <div>
                  <h4 className="font-bold text-xs text-amber-700">In Transit - Shipped via Courier</h4>
                  <p className="text-[11px] text-slate-400">Hub: Chennai Main Sorting Facility</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4 opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black z-10 shrink-0 ring-4 ring-white">
                  🏡
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-700">Estimated Home Delivery</h4>
                  <p className="text-[11px] text-slate-400">Expected by August 24, 2026</p>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="w-full py-3 bg-navy-950 hover:bg-navy-900 text-white text-xs font-black rounded-2xl shadow-md transition-colors cursor-pointer"
              >
                Close Tracking
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE MODAL 2: DIGITAL PRESCRIPTION SLIP VIEWER */}
      {/* ========================================================================= */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Prescription Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <h3 className="font-black text-xl text-navy-950">Dr. Bharathi's Homeo Care</h3>
                <p className="text-xs text-brandOrange-600 font-extrabold">Constitutional Homeopathy & Healing Center</p>
                <p className="text-[11px] text-slate-500 font-medium">Reg No: HOMEO-TN-44982 • Chennai, TN</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-xs text-navy-950 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {selectedPrescription.id}
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Date: {selectedPrescription.date}</p>
              </div>
            </div>

            {/* Prescribed Remedies */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl text-navy-950 italic">Rx</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">OFFICIAL CLINIC FORMULATION</span>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs font-bold text-slate-800">
                <div className="flex justify-between items-center pb-2 border-b border-amber-200/60">
                  <span>1. Arnica Montana 30C (Global Liquid Drops)</span>
                  <span className="text-brandOrange-600">2 drops twice daily</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>2. Five Phos 6X (Biochemic Remedy)</span>
                  <span className="text-brandOrange-600">4 tablets before meals</span>
                </div>
              </div>
            </div>

            {/* Doctor Seal & Signature */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
                <QrCode className="w-8 h-8 text-slate-800" />
                <span>Verified Digital Slip</span>
              </div>

              <div className="text-right">
                <p className="font-serif italic font-bold text-navy-950 text-sm">Dr. Bharathi B.H.M.S</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chief Homeopath Seal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => {
                  showToast('Prescription PDF saved to downloads', 'success');
                  setSelectedPrescription(null);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

