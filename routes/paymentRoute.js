import express from "express";

import {
  startPayment,
  verifyPayment,
  startSubscription,
  cancelSubscription,
  getBillingInfo
} from "../controllers/paymentController.js";

import authUser from "../middleware/authUser.js";

import { paystackWebhook } from "../controllers/paystackwebhook.js";

const router = express.Router();

router.post(
  "/paystack/start",
  authUser,
  startPayment
);

router.get(
  "/paystack/verify",
  verifyPayment
);

router.post(
  "/paystack/subscribe",
  authUser,
  startSubscription
);

router.post(
  "/paystack/webhook",
  express.json(),
  paystackWebhook
);

router.post(
  "/paystack/cancel",
  authUser,
  cancelSubscription
);

router.get(
  "/billing",
  authUser,
  getBillingInfo
);

export default router;