export const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `DHC-${dateStr}-${randomSuffix}`;
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
