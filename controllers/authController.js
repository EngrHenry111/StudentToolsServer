// 📍 /controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "../services/emailService.js";


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

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      username,
      email,
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

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
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
        username: user.username
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