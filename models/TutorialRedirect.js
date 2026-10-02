import mongoose from "mongoose";

// Old tutorial URLs that no longer resolve. When a tutorial is deleted (or
// merged into another), its slug is recorded here so /tutorial/<slug> can
// answer the way Google expects instead of a soft 404:
//   toPath set  → 301 to that path (content moved / merged)
//   toPath null → 410 Gone (content removed on purpose)
// A published tutorial with the same slug always wins over a redirect.
const tutorialRedirectSchema = new mongoose.Schema({
 fromSlug: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
 },
 toPath: {
  type: String,
  default: null
 },
 reason: String
}, { timestamps: true });

export default mongoose.model("TutorialRedirect", tutorialRedirectSchema);
