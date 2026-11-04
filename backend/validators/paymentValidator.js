import mongoose from 'mongoose';

export const validateCreatePaymentOrder = (data = {}) => {
  const errors = [];
  if (!data.orderId && !data.amount) {
    errors.push('Order ID or amount is required');
  }
  if (data.orderId && !mongoose.Types.ObjectId.isValid(data.orderId)) {
    errors.push('Valid order ID is required');
  }
  if (data.amount !== undefined && (isNaN(data.amount) || Number(data.amount) <= 0)) {
    errors.push('Valid positive amount is required');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateVerifyPayment = (data = {}) => {
  const errors = [];
  if (!data.razorpay_order_id && !data.orderId) errors.push('Razorpay order ID is required');
  if (!data.razorpay_payment_id && !data.paymentId) errors.push('Razorpay payment ID is required');
  return { isValid: errors.length === 0, errors };
};
