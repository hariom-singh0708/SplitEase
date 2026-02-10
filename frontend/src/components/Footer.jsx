import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">

          {/* Brand */}
          <div className="text-white font-bold tracking-tight">
            Split<span className="text-indigo-500">Ease</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-slate-500">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <Link to="/groups" className="hover:text-white transition">
              Groups
            </Link>
            <Link to="/profile" className="hover:text-white transition">
              Profile
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-slate-600 text-xs text-center sm:text-right">
            © {new Date().getFullYear()} All rights reserved.
          </div>

        </div>

      </div>
    </footer>
  );
}
