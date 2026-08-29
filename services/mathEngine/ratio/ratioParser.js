// Previously required the exact literal phrase "divide N in ratio A:B"
// with nothing else — "Divide 100 in THE ratio 2:3" (the extra word
// "the", which any real person would naturally write) didn't match.
// Fix: allow optional words between the fixed anchors, and support a
// couple of common alternate phrasings.
export const parseRatio = (problem) => {
  const text = problem.toLowerCase();

  const patterns = [
    /divide\s+(\d+(?:\.\d+)?)\s+in\s+(?:the\s+)?ratio\s+(\d+):(\d+)/,
    /share\s+(\d+(?:\.\d+)?)\s+in\s+(?:the\s+)?ratio\s+(\d+):(\d+)/,
    /split\s+(\d+(?:\.\d+)?)\s+in\s+(?:the\s+)?ratio\s+(\d+):(\d+)/,
    /(\d+(?:\.\d+)?)\s+(?:is\s+)?(?:to\s+be\s+)?divided\s+in\s+(?:the\s+)?ratio\s+(\d+):(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        type: "divide",
        total: Number(match[1]),
        r1: Number(match[2]),
        r2: Number(match[3]),
      };
    }
  }

  return null;
};
