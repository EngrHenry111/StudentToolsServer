import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

// Extracts plain text from an uploaded file buffer. Returns { text, sourceType }.
// Throws a clear error for unsupported formats rather than failing silently.
export const extractTextFromFile = async (buffer, mimetype, originalname) => {
  const lowerName = (originalname || "").toLowerCase();

  if (mimetype === "application/pdf" || lowerName.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      // strip pdf-parse's own page-boundary markers (e.g. "-- 1 of 3 --")
      // so they don't pollute the text sent to the AI
      const cleanText = result.text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "").trim();
      return { text: cleanText, sourceType: "pdf" };
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, sourceType: "docx" };
  }

  if (mimetype === "text/plain" || lowerName.endsWith(".txt")) {
    return { text: buffer.toString("utf-8"), sourceType: "text" };
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF, DOCX, or plain text file (or paste your notes directly)."
  );
};

// Guards against genuinely empty/near-empty documents (a scanned image-only
// PDF with no real text layer, for instance) before wasting an AI call on
// something with nothing to actually quiz.
export const validateExtractedText = (text) => {
  const trimmed = (text || "").trim();

  if (trimmed.length < 200) {
    return {
      valid: false,
      message:
        "We couldn't find enough readable text in this document. If it's a scanned document/image-based PDF, try pasting the text directly instead."
    };
  }

  return { valid: true };
};
