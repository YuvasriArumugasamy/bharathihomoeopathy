import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dr_bharathi_secure_jwt_secret_key_2026_homeo', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};
