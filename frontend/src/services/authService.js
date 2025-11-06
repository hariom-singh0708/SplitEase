import api from "./apiClient";

// 📝 Register new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// 🔐 Login user
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 👤 Fetch current user (using cookie or token)
export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) return { user: null };
    throw err;
  }
};

// 🚪 Logout user
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    /* ignore network errors on logout */
  }
};
