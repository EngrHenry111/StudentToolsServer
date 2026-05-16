const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/kg|km\/h|m\/s²|m\/s\^2|n|cm|m/g, "")
    .replace(/[?,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export default normalizeText;