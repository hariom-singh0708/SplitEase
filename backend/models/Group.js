import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }]
  },
  { timestamps: true }
);

groupSchema.index({ name: 1, createdBy: 1 });

export default mongoose.model("Group", groupSchema);
