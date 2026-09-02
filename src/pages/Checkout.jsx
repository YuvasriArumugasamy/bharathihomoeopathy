import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { ShippingAddressForm } from '../components/checkout/ShippingAddressForm';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { OrderSuccess } from '../components/checkout/OrderSuccess';
import { EmptyState } from '../components/common/EmptyState';
import { ShieldCheck } from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'PIN / Postal code is required';
    else if (!/^\d{6}$/.test(formData.postalCode.trim())) errs.postalCode = 'Enter a valid 6-digit PIN code';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      showToast('Please correct the highlighted form errors', 'warning');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const payload = {
        shippingAddress: formData,
        paymentMethod,
        notes: orderNotes,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full overflow-x-hidden">
      
      {!placedOrder ? (
        <>
          {/* Header */}
          <div className="pb-4 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Secure Checkout</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Delivery & Order Placement
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Address & Payment Method */}
            <div className="lg:col-span-8">
              <ShippingAddressForm
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                orderNotes={orderNotes}
                onOrderNotesChange={setOrderNotes}
              />
            </div>

            {/* Right: Sticky Summary */}
            <div className="lg:col-span-4">
              <CheckoutSummary
                isPlacingOrder={isPlacingOrder}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>

          </div>
        </>
      ) : (
        /* Order Success Receipt Component */
        <OrderSuccess order={placedOrder} />
      )}

    </div>
  );
};
