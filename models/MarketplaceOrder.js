import mongoose from "mongoose";

const marketplaceOrderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
    index: true
  },

  // Denormalized so publisher-side queries (their own orders view) never
  // need to populate through Listing just to filter by ownership.
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
    index: true
  },

  amount: {
    type: Number,
    required: true
  },

  publisherAmount: {
    type: Number,
    required: true
  },

  platformCommission: {
    type: Number,
    required: true
  },

  paystackReference: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },

  purchasedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// A buyer can only ever unlock a given listing once — also relied on by
// the "does this user own this listing" access check.
marketplaceOrderSchema.index({ buyer: 1, listing: 1 });

export default mongoose.model("MarketplaceOrder", marketplaceOrderSchema);
