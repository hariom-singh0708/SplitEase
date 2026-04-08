import axios from "axios";

// Dynamically switch between local & production URLs
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // your local Express backend
    : "https://splitease-production-4d64.up.railway.app/api"; // Render backend

const api = axios.create({
  baseURL,
  withCredentials: true, // ensures cookies (access/refresh) are sent with each request
});

// 🔄 Auto-refresh expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      const excluded = ["/auth/login", "/auth/register", "/auth/logout", "/auth/refresh"];

      if (excluded.some((endpoint) => original.url.includes(endpoint))) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(original);
      } catch {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
