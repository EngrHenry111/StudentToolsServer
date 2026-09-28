import MarketplaceOrder from "../models/MarketplaceOrder.js";
import Listing from "../models/Listing.js";
import { verifyMarketplaceTransaction } from "./marketplacePaystackService.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Single place an order ever flips to "completed" — shared by the
// webhook(s) and the verify-on-return fallback below. The status filter
// makes the flip atomic, so a webhook and a verify racing on the same
// reference can never both increment salesCount.
export const markOrderCompleted = async (reference) => {
  const order = await MarketplaceOrder.findOneAndUpdate(
    { paystackReference: reference, status: { $ne: "completed" } },
    { status: "completed", purchasedAt: new Date() },
    { returnDocument: "after" }
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

  // "failed", or a checkout the buyer walked away from over a day ago
  // (Paystack reports those as "abandoned") — stop showing it as Pending.
  const staleAbandoned =
    tx?.status === "abandoned" && Date.now() - new Date(order.createdAt).getTime() > ONE_DAY_MS;

  if (tx?.status === "failed" || staleAbandoned) {
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
    createdAt: { $gte: new Date(Date.now() - 7 * ONE_DAY_MS) }
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

// Brings a publisher's recent pending orders up to date with Paystack
// before their Orders page / dashboard is shown — otherwise an order only
// ever moved off "Pending" when the buyer reopened the listing or the
// webhook arrived. Bounded (last 7 days, 20 orders) and run in parallel
// so the page stays fast.
export const reconcilePendingOrders = async (filter) => {
  const pending = await MarketplaceOrder.find({
    ...filter,
    status: "pending",
    createdAt: { $gte: new Date(Date.now() - 7 * ONE_DAY_MS) }
  })
    .sort({ createdAt: -1 })
    .limit(20);

  await Promise.all(pending.map((order) => confirmOrderWithPaystack(order)));
};
