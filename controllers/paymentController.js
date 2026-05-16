

import { initializePayment } from "../services/paystackService.js";

import axios from "axios";
import User from "../models/User.js";

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

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
      const userId = data.metadata.userId;

      await User.findByIdAndUpdate(userId, {
        isPremium: true
      });

      return res.json({
        message: "Payment successful, premium activated"
      });
    }

    res.status(400).json({ message: "Payment not successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const startPayment = async (req, res) => {
  try {
    const user = req.user;
    const { email } = req.body;

    const payment = await initializePayment(
      email,
      5000, // ₦5000
      user.id
    );

    res.json({
      authorization_url: payment.authorization_url
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const startSubscription = async (req, res) => {
  try {
    const user = req.user;
    const { email } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        plan: process.env.PAYSTACK_PLAN_CODE, // 🔥 important
        metadata: {
          userId: user.id
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
    res.status(500).json({ message: err.message });
  }
};



export const cancelSubscription = async (req, res) => {
  try {
    const user = req.user;

    if (!user.subscriptionCode) {
      return res.status(400).json({
        message: "No active subscription"
      });
    }

    // 🔥 Call Paystack to disable subscription
    await axios.post(
      "https://api.paystack.co/subscription/disable",
      {
        code: user.subscriptionCode,
        token: user.email // Paystack may require email/token
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    // 🔄 Update user locally
    user.isPremium = false;
    user.subscriptionStatus = "cancelled";

    await user.save();

    res.json({
      message: "Subscription cancelled successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBillingInfo = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      isPremium: user.isPremium,
      subscriptionStatus: user.subscriptionStatus,
      nextBillingDate: user.nextBillingDate,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};