import api from './api';

export const createPaymentApi = async (paymentData) => {
  const response = await api.post('/payments/create', paymentData);
  return response.data;
};

export const verifyPaymentApi = async (verificationData) => {
  const response = await api.post('/payments/verify', verificationData);
  return response.data;
};
