import express from "express";
import {
  getPublisherStorefront,
  getListingBySlug,
  initiatePurchase,
  getMyPurchases
} from "../controllers/marketplaceController.js";
import authUser from "../middleware/authUser.js";
import optionalAuthUser from "../middleware/optionalAuthUser.js";

const router = express.Router();

// NOTE: the marketplace webhook is NOT defined here — like the Pro
// webhook, it's registered directly in server.js, before the global
// express.json(), because it needs the raw request body to verify
// Paystack's signature.

// ---- Public storefront + listing pages (SEO-indexed, Task 4) ----
router.get("/publishers/:slug", getPublisherStorefront);
router.get("/publishers/:slug/:listingSlug", optionalAuthUser, getListingBySlug);

// ---- Authenticated purchase ----
router.post("/purchase", authUser, initiatePurchase);
router.get("/me/purchases", authUser, getMyPurchases);

export default router;
