import mongoose from "mongoose";

// One row per user: which device is currently playing their course videos.
// Enforces "one device at a time" so a single paid/approved account can't
// be shared and watched on several phones at once. A session counts as
// active while its device keeps sending heartbeats (see WATCH_STALE_MS).
const watchSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  deviceId: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "TechCourse" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "CourseLesson" },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("WatchSession", watchSessionSchema);
