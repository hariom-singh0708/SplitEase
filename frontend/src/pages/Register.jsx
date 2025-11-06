import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "⚠️ Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #20c997, #0dcaf0, #0d6efd)",
        backgroundSize: "200% 200%",
        animation: "gradientMove 6s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div
        className="card border-0 shadow-lg p-4 rounded-4 text-center"
        style={{
          width: "23rem",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          transition: "all 0.3s",
        }}
      >
        <h3 className="fw-bold text-primary mb-3 d-flex justify-content-center align-items-center gap-2">
          <UserPlus size={24} /> Create Account
        </h3>
        <p className="text-muted small mb-3">
          Join <strong>SplitEase</strong> and start tracking expenses easily.
        </p>

        {error && (
          <div className="alert alert-danger py-2 small text-start">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <User className="text-secondary" size={18} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <Mail className="text-secondary" size={18} />
            </span>
            <input
              type="email"
              className="form-control border-start-0"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Mobile */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white border-end-0">
              <Phone className="text-secondary" size={18} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Mobile (optional)"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="input-group mb-4">
            <span className="input-group-text bg-white border-end-0">
              <Lock className="text-secondary" size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          {/* Register Button */}
          <button
            className="btn btn-success w-100 fw-semibold py-2 d-flex justify-content-center align-items-center gap-2 rounded-pill shadow-sm"
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(90deg, #20c997, #0dcaf0)",
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
                <UserPlus size={18} /> Register
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-3 text-center">
          <Link
            to="/login"
            className="text-decoration-none text-primary fw-semibold small"
          >
            Already have an account? Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
