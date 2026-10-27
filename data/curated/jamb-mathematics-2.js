// JAMB-style Mathematics, batch 2. Same format as jamb-mathematics.js.

export default [
  // Algebra
  { t: "Algebra", d: "easy", q: "Expand (x − 3)(x + 5).", o: ["x² + 2x − 15", "x² − 2x − 15", "x² + 8x − 15", "x² + 2x + 15"], a: 0, x: "x² + 5x − 3x − 15 = x² + 2x − 15." },
  { t: "Algebra", q: "Solve |2x − 3| = 7.", o: ["x = 5 only", "x = 5 or x = −2", "x = −5 or x = 2", "x = 2 only"], a: 1, x: "2x − 3 = 7 gives x = 5; 2x − 3 = −7 gives x = −2." },
  { t: "Algebra", d: "easy", q: "Simplify (x² − 9)/(x + 3).", o: ["x + 3", "x − 9", "x − 3", "x² − 3"], a: 2, x: "x² − 9 is a difference of two squares, (x − 3)(x + 3); cancelling (x + 3) leaves x − 3." },
  { t: "Algebra", q: "Solve the inequality 5 − 3x ≤ 11.", o: ["x ≤ −2", "x ≥ 2", "x ≤ 2", "x ≥ −2"], a: 3, x: "−3x ≤ 6. Dividing by −3 reverses the sign: x ≥ −2." },
  { t: "Algebra", q: "The 3rd term of a geometric progression is 12 and the 5th term is 48. Find the common ratio, given that it is positive.", o: ["2", "4", "3", "36"], a: 0, x: "ar⁴ ÷ ar² = r² = 48/12 = 4, so r = 2." },

  // Quadratic Equations
  { t: "Quadratic Equations", d: "easy", q: "Solve x² − 6x + 9 = 0.", o: ["x = −3 (twice)", "x = 3 (twice)", "x = 3 or −3", "x = 9 or 1"], a: 1, x: "x² − 6x + 9 = (x − 3)², so x = 3 is a repeated root." },
  { t: "Quadratic Equations", q: "Express x² + 6x + 2 in the form (x + a)² + b.", o: ["(x + 3)² + 2", "(x + 6)² − 34", "(x + 3)² − 7", "(x − 3)² − 7"], a: 2, x: "(x + 3)² = x² + 6x + 9, so x² + 6x + 2 = (x + 3)² − 7." },
  { t: "Quadratic Equations", q: "One root of x² − kx + 12 = 0 is 3. Find k.", o: ["4", "−7", "12", "7"], a: 3, x: "Substitute x = 3: 9 − 3k + 12 = 0, so k = 7. (The other root is 4.)" },
  { t: "Quadratic Equations", q: "Find the product of the roots of 4x² + 3x − 8 = 0.", o: ["−2", "2", "−3/4", "3/4"], a: 0, x: "The product of the roots is c/a = −8/4 = −2." },

  // Trigonometry
  { t: "Trigonometry", d: "easy", q: "Convert 135° to radians.", o: ["2π/3", "3π/4", "5π/6", "3π/2"], a: 1, x: "Multiply degrees by π/180: 135 × π/180 = 3π/4." },
  { t: "Trigonometry", q: "Find the exact value of cos 120°.", o: ["1/2", "√3/2", "−1/2", "−√3/2"], a: 2, x: "cos 120° = −cos 60° = −1/2, because cosine is negative in the second quadrant." },
  { t: "Trigonometry", q: "In triangle ABC, b = 5 cm, c = 8 cm and A = 60°. Find a.", o: ["9 cm", "√89 cm", "6 cm", "7 cm"], a: 3, x: "Cosine rule: a² = 25 + 64 − 2(5)(8)cos 60° = 89 − 40 = 49, so a = 7 cm." },
  { t: "Trigonometry", q: "Find the area of a triangle with two sides 6 cm and 10 cm and an included angle of 30°.", o: ["15 cm²", "30 cm²", "60 cm²", "15√3 cm²"], a: 0, x: "Area = ½ab sin C = ½ × 6 × 10 × ½ = 15 cm²." },
  { t: "Trigonometry", q: "The bearing of B from A is 060°. What is the bearing of A from B?", o: ["120°", "240°", "300°", "060°"], a: 1, x: "The back bearing differs by 180°: 060° + 180° = 240°." },

  // Calculus
  { t: "Calculus", q: "Differentiate y = 3 sin x − 2 cos x.", o: ["3 cos x − 2 sin x", "−3 cos x + 2 sin x", "3 cos x + 2 sin x", "3 sin x + 2 cos x"], a: 2, x: "d(sin x)/dx = cos x and d(cos x)/dx = −sin x, so dy/dx = 3 cos x + 2 sin x." },
  { t: "Calculus", q: "Differentiate y = x²(x + 1).", o: ["2x", "3x² + 1", "2x² + 2x", "3x² + 2x"], a: 3, x: "y = x³ + x², so dy/dx = 3x² + 2x." },
  { t: "Calculus", q: "Find the area under the curve y = x² between x = 1 and x = 3.", o: ["26/3", "8", "9", "28/3"], a: 0, x: "∫ from 1 to 3 of x² dx = [x³/3] = 9 − 1/3 = 26/3 square units." },
  { t: "Calculus", q: "A particle's displacement is s = t³ − 3t² + 2. Find its velocity when t = 3.", o: ["2", "9", "27", "12"], a: 1, x: "v = ds/dt = 3t² − 6t. At t = 3: 27 − 18 = 9." },
  { t: "Calculus", d: "hard", q: "Find the equation of the tangent to y = x² at the point (2, 4).", o: ["y = 2x", "y = 4x + 4", "y = 4x − 4", "y = 2x + 4"], a: 2, x: "dy/dx = 2x = 4 at x = 2. y − 4 = 4(x − 2) gives y = 4x − 4." },

  // Probability
  { t: "Probability", d: "easy", q: "The probability that it rains on a given day is 0.35. What is the probability that it does not rain?", o: ["0.35", "0.5", "0.75", "0.65"], a: 3, x: "P(not A) = 1 − P(A) = 1 − 0.35 = 0.65." },
  { t: "Probability", d: "easy", q: "A card is drawn from a standard pack of 52. What is the probability that it is a king?", o: ["1/13", "1/4", "1/52", "4/13"], a: 0, x: "There are 4 kings in 52 cards: 4/52 = 1/13." },
  { t: "Probability", q: "How many different pairs can be chosen from 6 players?", o: ["30", "15", "12", "36"], a: 1, x: "⁶C₂ = (6 × 5)/2 = 15. Order does not matter in a pair." },
  { t: "Probability", q: "A and B are mutually exclusive, with P(A) = 1/3 and P(B) = 1/4. Find P(A or B).", o: ["1/12", "1/7", "7/12", "2/7"], a: 2, x: "Mutually exclusive events cannot happen together, so P(A or B) = 1/3 + 1/4 = 7/12." },

  // Statistics
  { t: "Statistics", q: "The scores 1, 2 and 3 occur with frequencies 2, 3 and 5. Find the mean score.", o: ["2", "2.5", "3", "2.3"], a: 3, x: "Σfx = 2 + 6 + 15 = 23 and Σf = 10, so the mean = 2.3." },
  { t: "Statistics", d: "hard", q: "Find the standard deviation of 2, 4, 4, 4, 5, 5, 7, 9.", o: ["2", "4", "5", "√5"], a: 0, x: "Mean = 40/8 = 5. Squared deviations: 9, 1, 1, 1, 0, 0, 4, 16, which sum to 32. Variance = 32/8 = 4, so the standard deviation is 2." },
  { t: "Statistics", d: "easy", q: "Find the range of 12, 7, 19, 3, 15.", o: ["12", "16", "19", "11.2"], a: 1, x: "Range = largest − smallest = 19 − 3 = 16." },
  { t: "Statistics", d: "easy", q: "A cumulative frequency curve is also called", o: ["a histogram", "a bar chart", "an ogive", "a frequency polygon"], a: 2, x: "The cumulative frequency curve is the ogive. The median and quartiles can be read from it." },

  // Geometry
  { t: "Geometry", q: "Find the volume of a cone of radius 3 cm and height 7 cm. (Take π = 22/7.)", o: ["198 cm³", "22 cm³", "132 cm³", "66 cm³"], a: 3, x: "V = ⅓πr²h = ⅓ × 22/7 × 9 × 7 = 66 cm³." },
  { t: "Geometry", q: "Find the length of an arc of a circle of radius 14 cm that subtends 90° at the centre. (Take π = 22/7.)", o: ["22 cm", "44 cm", "11 cm", "154 cm"], a: 0, x: "Arc length = (90/360) × 2 × 22/7 × 14 = ¼ × 88 = 22 cm." },
  { t: "Geometry", q: "One angle of a cyclic quadrilateral is 75°. What is the angle opposite it?", o: ["75°", "105°", "285°", "15°"], a: 1, x: "Opposite angles of a cyclic quadrilateral add up to 180°: 180° − 75° = 105°." },
  { t: "Geometry", d: "easy", q: "The two shorter sides of a right-angled triangle are 9 cm and 12 cm. Find the hypotenuse.", o: ["21 cm", "√63 cm", "15 cm", "13 cm"], a: 2, x: "√(81 + 144) = √225 = 15 cm." },
  { t: "Geometry", d: "easy", q: "Find the total surface area of a cube of side 4 cm.", o: ["64 cm²", "16 cm²", "48 cm²", "96 cm²"], a: 3, x: "A cube has 6 square faces: 6 × 4² = 96 cm²." },

  // Indices and Logarithms
  { t: "Indices and Logarithms", q: "Evaluate 8^(−2/3).", o: ["1/4", "−4", "4", "1/16"], a: 0, x: "8^(2/3) = (∛8)² = 4, and the negative index gives the reciprocal: 1/4." },
  { t: "Indices and Logarithms", d: "easy", q: "Evaluate log₁₀ 1000.", o: ["30", "3", "100", "10"], a: 1, x: "10³ = 1000, so log₁₀ 1000 = 3." },
  { t: "Indices and Logarithms", d: "easy", q: "Express 0.000345 in standard form.", o: ["3.45 × 10⁴", "34.5 × 10⁻⁵", "3.45 × 10⁻⁴", "3.45 × 10⁻³"], a: 2, x: "Move the decimal point 4 places to the right to get 3.45, so the number is 3.45 × 10⁻⁴." },
  { t: "Indices and Logarithms", q: "Simplify log 50 + log 2, where log means log₁₀.", o: ["log 52", "1", "50", "2"], a: 3, x: "log 50 + log 2 = log(50 × 2) = log 100 = 2." },
  { t: "Indices and Logarithms", q: "Solve 4^x = 1/16.", o: ["−2", "2", "−4", "1/2"], a: 0, x: "1/16 = 4⁻², so x = −2." },

  // Sets
  { t: "Sets", d: "easy", q: "If A is a subset of B, then A ∩ B equals", o: ["B", "A", "the empty set", "A ∪ B"], a: 1, x: "Every element of A is already in B, so their common elements are exactly the elements of A." },
  { t: "Sets", q: "A set has 8 elements. How many elements does its power set have?", o: ["16", "64", "256", "255"], a: 2, x: "The power set (the set of all subsets) has 2⁸ = 256 elements." },
  { t: "Sets", q: "n(U) = 60, n(A) = 35, n(B) = 30 and n(A ∩ B) = 15. How many elements are in neither A nor B?", o: ["5", "25", "15", "10"], a: 3, x: "n(A ∪ B) = 35 + 30 − 15 = 50, so 60 − 50 = 10 are in neither." },
  { t: "Sets", d: "easy", q: "Which of these is an empty set?", o: ["{x : x is a month with 32 days}", "{0}", "{x : x is an even prime}", "{x : x² = 4}"], a: 0, x: "No month has 32 days, so the set has no members. {0} has one member, 0; the only even prime is 2; and x² = 4 gives ±2." },

  // Functions
  { t: "Functions", q: "Find the range of f(x) = x² + 3 for real x.", o: ["f(x) ≥ 0", "f(x) ≥ 3", "all real numbers", "f(x) ≤ 3"], a: 1, x: "x² is never negative, so the smallest value of f is 3, when x = 0." },
  { t: "Functions", q: "If f(x) = 2x + 1 and g(x) = x − 3, find g(f(x)).", o: ["2x − 5", "2x + 4", "2x − 2", "2x − 3"], a: 2, x: "g(f(x)) = (2x + 1) − 3 = 2x − 2." },
  { t: "Functions", d: "easy", q: "If f(x) = 4x − 7 and f(a) = 9, find a.", o: ["29", "1/2", "2", "4"], a: 3, x: "4a − 7 = 9, so 4a = 16 and a = 4." },
  { t: "Functions", d: "easy", q: "f: x → 3x² − 2. Find f(−2).", o: ["10", "−14", "34", "4"], a: 0, x: "3(−2)² − 2 = 3(4) − 2 = 10. The square makes the sign positive." }
];
