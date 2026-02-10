import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, ShieldCheck, LogOut, Save, RefreshCw } from "lucide-react";

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
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data.user);
      } catch (err) {
        console.error("Profile load failed:", err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.patch("/auth/me", {
        name: profile.name,
        mobile: profile.mobile,
      });
      setProfile(res.data.user);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || "Update failed"}`);
    } finally {
      setIsUpdating(false);
      setTimeout(() => { setMessage(""); setError(""); }, 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage("🔒 Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || "Password update failed"}`);
    } finally {
      setTimeout(() => { setMessage(""); setError(""); }, 3000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-slate-500 font-black uppercase tracking-widest text-sm">Authentication Required</h3>
          <button onClick={() => navigate("/login")} className="text-sky-500 font-bold hover:underline">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-sky-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20">
        
        {/* --- PROFILE HEADER --- */}
        <div className="text-center mb-12">
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-24 h-24 bg-slate-900 border-2 border-white/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <span className="text-4xl font-black text-sky-500">
                {profile.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">{profile.name}</h2>
          <p className="text-slate-500 font-medium">{profile.email}</p>
        </div>

        {/* --- GLOBAL FEEDBACK --- */}
        {(message || error) && (
          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-500 ${message ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <p className="text-sm font-bold tracking-wide">{message || error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          
          {/* --- PERSONAL INFO CARD --- */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-8">
              <User className="text-sky-500 w-5 h-5" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Account Settings</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-sky-400" />
                  <input
                    type="text"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all text-white"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 opacity-60 cursor-not-allowed">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email (Fixed)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-5 py-4 outline-none cursor-not-allowed text-slate-500"
                    value={profile.email}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Mobile</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-sky-400" />
                  <input
                    type="text"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all text-white"
                    value={profile.mobile}
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  disabled={isUpdating}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-sky-900/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] active:scale-95"
                >
                  {isUpdating ? <RefreshCw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* --- SECURITY CARD --- */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-8">
              <Lock className="text-amber-500 w-5 h-5" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Security</h3>
            </div>

            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all text-white"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">New Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all text-white"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                  Update Security Credentials
                </button>
              </div>
            </form>
          </section>

          {/* --- LOGOUT SECTION --- */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border border-red-500/20 hover:bg-red-500/10 transition-all text-red-500 font-black uppercase tracking-widest text-xs"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}