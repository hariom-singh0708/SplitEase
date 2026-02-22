import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getMe,
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* ================= INIT USER ================= */
const initializeAuth = useCallback(async () => {
  try {
    setLoading(true);
    const res = await getMe();
    setUser(res?.user ?? null);
  } catch (err) {
    if (err?.response?.status === 401) {
      // refresh interceptor will try automatically
      setUser(null);
    }
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /* ================= LOGIN ================= */
  const login = async (credentials) => {
    try {
      setAuthError(null);
      setLoading(true);

      const res = await loginUser(credentials);
      setUser(res?.user ?? null);

      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const register = async (data) => {
    try {
      setAuthError(null);
      setLoading(true);

      const res = await registerUser(data);
      setUser(res?.user ?? null);

      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed.";
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        refreshUser: initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
