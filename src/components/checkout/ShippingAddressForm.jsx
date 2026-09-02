import React from 'react';
import { MapPin, Phone, Mail, User } from 'lucide-react';

export const ShippingAddressForm = ({
  formData,
  onChange,
  errors = {},
  paymentMethod,
  onPaymentMethodChange,
  orderNotes,
  onOrderNotesChange
}) => {
  return (
    <div className="space-y-6">
      
      {/* Shipping Address Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-brandOrange-500" />
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
            1. Shipping Address
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                value={formData.fullName || ''}
                onChange={onChange}
                placeholder="e.g. Ananya Sharma"
                className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:bg-white ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 focus:border-brandOrange-500'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {errors.fullName && <p className="text-[10px] text-rose-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone || ''}
                onChange={onChange}
                placeholder="+91 98765 43210"
                className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:bg-white ${
                  errors.phone ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 focus:border-brandOrange-500'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email || ''}
                onChange={onChange}
                placeholder="ananya@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Street Address / Door No. <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="addressLine1"
              autoComplete="street-address"
              value={formData.addressLine1 || ''}
              onChange={onChange}
              placeholder="House/Flat No., Street, Area"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:bg-white ${
                errors.addressLine1 ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 focus:border-brandOrange-500'
              }`}
            />
            {errors.addressLine1 && <p className="text-[10px] text-rose-500 mt-1">{errors.addressLine1}</p>}
          </div>

          {/* Address Line 2 */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Landmark / Apartment Name (Optional)
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2 || ''}
              onChange={onChange}
              placeholder="Near City Garden / Tower B"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={onChange}
              placeholder="e.g. Chennai"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:bg-white ${
                errors.city ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 focus:border-brandOrange-500'
              }`}
            />
            {errors.city && <p className="text-[10px] text-rose-500 mt-1">{errors.city}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              State <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={onChange}
              placeholder="e.g. Tamil Nadu"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:bg-white ${
                errors.state ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 focus:border-brandOrange-500'
              }`}
            />
            {errors.state && <p className="text-[10px] text-rose-500 mt-1">{errors.state}</p>}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN / Postal Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              autoComplete="postal-code"
              value={formData.postalCode || ''}
              onChange={onChange}
              placeholder="600001"
              maxLength={6}
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:bg-white ${
                errors.postalCode ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200 focus:border-brandOrange-500'
              }`}
            />
            {errors.postalCode && <p className="text-[10px] text-rose-500 mt-1">{errors.postalCode}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              disabled
              value={formData.country || 'India'}
              className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
            />
          </div>

        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
          2. Payment Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* COD Option */}
          <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-smooth ${
            paymentMethod === 'COD' ? 'border-brandOrange-500 bg-brandOrange-50/40 ring-1 ring-brandOrange-500' : 'border-slate-200 hover:border-slate-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={() => onPaymentMethodChange('COD')}
              className="mt-0.5 text-brandOrange-500 focus:ring-brandOrange-500"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-navy-900">Cash on Delivery (COD)</span>
              <span className="text-[11px] text-slate-500">Pay cash/UPI directly at the time of delivery.</span>
            </div>
          </label>

          {/* ONLINE Option */}
          <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-smooth ${
            paymentMethod === 'ONLINE' ? 'border-brandOrange-500 bg-brandOrange-50/40 ring-1 ring-brandOrange-500' : 'border-slate-200 hover:border-slate-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE"
              checked={paymentMethod === 'ONLINE'}
              onChange={() => onPaymentMethodChange('ONLINE')}
              className="mt-0.5 text-brandOrange-500 focus:ring-brandOrange-500"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-navy-900">Online Payment</span>
              <span className="text-[11px] text-slate-500">Instant UPI, Cards & Netbanking via Razorpay.</span>
            </div>
          </label>

        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Special Delivery Instructions / Notes (Optional)
        </label>
        <textarea
          rows={3}
          value={orderNotes || ''}
          onChange={(e) => onOrderNotesChange(e.target.value)}
          placeholder="e.g. Please call before delivery or leave with front desk security."
          className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white"
        />
      </div>

    </div>
  );
};
