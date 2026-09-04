import mongoose from "mongoose";

// One document per user per calendar day. Deliberately simple counters
// rather than a full event log — missions only need "how many today",
// not a detailed history of every action.
const dailyMissionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  // Stored as "YYYY-MM-DD" (server date) rather than a Date object —
  // makes "find today's doc" a trivial exact-string match instead of
  // a date-range query, and sidesteps timezone edge cases for this
  // simple daily-reset use case.
  date: {
    type: String,
    required: true
  },

  questionsAnswered: { type: Number, default: 0 },
  quizzesCompleted: { type: Number, default: 0 },
  bestScorePercent: { type: Number, default: 0 },

  // Which mission IDs have already been auto-awarded today — prevents
  // re-awarding XP every time the condition re-evaluates as true.
  claimedMissions: [{ type: String }]

}, { timestamps: true });

dailyMissionLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyMissionLog", dailyMissionLogSchema);
