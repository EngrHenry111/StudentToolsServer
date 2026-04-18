import mongoose from "mongoose";

const quizProgressSchema = new mongoose.Schema({
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

  topic: String,

}, { timestamps: true });

export default mongoose.model("QuizProgress", quizProgressSchema);