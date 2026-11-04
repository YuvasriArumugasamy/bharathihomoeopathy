export const getStockStatus = (stock, lowStockThreshold = 5) => {
  if (stock <= 0) return 'Out of Stock';
  if (stock <= lowStockThreshold) return 'Low Stock';
  return 'In Stock';
};

export const getEffectivePrice = (product) => {
  if (!product) return 0;
  if (product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price) {
    return product.salePrice;
  }
  return product.price;
};
