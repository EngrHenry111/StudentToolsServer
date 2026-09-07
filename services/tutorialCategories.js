// Taxonomy for the tutorial/blog section.
// Mirror of StudentToolsClient/src/utils/tutorialCategories.js — keep in sync.
//
// CATEGORY: closed set (validated on create/update).
// TOPIC:    open-ended; only has to normalise to a clean kebab-case slug.
//           The per-category lists are editor suggestions, not a gate.

import { topicBank } from "./topicBank.js";

export const tutorialCategoryLabels = {
  physics: "Physics",
  mathematics: "Mathematics",
  chemistry: "Chemistry",
  biology: "Biology",
  programming: "Programming"
};

export const tutorialCategoryList = Object.keys(tutorialCategoryLabels);

// Editor autocomplete suggestions only (not a validation whitelist).
export const topicSuggestions = {
  physics: [
    "Mechanics", "Motion", "Newton's Laws", "Work and Energy", "Waves",
    "Electricity", "Magnetism", "Heat and Thermodynamics", "Optics",
    "Pressure", "Gravitation"
  ],
  mathematics: [...topicBank.mathematics],
  chemistry: [...topicBank.chemistry],
  biology: [...topicBank.biology],
  programming: [
    "JavaScript", "Python", "React", "Node.js", "HTML and CSS",
    "Databases", "Data Structures", "Algorithms", "Git and GitHub", "APIs"
  ]
};

// Matches slugify's "strict" output.
export const topicSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isValidTutorialCategory = (category) =>
  tutorialCategoryList.includes(String(category || "").toLowerCase());

// A clean topic is simply a non-empty kebab-case slug.
export const isCleanTopicSlug = (topic) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(topic || ""));
