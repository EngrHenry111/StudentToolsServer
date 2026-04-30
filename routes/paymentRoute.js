import { startPayment, 
    verifyPayment, startSubscription, cancelSubscription, getBillingInfo
 } from "../controllers/paymentController";
import authUser from "../middleware/authUser";

import express from "express";
import { paystackWebhook } from "../controllers/paystackWebhook.js";

router.post("/paystack/start", authUser, startPayment);
router.get("/paystack/verify", verifyPayment);
router.post("/paystack/subscribe", authUser, startSubscription);

router.post(
  "/paystack/webhook",
  express.json(), // ⚠️ important
  paystackWebhook
);

router.post("/paystack/cancel", authUser, cancelSubscription);

router.get("/billing", authUser, getBillingInfo);


export default router;