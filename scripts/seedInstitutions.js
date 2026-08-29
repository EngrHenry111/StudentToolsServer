// FILE: /scripts/seedInstitutions.js
//
// Loads real institution data into the database. Safe to re-run — it
// upserts by slug, so re-running just updates the existing Miva entry
// instead of creating duplicates. Add more institutions to the array
// below any time; the platform was built to support many, not just one.
//
// Run with: node scripts/seedInstitutions.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Institution from "../models/Institution.js";

// Real, looked-up (not guessed) Miva Open University structure as of
// this writing. Admin-editable afterward — this is just the starting
// seed, not a permanent hardcoded source of truth.
const institutions = [
  {
    name: "Miva Open University",
    slug: "miva",
    schools: [
      {
        name: "School of Computing",
        programmes: [
          "Computer Science",
          "Cybersecurity",
          "Cloud Computing",
          "Data Science",
          "Software Engineering",
          "Artificial Intelligence"
        ]
      },
      {
        name: "School of Management and Social Sciences",
        programmes: [
          "Business Management",
          "Economics",
          "Accounting",
          "Public Policy & Administration"
        ]
      },
      {
        name: "School of Communication and Media Studies",
        programmes: ["Mass Communication"]
      },
      {
        name: "School of Allied Health Sciences",
        programmes: ["Nursing Science", "Public Health"]
      },
      {
        name: "Postgraduate",
        programmes: [
          "MBA",
          "Master of Public Administration",
          "Master of Public Health",
          "Master of Information Technology"
        ]
      }
    ],
    active: true
  }
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  for (const inst of institutions) {
    await Institution.findOneAndUpdate(
      { slug: inst.slug },
      inst,
      { upsert: true, new: true }
    );
    console.log(`Upserted: ${inst.name}`);
  }

  console.log("Done.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
