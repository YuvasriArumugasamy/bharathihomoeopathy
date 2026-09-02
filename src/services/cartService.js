import { api } from '../utils/api';

export const cartService = {
  getCart: async () => {
    try {
      const res = await api.get('/cart');
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      return res;
    } catch (err) {
      throw err;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${productId}`, { quantity });
      return res;
    } catch (err) {
      throw err;
    }
  },

  removeFromCart: async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      return res;
    } catch (err) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete('/cart');
      return res;
    } catch (err) {
      throw err;
    }
  }
};
