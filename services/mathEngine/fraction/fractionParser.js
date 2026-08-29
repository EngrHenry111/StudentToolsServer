// Previously required an EXACT symbol-only pattern like "1/2+1/4" with
// no words at all — so a real sentence like "Add 1/2 and 1/4" (which
// has instruction words and "and" instead of a symbol) never matched.
// Fix: detect the operation from words too, and normalize "and" between
// two fractions into the actual operator symbol before matching.
const OPERATOR_WORDS = {
  "+": ["add", "plus", "sum of"],
  "-": ["subtract", "minus", "less"],
  "*": ["multiply", "times", "product of"],
  "/": ["divide", "divided by", "quotient of"],
};

const detectWordOperator = (text) => {
  for (const [symbol, words] of Object.entries(OPERATOR_WORDS)) {
    if (words.some((w) => text.includes(w))) return symbol;
  }
  return null;
};

export const parseFraction = (input) => {
  if (!input) return null;

  let text = input.toLowerCase();
  const wordOperator = detectWordOperator(text);

  text = text.replace(/\s/g, "");

  let operator;

  if (text.includes("×") || text.includes("*")) {
    operator = "*";
    text = text.replace("×", "*");
  } else if (text.includes("÷")) {
    operator = "/";
    text = text.replace("÷", "/DIV/");
  } else if (wordOperator) {
    // A word like "add"/"subtract" told us the operator — normalize the
    // connector between the two fractions ("and", or nothing) into the
    // real symbol so the regex below can find it.
    operator = wordOperator;
    const fracPattern = /(\d+\/\d+).*?(\d+\/\d+)/;
    const match = text.match(fracPattern);
    if (match) {
      text = `${match[1]}${operator}${match[2]}`;
    }
  } else if (text.includes("+")) {
    operator = "+";
  } else if (text.includes("-")) {
    operator = "-";
  } else if (text.includes("/")) {
    operator = "/";
  }

  if (text.includes("/DIV/")) {
    const parts = text.split("/DIV/");
    const left = parts[0].match(/(\d+)\/(\d+)/);
    const right = parts[1].match(/(\d+)\/(\d+)/);
    if (!left || !right) return null;

    return {
      a: Number(left[1]),
      b: Number(left[2]),
      operator: "/",
      c: Number(right[1]),
      d: Number(right[2]),
    };
  }

  // Extract two fractions and the operator between them, wherever they
  // land in the cleaned string — not requiring the ENTIRE string to be
  // exactly "a/b+c/d" with nothing else around it.
  const match = text.match(/(\d+)\/(\d+)\s*([+\-*])\s*(\d+)\/(\d+)/);

  if (!match) return null;

  return {
    a: Number(match[1]),
    b: Number(match[2]),
    operator: match[3],
    c: Number(match[4]),
    d: Number(match[5]),
  };
};
