import mongoose from 'mongoose';

export const validateAddToCart = (data) => {
  const errors = [];
  if (!data.productId || !mongoose.Types.ObjectId.isValid(data.productId)) {
    errors.push('Valid product ID is required');
  }
  if (!data.quantity || !Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 1) {
    errors.push('Quantity must be an integer of 1 or greater');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateUpdateCart = (data) => {
  const errors = [];
  if (data.quantity == null || !Number.isInteger(Number(data.quantity)) || Number(data.quantity) < 1) {
    errors.push('Quantity must be an integer of 1 or greater');
  }
  return { isValid: errors.length === 0, errors };
};
