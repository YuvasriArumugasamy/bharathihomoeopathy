export const validateCategoryInput = (data) => {
  const errors = [];
  if (!data.name || !data.name.trim()) errors.push('Category name is required');
  if (data.sortOrder != null && Number(data.sortOrder) < 0) errors.push('Sort order must be 0 or greater');
  return { isValid: errors.length === 0, errors };
};
