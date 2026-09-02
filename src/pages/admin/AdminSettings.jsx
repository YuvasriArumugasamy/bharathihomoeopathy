import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Phone, Clock, CreditCard, Truck, Bell, Mail, Lock } from 'lucide-react';
import { initialAdminSettings } from '../../data/adminSettingsData';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(initialAdminSettings);
  const [activeSection, setActiveSection] = useState('general');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Clinic settings and store parameters updated!', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Clinic & Platform Configuration</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Admin Settings</h1>
          <p className="text-xs text-slate-500">Configure clinic contact info, working hours, shipping rules, and payment gateways.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-1">
          {[
            { id: 'general', label: 'General & Brand', icon: Settings },
            { id: 'clinic', label: 'Clinic & Doctor Info', icon: ShieldCheck },
            { id: 'contact', label: 'Contact & Address', icon: Phone },
            { id: 'hours', label: 'Working Hours', icon: Clock },
            { id: 'payments', label: 'Payment Gateway', icon: CreditCard },
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'notifications', label: 'Alerts & Email SMTP', icon: Bell }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-smooth ${
                activeSection === sec.id
                  ? 'bg-brandOrange-50 text-brandOrange-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
              }`}
            >
              <sec.icon className={`w-4 h-4 ${activeSection === sec.id ? 'text-brandOrange-500' : 'text-slate-400'}`} />
              <span>{sec.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Form */}
        <main className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            
            {activeSection === 'general' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  General Platform Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Site Title</label>
                    <input
                      type="text"
                      value={settings.general.siteTitle}
                      onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteTitle: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.general.tagline}
                      onChange={(e) => setSettings({ ...settings, general: { ...settings.general, tagline: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'clinic' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Clinic & Practitioner Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinic Name</label>
                    <input
                      type="text"
                      value={settings.clinic.clinicName}
                      onChange={(e) => setSettings({ ...settings, clinic: { ...settings.clinic, clinicName: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lead Practitioner</label>
                    <input
                      type="text"
                      value={settings.clinic.leadDoctor}
                      onChange={(e) => setSettings({ ...settings, clinic: { ...settings.clinic, leadDoctor: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Public Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinic Email</label>
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={settings.contact.addressLine1}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, addressLine1: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'hours' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Dispensary & Consultation Timings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monday - Friday</label>
                    <input
                      type="text"
                      value={settings.workingHours.mondayFriday}
                      onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, mondayFriday: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Saturday</label>
                    <input
                      type="text"
                      value={settings.workingHours.saturday}
                      onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, saturday: e.target.value } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'payments' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Payment Gateway Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-semibold">
                    <input type="checkbox" defaultChecked className="rounded text-brandOrange-500" />
                    <span>Enable Cash on Delivery (COD)</span>
                  </label>
                  <label className="flex items-center gap-2 font-semibold">
                    <input type="checkbox" defaultChecked className="rounded text-brandOrange-500" />
                    <span>Enable Razorpay Online Payments</span>
                  </label>
                  <div className="pt-2">
                    <label className="block font-semibold text-slate-700 mb-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={settings.payments.razorpayKeyId}
                      className="w-full p-2.5 font-mono bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'shipping' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Delivery & Shipping Rules
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Standard Shipping Fee (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.standardShippingFee}
                      onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, standardShippingFee: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) } })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Notification Channels
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-brandOrange-500" />
                    <span>Send email confirmation on new prescription orders</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-brandOrange-500" />
                    <span>Send SMS/WhatsApp appointment alerts to patients</span>
                  </label>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-bold rounded-xl shadow-md transition-smooth flex items-center gap-2"
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
