import mongoose from "mongoose";

// One recorded class. The video itself lives on Bunny Stream — we only
// keep its id; playback URLs are signed per request (see bunnyStreamService).
const courseLessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "TechCourse", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },

  // Free-text grouping shown in the lesson list, e.g. "Week 1 — HTML".
  module: { type: String, default: "" },
  order: { type: Number, default: 0 },

  bunnyVideoId: { type: String, default: null },
  // Mirrors Bunny's encoding state: uploading → processing → ready (or failed).
  videoStatus: {
    type: String,
    enum: ["awaiting_upload", "processing", "ready", "failed"],
    default: "awaiting_upload"
  },
  durationSeconds: { type: Number, default: 0 },

  // Watchable by anyone, used as a taster on the public course page.
  isFreePreview: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

courseLessonSchema.index({ course: 1, order: 1 });

export default mongoose.model("CourseLesson", courseLessonSchema);
