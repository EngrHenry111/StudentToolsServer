import express from "express";

import {
  startPayment,
  verifyPayment,
  startSubscription,
  cancelSubscription,
  getBillingInfo,
  getLaunchOfferStatus
} from "../controllers/paymentController.js";

import authUser from "../middleware/authUser.js";

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

// NOTE: the /paystack/webhook route is intentionally NOT defined here.
// It's registered directly in server.js, before the global express.json()
// parser, because it needs the raw request body for Paystack signature
// verification — defining it here (after the global parser has already
// run) is what caused the earlier bug where a successful payment never
// activated the user's Pro access.

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

router.get(
  "/launch-offer",
  getLaunchOfferStatus
);

export default router;