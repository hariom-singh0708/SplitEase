import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/apiClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔹 Load current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data.user);
      } catch (err) {
        console.error("Profile load failed:", err);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      const res = await api.patch("/auth/me", {
        name: profile.name,
        mobile: profile.mobile,
      });
      setProfile(res.data.user);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Profile update failed";
      setError(`❌ ${msg}`);
    } finally {
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  };

  // 🔹 Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage("🔒 Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password change failed:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Password update failed";
      setError(`❌ ${msg}`);
    } finally {
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  };

  if (!user) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-muted">Please log in to view your profile.</h3>
      </div>
    );
  }

  return (
    <div className="container py-5 px-3" style={{ maxWidth: "900px" }}>
      <div className="text-center mb-5">
        <div
          className="rounded-circle bg-info bg-opacity-25 d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: "100px", height: "100px" }}
        >
          <h2 className="text-info fw-bold mb-0">
            {profile.name?.charAt(0).toUpperCase() || "U"}
          </h2>
        </div>
        <h2 className="fw-bold text-info mb-2">{profile.name}</h2>
        <p className="text-muted mb-0">{profile.email}</p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="alert alert-success text-center fw-semibold">
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center fw-semibold">{error}</div>
      )}

      {/* Profile Info */}
      <div className="card shadow-sm border-0 mb-4 rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-secondary mb-4">
            🧾 Profile Information
          </h5>
          <form onSubmit={handleUpdateProfile} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Mobile</label>
              <input
                type="text"
                className="form-control"
                value={profile.mobile}
                onChange={(e) =>
                  setProfile({ ...profile, mobile: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6 d-grid align-self-end">
              <button className="btn btn-info text-white fw-bold shadow-sm">
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Change */}
      <div className="card shadow-sm border-0 mb-4 rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-secondary mb-4">
            🔑 Change Password
          </h5>
          <form onSubmit={handleChangePassword} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-12 d-grid">
              <button className="btn btn-warning text-dark fw-bold shadow-sm">
                🔄 Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Logout */}
      <div className="text-center mt-4">
        <button
          className="btn btn-outline-danger px-4 fw-bold"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
