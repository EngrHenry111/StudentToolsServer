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

  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("TechCourse", techCourseSchema);
