import { CheckCircle, Clock, Trash2, IndianRupee, FileText } from "lucide-react";

export default function TransactionCard({ tx, onUpdate, onDelete }) {
  const isPaid = tx.status === "PAID";

  return (
    <div
      className="card border-0 shadow-sm mb-3 rounded-4 p-3 transaction-card"
      style={{
        background: isPaid
          ? "linear-gradient(135deg, #e8f5e9, #ffffff)"
          : "linear-gradient(135deg, #fffbea, #ffffff)",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "scale(1.02)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
      <div className="d-flex justify-content-between align-items-center">
        {/* Left: Transaction Info */}
        <div>
          <h5 className="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
            {tx.counterpartyName}
            <span
              className={`badge rounded-pill fw-semibold ${
                isPaid ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"
              }`}
            >
              {isPaid ? (
                <>
                  <CheckCircle size={14} className="me-1" /> Paid
                </>
              ) : (
                <>
                  <Clock size={14} className="me-1" /> Pending
                </>
              )}
            </span>
          </h5>

          <div className="text-muted small mb-1 d-flex align-items-center gap-2">
            <IndianRupee size={14} className="text-success" />
            <span className="fw-semibold text-dark">₹{tx.amount}</span>
            <span>• {new Date(tx.date).toLocaleDateString()}</span>
          </div>

          {tx.note && (
            <div className="text-secondary small d-flex align-items-center gap-2">
              <FileText size={14} className="text-muted" />
              <span>{tx.note}</span>
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn btn-sm rounded-pill fw-semibold d-flex align-items-center gap-1 shadow-sm ${
              isPaid ? "btn-success text-white" : "btn-outline-success"
            }`}
            onClick={() =>
              onUpdate(tx._id, {
                status: isPaid ? "PENDING" : "PAID",
              })
            }
          >
            {isPaid ? (
              <>
                <CheckCircle size={16} /> Paid
              </>
            ) : (
              <>
                <CheckCircle size={16} /> Mark Paid
              </>
            )}
          </button>

          <button
            className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center gap-1 shadow-sm"
            onClick={() => onDelete(tx._id)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
