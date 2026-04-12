// Clean input text
export const normalizeInput = (text) => {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
};

// Extract numbers from string
export const extractNumbers = (text) => {
  const matches = text.match(/\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
};

// Check if string contains keyword
export const contains = (text, keywords = []) => {
  return keywords.some((word) => text.includes(word));
};