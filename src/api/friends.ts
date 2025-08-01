import axios from "axios";
import { AxiosHeaders } from "axios";
const API = axios.create({ baseURL: "/api" });
// const API = axios.create({baseURL: 'http://192.168.100.2:3000/api'});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
export const getFriends = () => API.get("/friends");
export const getFriendLink = () => API.get("/friends/link");
export const acceptFriend = (id: number) => API.post(`/friends/add/${id}`);
export const removeFriend = (id: number) => API.delete(`/friends/remove/${id}`);
export const getUser = (userId: number) => API.get(`/friends/${userId}`);
