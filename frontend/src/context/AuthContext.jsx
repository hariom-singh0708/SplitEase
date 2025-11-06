import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, registerUser, logoutUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch current user once on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.user || null);
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔐 Login
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    setUser(res.user || null);
  };

  // 📝 Register
  const register = async (data) => {
    const res = await registerUser(data);
    setUser(res.user || null);
  };

  // 🚪 Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
