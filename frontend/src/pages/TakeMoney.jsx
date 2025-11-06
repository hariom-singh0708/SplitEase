import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../services/transactionService";

export default function TakeMoney() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ counterpartyName: "", amount: "", note: "" });

  const fetchData = async () => {
    const data = await getTransactions("TAKE");
    setTransactions(data);
  };

  useEffect(() => { fetchData(); }, []);

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
    <>
      <div className="container py-4">
        <h3 className="fw-bold text-success mb-3">💰 Take Money</h3>

        <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="From (name)"
                value={form.counterpartyName}
                onChange={(e) => setForm({ ...form, counterpartyName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Amount ₹"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Note (optional)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="col-md-1 d-grid">
              <button className="btn btn-success">Add</button>
            </div>
          </div>
        </form>

        {transactions.map((tx) => (
          <TransactionCard key={tx._id} tx={tx} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
}
