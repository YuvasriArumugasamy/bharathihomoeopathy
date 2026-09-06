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
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAccountData } from '../data/accountData';
import { useToast } from '../context/ToastContext';

export const MyAccount = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');

  const [address, setAddress] = useState(() => mockAccountData?.savedAddress || {
    fullName: 'Patient Customer',
    phone: '+91 98765 43210',
    addressLine1: '123 Healthcare Avenue',
    addressLine2: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    country: 'India'
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full overflow-x-hidden">
      
      {/* Customer Profile Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-brandOrange-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">{user?.name || 'Patient User'}</h1>
            <p className="text-xs text-slate-300">{user?.email || 'patient@example.com'}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/10 rounded-full text-[10px] font-semibold text-brandOrange-400">
              Registered Patient
            </span>
          </div>
        </div>

        {user ? (
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-400 text-xs font-semibold border border-white/10 transition-smooth cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal && openAuthModal('login')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brandOrange-500 hover:bg-brandOrange-600 text-white text-xs font-bold transition-smooth cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Log In / Sign Up</span>
          </button>
        )}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-1">
          {[
            { id: 'orders', label: 'Order History', icon: ShoppingBag },
            { id: 'appointments', label: 'My Consultations', icon: Calendar },
            { id: 'address', label: 'Delivery Address', icon: MapPin },
            { id: 'settings', label: 'Account Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-smooth cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brandOrange-50 text-brandOrange-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brandOrange-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === tab.id ? 'text-brandOrange-500' : 'text-slate-300'}`} />
            </button>
          ))}
        </aside>

        {/* Content Details Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Recent Orders & Prescription Deliveries
              </h3>

              <div className="space-y-4">
                {(mockAccountData?.recentOrders || []).map((order) => (
                  <div key={order.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-navy-900">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{order.items}</p>
                      <span className="text-[11px] text-slate-400">Placed on {order.date}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span className="font-extrabold text-sm text-brandOrange-600">₹{order.amount}</span>
                      <button
                        onClick={() => showToast(`Tracking link for ${order.id} sent to SMS`, 'info')}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-brandOrange-400 text-slate-700 text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Upcoming & Past Consultations
              </h3>

              {mockAccountData?.upcomingAppointment && (
                <div className="p-6 rounded-2xl bg-brandOrange-50/50 border border-brandOrange-200/60 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brandOrange-600" />
                      <span className="font-extrabold text-sm text-navy-900">{mockAccountData.upcomingAppointment.doctor}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-brandOrange-100 text-brandOrange-800 font-bold text-[10px] rounded-full">
                      {mockAccountData.upcomingAppointment.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div>Date: <strong>{mockAccountData.upcomingAppointment.date}</strong></div>
                    <div>Time: <strong>{mockAccountData.upcomingAppointment.time}</strong></div>
                    <div>Mode: <strong>{mockAccountData.upcomingAppointment.type}</strong></div>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">{mockAccountData.upcomingAppointment.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESS */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Default Delivery Address</h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-bold text-brandOrange-600 hover:underline cursor-pointer"
                >
                  {isEditingAddress ? 'Done Editing' : 'Edit Address'}
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1 text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-navy-900">{address?.fullName}</p>
                  <p>{address?.phone}</p>
                  <p>{address?.addressLine1}</p>
                  {address?.addressLine2 && <p>{address?.addressLine2}</p>}
                  <p>{address?.city}, {address?.state} - {address?.pincode}</p>
                  <p className="font-medium text-slate-400 pt-1">{address?.country}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={address?.fullName || ''}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                  <input
                    type="text"
                    value={address?.phone || ''}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                  <input
                    type="text"
                    value={address?.addressLine1 || ''}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setIsEditingAddress(false);
                      showToast('Address updated successfully', 'success');
                    }}
                    className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Notification & Communication Preferences
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span>SMS updates on prescription dispatch & tracking</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-brandOrange-500 rounded" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span>WhatsApp reminder 1 hour prior to doctor consultation</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-brandOrange-500 rounded" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                  <span>Monthly clinic health journal & wellness tips newsletter</span>
                  <input type="checkbox" className="w-4 h-4 text-brandOrange-500 rounded" />
                </label>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
