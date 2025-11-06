import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    counterpartyName: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: [0, "Amount must be positive"] },
    type: { type: String, enum: ["TAKE", "GIVE"], required: true },
    status: { type: String, enum: ["PENDING", "PAID"], default: "PENDING", index: true },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
