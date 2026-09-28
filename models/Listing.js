import mongoose from "mongoose";
import slugify from "slugify";

const listingSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  // Unique per publisher (not globally) — the public URL is
  // /publishers/:slug/:listingSlug, so the publisher's own slug already
  // disambiguates. Generated once at creation, never mutated afterwards.
  slug: {
    type: String,
    required: true
  },

  field: {
    type: String,
    required: true,
    trim: true
  },

  keywords: {
    type: [String],
    default: []
  },

  // Chapters 1 & 2 — shown to everyone, no gating. This is the real,
  // substantial content Google should index (see Task 4).
  previewContent: {
    type: String,
    required: true
  },

  // The complete document. The model layer doesn't restrict reads of
  // this field by itself — access control lives in the controller (see
  // marketplaceController.getListing), which only ever `.select()`s this
  // field in for a buyer with a completed order. Never trust a schema
  // field alone to keep something private.
  fullContent: {
    type: String,
    required: true
  },

  // Kobo, matching the convention already used for Paystack amounts
  // elsewhere in this codebase (see PRO_PLAN_AMOUNT_KOBO in
  // paymentController.js).
  price: {
    type: Number,
    required: true,
    min: 0
  },

  coverImageUrl: {
    type: String,
    default: null
  },

  status: {
    type: String,
    enum: ["draft", "published", "suspended"],
    default: "draft"
  },

  salesCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

listingSchema.index({ publisher: 1, slug: 1 }, { unique: true });

listingSchema.pre("save", async function () {
  if (this.isNew && this.title && !this.slug) {
    let candidate = slugify(this.title, { lower: true, strict: true });
    let suffix = 0;

    while (
      await mongoose.models.Listing.findOne({
        publisher: this.publisher,
        slug: suffix ? `${candidate}-${suffix}` : candidate
      })
    ) {
      suffix += 1;
    }

    this.slug = suffix ? `${candidate}-${suffix}` : candidate;
  }
});

export default mongoose.model("Listing", listingSchema);
