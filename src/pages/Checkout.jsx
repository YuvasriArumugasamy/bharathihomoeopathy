import { QRCodeSVG } from 'qrcode.react';
import React, { useState, useEffect } from 'react';
import phonepeQRImage from '../assets/WhatsApp Image 2026-09-10 at 10.05.20.jpeg';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { OrderSuccess } from '../components/checkout/OrderSuccess';
import { EmptyState } from '../components/common/EmptyState';
import CustomPhoneInput from '../components/common/CustomPhoneInput';
import { Country, State } from 'country-state-city';

const popularIsoCodes = ['IN', 'AE', 'US', 'GB', 'SG', 'MY', 'AU', 'CA', 'SA', 'LK'];
const allCountriesList = Country.getAllCountries();
const popularCountriesList = popularIsoCodes
  .map((code) => Country.getCountryByCode(code))
  .filter(Boolean);
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Navigation, 
  Check, 
  ChevronRight, 
  Truck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Package,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, grandTotal, discount, shipping, tax, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  // 2-Step Flow State: 'address' (Step 1) | 'checkout' (Step 2)
  const [step, setStep] = useState('address');

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || 'Yuvasri',
    lastName: user?.name?.split(' ').slice(1).join(' ') || 'Arumugasamy',
    email: user?.email || 'yuvasrikutty2005@gmail.com',
    phone: user?.phone || '9345865212',
    address: '201-1 S.M Kovil street Vallam',
    city: 'Tenkasi',
    state: 'Tamil Nadu',
    postalCode: '627811',
    country: localStorage.getItem('user_country') || 'India',
    saveAddress: true
  });

  // Dynamically resolve states according to current selected country
  const currentCountryObj = allCountriesList.find(
    (c) => c.name.toLowerCase() === (formData.country || 'India').toLowerCase() || c.isoCode === formData.country
  ) || Country.getCountryByCode('IN');

  const availableStates = currentCountryObj
    ? State.getStatesOfCountry(currentCountryObj.isoCode)
    : [];

  const handleCountryChange = (countryName) => {
    const foundC = allCountriesList.find((c) => c.name === countryName) || Country.getCountryByCode('IN');
    const states = foundC ? State.getStatesOfCountry(foundC.isoCode) : [];
    const firstState = states.length > 0 ? states[0].name : '';
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      state: firstState
    }));
    localStorage.setItem('user_country', countryName);
    window.dispatchEvent(new Event('country_changed'));
  };

  const [selectedCourier, setSelectedCourier] = useState('ST COURIER');
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

  // Validate if all mandatory address fields are filled
  const isAddressComplete = Boolean(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.phone?.trim() &&
    formData.address?.trim() &&
    formData.city?.trim() &&
    formData.state?.trim() &&
    /^\d{6}$/.test(formData.postalCode?.trim() || '')
  );

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Your Cart is Empty"
          description="You cannot proceed to checkout without items in your cart."
          actionText="Explore Remedies"
          actionLink="/shop"
        />
      </div>
    );
  }

  // Geolocation Handler for "Use My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setFormData(prev => ({
          ...prev,
          city: 'Tenkasi',
          state: 'Tamil Nadu',
          postalCode: '627811',
          address: `${prev.address || 'Detected Location Coordinates: ' + pos.coords.latitude.toFixed(4) + ', ' + pos.coords.longitude.toFixed(4)}`
        }));
        showToast('Location updated successfully!', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Unable to retrieve location. Please enter manually.', 'warning');
      }
    );
  };

  const validateAddressStep = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First Name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last Name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.address.trim()) errs.address = 'Complete address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.postalCode.trim()) {
      errs.postalCode = 'Postal Code is required';
    } else if (formData.country === 'India' && !/^\d{6}$/.test(formData.postalCode.trim())) {
      errs.postalCode = 'Enter a valid 6-digit PIN code';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToCheckoutStep = () => {
    if (validateAddressStep()) {
      setStep('checkout');
    } else {
      showToast('Please fill in all required address fields', 'warning');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedCourier) {
      showToast('Please select a shipping partner to continue', 'warning');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const fullAddressString = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.postalCode}`;
      const payload = {
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        courier: selectedCourier,
        paymentMethod: 'COD',
        totalAmount: grandTotal
      };

      const res = await orderService.createOrder(payload);

      if (res && res.success) {
        setPlacedOrder(res.data);
        clearCart();
        showToast('Order confirmed successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to place order', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error processing order', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Dynamic UPI Payment URL with exact order amount embedded
  const payableAmount = (subtotal + (subtotal * 0.05)).toFixed(2);
  const upiPaymentUrl = `upi://pay?pa=q826461256@ybl&pn=BARATHI%20HOMEOPATHY%20CLINIC&am=${payableAmount}&cu=INR&tn=Order%20Payment`;

  // Courier Partners List with Logos / Badges
  const courierOptions = [
    { id: 'ST COURIER', name: 'ST COURIER', tag: 'Fast Local Delivery', badge: 'LOCAL', color: 'border-[#f97316] text-[#f97316] bg-orange-50/60' },
    { id: 'DTDC', name: 'DTDC Express', tag: 'Pan-India Express', badge: 'EXPRESS', color: 'border-blue-500 text-blue-600 bg-blue-50/60' },
    { id: 'INDIA POST', name: 'INDIA POST', tag: 'Government Postal', badge: 'POSTAL', color: 'border-rose-500 text-rose-600 bg-rose-50/60' },
    { id: 'EMS SPEED POST', name: 'EMS SPEED POST', tag: 'Priority Speed Delivery', badge: 'SPEED', color: 'border-purple-500 text-purple-600 bg-purple-50/60' }
  ];

  // Estimated delivery range
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 5);
  const dateOptions = { day: '2-digit', month: 'SHORT' };
  const formattedDelivery = `${deliveryStart.getDate().toString().padStart(2, '0')} SEP - ${deliveryEnd.getDate().toString().padStart(2, '0')} SEP`;

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        
        {!placedOrder ? (
          <>
            {/* Top 2-Step Header Indicator */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                {/* Step 1 Pill */}
                <button
                  onClick={() => setStep('address')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer ${
                    step === 'address'
                      ? 'bg-[#0b344d] text-white shadow-md ring-4 ring-[#0b344d]/10'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold ${step === 'address' ? 'bg-[#f97316] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                  <span>ADDRESS</span>
                </button>

                <div className="w-12 sm:w-20 h-0.5 border-t-2 border-dashed border-slate-300" />

                {/* Step 2 Pill - disabled until address is fully filled */}
                {(() => {
                  const isActive = step === 'checkout';
                  return (
                    <button
                      disabled={!isAddressComplete && step !== 'checkout'}
                      onClick={() => {
                        if (validateAddressStep()) setStep('checkout');
                      }}
                      title={!isAddressComplete && step !== 'checkout' ? 'Please fill all address fields first' : ''}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0b344d] text-white shadow-md ring-4 ring-[#0b344d]/10 cursor-pointer'
                          : isAddressComplete
                          ? 'bg-white text-slate-500 border border-slate-200 hover:border-[#0b344d] hover:text-[#0b344d] cursor-pointer'
                          : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                        isActive
                          ? 'bg-[#f97316] text-white'
                          : isAddressComplete
                          ? 'bg-slate-300 text-slate-600'
                          : 'bg-slate-200 text-slate-400'
                      }`}>2</span>
                      <span>CHECKOUT</span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* STEP 1: ADDRESS ENTRY FORM */}
            {step === 'address' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Shipping Address Input Card */}
                <div className="lg:col-span-8 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.06)] space-y-6 relative">
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] rounded-t-3xl" />

                  {/* "Use My Location" Switch Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={isLocating}
                      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#e05a1e] hover:bg-orange-100 text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
                    </button>
                    <span className="text-xs text-slate-400 font-medium">Auto-fill via GPS</span>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="space-y-4 text-xs">
                    
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Enter first name"
                          className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                        />
                        {errors.firstName && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Enter last name"
                          className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                        />
                        {errors.lastName && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Email ID */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                        Email ID
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                      />
                    </div>

                    {/* Phone Number with Country Code */}
                    <div>
                      <CustomPhoneInput
                        label="Phone Number"
                        required={true}
                        country="in"
                        value={formData.phone}
                        onChange={(phone) => setFormData({ ...formData, phone })}
                        placeholder="Enter phone number"
                        error={errors.phone}
                      />
                    </div>

                    {/* Complete Address */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                        Enter your complete address <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="House No., Street, Area, Landmark"
                        className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                      />
                      {errors.address && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.address}</p>}
                    </div>

                    {/* City & Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                        />
                        {errors.city && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          Postal Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          placeholder="627811"
                          className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                        />
                        {errors.postalCode && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.postalCode}</p>}
                      </div>
                    </div>

                    {/* State & Country Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* State / Province Field: Dynamically populated based on selected country */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          State / Province <span className="text-rose-500">*</span>
                        </label>
                        {availableStates.length > 0 ? (
                          <select
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
                          >
                            <option value="" disabled>Select State / Province</option>
                            {availableStates.map((s) => (
                              <option key={s.isoCode || s.name} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="Enter state or province"
                            className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 shadow-2xs hover:border-slate-300 transition-all placeholder-slate-400"
                          />
                        )}
                        {errors.state && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.state}</p>}
                      </div>

                      {/* Country Field: Fully Selectable Dropdown */}
                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          Country <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={currentCountryObj?.name || formData.country || 'India'}
                          onChange={(e) => handleCountryChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 shadow-2xs cursor-pointer hover:border-slate-300 transition-all"
                        >
                          <optgroup label="Popular Regions">
                            {popularCountriesList.map((c) => (
                              <option key={`pop-${c.isoCode}`} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="All Countries">
                            {allCountriesList.map((c) => (
                              <option key={c.isoCode} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Save Address Checkbox */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={formData.saveAddress}
                        onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
                        className="w-4 h-4 text-[#f97316] rounded border-slate-300 focus:ring-[#f97316] cursor-pointer"
                      />
                      <label htmlFor="saveAddress" className="text-xs font-bold text-slate-700 cursor-pointer">
                        Save this address for future orders
                      </label>
                    </div>

                  </div>
                </div>

                {/* Right: Step 1 Price Details Card */}
                <div className="lg:col-span-4 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      PRICE DETAILS ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between items-center">
                      <span>Sub Total</span>
                      <span className="font-black text-slate-900">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>GST (inclusive of all taxes)</span>
                      <span className="font-extrabold text-slate-900">₹{(subtotal * 0.05).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-amber-600 font-bold">
                      <span>Shipping Fee</span>
                      <span className="font-black">To Be Calculated</span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-black text-slate-900 text-sm">Total Amount</span>
                      <span className="font-black text-xl text-[#f97316]">₹{(subtotal + (subtotal * 0.05)).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Continue Button to Step 2 - Active only when address is complete */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={!isAddressComplete}
                      onClick={handleProceedToCheckoutStep}
                      className={`w-full py-4 px-6 text-xs sm:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${
                        isAddressComplete
                          ? 'text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/25 cursor-pointer'
                          : 'text-slate-400 bg-slate-200 border border-slate-300/80 cursor-not-allowed opacity-60 shadow-none'
                      }`}
                    >
                      <span>CONTINUE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {!isAddressComplete && (
                      <p className="text-[10px] text-slate-400 font-bold text-center">
                        Please fill all required address fields (*) to continue
                      </p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: CHECKOUT REVIEW & SHIPPING PARTNER */}
            {step === 'checkout' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Address Review Card + Order Items Card */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Saved Selected Address Review Box */}
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.06)] relative overflow-hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                        <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#f97316]" />
                          <span>{formData.firstName} {formData.lastName}</span>
                        </h4>
                        <p className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formData.email}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>+91 {formData.phone ? formData.phone.toString().replace(/^\+?91\s*/, '') : ''}</span>
                        </p>
                        <p className="flex items-start gap-1.5 text-slate-700 font-bold pt-1">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{formData.address}, {formData.city}, {formData.state}, {formData.country} - {formData.postalCode}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep('address')}
                        className="px-4 py-2 text-xs font-black text-[#0b344d] bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        Change Address
                      </button>
                    </div>
                  </div>

                  {/* Order Items Review Card */}
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.06)] space-y-4">
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#f97316]" />
                        <span>Order Items ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl border border-slate-200/80 bg-white"
                            />
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                              <p className="text-xs text-slate-500 font-bold">Quantity: {item.quantity} • Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase border border-emerald-200/60">
                            50% OFF
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Estimated Delivery Bar */}
                    <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/60 text-xs text-emerald-900 font-extrabold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Estimated Delivery: <strong className="text-emerald-950 font-black">{formattedDelivery}</strong></span>
                    </div>

                  </div>

                </div>

                {/* Right Side: Select Preferred Shipping Partner + Price Details */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Select Your Preferred Shipping Partner Card */}
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#f97316]" />
                      <span>Select Your Preferred Shipping Partner</span>
                    </h3>

                    <div className="space-y-3">
                      {courierOptions.map((courier) => (
                        <label
                          key={courier.id}
                          onClick={() => setSelectedCourier(courier.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            selectedCourier === courier.id
                              ? 'border-[#f97316] bg-orange-50/70 ring-4 ring-orange-500/10 shadow-sm'
                              : 'border-slate-200/90 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="courier"
                              checked={selectedCourier === courier.id}
                              onChange={() => setSelectedCourier(courier.id)}
                              className="w-4 h-4 text-[#f97316] focus:ring-[#f97316]"
                            />
                            <div>
                              <span className="font-black text-xs text-slate-900 block">{courier.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{courier.tag}</span>
                            </div>
                          </div>
                          
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase border ${courier.color}`}>
                            {courier.badge || 'EXPRESS'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Details Card */}
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

                    <div className="pb-3 border-b border-slate-100">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        PRICE DETAILS ({items.length} {items.length === 1 ? 'item' : 'items'})
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600 font-medium">
                      <div className="flex justify-between items-center">
                        <span>Sub Total</span>
                        <span className="font-black text-slate-900">₹{subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>GST (inclusive of all taxes)</span>
                        <span className="font-extrabold text-slate-900">₹{(subtotal * 0.05).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Shipping Fee</span>
                        <span className="font-black text-emerald-600">FREE</span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-black text-slate-900 text-sm">Total Amount</span>
                        <span className="font-black text-2xl text-[#f97316]">₹{(subtotal + (subtotal * 0.05)).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Proceed to Payment CTA Button */}
                    <button
                      type="button"
                      disabled={isPlacingOrder}
                      onClick={() => {
                        if (!selectedCourier) {
                          showToast('Please select a shipping partner to continue', 'warning');
                          return;
                        }
                        setShowPaymentModal(true);
                      }}
                      className="w-full py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-[1.02] active:scale-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isPlacingOrder ? (
                        <span>Processing Payment...</span>
                      ) : (
                        <>
                          <span>PROCEED TO PAYMENT</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Courier selection hint */}
                    {!selectedCourier && (
                      <p className="text-[10px] text-rose-500 font-bold text-center">
                        Please select a shipping method to continue
                      </p>
                    )}

                    {/* Security Guarantee Footer */}
                    <p className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5 pt-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Your payment information is secure and protected</span>
                    </p>

                  </div>

                </div>

              </div>
            )}

          </>
        ) : (
          /* Order Success Receipt Screen */
          <OrderSuccess order={placedOrder} />
        )}

      </div>


      {/* PhonePe / UPI Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => { setShowPaymentModal(false); setSelectedPaymentMethod(null); }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => { setShowPaymentModal(false); setSelectedPaymentMethod(null); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all font-black text-sm"
            >
              X
            </button>

            {/* Header */}
            <div className="text-center space-y-1 pt-1">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">Choose Payment Method</h2>
              <p className="text-[11px] text-slate-500 font-medium">Select how you would like to pay</p>
            </div>

            {/* Method Selector - shown when no method selected */}
            {!selectedPaymentMethod && (
              <div className="grid grid-cols-2 gap-4">
                {/* PhonePe / UPI Option */}
                <button
                  onClick={() => setSelectedPaymentMethod('UPI')}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/60 hover:border-purple-500 hover:bg-purple-100/70 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#5f259f] flex items-center justify-center shadow-lg shadow-purple-300">
                    <span className="text-white text-xl font-black">Pe</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-900">PhonePe / UPI</p>
                    <p className="text-[10px] text-purple-600 font-bold mt-0.5">Scan QR &amp; Pay Instantly</p>
                  </div>
                </button>

                {/* Cash on Delivery Option */}
                <button
                  onClick={async () => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod(null);
                    await handlePlaceOrder();
                  }}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 hover:border-emerald-500 hover:bg-emerald-100/70 hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-300">
                    <span className="text-white text-xl font-black">COD</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-900">Cash on Delivery</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Pay at your doorstep</p>
                  </div>
                </button>
              </div>
            )}

            {/* UPI / QR Section with Strict UTR Verification */}
            {selectedPaymentMethod === 'UPI' && (
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-4">
                  {/* Dynamic Amount-Embedded UPI QR Code */}
                  <div className="bg-white rounded-3xl p-5 shadow-xl border border-purple-200 ring-4 ring-purple-100 flex flex-col items-center">
                    {/* PhonePe / BHIM Brand Header */}
                    <div className="flex items-center gap-2 pb-3 text-[#5f259f] font-black text-xs">
                      <div className="w-6 h-6 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-xs font-black shadow-sm">
                        Pe
                      </div>
                      <span>BARATHI HOMEOPATHY CLINIC</span>
                    </div>

                    {/* Dynamic Razor-Sharp QR Code (NPCI UPI Standard with exact amount) */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center">
                      <QRCodeSVG
                        value={upiPaymentUrl}
                        size={210}
                        level="M"
                        includeMargin={false}
                      />
                    </div>

                    <div className="pt-3 text-center">
                      <p className="text-[11px] font-mono font-bold text-slate-500">
                        UPI ID: <strong className="text-purple-700">q826461256@ybl</strong>
                      </p>
                    </div>
                  </div>

                  {/* Direct Mobile UPI App Button (for mobile phones) */}
                  <a
                    href={upiPaymentUrl}
                    className="w-full py-3 px-4 text-xs font-black text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm sm:hidden"
                  >
                    <span>Tap to Pay with Google Pay / PhonePe / Paytm</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <div className="text-center space-y-1.5">
                    <p className="text-xs font-black text-purple-700">Scan with any UPI App</p>
                    <p className="text-[10px] text-slate-400 font-bold">PhonePe | Google Pay | Paytm | BHIM</p>
                    <div className="mt-2 px-5 py-2.5 bg-purple-50 rounded-2xl border border-purple-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount to Pay</p>
                      <p className="text-2xl font-black text-purple-700">
                        <span className="text-lg mr-0.5">&#8377;</span>
                        {(subtotal + (subtotal * 0.05)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MANDATORY 12-DIGIT UPI REFERENCE / UTR NUMBER VERIFICATION FIELD */}
                <div className="space-y-2 text-left pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>12-Digit UPI Ref / UTR No <span className="text-rose-500">*</span></span>
                    </label>
                    <span className="text-[10px] font-bold text-purple-600">Required</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={16}
                      value={upiTransactionId}
                      onChange={(e) => setUpiTransactionId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                      placeholder="Enter 12-digit UTR (e.g. 425612849012)"
                      className="w-full px-4 py-3.5 bg-slate-50 focus:bg-white border-2 border-purple-200 focus:border-purple-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-inner tracking-widest"
                    />
                    {upiTransactionId.trim().length >= 12 && (
                      <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-[11px] font-black text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Valid</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Google Pay / PhonePe-ல் பணம் செலுத்திய பிறகு காட்டும் <strong>12-digit UPI Ref / UTR No</strong>-ஐ இங்கு பதிவிடவும். இந்த எண் இல்லாமல் ஆர்டர் கன்ஃபார்ம் ஆகாது.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    disabled={isPlacingOrder || isVerifyingUpi || upiTransactionId.trim().length < 12}
                    onClick={async () => {
                      if (upiTransactionId.trim().length < 12) {
                        showToast('Please enter the 12-digit UPI Reference / UTR Number from your payment app', 'warning');
                        return;
                      }
                      setIsVerifyingUpi(true);
                      setTimeout(async () => {
                        setIsVerifyingUpi(false);
                        setShowPaymentModal(false);
                        setSelectedPaymentMethod(null);
                        await handlePlaceOrder('UPI', upiTransactionId.trim());
                      }, 1200);
                    }}
                    className={`w-full py-3.5 px-6 text-sm font-black text-white rounded-2xl transition-all flex items-center justify-center gap-2 ${
                      upiTransactionId.trim().length >= 12 && !isPlacingOrder && !isVerifyingUpi
                        ? 'bg-gradient-to-r from-[#5f259f] to-[#8b2fc9] hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/30 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60 shadow-none'
                    }`}
                  >
                    {isVerifyingUpi ? (
                      <span>Verifying Transaction Reference...</span>
                    ) : isPlacingOrder ? (
                      <span>Confirming Order...</span>
                    ) : upiTransactionId.trim().length < 12 ? (
                      <span>Enter 12-Digit UTR to Confirm</span>
                    ) : (
                      <span>Verify & Confirm Order</span>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isPlacingOrder || isVerifyingUpi}
                    onClick={() => {
                      setSelectedPaymentMethod(null);
                      setUpiTransactionId('');
                    }}
                    className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    &larr; Back to payment options
                  </button>
                </div>
              </div>
            )}

            {/* Security Footer */}
            <p className="text-[10px] text-slate-400 font-bold text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>100% Secure Payment &mdash; Powered by BHIM UPI</span>
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
