export const validateOrderInput = (data) => {
  const errors = [];
  if (!data.shippingAddress) {
    errors.push('Shipping address is required');
    return { isValid: false, errors };
  }

  const addr = data.shippingAddress;
  if (!addr.fullName || !addr.fullName.trim()) errors.push('Full name is required');
  if (!addr.phone || !addr.phone.trim()) errors.push('Phone number is required');
  if (!addr.addressLine1 || !addr.addressLine1.trim()) errors.push('Address Line 1 is required');
  if (!addr.city || !addr.city.trim()) errors.push('City is required');
  if (!addr.state || !addr.state.trim()) errors.push('State is required');
  if (!addr.postalCode || !addr.postalCode.trim()) errors.push('Postal code is required');

  if (data.paymentMethod && !['COD', 'ONLINE'].includes(data.paymentMethod)) {
    errors.push('Payment method must be COD or ONLINE');
  }

  return { isValid: errors.length === 0, errors };
};
