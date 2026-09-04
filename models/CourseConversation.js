import mongoose from "mongoose";

// Persists a running conversation with the AI Course Tutor, scoped to
// one course (and optionally a specific topic within it) — unlike the
// original stateless AI Tutor, a student can come back and continue
// where they left off instead of every question starting from zero.
const courseConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  // Free-text, not tied to a rigid course catalog — matches the same
  // "lightweight now, deepen later" philosophy as Institution/Campus.
  // A student just types their actual course name; no admin setup
  // required before this feature is usable.
  courseName: {
    type: String,
    required: true
  },

  topic: {
    type: String,
    default: null
  },

  messages: [{
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

export default mongoose.model("CourseConversation", courseConversationSchema);
