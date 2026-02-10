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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItemStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-indigo-500/20 text-indigo-400"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/70 backdrop-blur-xl border-b border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">

        {/* ===== BRAND ===== */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-2xl font-extrabold"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
            SplitEase
          </span>
        </Link>

        {/* ===== DESKTOP MENU ===== */}
        <div className="hidden lg:flex items-center gap-6">

          {user && (
            <>
              <NavLink to="/take" className={navItemStyle}>
                <Wallet size={18} /> Take
              </NavLink>

              <NavLink to="/give" className={navItemStyle}>
                <Send size={18} /> Give
              </NavLink>

              <NavLink to="/groups" className={navItemStyle}>
                <Users size={18} /> Groups
              </NavLink>
            </>
          )}

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 ml-6">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition flex items-center gap-2"
                >
                  <User size={18} />
                  {user.name}
                </button>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition flex items-center gap-2 font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ===== MOBILE TOGGLE ===== */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-slate-300"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-6 py-6 space-y-4"
          >
            {user && (
              <>
                <NavLink to="/take" className={navItemStyle} onClick={() => setOpen(false)}>
                  <Wallet size={18} /> Take
                </NavLink>

                <NavLink to="/give" className={navItemStyle} onClick={() => setOpen(false)}>
                  <Send size={18} /> Give
                </NavLink>

                <NavLink to="/groups" className={navItemStyle} onClick={() => setOpen(false)}>
                  <Users size={18} /> Groups
                </NavLink>
              </>
            )}

            <div className="pt-4 border-t border-slate-800 space-y-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="w-full px-5 py-3 rounded-xl bg-slate-800 flex items-center justify-center gap-2 text-white"
                  >
                    <User size={18} />
                    {user.name}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-5 py-3 rounded-xl border border-slate-700 text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
