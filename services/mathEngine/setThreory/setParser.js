export const parseSetTheory = (problem) => {
  const text = problem.toLowerCase().replace(/\s+/g, "");

  let data = {};

  // n(A)=20
  const single = text.match(/n\(([a-z])\)=([0-9]+)/g);
  if (single) {
    single.forEach((item) => {
      const [, set, value] = item.match(/n\(([a-z])\)=([0-9]+)/);
      data[set] = Number(value);
    });
  }

  // n(A∩B)=5
  const intersection = text.match(/n\(([a-z])∩([a-z])\)=([0-9]+)/);
  if (intersection) {
    data.intersection = Number(intersection[3]);
  }

  // n(U)=100
  const universal = text.match(/n\(u\)=([0-9]+)/);
  if (universal) {
    data.universal = Number(universal[1]);
  }

  // Triple intersection
  const triple = text.match(/n\(([a-z])∩([a-z])∩([a-z])\)=([0-9]+)/);
  if (triple) {
    data.triple = Number(triple[4]);
  }

  return Object.keys(data).length ? data : null;
};