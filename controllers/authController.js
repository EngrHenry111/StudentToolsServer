// 📍 /controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { generateVerificationToken } from "../services/emailService.js";
import transporter from "../config/mailer.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// ================================
// 🔐 TOKEN FUNCTIONS (PUT HERE)
// ================================

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short life
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
    
  );
};


// ================================
// 🟢 REGISTER
// ================================

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // basic but effective email format check — catches things like
    // "name@gmailcom" (missing dot) before they ever reach Paystack
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      username: username.trim(),
      email: cleanEmail,
      password: hashed,
      verificationToken
    });

//     console.log(`Verify link:
// http://localhost:5000/api/auth/verify/${verificationToken}`);

const baseUrl = process.env.BASE_URL || "http://localhost:5000";

console.log(`Verify link:
${baseUrl}/api/auth/verify/${verificationToken}`);

    res.json({
      message: "User registered. Check console for verification link"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 🔵 LOGIN
// ================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    // if (!user || !user.isVerified) 
    if (!user){
      return res.status(400).json({
        message: "Invalid credentials or email not verified"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔥 USE TOKEN FUNCTIONS HERE
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
        subscriptionStatus: user.subscriptionStatus
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 🔄 REFRESH TOKEN
// ================================

export const refreshAccessToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // verify token validity
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 🔥 security check (optional but powerful)
    if (decoded.id !== user._id.toString()) {
      return res.status(403).json({ message: "Token mismatch" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Token expired" });
  }
};


// ================================
// 📧 VERIFY EMAIL
// ================================

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 👤 GET CURRENT USER (used on app load / after login)
// ================================

export const getMe = async (req, res) => {
  try {
    const user = req.user; // attached by authUser middleware

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      isPremium: user.isPremium,
      subscriptionStatus: user.subscriptionStatus,
      nextBillingDate: user.nextBillingDate,
      aiQuizAttempts: user.aiQuizAttempts,
      authProvider: user.authProvider,
      campus: user.campus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(200).json({ message: "Already logged out" });
    }

    // 🔥 invalidate refresh token
    user.refreshToken = null;

    // optional extra security
    user.tokenVersion += 1;

    await user.save();

    res.json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 🔵 GOOGLE SIGN-IN / SIGN-UP
// ================================
// The frontend uses Google's official Identity Services library, which
// hands back a signed ID token — we verify that token's signature and
// authenticity directly with Google's own servers (never trust a token's
// contents without verifying it), then find-or-create the matching user.
//
// Same-email accounts are unified: if someone already has a password
// account under an email and later uses "Sign in with Google" with that
// same email, we attach googleId to their EXISTING account rather than
// creating a duplicate — so they always land on the same single account
// regardless of which method they use.

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body; // the ID token from Google Identity Services

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google Sign-In is not configured on the server" });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ message: "Invalid Google credential" });
    }

    const email = payload.email?.trim().toLowerCase();
    const googleId = payload.sub;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // brand-new user via Google — no password at all, that's fine,
      // the schema only requires a password when authProvider is "local"
      let username = (payload.name || email.split("@")[0]).replace(/\s+/g, "").slice(0, 20);

      // usernames must be unique — if taken, add a short random suffix
      const usernameTaken = await User.findOne({ username });
      if (usernameTaken) {
        username = `${username}${Math.floor(Math.random() * 10000)}`;
      }

      user = await User.create({
        username,
        email,
        googleId,
        authProvider: "google",
        isVerified: true // Google already verified this email address for us
      });
    } else if (!user.googleId) {
      // existing password-based account, same email — link it rather
      // than creating a second, duplicate account
      user.googleId = googleId;
      if (!user.isVerified) user.isVerified = true;
      await user.save();
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
        subscriptionStatus: user.subscriptionStatus
      }
    });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 🔑 FORGOT PASSWORD — request a reset link
// ================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // Deliberately return the same success message whether or not the
    // account exists — telling a stranger "that email isn't registered"
    // is a real information leak (confirms which emails have accounts).
    const genericResponse = {
      message: "If an account exists for that email, a password reset link has been sent."
    };

    if (!user) {
      return res.json(genericResponse);
    }

    if (user.authProvider === "google" && !user.password) {
      // Google-only account — there's no password to reset. Still return
      // the generic message (don't leak account existence/type), but
      // don't actually send a reset email since it wouldn't make sense.
      return res.json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const baseUrl = process.env.CLIENT_URL || "https://studenttoolsng.com";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your StudentToolsNG password",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;">
            <h2 style="color:#2563eb;">Reset your password</h2>
            <p>We received a request to reset your StudentToolsNG password. This link expires in 30 minutes.</p>
            <p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email — your password will not be changed.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error("PASSWORD RESET EMAIL FAILED:", emailErr);
      // don't reveal the email failure to the client — same generic response
    }

    res.json(genericResponse);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================================
// 🔑 RESET PASSWORD — consume the token, set a new password
// ================================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.authProvider = "local"; // they now have a real password, whichever way they signed up originally
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // invalidate any existing sessions for safety, since the password
    // just changed — force a fresh login everywhere
    user.refreshToken = null;
    user.tokenVersion += 1;

    await user.save();

    res.json({ message: "Password reset successfully. Please log in with your new password." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
