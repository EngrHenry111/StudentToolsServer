import User from "../models/User.js";

export const paystackWebhook = async (
  req,
  res
) => {

  try {

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