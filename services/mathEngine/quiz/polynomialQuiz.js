const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generatePolynomialQuestion = (difficulty = "easy") => {

  let a = random(1, 9);
  let b = random(1, 9);

  // 🔥 EASY
  if (difficulty === "easy") {

    return {
      topic: "Polynomial",
      difficulty,

      type: "polynomial",

      question: `(x + ${a})(x + ${b})`,

      answer: `x^2+${a + b}x+${a * b}`,

      solution: {
        formula: "(a+b)(a+c)=a²+(b+c)a+bc",

        steps: [
          `Expand using distributive law`,
          `x(x + ${b}) + ${a}(x + ${b})`,
          `x² + ${b}x + ${a}x + ${a * b}`,
          `Combine like terms`,
        ],

        answer: `x^2+${a + b}x+${a * b}`,
      },
    };
  }

  // 🔥 MEDIUM
  if (difficulty === "medium") {

    return {
      topic: "Polynomial",
      difficulty,

      type: "polynomial",

      question: `(x + ${a})(x - ${b})`,

      answer: `x^2${a - b >= 0 ? "+" : ""}${a - b}x-${a * b}`,

      solution: {
        formula: "(a+b)(a-c)=a²+(b-c)a-bc",

        steps: [
          `Expand brackets`,
          `x(x-${b}) + ${a}(x-${b})`,
          `x²-${b}x+${a}x-${a * b}`,
          `Combine like terms`,
        ],

        answer: `x^2${a - b >= 0 ? "+" : ""}${a - b}x-${a * b}`,
      },
    };
  }

  // 🔥 HARD
  return {
    topic: "Polynomial",
    difficulty,

    type: "polynomial",

    question: `(${a}x + ${b})(x - ${a})`,

    answer: `${a}x^2${b - a * a >= 0 ? "+" : ""}${b - a * a}x-${a * b}`,

    solution: {
      formula: "(ax+b)(x-c)",

      steps: [
        `Multiply every term`,
        `${a}x(x-${a}) + ${b}(x-${a})`,
        `${a}x²-${a * a}x+${b}x-${a * b}`,
        `Combine like terms`,
      ],

      answer: `${a}x^2${b - a * a >= 0 ? "+" : ""}${b - a * a}x-${a * b}`,
    },
  };
};

export default generatePolynomialQuestion;