export const validateProductInput = (data) => {
  const errors = [];
  if (!data.name || !data.name.trim()) errors.push('Product name is required');
  if (!data.sku || !data.sku.trim()) errors.push('Product SKU is required');
  if (!data.category) errors.push('Category is required');
  if (data.price == null || Number(data.price) < 0) errors.push('Price must be a non-negative number');
  if (data.salePrice != null && Number(data.salePrice) < 0) errors.push('Sale price cannot be negative');
  if (data.salePrice != null && Number(data.salePrice) > Number(data.price)) errors.push('Sale price cannot exceed regular price');
  if (data.stock != null && Number(data.stock) < 0) errors.push('Stock cannot be negative');
  return { isValid: errors.length === 0, errors };
};
