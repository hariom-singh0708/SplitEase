import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  ShieldCheck,
  BarChart3,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden">

      {/* ================= BACKGROUND GRADIENT BLOBS ================= */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[140px] opacity-20"></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-600 rounded-full blur-[140px] opacity-20"></div>

      {/* ================= HERO ================= */}
      <section className="relative px-6 lg:px-20 py-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* ================= LEFT ================= */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-6">
                <Sparkles size={16} />
                Smart Expense Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                {user ? (
                  <>
                    Welcome back,
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
                      {user.name}
                    </span>
                  </>
                ) : (
                  <>
                    The Future of
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
                      Money Management
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-8 text-slate-400 text-lg lg:text-xl max-w-xl">
                {user
                  ? "Continue managing your groups and stay financially organized."
                  : "Track shared expenses, manage debts, and collaborate smarter."}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-6">

                {!user && (
                  <>
                    <Link
                      to="/register"
                      className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-xl shadow-indigo-500/40 hover:scale-105 transition"
                    >
                      Get Started Free
                    </Link>

                    <Link
                      to="/login"
                      className="px-10 py-4 rounded-2xl border border-slate-700 hover:bg-slate-800/60 transition"
                    >
                      Login
                    </Link>
                  </>
                )}

                {user && (
                  <>
                    <Link
                      to="/groups"
                      className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-xl shadow-indigo-500/40 hover:scale-105 transition flex items-center gap-2"
                    >
                      <Users size={18} />
                      Explore Groups
                    </Link>

                    <Link
                      to="/profile"
                      className="px-10 py-4 rounded-2xl border border-slate-700 hover:bg-slate-800/60 transition flex items-center gap-2"
                    >
                      Profile
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT PREMIUM VISUAL ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 pointer-events-none"></div>

              <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                <Wallet size={22} className="text-indigo-400" />
                Intelligent Expense Workspace
              </h3>

              <div className="space-y-6">

                <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 hover:border-indigo-400/40 transition">
                  <div className="flex items-center gap-3 text-indigo-400 mb-2">
                    <Users size={18} />
                    Group Collaboration
                  </div>
                  <p className="text-slate-400 text-sm">
                    Manage shared expenses with smart auto-calculation logic.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 hover:border-green-400/40 transition">
                  <div className="flex items-center gap-3 text-green-400 mb-2">
                    <BarChart3 size={18} />
                    Visual Insights
                  </div>
                  <p className="text-slate-400 text-sm">
                    Understand your financial behavior through clean analytics.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 hover:border-pink-400/40 transition">
                  <div className="flex items-center gap-3 text-pink-400 mb-2">
                    <ShieldCheck size={18} />
                    Secure Architecture
                  </div>
                  <p className="text-slate-400 text-sm">
                    Encrypted transactions and protected user data.
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="px-6 lg:px-20 py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          <FeatureCard
            icon={<Users />}
            title="Smart Group Splits"
            desc="Automatically calculate who owes what in seconds."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure Transactions"
            desc="End-to-end encryption with multi-layer authentication."
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Advanced Analytics"
            desc="Track your spending trends with real-time insights."
          />

        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="px-6 lg:px-20 py-20 border-t border-slate-800 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Trusted by 100,000+ Users
        </h2>

        <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <TrustStat number="100K+" label="Active Users" />
          <TrustStat number="₹50Cr+" label="Transactions Processed" />
          <TrustStat number="99.99%" label="Platform Uptime" />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 lg:px-20 py-24 border-t border-slate-800 text-center">
        <h2 className="text-4xl font-bold">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-slate-400 mt-4">
          Join now and simplify your money management.
        </p>

        <Link
          to="/register"
          className="inline-block mt-10 px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold shadow-lg shadow-indigo-500/40 hover:scale-105 transition"
        >
          Create Free Account
        </Link>
      </section>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500 transition">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

function TrustStat({ number, label }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
      <h3 className="text-3xl font-bold text-indigo-400">{number}</h3>
      <p className="text-slate-400 mt-2">{label}</p>
      <CheckCircle className="mx-auto mt-4 text-green-400" />
    </div>
  );
}
