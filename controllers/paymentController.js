import { initializePayment } from "../services/paystackService.js";

import axios from "axios";
import User from "../models/User.js";

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: "Missing payment reference" });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const data = response.data.data;

    if (data.status === "success") {
      const userId = data.metadata?.userId;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          subscriptionStatus: "active"
        });
      }

      return res.json({
        message: "Payment successful, premium activated"
      });
    }

    res.status(400).json({ message: "Payment not successful" });

  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
};

// One-off payment (₦5000 flat, no recurring billing)
export const startPayment = async (req, res) => {
  try {
    const user = req.user; // full Mongoose doc, thanks to authUser
    const email = req.body.email || user.email;

    const payment = await initializePayment(email, 5000, user._id);

    res.json({
      authorization_url: payment.authorization_url
    });

  } catch (err) {
    console.error("START PAYMENT ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};

// Recurring monthly subscription via a Paystack plan
// Must match your Paystack plan's amount exactly (in kobo, so ₦5,000 = 500000).
// Paystack's /transaction/initialize requires "amount" even when a plan is
// also supplied — leaving it out is what produces "Invalid amount sent".
const PRO_PLAN_AMOUNT_KOBO = 5000 * 100;

// ---------------- LAUNCH DISCOUNT ----------------
// A time-and-quantity-limited launch price. Active while BOTH:
//   1. today is before LAUNCH_OFFER_ENDS_AT, and
//   2. fewer than LAUNCH_OFFER_MAX_REDEMPTIONS people have used it
// Requires a SEPARATE Paystack Plan created at the discounted amount —
// see PAYSTACK_PLAN_CODE_LAUNCH in your .env / Render environment.
const LAUNCH_OFFER_AMOUNT_KOBO = 2500 * 100;
const LAUNCH_OFFER_MAX_REDEMPTIONS = 100;
// Defaults to 30 days from server start if not set in env — always set
// LAUNCH_OFFER_ENDS_AT explicitly in Render for a real launch.
const LAUNCH_OFFER_ENDS_AT = process.env.LAUNCH_OFFER_ENDS_AT
  ? new Date(process.env.LAUNCH_OFFER_ENDS_AT)
  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const getLaunchOfferStatus = async (req, res) => {
  try {
    const redemptions = await User.countDocuments({ usedLaunchOffer: true });
    const spotsRemaining = Math.max(0, LAUNCH_OFFER_MAX_REDEMPTIONS - redemptions);
    const timeActive = Date.now() < LAUNCH_OFFER_ENDS_AT.getTime();
    const active = Boolean(process.env.PAYSTACK_PLAN_CODE_LAUNCH) && timeActive && spotsRemaining > 0;

    res.json({
      active,
      price: LAUNCH_OFFER_AMOUNT_KOBO / 100,
      regularPrice: PRO_PLAN_AMOUNT_KOBO / 100,
      spotsRemaining,
      endsAt: LAUNCH_OFFER_ENDS_AT
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const startSubscription = async (req, res) => {
  try {
    const user = req.user;
    const email = req.body.email || user.email;

    // Decide launch price vs regular price server-side — never trust a
    // price the client claims, since that's trivially fakeable.
    const redemptions = await User.countDocuments({ usedLaunchOffer: true });
    const offerLive =
      Boolean(process.env.PAYSTACK_PLAN_CODE_LAUNCH) &&
      Date.now() < LAUNCH_OFFER_ENDS_AT.getTime() &&
      redemptions < LAUNCH_OFFER_MAX_REDEMPTIONS;

    const useLaunchPrice = offerLive && !user.usedLaunchOffer;

    const planCode = useLaunchPrice
      ? process.env.PAYSTACK_PLAN_CODE_LAUNCH
      : process.env.PAYSTACK_PLAN_CODE;

    const amount = useLaunchPrice
      ? LAUNCH_OFFER_AMOUNT_KOBO
      : PRO_PLAN_AMOUNT_KOBO;

    if (!planCode) {
      return res.status(500).json({
        message: "Subscription plan is not configured on the server"
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        plan: planCode,
        metadata: {
          userId: user._id.toString()
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json({
      authorization_url: response.data.data.authorization_url
    });

  } catch (err) {
    console.error("PAYSTACK SUBSCRIBE ERROR:", err.response?.data || err.message);
    res.status(500).json({
      message: err.response?.data?.message || err.message
    });
  }
};


export const cancelSubscription = async (req, res) => {
  try {
    const user = req.user;

    let subscriptionCode = null;
    let emailToken = null;

    // Always ask Paystack directly which subscription is ACTUALLY active
    // right now, rather than trusting whatever code is cached locally.
    // A locally stored code can go stale (e.g. a user cancels, then
    // resubscribes — Paystack issues a brand-new subscription code, but
    // our DB may still be holding the old, now-dead one if the
    // subscription.create webhook didn't update it in time).
    let liveLookupFailed = false;

    try {
      const customerRes = await axios.get(
        `https://api.paystack.co/customer/${encodeURIComponent(user.email)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        }
      );

      const subs = customerRes.data?.data?.subscriptions || [];

      // Prefer a genuinely active subscription; if several exist, take
      // the most recently created one.
      const activeSubs = subs.filter(s => s.status === "active");
      const activeSub = activeSubs.length
        ? activeSubs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        : null;

      if (activeSub) {
        subscriptionCode = activeSub.subscription_code;
        emailToken = activeSub.email_token;
      }
    } catch (lookupErr) {
      liveLookupFailed = true;
      console.error("SUBSCRIPTION LOOKUP ERROR:", lookupErr.response?.data || lookupErr.message);
    }

    // Only fall back to the locally cached code if the live lookup itself
    // couldn't be performed (e.g. Paystack API unreachable) — not if it
    // succeeded and simply found nothing active.
    if (!subscriptionCode && liveLookupFailed) {
      subscriptionCode = user.subscriptionCode;
      emailToken = user.subscriptionEmailToken;
    }

    if (!subscriptionCode || !emailToken) {
      // Nothing active on Paystack's side — make sure our own record
      // reflects that too, so the UI doesn't keep showing "active".
      if (user.isPremium || user.subscriptionStatus === "active") {
        user.isPremium = false;
        user.subscriptionStatus = "cancelled";
        await user.save();
      }

      return res.status(400).json({
        message: "No active subscription found for this account"
      });
    }

    // backfill so future cancels can use this as a last-resort fallback
    user.subscriptionCode = subscriptionCode;
    user.subscriptionEmailToken = emailToken;

    // Paystack requires the subscription code AND its email token
    // (not the user's email address) to disable a subscription.
    await axios.post(
      "https://api.paystack.co/subscription/disable",
      {
        code: subscriptionCode,
        token: emailToken
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    user.isPremium = false;
    user.subscriptionStatus = "cancelled";

    await user.save();

    res.json({
      message: "Subscription cancelled successfully"
    });

  } catch (err) {
    console.error("CANCEL SUBSCRIPTION ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};


export const getBillingInfo = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      isPremium: user.isPremium,
      status: user.subscriptionStatus,
      subscriptionStatus: user.subscriptionStatus,
      nextBillingDate: user.nextBillingDate,
      email: user.email,
      plan: user.isPremium ? "Pro" : "Free"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
