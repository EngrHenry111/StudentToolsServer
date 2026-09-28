import MarketplaceOrder from "../models/MarketplaceOrder.js";
import Listing from "../models/Listing.js";
import { verifyMarketplaceTransaction } from "./marketplacePaystackService.js";
import transporter from "../config/mailer.js";

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
    // Only reached on the one call that actually flipped the order, so
    // the buyer gets exactly one receipt however many confirmations race.
    sendPurchaseReceipt(order);
  }

  return order;
};

const CLIENT_URL = process.env.CLIENT_URL || "https://studenttoolsng.com";

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (str = "") => String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

// Receipt with a direct "open your document" link, so a buyer can always
// get back to what they paid for — even without remembering the site's
// My Purchases page. Fire-and-forget: never blocks or fails the unlock.
const sendPurchaseReceipt = (order) => {
  MarketplaceOrder.findById(order._id)
    .populate("buyer", "username email")
    .populate("listing", "title slug")
    .populate("publisher", "businessName slug")
    .then((o) => {
      if (!o?.buyer?.email || !o.listing || !o.publisher) return;

      const docUrl = `${CLIENT_URL}/publishers/${o.publisher.slug}/${o.listing.slug}`;
      const amount = `₦${(o.amount / 100).toLocaleString()}`;

      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: o.buyer.email,
        subject: `Your receipt: ${o.listing.title}`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;">
            <h2 style="color:#2563eb;">Payment confirmed ✅</h2>
            <p>Hi ${escapeHtml(o.buyer.username)}, thanks for your purchase on StudentToolsNG.</p>
            <table style="border-collapse:collapse;margin:12px 0;">
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Document</td><td><strong>${escapeHtml(o.listing.title)}</strong></td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Publisher</td><td>${escapeHtml(o.publisher.businessName)}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Amount</td><td>${amount}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Reference</td><td>${escapeHtml(o.paystackReference)}</td></tr>
            </table>
            <p><a href="${docUrl}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Open your document</a></p>
            <p style="color:#64748b;font-size:13px;">It stays unlocked on your account — log in any time and find it under <a href="${CLIENT_URL}/my-purchases">My Purchases</a>.</p>
          </div>
        `
      });
    })
    .catch((err) => console.error("PURCHASE RECEIPT EMAIL FAILED:", err.message));
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
