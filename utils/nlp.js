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

export const hasWords = (text, words) => {
  return words.some((word) => text.includes(word));
};

