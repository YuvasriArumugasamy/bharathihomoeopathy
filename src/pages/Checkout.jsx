import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { OrderSuccess } from '../components/checkout/OrderSuccess';
import { EmptyState } from '../components/common/EmptyState';
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
  AlertCircle
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
    country: 'India',
    gstNumber: '',
    saveAddress: true
  });

  const [selectedCourier, setSelectedCourier] = useState('ST COURIER');
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal Code is required';
    else if (!/^\d{6}$/.test(formData.postalCode.trim())) errs.postalCode = 'Enter a valid 6-digit PIN code';

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

  // Courier Partners List with Logos / Badges
  const courierOptions = [
    { id: 'ST COURIER', name: 'ST COURIER', tag: 'Fast Local Delivery', color: 'border-[#f97316] text-[#f97316] bg-orange-50/60' },
    { id: 'DTDC', name: 'DTDC Express', tag: 'Pan-India Express', color: 'border-blue-500 text-blue-600 bg-blue-50/60' },
    { id: 'INDIA POST', name: 'INDIA POST', tag: 'Government Postal', color: 'border-rose-500 text-rose-600 bg-rose-50/60' },
    { id: 'EMS SPEED POST', name: 'EMS SPEED POST', tag: 'Priority Speed Delivery', color: 'border-purple-500 text-purple-600 bg-purple-50/60' }
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

                {/* Step 2 Pill */}
                <button
                  onClick={() => {
                    if (validateAddressStep()) setStep('checkout');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer ${
                    step === 'checkout'
                      ? 'bg-[#0b344d] text-white shadow-md ring-4 ring-[#0b344d]/10'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold ${step === 'checkout' ? 'bg-[#f97316] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                  <span>CHECKOUT</span>
                </button>
              </div>
            </div>

            {/* STEP 1: ADDRESS ENTRY FORM */}
            {step === 'address' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Shipping Address Input Card */}
                <div className="lg:col-span-8 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.06)] space-y-6 relative overflow-hidden">
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

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
                      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                        Phone Number (10 digits) <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select className="px-3 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 cursor-pointer">
                          <option>+91</option>
                        </select>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="9345865212"
                          className="flex-1 px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.phone}</p>}
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
                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          State <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] text-xs font-bold text-slate-900 shadow-2xs cursor-pointer"
                        >
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                          Country
                        </label>
                        <select
                          disabled
                          value="India"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-500 cursor-not-allowed"
                        >
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>

                    {/* GST Number */}
                    <div>
                      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        placeholder="Enter 15-digit GSTIN if applicable"
                        className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 text-xs font-bold text-slate-900 placeholder-slate-400 shadow-2xs"
                      />
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

                    <div className="flex justify-between items-center">
                      <span>Net Weight of Product</span>
                      <span className="font-extrabold text-slate-900">0.100 kg</span>
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

                  {/* Continue Button to Step 2 */}
                  <button
                    type="button"
                    onClick={handleProceedToCheckoutStep}
                    className="w-full py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-[1.02] active:scale-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
                          <span>+91 {formData.phone}</span>
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
                            EXPRESS
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
                        <span>Net Weight of Product</span>
                        <span className="font-extrabold text-slate-900">0.100 kg</span>
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
                      onClick={handlePlaceOrder}
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
    </div>
  );
};

