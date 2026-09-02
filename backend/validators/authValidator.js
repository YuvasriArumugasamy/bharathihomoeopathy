export const validateRegister = (data) => {
  const errors = [];
  if (!data.name || !data.name.trim()) errors.push('Name is required');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.push('Valid email is required');
  if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters');
  return { isValid: errors.length === 0, errors };
};

export const validateLogin = (data) => {
  const errors = [];
  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');
  return { isValid: errors.length === 0, errors };
};
