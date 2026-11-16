import mongoose from "mongoose";

// One person's registration for one batch of a Program. Always tied to a
// StudentToolsNG account (the form creates one if needed), so accepting it
// can grant course access to that exact account straight away.
const programApplicationSchema = new mongoose.Schema({
  program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  batch: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  gender: { type: String, default: "" },
  ageRange: { type: String, default: "" },
  location: { type: String, default: "" },        // state / city
  educationLevel: { type: String, default: "" },
  occupation: { type: String, default: "" },
  hasLaptop: { type: String, default: "" },        // yes / no
  experience: { type: String, default: "" },       // coding experience
  howHeard: { type: String, default: "" },
  motivation: { type: String, default: "" },

  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  decidedAt: { type: Date, default: null },
  acceptedEmailAt: { type: Date, default: null },
  accessNote: { type: String, default: "" } // note on the CourseApprovals it created
}, { timestamps: true });

programApplicationSchema.index({ program: 1, batch: 1, user: 1 }, { unique: true });
programApplicationSchema.index({ program: 1, status: 1, createdAt: -1 });

export default mongoose.model("ProgramApplication", programApplicationSchema);
