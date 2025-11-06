import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    setExpanded(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top px-3">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold text-light fs-4"
          to="/"
          onClick={() => setExpanded(false)}
        >
          💸 SplitEase
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/take"
                  onClick={() => setExpanded(false)}
                >
                  💰 Take Money
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/give"
                  onClick={() => setExpanded(false)}
                >
                  💸 Give Money
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/groups"
                  onClick={() => setExpanded(false)}
                >
                  👥 Groups
                </NavLink>
              </li>
            </ul>
          )}

          {/* Right Side */}
          <div className="d-flex align-items-center ms-auto">
            {user ? (
              <>
                {/* Profile Name */}
                <button
                  className="btn btn-link text-light text-decoration-none fw-semibold me-3"
                  onClick={() => {
                    navigate("/profile");
                    setExpanded(false);
                  }}
                  style={{
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  {user.name}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm fw-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-light btn-sm me-2 fw-semibold"
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Link>
                <Link
                  className="btn btn-info text-white btn-sm fw-semibold"
                  to="/register"
                  onClick={() => setExpanded(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
