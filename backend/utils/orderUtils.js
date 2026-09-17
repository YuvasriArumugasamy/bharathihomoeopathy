export const generateOrderNumber = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const calculateShippingCharge = (subtotal) => {
  return subtotal >= 1000 ? 0 : 50;
};

export const calculateOrderTotal = (subtotal, shippingCharge = 0, discount = 0) => {
  return Math.max(0, subtotal + shippingCharge - discount);
};

export const validateStatusTransition = (currentStatus, newStatus) => {
  const allowed = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

  return allowed[currentStatus]?.includes(newStatus) || false;
};
