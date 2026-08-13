import express from "express";
import rateLimit from "express-rate-limit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  getMe
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

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", authLimiter, refreshAccessToken);
router.get("/verify/:token", verifyEmail);
router.get("/me", authUser, getMe);

export default router;
