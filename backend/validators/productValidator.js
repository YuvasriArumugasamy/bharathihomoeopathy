export const validateProductInput = (data) => {
  const errors = [];
  const effectivePrice = data.price != null ? data.price : data.regularPrice;
  const effectiveSalePrice = data.salePrice != null ? data.salePrice : data.offerPrice;

  if (!data.name || !data.name.trim()) errors.push('Product name is required');
  if (!data.sku || !data.sku.trim()) errors.push('Product SKU is required');
  if (!data.category) errors.push('Category is required');
  if (effectivePrice == null || Number(effectivePrice) < 0) errors.push('Price must be a non-negative number');
  if (effectiveSalePrice != null && Number(effectiveSalePrice) < 0) errors.push('Sale price cannot be negative');
  if (effectiveSalePrice != null && Number(effectiveSalePrice) > Number(effectivePrice)) errors.push('Sale price cannot exceed regular price');
  if (data.stock != null && Number(data.stock) < 0) errors.push('Stock cannot be negative');
  return { isValid: errors.length === 0, errors };
};
