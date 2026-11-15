import mongoose from "mongoose";

// A one-time Paystack payment for lifetime access to a course.
const courseOrderSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "TechCourse", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // kobo, fixed at checkout time
  paystackReference: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paidAt: { type: Date, default: null }
}, { timestamps: true });

courseOrderSchema.index({ user: 1, course: 1, status: 1 });

export default mongoose.model("CourseOrder", courseOrderSchema);
