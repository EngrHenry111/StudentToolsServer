import mongoose from "mongoose";

// A video course (e.g. Youth Tech Hub — Fullstack Web Development).
// Named TechCourse because models/Course.js is already the CGPA
// calculator's per-semester course row.
const techCourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  tagline: { type: String, default: "" },
  description: { type: String, default: "" },
  coverImageUrl: { type: String, default: "" },
  instructor: { type: String, default: "" },

  // One-time price for lifetime access, in KOBO (₦1 = 100). 0 = not for
  // sale yet (approved students only).
  price: { type: Number, default: 0, min: 0 },

  isPublished: { type: Boolean, default: false },

  // Live class (Google Meet / Zoom). The admin switches it on for each class
  // and off afterwards. The link is only ever sent to students who have
  // access, and only while active; publicCourse() never includes it.
  live: {
    active: { type: Boolean, default: false },
    url: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true }, // e.g. "Week 3: React hooks"
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null }
  }
}, { timestamps: true });

export default mongoose.model("TechCourse", techCourseSchema);
