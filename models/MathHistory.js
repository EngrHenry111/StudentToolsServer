import mongoose from "mongoose";

const mathHistorySchema = new mongoose.Schema({
  problem: { type: String, required: true },
  topic: String,
  answer: String,
  steps: [String],
  user: { type: String }, // optional (for future auth system)
}, { timestamps: true });

export default mongoose.model("MathHistory", mathHistorySchema);