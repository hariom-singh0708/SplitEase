import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { User, IndianRupee, FileText, PlusCircle, Inbox } from "lucide-react";

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
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
      }}
    >
      <div
        className="card border-0 shadow-lg p-4 rounded-4 mb-4"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h3 className="fw-bold text-warning mb-4 d-flex align-items-center gap-2">
          💸 <span>Give Money</span>
        </h3>

        {/* Add Transaction Form */}
        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">
              To (Name)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <User size={18} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter recipient name"
                value={form.counterpartyName}
                onChange={(e) =>
                  setForm({ ...form, counterpartyName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-secondary">
              Amount (₹)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <IndianRupee size={18} className="text-secondary" />
              </span>
              <input
                type="number"
                className="form-control border-start-0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">
              Note (optional)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FileText size={18} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Write a note..."
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-md-1 d-grid">
            <button
              className="btn btn-warning fw-semibold d-flex align-items-center justify-content-center gap-1 shadow-sm"
              type="submit"
            >
              <PlusCircle size={18} /> Add
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Section */}
      <div className="mt-4">
        <h5 className="fw-bold text-secondary mb-3">
          📋 Your Given Transactions
        </h5>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-warning"
              role="status"
            ></div>
          </div>
        ) : transactions.length === 0 ? (
          <div
            className="card border-0 text-center py-5 shadow-sm rounded-4"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Inbox size={40} className="text-muted mb-2" />
            <h6 className="text-muted fw-semibold mb-1">
              No transactions yet
            </h6>
            <p className="small text-secondary">
              Add your first record using the form above.
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="col-md-6 col-lg-4">
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
  );
}
