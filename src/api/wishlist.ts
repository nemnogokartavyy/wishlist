import axios from 'axios';
import { AxiosHeaders } from 'axios';
const API = axios.create({ baseURL: "/api" });
// const API = axios.create({baseURL: 'http://192.168.100.2:3000/api'});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
  });
export const getMyWishlist = () => API.get('/wishlist');
export const createGift = (data: any) => API.post('/wishlist', data);
export const updateGift = (id: number, data: any) => API.put(`/wishlist/${id}`, data);
export const deleteGift = (id: number) => API.delete(`/wishlist/${id}`);
export const getWishlist = (userId: number) => API.get(`/wishlist/${userId}`);
export const markGift = (giftId: number) => API.post(`/wishlist/${giftId}/mark`);
export const unmarkGift = (giftId: number) => API.post(`/wishlist/${giftId}/unmark`);
