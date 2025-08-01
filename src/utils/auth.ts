import { jwtDecode } from "jwt-decode";
export interface DecodedToken {
  id?: number;
  userId?: number;
  email?: string;
  role?: string;
  exp?: number;
  [key: string]: any;
}
export function decodeToken(): DecodedToken | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (e) {
    console.error("Ошибка декодирования токена:", e);
    return null;
  }
}
