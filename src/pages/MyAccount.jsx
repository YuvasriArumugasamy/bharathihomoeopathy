import React, { useState } from 'react';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  Heart, 
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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAccountData } from '../data/accountData';
import { useToast } from '../context/ToastContext';

export const MyAccount = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');

  const [address, setAddress] = useState(() => mockAccountData?.savedAddress || {
    fullName: user?.name || 'Patient Customer',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: '123 Healthcare Avenue, 2nd Cross',
    addressLine2: 'Near Botanical Garden',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    country: 'India'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Edit Profile States
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Bharathi Customer',
    email: user?.email || 'patient@example.com',
    phone: user?.phone || '+91 98765 43210',
    bloodGroup: 'O+',
    allergies: 'None',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const navTabs = [
    { id: 'orders', label: 'Order History & Track', icon: ShoppingBag, count: 3 },
    { id: 'appointments', label: 'My Consultations & Rx', icon: Calendar, count: 1 },
    { id: 'address', label: 'Delivery Addresses', icon: MapPin },
    { id: 'medical', label: 'Prescription Wallet', icon: FileText },
    { id: 'settings', label: 'Account & Security', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full overflow-x-hidden">
      
      {/* 1. World-Class Patient Banner with Dark Medical Teal Gradient & Glass Badges */}
      <div className="relative bg-gradient-to-r from-[#0b344d] via-[#18587c] to-[#0b344d] rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden border border-white/10">
        
        {/* Decorative Background Circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-brandOrange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Patient Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl ring-4 ring-white/20 shrink-0 overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'P'}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px]" title="Active Patient">
                ✓
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{user?.name || profileData.name}</h1>
                <span className="px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-[10px] font-black text-amber-300 uppercase tracking-wider backdrop-blur-md">
                  VERIFIED PATIENT
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-200 font-semibold">{user?.email || profileData.email}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ID: <strong className="font-mono text-white">#BH-PATIENT-88902</strong>
                </span>
                <span>•</span>
                <span className="font-medium text-amber-300">Constitutional Homeopathy Patient</span>
              </div>
            </div>
          </div>

          {/* Stat Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center sm:text-left space-y-0.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Total Orders</span>
              <span className="text-lg font-black text-white">3 Orders</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center sm:text-left space-y-0.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Consultation</span>
              <span className="text-lg font-black text-amber-300">1 Upcoming</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center sm:text-left space-y-0.5 shadow-sm flex items-center justify-between sm:block">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Quick Actions</span>
              {user ? (
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal && openAuthModal('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brandOrange-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-md space-y-1.5 sticky top-24">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3.5 py-2">PATIENT PORTAL MENU</p>
          
          {navTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-black scale-[1.02]'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-navy-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {tab.count && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Details Container */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: ORDER HISTORY & DELIVERIES */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-navy-950">Recent Orders & Prescription Deliveries</h2>
                  <p className="text-xs text-slate-500 font-medium">Track your constitutional remedies and order dispatches</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
                  3 Total Orders
                </span>
              </div>

              <div className="space-y-5">
                {(mockAccountData?.recentOrders || []).map((order) => (
                  <div 
                    key={order.id} 
                    className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 hover:border-brandOrange-300/80 transition-all shadow-2xs"
                  >
                    {/* Order Card Top Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-navy-950">{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Placed on {order.date}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-black text-lg text-brandOrange-600">₹{order.amount}</span>
                        <button
                          onClick={() => showToast(`Tracking details for ${order.id} sent via SMS`, 'info')}
                          className="px-4 py-2 bg-white border border-slate-200 hover:border-brandOrange-400 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5 text-brandOrange-500" />
                          <span>Track Order</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Item Description */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-brandOrange-500 shrink-0" />
                        <span>{order.items}</span>
                      </div>
                      <span className="text-slate-400 font-medium">{order.itemsCount} items</span>
                    </div>

                    {/* Order Delivery Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Order Placed</span>
                        <span>Prescription Packed</span>
                        <span className={order.status === 'Delivered' ? 'text-emerald-600 font-black' : 'text-amber-600'}>
                          {order.status === 'Delivered' ? 'Delivered' : 'In Transit'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            order.status === 'Delivered' ? 'bg-emerald-500 w-full' : 'bg-gradient-to-r from-brandOrange-500 to-amber-500 w-3/4'
                          }`}
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: MY CONSULTATIONS & RX */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-navy-950">Upcoming & Past Doctor Consultations</h2>
                  <p className="text-xs text-slate-500 font-medium">Your appointments with Dr. Bharathi</p>
                </div>
                <button
                  onClick={() => showToast('Redirecting to appointment booking page...', 'info')}
                  className="btn-gradient-orange text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book New Consultation</span>
                </button>
              </div>

              {/* Consultation Card */}
              {mockAccountData?.upcomingAppointment && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-brandOrange-50/70 via-amber-50/40 to-white border border-brandOrange-200/80 space-y-4 shadow-sm">
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff4e50] to-[#f97316] text-white flex items-center justify-center shadow-md font-black text-lg">
                        👨‍⚕️
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-navy-950">{mockAccountData.upcomingAppointment.doctor}</h3>
                        <span className="text-xs font-bold text-brandOrange-600">Chief Homeopath & Founder</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-[11px] rounded-full uppercase tracking-wider border border-amber-300/60">
                      {mockAccountData.upcomingAppointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-amber-200/60 text-xs text-slate-700 font-semibold">
                    <div>📅 Date: <strong className="text-navy-950">{mockAccountData.upcomingAppointment.date}</strong></div>
                    <div>⏰ Time: <strong className="text-navy-950">{mockAccountData.upcomingAppointment.time}</strong></div>
                    <div>🏥 Mode: <strong className="text-navy-950">{mockAccountData.upcomingAppointment.type}</strong></div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Note: {mockAccountData.upcomingAppointment.notes}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => showToast('Prescription PDF download initiated', 'success')}
                      className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-300" />
                      <span>Download Digital Prescription</span>
                    </button>
                    
                    <button
                      onClick={() => showToast('Clinic Reception: +91 98765 43210', 'info')}
                      className="px-4 py-2 bg-white border border-slate-200 hover:border-brandOrange-400 text-slate-700 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-brandOrange-500" />
                      <span>Call Clinic Support</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: DELIVERY ADDRESSES */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-navy-950">Default Delivery Address</h2>
                  <p className="text-xs text-slate-500 font-medium">Your primary address for medicine dispatches</p>
                </div>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="px-4 py-2 rounded-xl bg-brandOrange-50 hover:bg-brandOrange-100 text-brandOrange-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingAddress ? 'Done Editing' : 'Edit Address'}</span>
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700 leading-relaxed relative">
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] rounded-full uppercase tracking-wider">
                    PRIMARY ADDRESS
                  </span>
                  <p className="font-extrabold text-sm text-navy-950">{address?.fullName}</p>
                  <p className="font-semibold text-slate-600">📞 Phone: {address?.phone}</p>
                  <p className="font-medium text-slate-600">{address?.addressLine1}</p>
                  {address?.addressLine2 && <p className="font-medium text-slate-600">{address?.addressLine2}</p>}
                  <p className="font-medium text-slate-600">{address?.city}, {address?.state} - {address?.pincode}</p>
                  <p className="font-bold text-slate-400 pt-1 uppercase tracking-wider text-[10px]">{address?.country}</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address?.fullName || ''}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={address?.phone || ''}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address?.addressLine1 || ''}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setIsEditingAddress(false);
                      showToast('Delivery address updated successfully', 'success');
                    }}
                    className="px-6 py-3 bg-navy-950 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Save Address Changes
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: PRESCRIPTION WALLET & MEDICAL PROFILE */}
          {activeTab === 'medical' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-navy-950">Patient Medical Profile & Prescription Wallet</h2>
                <p className="text-xs text-slate-500 font-medium">Your health details and prescribed constitutional remedies</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">HEALTH METRICS</span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-bold">
                    <div>Blood Group: <span className="text-emerald-700">{profileData.bloodGroup}</span></div>
                    <div>Allergies: <span className="text-emerald-700">{profileData.allergies}</span></div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-2">
                  <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">ACTIVE REMEDIES</span>
                  <p className="text-xs text-slate-700 font-bold">Arnica Montana 30C + Five Phos 6X</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-navy-950">Prescription Record #RX-2026-08</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Issued by Dr. Bharathi on 20 Aug 2026</p>
                </div>

                <button
                  onClick={() => showToast('Downloading digital prescription file...', 'info')}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:border-brandOrange-400 text-slate-700 text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-brandOrange-500" />
                  <span>Download PDF</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 5: ACCOUNT & SECURITY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-navy-950">Account & Security Preferences</h2>
                <p className="text-xs text-slate-500 font-medium">Manage notifications and patient communication channels</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-navy-950 block">SMS Updates</span>
                    <span className="text-[11px] text-slate-500">Receive dispatch & tracking notifications on mobile</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-brandOrange-500 accent-brandOrange-500 rounded cursor-pointer" />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-navy-950 block">WhatsApp Doctor Reminders</span>
                    <span className="text-[11px] text-slate-500">Receive consultation reminders 1 hour prior to appointment</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-brandOrange-500 accent-brandOrange-500 rounded cursor-pointer" />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-navy-950 block">Monthly Clinic Journal</span>
                    <span className="text-[11px] text-slate-500">Subscribe to Dr. Bharathi's seasonal health tips</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-brandOrange-500 accent-brandOrange-500 rounded cursor-pointer" />
                </label>
              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
};
