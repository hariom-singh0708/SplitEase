import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  Wallet,
  Send,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout();
    setExpanded(false);
    navigate("/login");
  };

  // Detect scroll for dynamic navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top shadow-sm transition-all ${
        scrolled ? "bg-dark bg-opacity-75 backdrop-blur" : "bg-transparent"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        transition: "0.4s ease",
      }}
    >
      <div className="container-fluid px-3">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold text-light fs-4 d-flex align-items-center gap-2"
          to="/"
          onClick={() => setExpanded(false)}
          style={{
            textShadow: "0 0 6px rgba(255,255,255,0.5)",
          }}
        >
          💸 <span className="fw-bolder">SplitEase</span>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <X className="text-white" />
          ) : (
            <Menu className="text-white" />
          )}
        </button>

        {/* Menu */}
        <div
          className={`collapse navbar-collapse ${
            expanded ? "show animate__animated animate__fadeInDown" : ""
          }`}
        >
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 fw-semibold ${
                      isActive ? "text-info" : "text-light opacity-75"
                    }`
                  }
                  to="/take"
                  onClick={() => setExpanded(false)}
                >
                  <Wallet size={18} /> Take Money
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 fw-semibold ${
                      isActive ? "text-info" : "text-light opacity-75"
                    }`
                  }
                  to="/give"
                  onClick={() => setExpanded(false)}
                >
                  <Send size={18} /> Give Money
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 fw-semibold ${
                      isActive ? "text-info" : "text-light opacity-75"
                    }`
                  }
                  to="/groups"
                  onClick={() => setExpanded(false)}
                >
                  <Users size={18} /> Groups
                </NavLink>
              </li>
            </ul>
          )}

          {/* Right Side */}
          <div className="d-flex align-items-center ms-auto mt-3 mt-lg-0 gap-2">
            {user ? (
              <>
                {/* Profile Button */}
                <button
                  className="btn btn-outline-light fw-semibold d-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-sm"
                  onClick={() => {
                    navigate("/profile");
                    setExpanded(false);
                  }}
                  style={{
                    transition: "0.3s",
                    borderColor: "rgba(255,255,255,0.4)",
                  }}
                >
                  <User size={18} />
                  <span>{user.name}</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-white fw-semibold d-flex align-items-center gap-1 px-3 py-1 rounded-pill shadow-sm"
                  style={{ transition: "0.3s" }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-light fw-semibold d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  className="btn btn-info text-white fw-semibold d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                  to="/register"
                  onClick={() => setExpanded(false)}
                >
                  <UserPlus size={18} />
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
