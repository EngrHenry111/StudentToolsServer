import mongoose from "mongoose";

// Tracks an uploaded (or pasted) piece of course material that a
// student wants quizzed on. The extracted text is stored so quiz
// generation/regeneration never needs to re-parse the original file.
const materialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true
  },

  sourceType: {
    type: String,
    enum: ["pdf", "docx", "text"],
    required: true
  },

  extractedText: {
    type: String,
    required: true
  },

  // Optional context — not required, since not every student sets up a
  // campus profile before using this feature.
  subject: { type: String, default: null },
  courseCode: { type: String, default: null },

  status: {
    type: String,
    enum: ["processing", "ready", "failed"],
    default: "processing"
  },

  errorMessage: { type: String, default: null }

}, { timestamps: true });

export default mongoose.model("Material", materialSchema);
