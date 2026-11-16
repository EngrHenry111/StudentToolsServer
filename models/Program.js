import mongoose from "mongoose";

// A training programme people register for through a public link, e.g.
// "Bar Ime Okon Youth Tech Hub Training". It runs in batches: the admin
// opens registration, pauses it between batches, and closes it at the end.
//
// status:
//   draft  → not public (admin can preview)
//   open   → form accepts registrations; shown first on home page + menu
//   paused → page and menu link stay up, but the form says registration is
//            closed for now and will reopen (between batches)
//   closed → hidden from home page + menu; the link says the programme is over
const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },          // "Youth Tech Hub Training"
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // Shown above the title, e.g. "Bar Ime Okon". Change it per sponsor.
  sponsorName: { type: String, default: "", trim: true },
  sponsorLogoUrl: { type: String, default: "", trim: true },

  tagline: { type: String, default: "" },     // one line under the title
  description: { type: String, default: "" }, // what the training is about
  details: { type: String, default: "" },     // dates, venue, requirements (one per line)

  batch: { type: String, default: "Batch 1", trim: true },
  status: { type: String, enum: ["draft", "open", "paused", "closed"], default: "draft" },
  pausedMessage: { type: String, default: "" },

  // Accepted applicants get free access to these video courses.
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "TechCourse" }]
}, { timestamps: true });

programSchema.index({ status: 1, updatedAt: -1 });

export default mongoose.model("Program", programSchema);
