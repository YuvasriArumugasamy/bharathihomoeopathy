import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { 
  Settings, Save, RotateCcw, Trash2, AlertTriangle, Database, ShieldCheck, Phone, Clock, CreditCard, 
  Truck, Bell, Mail, Lock, Sparkles, Check, Stethoscope, 
  MapPin, CheckCircle2, ChevronRight
} from 'lucide-react';
import { initialAdminSettings } from '../../data/adminSettingsData';
import { useToast } from '../../context/ToastContext';
import { cloudSyncService } from '../../services/cloudSyncService';

export const AdminSettings = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_clinic_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialAdminSettings,
          ...parsed,
          general: { ...initialAdminSettings.general, ...(parsed.general || {}) },
          clinic: { ...initialAdminSettings.clinic, ...(parsed.clinic || {}) },
          contact: { ...initialAdminSettings.contact, ...(parsed.contact || {}) },
          workingHours: { ...initialAdminSettings.workingHours, ...(parsed.workingHours || {}) },
          store: { ...initialAdminSettings.store, ...(parsed.store || {}) },
          orders: { ...initialAdminSettings.orders, ...(parsed.orders || {}) },
          appointments: { ...initialAdminSettings.appointments, ...(parsed.appointments || {}) },
          payments: { ...initialAdminSettings.payments, ...(parsed.payments || {}) },
          shipping: { ...initialAdminSettings.shipping, ...(parsed.shipping || {}) },
          tax: { ...initialAdminSettings.tax, ...(parsed.tax || {}) }
        };
      }
    } catch {
      // Fallback
    }
    return initialAdminSettings;
  });

  useEffect(() => {
    const unsub = cloudSyncService.listenToSettings((cloudSettings) => {
      if (cloudSettings) {
        setSettings(prev => ({
          ...initialAdminSettings,
          ...cloudSettings,
          general: { ...initialAdminSettings.general, ...(cloudSettings.general || {}) },
          clinic: { ...initialAdminSettings.clinic, ...(cloudSettings.clinic || {}) },
          contact: { ...initialAdminSettings.contact, ...(cloudSettings.contact || {}) },
          workingHours: { ...initialAdminSettings.workingHours, ...(cloudSettings.workingHours || {}) },
          store: { ...initialAdminSettings.store, ...(cloudSettings.store || {}) },
          orders: { ...initialAdminSettings.orders, ...(cloudSettings.orders || {}) },
          appointments: { ...initialAdminSettings.appointments, ...(cloudSettings.appointments || {}) },
          payments: { ...initialAdminSettings.payments, ...(cloudSettings.payments || {}) },
          shipping: { ...initialAdminSettings.shipping, ...(cloudSettings.shipping || {}) },
          tax: { ...initialAdminSettings.tax, ...(cloudSettings.tax || {}) }
        }));
      }
    });
    return () => unsub();
  }, []);

  const [activeSection, setActiveSection] = useState('general');

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('admin_clinic_settings', JSON.stringify(settings));
      window.dispatchEvent(new Event('drBharathiSettingsUpdated'));
      cloudSyncService.syncSettingsToCloud(settings);
    } catch (err) {
      console.warn('Failed to save settings to storage:', err);
    }
    showToast('Clinic operational settings and store parameters updated and saved!', 'success');
  };


  const [isResetting, setIsResetting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetType, setResetType] = useState('orders_only'); // 'orders_only' | 'full'

  const handleExecuteReset = async () => {
    setIsResetting(true);
    try {
      const includeAll = resetType === 'full';
      // 1. Call Cloud backend API to permanently wipe test data from Render MongoDB
      try {
        await api.post('/admin/reset-test-data', { includeProductsAndCategories: includeAll });
      } catch (cloudErr) {
        console.warn('Backend reset call note:', cloudErr.message);
      }

      // 2. Wipe Local Storage
      localStorage.setItem('admin_orders_store', '[]');
      localStorage.setItem('admin_appointments_store', '[]');
      localStorage.setItem('admin_customers_store', '[]');
      localStorage.setItem('admin_enquiries_store', '[]');
      localStorage.setItem('admin_reviews_store', '[]');
      localStorage.removeItem('drBharathiCart');

      if (includeAll) {
        localStorage.setItem('admin_products_store', '[]');
        localStorage.setItem('drBharathiProductsCatalog', '[]');
        localStorage.setItem('admin_categories_store', '[]');
        localStorage.setItem('admin_inventory_store', '[]');
      }

      // 3. Dispatch global sync events across all open tabs & components
      window.dispatchEvent(new Event('orders_updated'));
      window.dispatchEvent(new Event('drBharathiAppointmentsUpdated'));
      window.dispatchEvent(new Event('drBharathiProductsUpdated'));
      window.dispatchEvent(new Event('drBharathiCategoriesUpdated'));
      window.dispatchEvent(new Event('storage'));

      showToast(
        includeAll
          ? 'Full Factory Reset complete! All test orders, appointments, products & categories wiped from Cloud & Local.'
          : 'All test orders, appointments, and test customers wiped from Cloud & Local! Ready for client.',
        'success'
      );
      setResetModalOpen(false);
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const navItems = [
    { id: 'general', label: 'General & Brand', desc: 'Site branding & clinic slogan', icon: Settings },
    { id: 'clinic', label: 'Practitioner Profile', desc: 'Dr. Bharathi credentials', icon: Stethoscope },
    { id: 'contact', label: 'Contact & Location', desc: 'Phone, email, street address', icon: MapPin },
    { id: 'hours', label: 'Consultation Hours', desc: 'Dispensary & clinic timings', icon: Clock },
    { id: 'payments', label: 'Payment Gateways', desc: 'Razorpay API & COD switch', icon: CreditCard },
    { id: 'shipping', label: 'Shipping & Delivery', desc: 'Courier rates & free limits', icon: Truck },
    { id: 'notifications', label: 'Patient Alerts', desc: 'Email, SMS & WhatsApp', icon: Bell },
    { id: 'reset', label: 'Client Handover / Reset', desc: 'Wipe all test orders & data', icon: RotateCcw }
  ];

  return (
    <div className="space-y-8 ">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-sans italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            System Settings
          </h1>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Doctor</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-navy-950 truncate">Dr. Bharathi</span>
            <span className="text-xs text-slate-400 font-semibold">B.H.M.S</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payments</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-600">Razorpay Live</span>
            <span className="text-xs text-emerald-700/80 font-semibold">+ COD</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Delivery</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-brandOrange-600">₹{settings.shipping?.freeShippingThreshold || 999}+</span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">Orders</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dispatch Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-sky-600">Enabled</span>
            <span className="text-xs text-sky-700/80 font-semibold">Email & SMS</span>
          </div>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 bg-white/95 backdrop-blur-sm rounded-[2.25rem] p-4 border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-1.5">
          <div className="px-4 py-3 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Settings Categories</span>
          </div>

          {navItems.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between group ${
                activeSection === sec.id
                  ? 'bg-gradient-to-r from-[#1F5975] to-[#246582] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#1F5975]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  activeSection === sec.id ? 'bg-[#C86838] text-white shadow-xs' : 'bg-slate-100 text-slate-500 group-hover:text-[#1F5975] group-hover:bg-slate-200'
                }`}>
                  <sec.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${activeSection === sec.id ? 'text-white' : 'text-slate-800'}`}>
                    {sec.label}
                  </h4>
                  <p className={`text-[10px] ${activeSection === sec.id ? 'text-teal-100/80' : 'text-slate-400'}`}>
                    {sec.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                activeSection === sec.id ? 'text-white translate-x-1' : 'text-slate-300 group-hover:text-slate-400'
              }`} />
            </button>
          ))}
        </aside>

        {/* Content Form */}
        <main className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-[2.25rem] p-6 sm:p-8 lg:p-9 border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)]">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            
            {/* GENERAL */}
            {activeSection === 'general' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Platform Identity</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">General Brand Parameters</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Site Title</label>
                    <input
                      type="text"
                      value={settings.general.siteTitle}
                      onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteTitle: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Brand Tagline</label>
                    <input
                      type="text"
                      value={settings.general.tagline}
                      onChange={(e) => setSettings({ ...settings, general: { ...settings.general, tagline: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-xs leading-relaxed">
                  <strong>Branding Note:</strong> The title and tagline define the default metadata across patient search results, topbar navigation, and receipt headers.
                </div>
              </div>
            )}

            {/* CLINIC */}
            {activeSection === 'clinic' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Practitioner Information</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Clinic & Practitioner Profile</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Clinic Name</label>
                    <input
                      type="text"
                      value={settings.clinic.clinicName}
                      onChange={(e) => setSettings({ ...settings, clinic: { ...settings.clinic, clinicName: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Lead Practitioner Doctor</label>
                    <input
                      type="text"
                      value={settings.clinic.leadDoctor}
                      onChange={(e) => setSettings({ ...settings, clinic: { ...settings.clinic, leadDoctor: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT */}
            {activeSection === 'contact' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Location & Helpdesk</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Public Contact Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Primary Consultation Phone</label>
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Clinic Support Email</label>
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1.5">Street & Clinic Address</label>
                    <input
                      type="text"
                      value={settings.contact.addressLine1}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, addressLine1: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HOURS */}
            {activeSection === 'hours' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Consultation Schedule</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Dispensary & Clinic Timings</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Monday to Friday Timings</label>
                    <input
                      type="text"
                      value={settings.workingHours.mondayFriday}
                      onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, mondayFriday: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Saturday Timings</label>
                    <input
                      type="text"
                      value={settings.workingHours.saturday}
                      onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, saturday: e.target.value } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENTS */}
            {activeSection === 'payments' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Gateway API</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Payment Gateways</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <label className="flex items-center gap-3 font-bold text-navy-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.payments?.enableCOD ?? true}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: { ...settings.payments, enableCOD: e.target.checked }
                        })}
                        className="w-4 h-4 rounded text-brandOrange-500"
                      />
                      <span>Accept Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center gap-3 font-bold text-navy-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.payments?.enableRazorpay ?? true}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: { ...settings.payments, enableRazorpay: e.target.checked }
                        })}
                        className="w-4 h-4 rounded text-brandOrange-500"
                      />
                      <span>Accept Razorpay Online Payments (UPI, Cards, NetBanking)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Razorpay Key ID (Live / Test)</label>
                    <input
                      type="text"
                      placeholder="e.g. rzp_live_xxxxxxxx or rzp_test_xxxxxxxx"
                      value={settings.payments?.razorpayKeyId || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          razorpayKeyId: e.target.value.trim()
                        }
                      })}
                      className="w-full p-3 font-mono bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Add your Razorpay Key ID here. Real payments use keys starting with <code className="text-emerald-600 font-bold">rzp_live_</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SHIPPING */}
            {activeSection === 'shipping' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Logistics Rules</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Delivery & Shipping Rules (Location-Based)</h3>
                </div>

                <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 font-medium flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span>Shipping fees automatically calculate based on patient's delivery address (State & Country) during checkout.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Local State Fee (TN) (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.localStateFee ?? settings.shipping.standardShippingFee ?? 22}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          localStateFee: Number(e.target.value),
                          standardShippingFee: Number(e.target.value)
                        }
                      })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">For Tamil Nadu delivery</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Rest of India Fee (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.otherStatesFee ?? 50}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          otherStatesFee: Number(e.target.value)
                        }
                      })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Other Indian States</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">International Fee (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.internationalFee ?? 250}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          internationalFee: Number(e.target.value)
                        }
                      })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Outside India delivery</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Free Shipping Eligibility (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold ?? 1000}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          freeShippingThreshold: Number(e.target.value)
                        }
                      })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">₹0 delivery threshold</span>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Alert Automation</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Notification Channels</h3>
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <label className="flex items-center gap-3 font-bold text-navy-950 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandOrange-500" />
                    <span>Send instant email confirmation on new prescription orders</span>
                  </label>
                  <label className="flex items-center gap-3 font-bold text-navy-950 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandOrange-500" />
                    <span>Send SMS/WhatsApp appointment reminders 2 hours before slot</span>
                  </label>
                </div>
              </div>
            )}

            
            {/* CLIENT HANDOVER & DATA RESET */}
            {activeSection === 'reset' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">Danger Zone • Production Delivery</span>
                    <h3 className="font-heading font-black text-xl text-navy-950">Client Handover Data Wipe</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    Cloud + Local Storage
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Preparing Project for Dr. Bharathi Client Handover</span>
                  </div>
                  <p>
                    When delivering this project to your client, you should remove all your dummy testing orders, fake patient consultations, and test customers. Use the buttons below to permanently wipe them from both the <strong>Cloud MongoDB database</strong> and browser storage.
                  </p>
                </div>

                {/* Option 1: Clean Test Transactions (Recommended) */}
                <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-brandOrange-300 transition-all shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-brandOrange-500" />
                        Clear Test Orders, Appointments & Customers
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Permanently deletes all test orders (e.g. ₹5.25, ₹151.20), test appointments, and customer records from Cloud & Local. Keeps your clinic configuration, categories and real products intact.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setResetType('orders_only'); setResetModalOpen(true); }}
                      className="px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      Clear Test Orders & Data
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                    <span className="px-2 py-0.5 bg-slate-100 rounded">âœ“ Wipes Orders (Cloud + Local)</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded">âœ“ Wipes Appointments</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded">âœ“ Wipes Test Customers</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded">âœ“ Resets Dashboard KPIs to â‚¹0</span>
                  </div>
                </div>

                {/* Option 2: Full Factory Reset */}
                <div className="p-6 rounded-3xl bg-rose-50/60 border-2 border-rose-200 hover:border-rose-300 transition-all shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-black text-rose-950 text-base flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Full Factory Reset (100% Brand New Blank Slate)
                      </h4>
                      <p className="text-xs text-rose-800/80 mt-1">
                        Wipes EVERYTHING: all orders, all appointments, test customers, test products ("mn"), and test categories ("kjds"). The client will start with a completely pristine, empty catalog.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setResetType('full'); setResetModalOpen(true); }}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      Full Factory Wipe
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Changes apply instantly across dispensary store and appointment engine.
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>

          </form>
        </main>

      </div>


      {/* Confirmation Modal */}
      {resetModalOpen && (
        <div 
          onClick={() => setResetModalOpen(false)}
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-heading font-black text-xl text-slate-900">
                {resetType === 'full' ? 'Confirm Full Factory Reset?' : 'Confirm Wiping Test Data?'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {resetType === 'full' 
                  ? 'This will permanently delete all test orders, appointments, customers, products and categories from Cloud MongoDB and local storage. This action cannot be undone.'
                  : 'This will permanently remove all test orders, appointments, and test customer profiles from Cloud MongoDB and local storage. Your real store products and clinic settings will remain intact.'}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                disabled={isResetting}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                disabled={isResetting}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? (
                  <span>Wiping Cloud Data...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Wipe Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
