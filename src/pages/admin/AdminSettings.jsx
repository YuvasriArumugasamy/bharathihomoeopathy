import React, { useState } from 'react';
import { 
  Settings, Save, ShieldCheck, Phone, Clock, CreditCard, 
  Truck, Bell, Mail, Lock, Sparkles, Check, Stethoscope, 
  MapPin, CheckCircle2, ChevronRight
} from 'lucide-react';
import { initialAdminSettings } from '../../data/adminSettingsData';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(initialAdminSettings);
  const [activeSection, setActiveSection] = useState('general');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Clinic operational settings and store parameters updated!', 'success');
  };

  const navItems = [
    { id: 'general', label: 'General & Brand', desc: 'Site branding & clinic slogan', icon: Settings },
    { id: 'clinic', label: 'Practitioner Profile', desc: 'Dr. Bharathi credentials', icon: Stethoscope },
    { id: 'contact', label: 'Contact & Location', desc: 'Phone, email, street address', icon: MapPin },
    { id: 'hours', label: 'Consultation Hours', desc: 'Dispensary & clinic timings', icon: Clock },
    { id: 'payments', label: 'Payment Gateways', desc: 'Razorpay API & COD switch', icon: CreditCard },
    { id: 'shipping', label: 'Shipping & Delivery', desc: 'Courier rates & free limits', icon: Truck },
    { id: 'notifications', label: 'Patient Alerts', desc: 'Email, SMS & WhatsApp', icon: Bell }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-7 sm:p-9 rounded-[2.25rem] border border-slate-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandOrange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandOrange-500/20 border border-brandOrange-400/30 text-brandOrange-300 text-xs font-black tracking-widest uppercase">
              <Settings className="w-3.5 h-3.5 text-brandOrange-400" />
              Clinic & Platform Administration
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              System Settings
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
              Configure clinic operating hours, lead doctor profiles, Razorpay credentials, shipping rates, and patient dispatch notifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">System Status</span>
                <span className="text-xs font-bold text-white">All Systems Operational</span>
              </div>
            </div>
          </div>
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
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  activeSection === sec.id ? 'bg-brandOrange-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-navy-900 group-hover:bg-slate-200'
                }`}>
                  <sec.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${activeSection === sec.id ? 'text-white' : 'text-navy-950'}`}>
                    {sec.label}
                  </h4>
                  <p className={`text-[10px] ${activeSection === sec.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {sec.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeSection === sec.id ? 'text-brandOrange-400' : 'text-slate-300'}`} />
            </button>
          ))}
        </aside>

        {/* Content Form */}
        <main className="lg:col-span-8 bg-white/95 backdrop-blur-sm rounded-[2.25rem] p-7 sm:p-9 border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)]">
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
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandOrange-500" />
                      <span>Accept Cash on Delivery (COD)</span>
                    </label>
                    <label className="flex items-center gap-3 font-bold text-navy-950 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brandOrange-500" />
                      <span>Accept Razorpay Online Payments (UPI, Cards, NetBanking)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Razorpay Key ID (Live / Test)</label>
                    <input
                      type="text"
                      value={settings.payments.razorpayKeyId}
                      className="w-full p-3 font-mono bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SHIPPING */}
            {activeSection === 'shipping' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Logistics Rules</span>
                  <h3 className="font-heading font-black text-lg text-navy-950">Delivery & Shipping Rules</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Standard Courier Fee (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.standardShippingFee}
                      onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, standardShippingFee: Number(e.target.value) } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Free Shipping Eligibility (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) } })}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                    />
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

    </div>
  );
};
