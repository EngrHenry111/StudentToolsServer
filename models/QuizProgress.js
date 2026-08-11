import mongoose from "mongoose";

const quizProgressSchema = new mongoose.Schema({
  // Free/guest quiz keeps using username only.
  // Authenticated (Pro) quiz routes also set userId so progress
  // is reliably isolated per account instead of merging into "Guest".
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    index: true
  },

  username: {
    type: String,
    default: "Guest",
  },

  score: {
    type: Number,
    default: 0,
  },

  streak: {
    type: Number,
    default: 0,
  },

  attempts: {
    type: Number,
    default: 0,
  },

  correct: {
    type: Number,
    default: 0,
  },

  xp: {
    type: Number,
    default: 0,
  },

  level: {
    type: Number,
    default: 1,
  },

  lastActiveDate: {
    type: Date,
    default: null,
  },

  topic: String,

}, { timestamps: true });

export default mongoose.model("QuizProgress", quizProgressSchema);
