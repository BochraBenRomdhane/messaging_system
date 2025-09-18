import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://messaging-system-n0wz.onrender.com/api" : "/api",
  withCredentials: true,
});
