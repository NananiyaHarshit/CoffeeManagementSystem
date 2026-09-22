import api from './api';

export const getCoffeesApi = async (params = {}) => {
  const response = await api.get('/coffees', { params });
  return response.data;
};

export const getCoffeeByIdApi = async (id) => {
  const response = await api.get(`/coffees/${id}`);
  return response.data;
};

export const getProductReviewsApi = async (productId) => {
  const response = await api.get(`/reviews/${productId}`);
  return response.data;
};

export const submitReviewApi = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};
