import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import { AuthState, User } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://messaging-system-n0wz.onrender.com");

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      // Clear localStorage token if auth check fails
      localStorage.removeItem('authToken');
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: { fullName: string; email: string; password: string }) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      // Store token in localStorage as fallback for mobile browsers
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
      }

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      // Store token in localStorage as fallback for mobile browsers
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
      }

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem('authToken'); // Clear localStorage token
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data: { profilePic?: string }) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    socket.connect();

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
