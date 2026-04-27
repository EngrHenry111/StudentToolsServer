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
    default: "ai"
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