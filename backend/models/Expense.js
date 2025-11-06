import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },
    description: { type: String, trim: true, maxlength: 240 },
    amount: { type: Number, required: true, min: [0, "Amount must be positive"] },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // default: all group members if not specified (controller)
    // Optional: keep computed shares for audit (not required to compute balances)
    shares: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        share: { type: Number, required: true, min: 0 }
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
