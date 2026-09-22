import api from './api';

export const getCartApi = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCartApi = async (itemData) => {
  const response = await api.post('/cart', itemData);
  return response.data;
};

export const updateCartItemApi = async (itemId, quantity) => {
  const response = await api.patch(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeCartItemApi = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete('/cart');
  return response.data;
};
