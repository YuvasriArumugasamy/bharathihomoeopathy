import mongoose from 'mongoose';

export const validateCreatePaymentOrder = (data) => {
  const errors = [];
  if (!data.orderId || !mongoose.Types.ObjectId.isValid(data.orderId)) {
    errors.push('Valid order ID is required');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateVerifyPayment = (data) => {
  const errors = [];
  if (!data.razorpay_order_id) errors.push('Razorpay order ID is required');
  if (!data.razorpay_payment_id) errors.push('Razorpay payment ID is required');
  if (!data.razorpay_signature) errors.push('Razorpay signature is required');
  return { isValid: errors.length === 0, errors };
};
