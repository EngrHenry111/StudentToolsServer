import mongoose from "mongoose";

// A single, deliberately singleton settings document (always looked up
// by the fixed key below, never by _id) — a minimal way to store one
// platform-wide value without a whole admin-settings subsystem.
//
// Existing publishers' Publisher.commissionRate is a frozen COPY taken
// from this default at registration time (see publisherController.js) —
// changing the default here on purpose never retroactively touches
// publishers who already registered.
const platformSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: "global",
    unique: true
  },

  // Percentage of every marketplace sale the platform keeps, applied to
  // new publishers only. Matches Paystack's own percentage_charge
  // semantics exactly (see marketplacePaystackService.js) — this value is
  // passed straight through as a new subaccount's percentage_charge.
  defaultCommissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 15
  }

}, { timestamps: true });

export const getPlatformSettings = async () => {
  let settings = await mongoose.models.PlatformSettings.findOne({ key: "global" });

  if (!settings) {
    settings = await mongoose.models.PlatformSettings.create({ key: "global" });
  }

  return settings;
};

export default mongoose.model("PlatformSettings", platformSettingsSchema);
