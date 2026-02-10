import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { User, IndianRupee, FileText, PlusCircle, Inbox, TrendingDown, History } from "lucide-react";

export default function TakeMoney() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    counterpartyName: "",
    amount: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getTransactions("TAKE");
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTransaction({ ...form, type: "TAKE", status: "PENDING" });
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
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pb-24 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4">
              Receive <span className="text-emerald-500 italic">Funds.</span>
            </h2>
            <p className="text-slate-500 max-w-md font-medium">
              Track money owed to you. Monitor your incoming cash flow and pending settlements.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 px-6 py-4 rounded-[2rem]">
             <TrendingDown className="text-emerald-500 w-5 h-5 rotate-180" />
             <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Receivable</p>
                <p className="text-xl font-black text-white">
                  ₹{transactions.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}
                </p>
             </div>
          </div>
        </div>

        {/* --- PREMIUM INPUT SECTION --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-white/5 p-6 sm:p-10 mb-16 transition-all hover:border-emerald-500/20">
          {/* Emerald Ambient Glow */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] -ml-32 -mt-32"></div>

          <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                Source Name
              </label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all text-white placeholder:text-slate-700"
                  placeholder="Who owes you?"
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
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                  type="number"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all text-white font-black placeholder:text-slate-700"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                Note
              </label>
              <div className="relative group/input">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all text-white placeholder:text-slate-700"
                  placeholder="Reason (Optional)"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                <PlusCircle size={16} /> Collect
              </button>
            </div>
          </form>
        </div>

        {/* --- INBOUND LEDGER --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <History className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-[0.1em]">Inbound Ledger</h3>
            <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-lg">
              {transactions.length} Records
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-700">Syncing Assets...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[3rem] py-24 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:rotate-12">
                <Inbox size={32} className="text-slate-700" />
              </div>
              <h6 className="text-white font-bold text-lg mb-1">Debt Free</h6>
              <p className="text-slate-600 text-xs font-black uppercase tracking-widest">No pending receivables found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((tx) => (
                <div key={tx._id} className="group relative">
                  <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <TransactionCard
                    tx={tx}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
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