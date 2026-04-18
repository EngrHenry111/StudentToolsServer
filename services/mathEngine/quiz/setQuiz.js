export const generateSetTheoryQuestion = () => {
  const A = Math.floor(Math.random() * 50) + 10;
  const B = Math.floor(Math.random() * 50) + 10;
  const intersect = Math.floor(Math.random() * 10);

  const union = A + B - intersect;

  return {
    question: `If n(A)=${A}, n(B)=${B}, n(A∩B)=${intersect}, find n(A∪B)`,
    answer: union,
    topic: "Set Theory",
    difficulty: "medium",
    type: "set",
  };
};