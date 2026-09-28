import mongoose from "mongoose";

// A buyer's rating (+ optional comment) of a listing they purchased. One
// per buyer per listing — re-submitting edits it. Only ever written by
// marketplaceController.submitReview, which checks for a completed order.
const reviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
    index: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    default: "",
    trim: true,
    maxlength: 1000
  }

}, { timestamps: true });

reviewSchema.index({ listing: 1, buyer: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
