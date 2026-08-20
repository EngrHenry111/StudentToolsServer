// FILE: /scripts/seedCuratedQuestions.js
//
// Loads data/curatedQuestions.js into the Question collection.
// Safe to re-run any time you add more questions to that file —
// it skips any question that already exists (matched on the exact
// question text + subject) instead of creating duplicates.
//
// Run with:  node scripts/seedCuratedQuestions.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Question from "../models/questionModel.js";
import { curatedQuestions } from "../data/curatedQuestions.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  let inserted = 0;
  let skipped = 0;

  for (const q of curatedQuestions) {
    const exists = await Question.findOne({
      subject: q.subject,
      question: q.question
    });

    if (exists) {
      skipped++;
      continue;
    }

    await Question.create({
      ...q,
      source: "curated"
    });
    inserted++;
  }

  console.log(`Done. Inserted: ${inserted}, skipped (already existed): ${skipped}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
