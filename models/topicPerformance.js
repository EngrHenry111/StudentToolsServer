import mongoose from "mongoose";

const topicPerformanceSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "Guest"
  },

  subject: String,
  topic: String,

  attempts: {
    type: Number,
    default: 0
  },

  correct: {
    type: Number,
    default: 0
  },

  accuracy: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("TopicPerformance", topicPerformanceSchema);