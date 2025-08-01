import axios from "axios"; // библиотека для работы с запросами на сервер
import { AxiosHeaders } from "axios"; // класс для удобной работы с заголовками
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
export const register = (data: any) => API.post("/auth/registration", data);
export const login = (data: any) => API.post("/auth/login", data);
