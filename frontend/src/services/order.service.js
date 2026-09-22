import api from './api';

export const createOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderByIdApi = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const trackOrderApi = async (id) => {
  const response = await api.get(`/orders/${id}/track`);
  return response.data;
};
