import { useEffect, useState } from "react";
import {
  getGroups,
  createGroup,
  getGroupExpenses,
  addExpense,
  getSettlement,
  deleteGroup,
} from "../services/groupService";
import api from "../services/apiClient";
import {
  Users, Plus, Trash2, ArrowRight, Receipt, UserPlus, X,
  LayoutGrid, Calendar, ChevronRight, Activity, Wallet,
  ArrowUpRight, Clock, Filter
} from "lucide-react";

export default function GroupExpenses() {
  // --- States ---
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [totals, setTotals] = useState({});
  const [groupForm, setGroupForm] = useState({ name: "", newMember: "" });
  const [addedMembers, setAddedMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState("");
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", paidBy: "" });
  const [sortOption, setSortOption] = useState("date");
  const [loading, setLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    fetchGroups();
  }, []);

  // --- Functions ---
  const fetchGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups", err);
    }
  };

  const handleAddMember = async () => {
    const identifier = groupForm.newMember?.trim();
    if (!identifier) return;
    try {
      setMemberStatus("🔍 Searching...");
      const res = await api.get(`/auth/search?query=${identifier}`);
      const users = res.data;

      if (users.length > 0) {
        const user = users[0];
        if (!addedMembers.some((m) => m._id === user._id)) {
          setAddedMembers([...addedMembers, user]);
          setMemberStatus(`✅ Added ${user.name}`);
        } else {
          setMemberStatus("⚠️ Already in list");
        }
      } else {
        setMemberStatus("❌ User not found");
      }
    } catch (err) {
      setMemberStatus("⚠️ Connection error");
    }
    setGroupForm({ ...groupForm, newMember: "" });
    setTimeout(() => setMemberStatus(""), 3000);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name || addedMembers.length === 0) {
      alert("Please provide a name and at least one member.");
      return;
    }
    const memberIdentifiers = addedMembers.map((m) => m.email || m.mobile);
    try {
      await createGroup({ name: groupForm.name, membersIdentifiers: memberIdentifiers });
      setGroupForm({ name: "", newMember: "" });
      setAddedMembers([]);
      fetchGroups();
    } catch (err) {
      alert("Failed to create group.");
    }
  };

  const loadGroup = async (group) => {
    setLoading(true);
    setSelectedGroup(group);
    try {
      const exp = await getGroupExpenses(group._id);
      const settle = await getSettlement(group._id);
      setExpenses(exp);
      setSettlements(settle.settlements || []);

      const spent = {};
      group.members.forEach((m) => (spent[m._id] = 0));
      exp.forEach((e) => {
        if (e.paidBy?._id) spent[e.paidBy._id] += Number(e.amount);
      });
      setTotals(spent);
    } catch (err) {
      console.error("Error loading group details", err);
    }
    setLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.paidBy) return;
    try {
      await addExpense({
        groupId: selectedGroup._id,
        description: expenseForm.description,
        amount: expenseForm.amount,
        paidBy: expenseForm.paidBy,
      });
      setExpenseForm({ description: "", amount: "", paidBy: "" });
      loadGroup(selectedGroup);
    } catch (err) {
      alert("Error adding expense");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteGroup(groupId);
      setGroups(groups.filter((g) => g._id !== groupId));
      if (selectedGroup?._id === groupId) setSelectedGroup(null);
    } catch (err) {
      alert("Not authorized to delete this group.");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortOption === "name") return a.paidBy.name.localeCompare(b.paidBy.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans pt-28 md:pt-32 pb-24">

      <div className="max-w-7xl mx-auto px-6 mt-12">

        {/* --- HERO / CREATE GROUP SECTION --- */}
        <section className="bg-gradient-to-b from-slate-900/50 to-slate-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="max-w-2xl mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Create a <span className="text-indigo-500 italic">Financial Circle.</span></h1>
            <p className="text-slate-500 text-lg">Add members and start tracking shared expenses with pro-level accuracy.</p>
          </div>

          <form className="grid lg:grid-cols-12 gap-5 items-end">
            <div className="lg:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Circle Name</label>
              <input
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                className="w-full bg-slate-800/30 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="Ex: Weekend Getaway"
              />
            </div>
            <div className="lg:col-span-5 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Invite Members</label>
              <div className="relative">
                <input
                  value={groupForm.newMember}
                  onChange={(e) => setGroupForm({ ...groupForm, newMember: e.target.value })}
                  className="w-full bg-slate-800/30 border border-white/10 rounded-2xl pl-5 pr-14 py-4 focus:ring-2 ring-indigo-500/20 outline-none transition-all text-white placeholder:text-slate-600"
                  placeholder="Email or Mobile"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition shadow-lg group"
                >
                  <UserPlus className="w-5 h-5 text-white group-hover:scale-110 transition" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <button
                onClick={handleCreateGroup}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 active:scale-[0.98]"
              >
                Create Circle
              </button>
            </div>
          </form>

          {memberStatus && <p className="mt-3 text-xs font-bold text-indigo-400 ml-1 animate-pulse">{memberStatus}</p>}

          {addedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white/5">
              {addedMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-2 bg-indigo-500/5 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-bold text-indigo-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] uppercase">{m.name[0]}</div>
                  {m.name}
                  <X className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => setAddedMembers(addedMembers.filter((_, idx) => idx !== i))} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- GROUPS GRID --- */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-indigo-500 w-5 h-5" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Circles</h2>
          </div>
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{groups.length} Groups Total</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
          {groups.map((g) => (
            <div
              key={g._id}
              onClick={() => loadGroup(g)}
              className={`relative group p-7 rounded-[2.2rem] border transition-all duration-500 cursor-pointer overflow-hidden
                  ${selectedGroup?._id === g._id
                  ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-500/30 -translate-y-2'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/80'}`}
            >
              {selectedGroup?._id === g._id && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}

              <div className="flex justify-between items-start mb-12">
                <div className={`p-3 rounded-2xl ${selectedGroup?._id === g._id ? 'bg-white/20' : 'bg-slate-800'}`}>
                  <Users className={`w-6 h-6 ${selectedGroup?._id === g._id ? 'text-white' : 'text-indigo-400'}`} />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g._id); }}
                  className={`p-2 rounded-lg transition-colors ${selectedGroup?._id === g._id ? 'text-indigo-200 hover:bg-white/10' : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className={`text-xl font-bold mb-1 truncate ${selectedGroup?._id === g._id ? 'text-white' : 'text-slate-100'}`}>{g.name}</h3>
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-bold uppercase tracking-wider ${selectedGroup?._id === g._id ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {g.members.length} Members
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- SELECTED GROUP DETAIL VIEW --- */}
        {selectedGroup && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">

            {/* Header / Stats Bar */}
            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl">🌍</div>
                <div>
                  <h2 className="text-3xl font-black text-white leading-none">{selectedGroup.name}</h2>
                  <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Updated just now
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {selectedGroup.members.map(m => (
                  <div key={m._id} title={m.name} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center text-xs font-black text-indigo-400 hover:border-indigo-500 transition-colors cursor-help">
                    {m.name[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">

              {/* LEFT COLUMN: SETTLEMENTS & FORM */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-12">

                {/* ADD EXPENSE (GLASS) */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-500 bg-indigo-500/10 rounded-full p-1" /> Record Expense
                  </h3>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <input
                      placeholder="Description (Dinner, Uber...)"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="Amount"
                        type="number"
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        required
                      />
                      <select
                        className="bg-slate-950 border border-white/5 rounded-2xl px-3 text-xs font-bold text-slate-400 outline-none appearance-none cursor-pointer hover:border-white/20 transition-all"
                        value={expenseForm.paidBy}
                        onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                        required
                      >
                        <option value="">Paid By</option>
                        {selectedGroup.members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                      </select>
                    </div>
                    <button className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-black/20 mt-2 flex items-center justify-center gap-2">
                      Push to Ledger <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* SETTLEMENT CARD (REMIUM RESPONSIVE) */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 sm:p-8 shadow-2xl group transition-all duration-500">

                  {/* Dynamic Background Elements */}
                  <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                  <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/20 rounded-full blur-2xl"></div>

                  {/* Header */}
                  <div className="flex justify-between items-center mb-10 relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-white font-black flex items-center gap-3 uppercase tracking-wider text-sm sm:text-base">
                        <span className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-lg rounded-xl">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </span>
                        Clearance Plan
                      </h3>
                      <p className="text-indigo-200/60 text-[10px] font-bold uppercase tracking-[0.2em] ml-11">Optimization Active</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-2xl backdrop-blur-md border border-white/10">
                      <Wallet className="text-white w-5 h-5" />
                    </div>
                  </div>

                  {/* Settlements List */}
                  <div className="space-y-3 relative z-10">
                    {settlements.length > 0 ? (
                      settlements.map((s, i) => (
                        <div
                          key={i}
                          className="group/item relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 flex items-center justify-between transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                        >
                          {/* Debtor */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1 opacity-70">To Pay</span>
                            <span className="font-bold text-white text-xs sm:text-sm truncate pr-2">
                              {selectedGroup.members.find(m => m._id === s.from)?.name}
                            </span>
                          </div>

                          {/* Amount Bridge */}
                          <div className="flex flex-col items-center shrink-0 px-4">
                            <div className="px-3 py-1 rounded-full bg-white text-indigo-700 text-xs sm:text-sm font-black shadow-xl shadow-indigo-900/20 mb-2">
                              ₹{s.amount.toLocaleString('en-IN')}
                            </div>
                            <div className="relative w-12 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent">
                              <ArrowRight className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-3 h-3 text-white/60 group-hover/item:left-[70%] transition-all duration-500" />
                            </div>
                          </div>

                          {/* Receiver */}
                          <div className="flex flex-col text-right min-w-0 flex-1">
                            <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-1 opacity-70">To Receive</span>
                            <span className="font-bold text-white text-xs sm:text-sm truncate pl-2">
                              {selectedGroup.members.find(m => m._id === s.to)?.name}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Empty State */
                      <div className="flex flex-col items-center justify-center py-12 px-6 bg-black/10 rounded-[2rem] border border-dashed border-white/20">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                          <span className="text-xl">✨</span>
                        </div>
                        <p className="text-white font-bold text-sm tracking-tight text-center">All Debts Settled</p>
                        <p className="text-indigo-200/40 text-[10px] uppercase font-black tracking-widest mt-1">Perfect Balance Achieved</p>
                      </div>
                    )}
                  </div>

                  {/* Decorative Label */}
                  <div className="absolute top-4 right-8 text-[40px] font-black text-white/[0.03] italic pointer-events-none select-none">
                    SETTLE
                  </div>
                </div>

                {/* Summary Totals Section */}
                <div className="mt-12 px-2">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                      Individual Contributions
                    </h5>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                  </div>

                  {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                    {selectedGroup.members.map((m) => {
                      const amount = totals[m._id] || 0;
                      const totalGroupSpent = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
                      const percentage = Math.min((amount / totalGroupSpent) * 100, 100);

                      return (
                        <div
                          key={m._id}
                          className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-white/5 p-6 transition-all duration-500 hover:bg-slate-900/60 hover:border-indigo-500/30 shadow-2xl"
                        >
                          {/* Animated Glow Effect on Hover */}
                          <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>

                          <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                {/* Avatar with Ring */}
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-white/10">
                                    {m.name[0].toUpperCase()}
                                  </div>
                                  {percentage > 50 && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest truncate max-w-[100px]">
                                  {m.name}
                                </span>
                              </div>

                              <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg">
                                {percentage.toFixed(0)}%
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Total Paid</p>
                                <h3 className="text-2xl font-black text-white tracking-tighter">
                                  ₹{amount.toLocaleString('en-IN')}
                                </h3>
                              </div>

                              {/* Responsive Progress Bar */}
                              <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Large decorative letter in background */}
                          <span className="absolute -bottom-4 -right-2 text-8xl font-black text-white/[0.02] pointer-events-none group-hover:text-indigo-500/[0.05] transition-colors duration-500">
                            {m.name[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>


              </div>

              {/* RIGHT COLUMN: TRANSACTION GRID */}
              <div className="lg:col-span-8">

                {/* Header for Logs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">Financial Logs</h3>
                    <p className="text-slate-500 text-sm mt-1">Dual-column transaction stream</p>
                  </div>
                  <div className="flex gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <button
                      onClick={() => setSortOption('date')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${sortOption === 'date' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Recent
                    </button>
                    <button
                      onClick={() => setSortOption('name')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${sortOption === 'name' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Member
                    </button>
                    <div className="px-2 flex items-center"><Filter className="w-3 h-3 text-slate-700" /></div>
                  </div>
                </div>

                {/* 2-COLUMN TRANSACTION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {sortedExpenses.length > 0 ? sortedExpenses.map((e) => (
                    <div
                      key={e._id}
                      className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:bg-slate-800/40 hover:border-indigo-500/40 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-[2rem]"></div>

                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600/20 transition-colors">
                          <Receipt className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-white tracking-tighter">₹{e.amount}</span>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">Authorized</p>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-100 text-lg leading-snug line-clamp-1 mb-4">{e.description}</h4>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-indigo-500/20 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-400 ring-1 ring-indigo-500/30">
                            {e.paidBy.name[0].toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-slate-400 truncate w-24">
                            {e.paidBy.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-tighter flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(e.createdAt)}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-24 text-center bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[3rem]">
                      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📭</div>
                      <h4 className="text-xl font-bold text-white mb-2">The ledger is empty</h4>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">Start by adding your first group expense above to see the magic happen.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}