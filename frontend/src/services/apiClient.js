import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // ensures cookies (access/refresh) are sent with each request
});

// 🔄 Auto-refresh expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only handle 401 errors once per request
    if (error.response?.status === 401 && !original._retry) {
      const excluded = ["/auth/login", "/auth/register", "/auth/logout", "/auth/refresh", "/auth/me"];
      if (excluded.some((endpoint) => original.url.includes(endpoint))) {
        return Promise.reject(error);
      }

      original._retry = true;
      try {
        await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
        return api(original); // retry original request
      } catch {
        console.warn("Session expired, redirecting to login...");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
