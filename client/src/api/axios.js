import axios from "axios";
import store from "../app/store";
import { clearUser } from "../features/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Global flag to track server status
let serverDownDetected = false;

export const setServerDownStatus = (status) => {
  serverDownDetected = status;
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('serverStatusChange', { detail: { isDown: status } }));
};

export const getServerDownStatus = () => serverDownDetected;

let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue with an error (rejecting all waiting requests)
const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Server is responding, mark it as up
    setServerDownStatus(false);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ Detect server downtime (not slow network)
    // Server is down if:
    // 1. No response from server (network error)
    // 2. ERR_NETWORK or ERR_CONNECTION_REFUSED
    // 3. No error.response object (means request never reached server)
    const isNetworkError = error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_CONNECTION_REFUSED' ||
      error.message === 'Network Error' ||
      !error.response;

    // If it's a timeout but we got a response, it's slow network, not server down
    const isTimeout = error.code === 'ECONNABORTED';

    if (isNetworkError && !isTimeout) {
      console.error('Server is down - network error detected:', error.code || error.message);
      setServerDownStatus(true);
      return Promise.reject(error);
    }

    // If we got any response, server is up (even if it's an error response)
    if (error.response) {
      setServerDownStatus(false);
    }

    // ✅ Check for refresh token endpoint explicitly
    const isRefreshTokenEndpoint = originalRequest.url?.includes('/auth/refresh-token');

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access token expired" &&
      !originalRequest._retry &&
      !isRefreshTokenEndpoint // ✅ Don't intercept refresh endpoint errors
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh-token");
        console.log(res);

        isRefreshing = false;
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err);

        // ✅ Log out user when refresh fails
        console.error("Refresh token failed. Logging out...", err);

        // Show user-friendly message
        const isExpired = err.response?.data?.message?.includes("expired");
        const message = isExpired
          ? "Your session has expired. Please login again."
          : "Authentication failed. Please login again.";

        // Use dynamic import to avoid circular dependency
        import('react-hot-toast').then(({ toast }) => {
          toast.error(message, { duration: 4000 });
        });

        // Clear all auth data
        store.dispatch(clearUser());
        localStorage.removeItem("appStore");

        // Small delay to ensure state is cleared before redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 100);

        return Promise.reject(err);
      }
    }
    // ✅ Handle refresh token errors (401 from /auth/refresh-token)
    // This covers: "Refresh token expired", "Refresh token missing", "Invalid refresh token", etc.
    if (error.response?.status === 401 && isRefreshTokenEndpoint) {
      const errorMessage = error.response?.data?.message || "";
      console.error("Refresh token failed:", errorMessage);

      // Determine user-friendly message based on error type
      let userMessage = "Your session has expired. Please login again.";
      if (errorMessage.includes("missing")) {
        userMessage = "Session not found. Please login again.";
      } else if (errorMessage.includes("expired")) {
        userMessage = "Your session has expired. Please login again.";
      } else if (errorMessage.includes("Invalid") || errorMessage.includes("not matched")) {
        userMessage = "Session invalid. Please login again.";
      }

      // Show user-friendly message
      import('react-hot-toast').then(({ toast }) => {
        toast.error(userMessage, { duration: 4000 });
      });

      // Clear all auth data
      store.dispatch(clearUser());
      localStorage.removeItem("appStore");

      // Clear cookies as well (in case they're stale)
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Small delay to ensure state is cleared before redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 100);

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;