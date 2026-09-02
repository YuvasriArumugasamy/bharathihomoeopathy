// Configurable Cart & Checkout values
// Real business values can easily be adjusted or connected to backend settings
export const cartConfig = {
  freeShippingThreshold: 1000,
  standardShippingFee: 50,
  taxRatePercentage: 0, // 0 for demo, easily configured to GST %
  minOrderAmount: 0
};

export const checkoutConfig = {
  standardDeliveryCharge: 50,
  expressDeliveryCharge: 120,
  freeDeliveryThreshold: 1000,
  estimatedStandardDays: "3-5 business days",
  estimatedExpressDays: "1-2 business days",
  defaultCountry: "India"
};
