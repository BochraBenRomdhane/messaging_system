import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://messaging-system-n0wz.onrender.com/api"),
  withCredentials: false, // Always disable credentials since we're using localStorage
});

// Add request interceptor to include token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Adding Bearer token to request:', token.substring(0, 20) + '...');
  } else {
    console.log('❌ No auth token found in localStorage');
  }
  return config;
});

// Add response interceptor to handle token refresh and auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.config?.url, error.message);
    if (error.response?.status === 401) {
      console.log('🚫 401 Unauthorized - clearing token and redirecting');
      // Clear invalid token
      localStorage.removeItem('authToken');
      // Redirect to login or refresh page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);