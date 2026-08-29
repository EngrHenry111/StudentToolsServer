export const parseSetTheory = (problem) => {
  const text = problem.toLowerCase().replace(/\s+/g, "");

  let data = {};

  // n(A∩B)=5 — also accept the word "and" instead of the ∩ symbol,
  // since real problems are usually typed as "n(A and B)=3", not with
  // the actual ∩ character, which most people don't know how to type.
  const intersection = text.match(/n\(([a-z])(?:∩|and)([a-z])\)=([0-9]+)/);
  if (intersection) {
    data.intersection = Number(intersection[3]);
  }

  // n(A)=20 — matched AFTER intersection, so "n(aandb)=3" isn't
  // mistakenly partially consumed by the single-set pattern first.
  const withoutIntersection = intersection ? text.replace(intersection[0], "") : text;
  const single = withoutIntersection.match(/n\(([a-z])\)=([0-9]+)/g);
  if (single) {
    single.forEach((item) => {
      const [, set, value] = item.match(/n\(([a-z])\)=([0-9]+)/);
      data[set] = Number(value);
    });
  }

  // n(U)=100
  const universal = text.match(/n\(u\)=([0-9]+)/);
  if (universal) {
    data.universal = Number(universal[1]);
  }

  // Triple intersection
  const triple = text.match(/n\(([a-z])(?:∩|and)([a-z])(?:∩|and)([a-z])\)=([0-9]+)/);
  if (triple) {
    data.triple = Number(triple[4]);
  }

  return Object.keys(data).length ? data : null;
};