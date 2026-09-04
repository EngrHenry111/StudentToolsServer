import express from "express";
import rateLimit from "express-rate-limit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  getMe,
  googleAuth,
  forgotPassword,
  resetPassword,
  getReferralLeaderboard,
  updateNotificationPreferences
} from "../controllers/authController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

// 🔒 SECURITY: without this, someone could script unlimited password
// guesses against any account. Limits each IP to 10 login/register
// attempts per 15 minutes — generous for real users, painful to brute-force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Please try again in a few minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

// Same limiter reused for password-reset requests specifically, so it
// can't be used to spam someone's inbox with reset emails either.
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again in a few minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/google", authLimiter, googleAuth);
router.post("/logout", logoutUser);
router.post("/refresh", authLimiter, refreshAccessToken);
router.get("/verify/:token", verifyEmail);
router.get("/me", authUser, getMe);

router.post("/forgot-password", resetLimiter, forgotPassword);
router.post("/reset-password/:token", resetLimiter, resetPassword);

router.get("/referral-leaderboard", getReferralLeaderboard);
router.put("/notification-preferences", authUser, updateNotificationPreferences);

export default router;
