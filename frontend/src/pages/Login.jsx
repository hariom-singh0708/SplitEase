import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ emailOrMobile: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(form);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-indigo-600 blur-[140px] opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-pink-600 blur-[140px] opacity-20 rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-white">
            <LogIn size={26} className="text-indigo-400" />
            Welcome Back
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to continue to <span className="font-semibold text-white">SplitEase</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email / Mobile */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Email or Mobile
            </label>
            <div className="flex items-center bg-slate-800 rounded-xl px-4 border border-slate-700 focus-within:border-indigo-500 transition">
              {/\d/.test(form.emailOrMobile) ? (
                <Phone size={18} className="text-slate-400" />
              ) : (
                <Mail size={18} className="text-slate-400" />
              )}
              <input
                type="text"
                className="bg-transparent w-full p-3 outline-none text-white"
                placeholder="Enter email or mobile"
                value={form.emailOrMobile}
                onChange={(e) =>
                  setForm({ ...form, emailOrMobile: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Password
            </label>
            <div className="flex items-center bg-slate-800 rounded-xl px-4 border border-slate-700 focus-within:border-indigo-500 transition">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="bg-transparent w-full p-3 outline-none text-white"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-slate-400" />
                ) : (
                  <Eye size={18} className="text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold hover:scale-105 transition shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
