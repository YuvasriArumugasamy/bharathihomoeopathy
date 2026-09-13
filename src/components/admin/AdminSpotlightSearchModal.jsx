import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Calendar, 
  ShoppingBag, 
  User, 
  Package, 
  ArrowRight, 
  ChevronRight,
  Clock,
  Sparkles,
  Command
} from 'lucide-react';
import { getStoredOrders } from '../../services/orderService';
import { getStoredAppointments } from '../../services/appointmentService';
import { getStoredCustomers } from '../../services/customerService';
import { initialAdminInventory } from '../../data/adminInventoryData';

export const AdminSpotlightSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Toggle or trigger
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // 1. Search Appointments
  const appointments = getStoredAppointments();
  const matchedAppointments = q ? appointments.filter(a => 
    (a.patient?.name || '').toLowerCase().includes(q) ||
    (a.patient?.phone || '').includes(q) ||
    (a.appointmentId || '').toLowerCase().includes(q) ||
    (a.concern || '').toLowerCase().includes(q)
  ).slice(0, 3) : [];

  // 2. Search Orders
  const orders = getStoredOrders();
  const matchedOrders = q ? orders.filter(o => 
    (o.orderId || o.id || '').toLowerCase().includes(q) ||
    (o.customer?.name || o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
    (o.customer?.phone || o.shippingAddress?.phone || '').includes(q)
  ).slice(0, 3) : [];

  // 3. Search Patients
  const customers = getStoredCustomers();
  const matchedCustomers = q ? customers.filter(c => 
    (c.name || '').toLowerCase().includes(q) ||
    (c.phone || '').includes(q) ||
    (c.email || '').toLowerCase().includes(q)
  ).slice(0, 3) : [];

  // 4. Search Medicines / Inventory
  let inventoryItems = initialAdminInventory;
  try {
    const raw = localStorage.getItem('admin_inventory_store');
    if (raw) inventoryItems = JSON.parse(raw);
  } catch {}

  const matchedInventory = q ? inventoryItems.filter(i => 
    (i.productName || '').toLowerCase().includes(q) ||
    (i.sku || '').toLowerCase().includes(q)
  ).slice(0, 3) : [];

  // Quick navigation shortcuts
  const navigationShortcuts = [
    { label: 'Consultation Appointments', path: '/admin/appointments', icon: Calendar, color: 'text-amber-600 bg-amber-50' },
    { label: 'Orders & Dispatches', path: '/admin/orders', icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Patient Directory', path: '/admin/customers', icon: User, color: 'text-blue-600 bg-blue-50' },
    { label: 'Remedy Inventory & Stock', path: '/admin/inventory', icon: Package, color: 'text-purple-600 bg-purple-50' }
  ];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const hasResults = matchedAppointments.length > 0 || matchedOrders.length > 0 || matchedCustomers.length > 0 || matchedInventory.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Field Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-brandOrange-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type patient name, phone, Order ID, remedy, or appointment slot..."
            className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-400 rounded-lg border border-slate-200 shadow-2xs shrink-0">
            ESC to close
          </kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* If no query entered, show quick navigation */}
          {!q && (
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                QUICK CLINIC NAVIGATION
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {navigationShortcuts.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.path)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-100 hover:border-orange-200 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-xs text-navy-950 group-hover:text-brandOrange-600 transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brandOrange-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results for Search Query */}
          {q && (
            <>
              {!hasResults ? (
                <div className="text-center py-10 space-y-2">
                  <p className="font-bold text-slate-700 text-sm">No records found for "{query}"</p>
                  <p className="text-[11px] text-slate-400">Try searching by patient phone number, slot ID, or remedy name.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Appointments */}
                  {matchedAppointments.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">
                        CONSULTATIONS ({matchedAppointments.length})
                      </span>
                      {matchedAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => handleSelect('/admin/appointments')}
                          className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-100 hover:border-amber-200 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                                {apt.appointmentId}
                              </span>
                              <span className="font-black text-xs text-navy-950 group-hover:text-brandOrange-600">
                                {apt.patient?.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {apt.patient?.phone} • {apt.date} ({apt.time}) • {apt.concern}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-white border border-slate-200">
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Orders */}
                  {matchedOrders.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                        ORDERS & DISPATCHES ({matchedOrders.length})
                      </span>
                      {matchedOrders.map((ord) => (
                        <div
                          key={ord.id}
                          onClick={() => handleSelect('/admin/orders')}
                          className="p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                                #{ord.orderId || ord.id}
                              </span>
                              <span className="font-black text-xs text-navy-950 group-hover:text-emerald-700">
                                {ord.customer?.name || ord.shippingAddress?.fullName || 'Patient'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              ₹{ord.total || 450} • {ord.paymentMethod || 'Online'} • {ord.items?.[0]?.name || 'Remedies'}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {ord.orderStatus || ord.status || 'Processing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Patients Directory */}
                  {matchedCustomers.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">
                        PATIENTS DIRECTORY ({matchedCustomers.length})
                      </span>
                      {matchedCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => handleSelect('/admin/customers')}
                          className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div>
                            <span className="font-black text-xs text-navy-950 group-hover:text-blue-700">
                              {cust.name}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {cust.phone} • {cust.email} • {cust.city || 'Tamil Nadu'}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">
                            {cust.totalOrders || 1} Orders
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Medicines / Inventory */}
                  {matchedInventory.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">
                        MEDICINE DISPENSARY ({matchedInventory.length})
                      </span>
                      {matchedInventory.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect('/admin/inventory')}
                          className="p-3 bg-slate-50 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                                {item.sku}
                              </span>
                              <span className="font-black text-xs text-navy-950 group-hover:text-purple-700">
                                {item.productName}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Category: {item.category || 'Dispensary'}
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                            item.currentStock > 0 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {item.currentStock > 0 ? `Stock: ${item.currentStock}` : 'Out of Stock'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminSpotlightSearchModal;
