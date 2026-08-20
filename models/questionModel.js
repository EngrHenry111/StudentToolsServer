import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  question: String,
  options: [String],
  correctAnswer: String,
  explanation: String,
  difficulty: String,

  source: {
    type: String,
    default: "ai" // "ai" | "curated"
  },

  // Only meaningful when source === "curated" — which real exam body this
  // question is styled after, and optionally the year it's modeled on.
  examBody: {
    type: String,
    enum: ["WAEC", "JAMB", "NECO", null],
    default: null
  },

  year: {
    type: Number,
    default: null
  },

  usageCount: {
    type: Number,
    default: 0
  }
  ,

  xp: {
  type: Number,
  default: 0
},

level: {
  type: Number,
  default: 1
},

lastActiveDate: {
  type: Date,
  default: null
}

}, { timestamps: true });

export default mongoose.model("Question", questionSchema);