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
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return setError("Please accept Terms & Conditions.");

    setLoading(true);
    setError("");

    const res = await register(form);

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
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-indigo-600 blur-[150px] opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-600 blur-[150px] opacity-20 rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-white">
            <UserPlus size={26} className="text-indigo-400" />
            Create Account
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Join <span className="text-white font-semibold">SplitEase</span> and manage money smarter.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <InputField
            icon={<User size={18} />}
            placeholder="Full Name"
            value={form.name}
            onChange={(val) => setForm({ ...form, name: val })}
          />

          {/* Email */}
          <InputField
            icon={<Mail size={18} />}
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(val) => setForm({ ...form, email: val })}
          />

          {/* Mobile */}
          <InputField
            icon={<Phone size={18} />}
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(val) => setForm({ ...form, mobile: val })}
          />

          {/* Password */}
          <div>
            <div className="flex items-center bg-slate-800 rounded-xl px-4 border border-slate-700 focus-within:border-indigo-500 transition">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="bg-transparent w-full p-3 outline-none text-white"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} className="text-slate-400" />
                ) : (
                  <Eye size={18} className="text-slate-400" />
                )}
              </button>
            </div>

            {/* Strength Indicator */}
            {form.password && (
              <div className="mt-2">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Strength: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-indigo-500"
            />
            I agree to the Terms & Conditions
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold hover:scale-105 transition shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function InputField({ icon, placeholder, type = "text", value, onChange }) {
  return (
    <div className="flex items-center bg-slate-800 rounded-xl px-4 border border-slate-700 focus-within:border-indigo-500 transition">
      <span className="text-slate-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent w-full p-3 outline-none text-white"
        required
      />
    </div>
  );
}

/* ================= PASSWORD STRENGTH ================= */

function getStrength(password) {
  if (password.length < 6)
    return { width: "25%", color: "bg-red-500", label: "Weak" };
  if (password.length < 10)
    return { width: "50%", color: "bg-yellow-500", label: "Medium" };
  if (/[A-Z]/.test(password) && /\d/.test(password))
    return { width: "100%", color: "bg-green-500", label: "Strong" };
  return { width: "75%", color: "bg-blue-500", label: "Good" };
}
