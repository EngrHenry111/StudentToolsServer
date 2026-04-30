import User from "../models/User.js";

export const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    // ✅ subscription activated
    // if (event.event === "subscription.create") {
    //   const userId = event.data.customer.metadata.userId;

    //   await User.findByIdAndUpdate(userId, {
    //     isPremium: true,
    //     subscriptionCode: event.data.subscription_code
    //   });
    // }

    if (event.event === "subscription.create") {
  const userId = event.data.customer.metadata.userId;

  await User.findByIdAndUpdate(userId, {
    isPremium: true,
    subscriptionCode: event.data.subscription_code,
    subscriptionStatus: "active",
    nextBillingDate: event.data.next_payment_date
  });
}

if (event.event === "subscription.disable") {
  const subCode = event.data.subscription_code;

  await User.findOneAndUpdate(
    { subscriptionCode: subCode },
    {
      isPremium: false,
      subscriptionStatus: "cancelled"
    }
  );
}

    // ❌ subscription disabled
    if (event.event === "subscription.disable") {
      const subCode = event.data.subscription_code;

      await User.findOneAndUpdate(
        { subscriptionCode: subCode },
        { isPremium: false }
      );
    }
    

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};