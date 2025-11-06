import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ emailOrMobile: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "⚠️ Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
    >

      <div
        className="card border-0 shadow-lg p-4 rounded-4 text-center"
        style={{
          width: "22rem",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          transition: "0.3s",
        }}
      >
        <h3 className="fw-bold text-primary mb-3 d-flex justify-content-center align-items-center gap-2">
          <LogIn size={24} /> Welcome Back
        </h3>
        <p className="text-muted mb-3 small">
          Sign in to continue to <strong>SplitEase</strong>
        </p>

        {error && (
          <div className="alert alert-danger py-2 small text-start">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email or Mobile */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              {/\d/.test(form.emailOrMobile) ? (
                <Phone className="text-secondary" size={18} />
              ) : (
                <Mail className="text-secondary" size={18} />
              )}
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Email or Mobile"
              value={form.emailOrMobile}
              onChange={(e) =>
                setForm({ ...form, emailOrMobile: e.target.value })
              }
              required
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <Lock className="text-secondary" size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
            <span
              className="input-group-text bg-white border-start-0"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="text-secondary" size={18} />
              ) : (
                <Eye className="text-secondary" size={18} />
              )}
            </span>
          </div>

          <button
            className="btn btn-primary w-100 fw-semibold py-2 d-flex justify-content-center align-items-center gap-2 rounded-pill shadow-sm"
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(90deg, #0dcaf0, #0d6efd)",
              border: "none",
            }}
          >
            {loading ? (
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              ></div>
            ) : (
              <>
                <LogIn size={18} /> Login
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-3 text-center">
          <Link
            to="/register"
            className="text-decoration-none text-primary fw-semibold small"
          >
            New here? Create an account →
          </Link>
          <br />
        </div>
      </div>
    </div>
  );
}
