import mongoose from "mongoose";

const careerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  careerGoal: { type: String, required: true },
  currentSkills: [{ type: String }],
  interests: [{ type: String }],

  // Cached AI output — regenerated only when the student updates their
  // profile, not on every page visit, to avoid unnecessary AI calls for
  // something that doesn't change moment to moment.
  roadmap: {
    steps: [{ type: String }],
    recommendedSkills: [{ type: String }],
    recommendedProjects: [{ type: String }],
    generatedAt: { type: Date, default: null }
  }

}, { timestamps: true });

export default mongoose.model("CareerProfile", careerProfileSchema);
