import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://messaging-system-n0wz.onrender.com/api"),
  withCredentials: true,
});

// Add request interceptor to include token from localStorage as fallback
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});