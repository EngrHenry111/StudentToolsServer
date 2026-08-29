export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/[^a-z0-9.%\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const extractNumbers = (text) => {
  const matches = text.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
};

// Previously this used plain text.includes(word), which is substring
// matching — e.g. checking for "age" would also match "average" (which
// contains "age" as a substring), silently misrouting average-of-numbers
// problems to the age-word-problem solver. Now uses real word-boundary
// matching so "age" only matches the actual word "age", not "average".
export const hasWords = (text, words) => {
  return words.some((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escaped}\\b`, "i");
    return pattern.test(text);
  });
};
