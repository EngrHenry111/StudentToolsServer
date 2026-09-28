import MarketplaceOrder from "../models/MarketplaceOrder.js";
import Listing from "../models/Listing.js";
import { verifyMarketplaceTransaction } from "./marketplacePaystackService.js";

// Single place an order ever flips to "completed" — shared by the
// webhook(s) and the verify-on-return fallback below. The status filter
// makes the flip atomic, so a webhook and a verify racing on the same
// reference can never both increment salesCount.
export const markOrderCompleted = async (reference) => {
  const order = await MarketplaceOrder.findOneAndUpdate(
    { paystackReference: reference, status: { $ne: "completed" } },
    { status: "completed", purchasedAt: new Date() },
    { new: true }
  );

  if (order) {
    await Listing.findByIdAndUpdate(order.listing, { $inc: { salesCount: 1 } });
  }

  return order;
};

// Asks Paystack directly whether this order was paid. This is what makes
// unlocking independent of the webhook: the buyer lands back on the
// listing page, the page asks for the listing, and the server confirms
// any pending order right then — even if the webhook never arrives
// (wrong webhook URL on the Paystack dashboard, Render cold start, etc.).
export const confirmOrderWithPaystack = async (order) => {
  if (order.status === "completed") return true;

  let tx;
  try {
    tx = await verifyMarketplaceTransaction(order.paystackReference);
  } catch (err) {
    console.error("VERIFY MARKETPLACE TRANSACTION ERROR:", err.response?.data || err.message);
    return false;
  }

  // Amount check: never unlock on a successful charge for a different
  // amount than this order was created for.
  if (tx?.status === "success" && Number(tx.amount) === order.amount) {
    await markOrderCompleted(order.paystackReference);
    return true;
  }

  if (tx?.status === "failed") {
    await MarketplaceOrder.updateOne({ _id: order._id, status: "pending" }, { status: "failed" });
  }

  return false;
};

// The one "does this buyer own this listing" check. Looks for a completed
// order first; failing that, verifies the buyer's recent pending orders
// with Paystack (covers the buyer returning before/without the webhook).
export const findOwnedOrder = async (buyerId, listingId) => {
  const completed = await MarketplaceOrder.findOne({
    buyer: buyerId,
    listing: listingId,
    status: "completed"
  });
  if (completed) return completed;

  const pending = await MarketplaceOrder.find({
    buyer: buyerId,
    listing: listingId,
    status: "pending",
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  })
    .sort({ createdAt: -1 })
    .limit(3);

  for (const order of pending) {
    if (await confirmOrderWithPaystack(order)) {
      return MarketplaceOrder.findById(order._id);
    }
  }

  return null;
};
