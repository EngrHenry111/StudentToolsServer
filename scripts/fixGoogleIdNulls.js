// FILE: /scripts/fixGoogleIdNulls.js
//
// One-time cleanup for the googleId sparse-unique-index bug (see the
// comment on the googleId field in models/User.js). Every local
// (non-Google) user created before that fix has googleId EXPLICITLY set
// to null, which a sparse index treats as a real, must-be-unique value —
// so at most one such user could ever exist at a time, and every
// registration after the first one crashed with:
//   E11000 duplicate key error ... googleId_1 dup key: { googleId: null }
//
// This just $unsets googleId on every document where it's exactly null.
// Safe and narrow: it never touches a document that has a real googleId
// string (an actual Google-linked account), only the placeholder null.
//
// Run with: node scripts/fixGoogleIdNulls.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to StudentToolsServer/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.\n");

  const affected = await User.countDocuments({ googleId: null });
  console.log(`Users with googleId explicitly set to null: ${affected}`);

  if (affected > 0) {
    const result = await User.updateMany(
      { googleId: null },
      { $unset: { googleId: "" } }
    );
    console.log(`Unset googleId on ${result.modifiedCount} document(s).`);
  } else {
    console.log("Nothing to clean up.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Cleanup script failed:", err);
  process.exit(1);
});
