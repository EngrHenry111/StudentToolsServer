import mongoose from "mongoose";
import slugify from "slugify";

// A publisher's marketplace workspace. One per user account — enforced
// below via `unique: true` on `user`, not just checked in the controller,
// so a duplicate can never slip in even under a race condition.
const publisherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true
  },

  businessName: {
    type: String,
    required: true,
    trim: true
  },

  // URL-safe, used for the public storefront path (/publishers/:slug).
  // Generated once from businessName at creation — see the pre-save hook
  // below. Deliberately never regenerated afterwards: the same lesson
  // learned from the tutorial slug bug (regenerating on every save
  // eventually broke canonical URLs there).
  slug: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    default: ""
  },

  logoUrl: {
    type: String,
    default: null
  },

  // Bank details captured at onboarding. accountName is never typed by
  // the user — it comes back from Paystack's Resolve Account Number call,
  // so a publisher can't claim to own an account that isn't theirs.
  bankName: { type: String, required: true },
  bankCode: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },

  paystackSubaccountCode: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active"
  },

  // Frozen at registration time from the platform default that existed
  // then (see PlatformSettings + Task 2). Deliberately NOT re-read from
  // the global default on every use — an existing publisher's rate must
  // never move just because the admin changes the default later, since
  // it also has to match the percentage_charge already fixed on their
  // live Paystack subaccount.
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }

}, { timestamps: true });

publisherSchema.pre("save", async function () {
  if (this.isNew && this.businessName && !this.slug) {
    let candidate = slugify(this.businessName, { lower: true, strict: true });
    let suffix = 0;

    // Guard against a collision with another publisher's slug (two
    // businesses with the same/similar name) without ever mutating an
    // existing publisher's slug — only ever runs on first creation.
    while (await mongoose.models.Publisher.findOne({ slug: suffix ? `${candidate}-${suffix}` : candidate })) {
      suffix += 1;
    }

    this.slug = suffix ? `${candidate}-${suffix}` : candidate;
  }
});

export default mongoose.model("Publisher", publisherSchema);
