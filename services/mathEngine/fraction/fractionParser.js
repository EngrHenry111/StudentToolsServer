export const parseFraction = (input) => {
  if (!input) return null;

  // 🔥 normalize input
  input = input
    .replace(/\s/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  // 🔥 FIX: detect operator BEFORE replacing division
  const match = input.match(
    /^(\d+)\/(\d+)([\+\-\*\/])(\d+)\/(\d+)$/
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