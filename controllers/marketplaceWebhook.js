import crypto from "crypto";
import MarketplaceOrder from "../models/MarketplaceOrder.js";
import { markOrderCompleted } from "../services/marketplaceOrderService.js";

// Separate from controllers/paystackwebhook.js on purpose (see
// marketplacePaystackService.js) — same signature-verification rigor,
// applied to marketplace one-time-purchase events instead of Pro's
// subscription events.
export const marketplaceWebhook = async (req, res) => {
  try {
    // 🔒 SECURITY: identical verification to the Pro webhook — never
    // trust a webhook body until its HMAC SHA512 signature (over the
    // RAW body) is confirmed to have been signed with our own secret key.
    // Uses PAYSTACK_MARKETPLACE_SECRET_KEY, not PAYSTACK_SECRET_KEY — the
    // marketplace's independent key, matching marketplacePaystackService.js.
    // A marketplace webhook is signed with the marketplace key, so
    // checking it against the Pro key would reject every real one.
    const signature = req.headers["x-paystack-signature"];

    const expectedSignature = crypto
      .createHmac("sha512", process.env.PAYSTACK_MARKETPLACE_SECRET_KEY)
      .update(req.rawBody)
      .digest("hex");

    if (!signature || signature !== expectedSignature) {
      console.warn("⚠️  Rejected marketplace webhook with invalid Paystack signature");
      return res.sendStatus(401);
    }

    const event = req.body;

    if (event.event === "charge.success" && event.data.metadata?.type === "marketplace") {
      const reference = event.data.reference;

      const order = await MarketplaceOrder.findOne({ paystackReference: reference });

      if (!order) {
        console.warn("Marketplace webhook for unknown reference:", reference);
        return res.sendStatus(200);
      }

      // Idempotent: markOrderCompleted only flips a not-yet-completed
      // order, so a redelivered event never double-counts salesCount.
      if (Number(event.data.amount) === order.amount) {
        await markOrderCompleted(reference);
      }
    }

    if (event.event === "charge.failed" && event.data.metadata?.type === "marketplace") {
      await MarketplaceOrder.findOneAndUpdate(
        { paystackReference: event.data.reference, status: "pending" },
        { status: "failed" }
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("MARKETPLACE WEBHOOK ERROR:", err);
    res.sendStatus(500);
  }
};
