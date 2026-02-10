import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { User, IndianRupee, FileText, PlusCircle, Inbox, ArrowUpRight, History } from "lucide-react";

export default function GiveMoney() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    counterpartyName: "",
    amount: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getTransactions("GIVE");
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTransaction({ ...form, type: "GIVE", status: "PENDING" });
    setForm({ counterpartyName: "", amount: "", note: "" });
    fetchData();
  };

  const handleUpdate = async (id, update) => {
    await updateTransaction(id, update);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this record?")) {
      await deleteTransaction(id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4">
            Give <span className="text-indigo-500 italic">Capital.</span>
          </h2>
          <p className="text-slate-500 max-w-xl font-medium">
            Record money lent to friends or colleagues. Tracking outgoings with precision.
          </p>
        </div>

        {/* --- PREMIUM INPUT CARD --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-white/5 p-6 sm:p-10 mb-16 group">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>

          <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                Recipient Name
              </label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-700"
                  placeholder="Who received it?"
                  value={form.counterpartyName}
                  onChange={(e) => setForm({ ...form, counterpartyName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                Amount
              </label>
              <div className="relative group/input">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" />
                <input
                  type="number"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white font-black placeholder:text-slate-700"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                Memo
              </label>
              <div className="relative group/input">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-700"
                  placeholder="What's this for?"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                <PlusCircle size={16} /> Record
              </button>
            </div>
          </form>
        </div>

        {/* --- TRANSACTIONS LIST --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-[0.1em]">Outbound History</h3>
            <div className="h-px flex-grow bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-600">Retrieving Ledger...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[3rem] py-20 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox size={32} className="text-slate-700" />
              </div>
              <h6 className="text-white font-bold text-lg mb-1">Clear Slate</h6>
              <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">No given transactions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((tx) => (
                <div key={tx._id} className="group relative">
                  <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <TransactionCard
                    tx={tx}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    // Pass a custom "dark" mode prop if your TransactionCard supports it
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}