export default function TransactionCard({ tx, onUpdate, onDelete }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">{tx.counterpartyName}</h5>
          <small className="text-muted">
            ₹{tx.amount} • {new Date(tx.date).toLocaleDateString()} • {tx.status}
          </small>
          {tx.note && <p className="mb-0 text-secondary">{tx.note}</p>}
        </div>
        <div>
          <button
            className={`btn btn-sm ${tx.status === "PAID" ? "btn-success" : "btn-outline-success"} me-2`}
            onClick={() => onUpdate(tx._id, { status: tx.status === "PAID" ? "PENDING" : "PAID" })}
          >
            {tx.status === "PAID" ? "Paid" : "Mark Paid"}
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(tx._id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
