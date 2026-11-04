import { getEffectivePrice } from './productUtils.js';

export const calculateItemSubtotal = (price, quantity) => {
  return price * quantity;
};

export const calculateCartTotals = (items = []) => {
  let subtotal = 0;
  let totalItems = 0;

  for (const item of items) {
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  }

  return { subtotal, totalItems };
};
