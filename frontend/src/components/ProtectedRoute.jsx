import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        
        {/* Gradient Glow Background */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-600 blur-[140px] opacity-20 rounded-full"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative flex flex-col items-center gap-6"
        >
          {/* Animated Loader */}
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full"
            ></motion.div>
          </div>

          <p className="text-slate-400 text-sm tracking-wide">
            Securing your session...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
