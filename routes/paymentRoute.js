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
  // capture the raw body alongside parsing it — needed for HMAC
  // signature verification, which must run over the exact original bytes
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }),
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

router.get(
  "/launch-offer",
  getLaunchOfferStatus
);

export default router;