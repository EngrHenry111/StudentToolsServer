import mongoose from "mongoose";

// Deliberately flat/lightweight — NOT a full Faculty→Department→
// Programme→Level→Semester hierarchy. This is enough to onboard Miva
// (and any future institution) without hardcoding anything, while
// staying simple enough to actually maintain as a solo developer. If
// a second or third institution's needs genuinely outgrow this shape,
// that's the signal to build the deeper hierarchy — not before.
const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  programmes: [{ type: String }]
}, { _id: false });

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String, default: null },
  schools: [schoolSchema],
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Institution", institutionSchema);
