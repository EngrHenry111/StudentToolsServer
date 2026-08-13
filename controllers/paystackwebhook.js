import crypto from "crypto";
import User from "../models/User.js";

export const paystackWebhook = async (
  req,
  res
) => {

  try {

    // 🔒 SECURITY: verify this request genuinely came from Paystack before
    // trusting anything in it. Paystack signs every webhook with your
    // secret key (HMAC SHA512 over the raw request body) and sends the
    // result in the x-paystack-signature header. Without this check,
    // anyone who discovers this URL could POST a fake "payment succeeded"
    // event and grant themselves free Pro access.
    const signature = req.headers["x-paystack-signature"];

    const expectedSignature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest("hex");

    if (!signature || signature !== expectedSignature) {
      console.warn("⚠️  Rejected webhook request with invalid Paystack signature");
      return res.sendStatus(401);
    }

    const event = req.body;

    // subscription activated
    if (
      event.event === "subscription.create"
    ) {

      const userId =
        event.data.customer.metadata.userId;

      await User.findByIdAndUpdate(
        userId,
        {
          isPremium: true,
          subscriptionCode:
            event.data.subscription_code,
          subscriptionEmailToken:
            event.data.email_token,

          subscriptionStatus: "active",

          nextBillingDate:
            event.data.next_payment_date
        }
      );
    }

    // recurring charge succeeded — extend billing date, keep premium active
    if (event.event === "charge.success" && event.data.plan) {
      const userId = event.data.metadata?.userId;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          subscriptionStatus: "active"
        });
      }
    }

    // payment failed on a renewal — Paystack will retry; we don't revoke
    // access immediately, subscription.disable will fire if it ultimately fails
    if (event.event === "invoice.payment_failed") {
      // no-op for now — logged for visibility
      console.warn("Paystack renewal payment failed:", event.data?.subscription?.subscription_code);
    }

    // subscription cancelled
    if (
      event.event === "subscription.disable"
    ) {

      const subCode =
        event.data.subscription_code;

      await User.findOneAndUpdate(
        {
          subscriptionCode: subCode
        },
        {
          isPremium: false,
          subscriptionStatus: "cancelled"
        }
      );
    }

    res.sendStatus(200);

  } catch (err) {

    console.error(err);

    res.sendStatus(500);
  }
};