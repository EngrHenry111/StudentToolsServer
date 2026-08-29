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
    default: "ai" // "ai" | "curated" | "material"
  },

  // Only meaningful when source === "material" — links this question
  // back to the uploaded document it was generated from.
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
    default: null
  },

  // Only meaningful when source === "material" — which of the multiple
  // question formats this is (mcq, true_false, fill_blank, scenario),
  // and which underlying concept it drills, so several formats of the
  // SAME concept can be grouped/identified later if needed.
  questionFormat: {
    type: String,
    enum: ["mcq", "true_false", "fill_blank", "scenario", null],
    default: null
  },

  conceptTag: {
    type: String,
    default: null
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