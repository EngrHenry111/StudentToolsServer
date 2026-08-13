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

export const startSubscription = async (req, res) => {
  try {
    const user = req.user;
    const email = req.body.email || user.email;

    if (!process.env.PAYSTACK_PLAN_CODE) {
      return res.status(500).json({
        message: "Subscription plan is not configured on the server"
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: PRO_PLAN_AMOUNT_KOBO,
        plan: process.env.PAYSTACK_PLAN_CODE,
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

    let subscriptionCode = user.subscriptionCode;
    let emailToken = user.subscriptionEmailToken;

    // Fallback: if the subscription.create webhook hasn't populated these
    // yet (can happen depending on webhook timing/order), look the
    // subscription up directly from Paystack using the customer's email
    // instead of failing outright.
    if (!subscriptionCode || !emailToken) {
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
        const activeSub = subs.find(s => s.status === "active") || subs[0];

        if (activeSub) {
          subscriptionCode = activeSub.subscription_code;
          emailToken = activeSub.email_token;

          user.subscriptionCode = subscriptionCode;
          user.subscriptionEmailToken = emailToken;
        }
      } catch (lookupErr) {
        console.error("SUBSCRIPTION LOOKUP ERROR:", lookupErr.response?.data || lookupErr.message);
      }
    }

    if (!subscriptionCode || !emailToken) {
      return res.status(400).json({
        message: "No active subscription found for this account"
      });
    }

    await axios.post(
      "https://api.paystack.co/subscription/disable",
      { code: subscriptionCode, token: emailToken },
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    user.isPremium = false;
    user.subscriptionStatus = "cancelled";
    await user.save();

    res.json({ message: "Subscription cancelled successfully" });

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
