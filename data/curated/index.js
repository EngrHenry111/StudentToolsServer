// Expands the compact batch files in this folder into Question documents
// for data/curatedQuestions.js. To add a batch: write a file with the same
// { t, d, q, o, a, x } shape, add it to BATCHES, run
// scripts/checkCuratedQuestions.js, then scripts/seedCuratedQuestions.js.

import mathematics from "./jamb-mathematics.js";
import physics from "./jamb-physics.js";
import chemistry from "./jamb-chemistry.js";
import biology from "./jamb-biology.js";
import englishLanguage from "./jamb-english.js";
import mathematics2 from "./jamb-mathematics-2.js";
import physics2 from "./jamb-physics-2.js";
import chemistry2 from "./jamb-chemistry-2.js";
import biology2 from "./jamb-biology-2.js";
import englishLanguage2 from "./jamb-english-2.js";
import mathematics3 from "./jamb-mathematics-3.js";
import physics3 from "./jamb-physics-3.js";
import chemistry3 from "./jamb-chemistry-3.js";
import biology3 from "./jamb-biology-3.js";
import englishLanguage3 from "./jamb-english-3.js";
import waecMathematics from "./waec-mathematics.js";
import waecMathematics2 from "./waec-mathematics-2.js";
import waecPhysics from "./waec-physics.js";
import waecPhysics2 from "./waec-physics-2.js";
import waecChemistry from "./waec-chemistry.js";
import waecChemistry2 from "./waec-chemistry-2.js";
import waecBiology from "./waec-biology.js";
import waecBiology2 from "./waec-biology-2.js";
import waecEnglishLanguage from "./waec-english.js";
import waecEnglishLanguage2 from "./waec-english-2.js";

const BATCHES = [
  { examBody: "JAMB", subject: "mathematics", items: [...mathematics, ...mathematics2, ...mathematics3] },
  { examBody: "JAMB", subject: "physics", items: [...physics, ...physics2, ...physics3] },
  { examBody: "JAMB", subject: "chemistry", items: [...chemistry, ...chemistry2, ...chemistry3] },
  { examBody: "JAMB", subject: "biology", items: [...biology, ...biology2, ...biology3] },
  { examBody: "JAMB", subject: "englishLanguage", items: [...englishLanguage, ...englishLanguage2, ...englishLanguage3] },
  { examBody: "WAEC", subject: "mathematics", items: [...waecMathematics, ...waecMathematics2] },
  { examBody: "WAEC", subject: "physics", items: [...waecPhysics, ...waecPhysics2] },
  { examBody: "WAEC", subject: "chemistry", items: [...waecChemistry, ...waecChemistry2] },
  { examBody: "WAEC", subject: "biology", items: [...waecBiology, ...waecBiology2] },
  { examBody: "WAEC", subject: "englishLanguage", items: [...waecEnglishLanguage, ...waecEnglishLanguage2] }
];

export const batchQuestions = BATCHES.flatMap(({ examBody, subject, items }) =>
  items.map(({ t, d, q, o, a, x }) => ({
    subject,
    topic: t,
    examBody,
    difficulty: d || "medium",
    question: q,
    options: o,
    correctAnswer: o[a],
    explanation: x
  }))
);
