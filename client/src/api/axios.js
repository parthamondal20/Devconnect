import axios from "axios";
import store from "../app/store";
import { clearUser } from "../features/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue with an error (rejecting all waiting requests)
const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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
        store.dispatch(clearUser());
        localStorage.removeItem("appStore");
        window.location.href = "/";

        return Promise.reject(err);
      }
    }
    // ✅ Handle refresh token errors (401 from /auth/refresh-token)
    if (error.response?.status === 401 && isRefreshTokenEndpoint) {
      store.dispatch(clearUser());
      localStorage.removeItem("appStore");
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;