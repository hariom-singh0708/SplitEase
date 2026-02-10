import {
  CheckCircle,
  Clock,
  Trash2,
  IndianRupee,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

export default function TransactionCard({ tx, onUpdate, onDelete }) {
  const isPaid = tx.status === "PAID";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300
        ${
          isPaid
            ? "bg-green-500/5 border-green-500/20 hover:border-green-400/40"
            : "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-400/40"
        }`}
    >
      {/* Glow Background */}
      <div
        className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 rounded-full
          ${isPaid ? "bg-green-500" : "bg-yellow-500"}`}
      ></div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        
        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              {tx.counterpartyName}
            </h3>

            {/* Status Badge */}
            <span
              className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium
                ${
                  isPaid
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
            >
              {isPaid ? (
                <>
                  <CheckCircle size={14} /> Paid
                </>
              ) : (
                <>
                  <Clock size={14} /> Pending
                </>
              )}
            </span>
          </div>

          {/* Amount + Date */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1 text-green-400 font-semibold">
              <IndianRupee size={16} />
              ₹{tx.amount}
            </div>

            <span>
              • {new Date(tx.date).toLocaleDateString()}
            </span>
          </div>

          {/* Note */}
          {tx.note && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FileText size={14} />
              <span>{tx.note}</span>
            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">

          {/* Toggle Paid */}
          <button
            onClick={() =>
              onUpdate(tx._id, {
                status: isPaid ? "PENDING" : "PAID",
              })
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
              ${
                isPaid
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-slate-800 text-green-400 border border-green-500/30 hover:bg-green-500/10"
              }`}
          >
            {isPaid ? "Paid" : "Mark Paid"}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(tx._id)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 transition"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
