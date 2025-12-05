import axios from "axios";

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

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If a token refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest }); // Added originalRequest to queue for clarity, though not strictly required with the fix below
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        // Attempt to get a new token
        // NOTE: The backend must send the new access token (e.g., in a cookie) 
        // for the subsequent api(originalRequest) calls to work.
        const res = await api.post("/auth/refresh-token");
        console.log(res);
        isRefreshing = false;

        // ✅ FIX: Resolve queued requests by instructing them to re-run
        failedQueue.forEach(({ resolve }) => resolve(api(originalRequest)));
        failedQueue = [];

        // Return the promise from re-running the current request
        return api(originalRequest);

      } catch (err) {
        // Refresh failed: clear queue, reject waiting requests, and log out user
        isRefreshing = false;
        processQueue(err);

        localStorage.removeItem("appstore");
        window.location.href = "/";

        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;