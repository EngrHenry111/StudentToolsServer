import express from "express";
import {
  getBanks,
  registerPublisher,
  getMyProfile,
  getMyOverview,
  getMyOrders,
  adminGetSettings,
  adminUpdateSettings
} from "../controllers/publisherController.js";
import {
  createListing,
  getMyListings,
  getMyListingById,
  updateListing,
  deleteListing
} from "../controllers/listingController.js";
import authUser from "../middleware/authUser.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ---- Onboarding ----
router.get("/banks", authUser, getBanks);
router.post("/register", authUser, registerPublisher);

// ---- Workspace (owner-only, enforced inside each controller) ----
router.get("/me", authUser, getMyProfile);
router.get("/me/overview", authUser, getMyOverview);
router.get("/me/orders", authUser, getMyOrders);

router.post("/me/listings", authUser, upload.single("coverImage"), createListing);
router.get("/me/listings", authUser, getMyListings);
router.get("/me/listings/:id", authUser, getMyListingById);
router.put("/me/listings/:id", authUser, upload.single("coverImage"), updateListing);
router.delete("/me/listings/:id", authUser, deleteListing);

// ---- Admin: platform commission default (Task 2) ----
router.get("/admin/settings", adminAuth, adminGetSettings);
router.put("/admin/settings", adminAuth, adminUpdateSettings);

export default router;
