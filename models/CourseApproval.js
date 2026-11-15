import mongoose from "mongoose";

// An email the admin has approved for free, lifetime access (registered
// class students). Access is granted to the account with this email ONLY
// once that account has proven it owns the address — either Google
// Sign-In (already verified) or by opening the claim link we email them.
// Without that, anyone could register with a student's email and get in.
const courseApprovalSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "TechCourse", required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  note: { type: String, default: "" }, // e.g. "Cohort 1"

  claimToken: { type: String, required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  claimedAt: { type: Date, default: null },

  lastEmailedAt: { type: Date, default: null }
}, { timestamps: true });

courseApprovalSchema.index({ course: 1, email: 1 }, { unique: true });
courseApprovalSchema.index({ email: 1 });

export default mongoose.model("CourseApproval", courseApprovalSchema);
