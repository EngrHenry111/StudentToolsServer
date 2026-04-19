export const parseFraction = (input) => {
  if (!input) return null;

  input = input.replace(/\s/g, "");

  let operator;

  if (input.includes("×") || input.includes("*")) {
    operator = "*";
    input = input.replace("×", "*");
  } else if (input.includes("÷")) {
    operator = "/";
    input = input.replace("÷", "/DIV/"); // 🔥 TEMP MARKER
  } else if (input.includes("+")) {
    operator = "+";
  } else if (input.includes("-")) {
    operator = "-";
  } else if (input.includes("/")) {
    // fallback
    operator = "/";
  }

  // 🔥 handle division separately
  if (input.includes("/DIV/")) {
    const parts = input.split("/DIV/");

    const left = parts[0].split("/");
    const right = parts[1].split("/");

    if (left.length !== 2 || right.length !== 2) return null;

    return {
      a: Number(left[0]),
      b: Number(left[1]),
      operator: "/",
      c: Number(right[0]),
      d: Number(right[1]),
    };
  }

  // 🔥 normal operations
  const match = input.match(
    /^(\d+)\/(\d+)([\+\-\*])(\d+)\/(\d+)$/
  );

  if (!match) return null;

  return {
    a: Number(match[1]),
    b: Number(match[2]),
    operator: match[3],
    c: Number(match[4]),
    d: Number(match[5]),
  };
};