// JAMB-style Mathematics, batch 1. Original questions (not copied from past
// papers). Format: t topic, d difficulty, q question, o options, a index of
// the correct option, x explanation. Loaded by data/curated/index.js.

export default [
  // Algebra
  { t: "Algebra", q: "Make r the subject of the formula V = πr²h.", o: ["r = √(V/πh)", "r = V/πh", "r = √(Vπh)", "r = (V/πh)²"], a: 0, x: "Divide both sides by πh to get r² = V/πh, then take the square root." },
  { t: "Algebra", q: "Solve for x: (2x + 1)/3 − (x − 2)/4 = 2", o: ["2", "14/5", "18/5", "6/5"], a: 1, x: "Multiply through by 12: 4(2x + 1) − 3(x − 2) = 24, so 5x + 10 = 24 and x = 14/5." },
  { t: "Algebra", q: "Solve the simultaneous equations 2x + 3y = 12 and x − y = 1.", o: ["x = 2, y = 3", "x = 4, y = 1", "x = 3, y = 2", "x = 1, y = 4"], a: 2, x: "From the second equation x = y + 1. Substituting: 2(y + 1) + 3y = 12, so 5y = 10, y = 2 and x = 3." },
  { t: "Algebra", q: "If (5x + 1)/((x + 1)(x − 1)) = A/(x + 1) + B/(x − 1), find A.", o: ["3", "−2", "−3", "2"], a: 3, x: "5x + 1 = A(x − 1) + B(x + 1). Put x = −1: −4 = −2A, so A = 2. (Putting x = 1 gives B = 3.)" },
  { t: "Algebra", q: "Factorise 2x² + 7x + 3.", o: ["(2x + 1)(x + 3)", "(2x + 3)(x + 1)", "(2x − 1)(x − 3)", "(x + 1)(x + 3)"], a: 0, x: "(2x + 1)(x + 3) = 2x² + 6x + x + 3 = 2x² + 7x + 3." },
  { t: "Algebra", q: "P varies directly as Q. If P = 12 when Q = 4, find P when Q = 10.", o: ["22", "30", "40", "4.8"], a: 1, x: "P = kQ. 12 = 4k gives k = 3, so P = 3 × 10 = 30." },

  // Quadratic Equations
  { t: "Quadratic Equations", q: "Find the sum of the roots of 3x² − 7x + 2 = 0.", o: ["−7/3", "2/3", "7/3", "−2/3"], a: 2, x: "For ax² + bx + c = 0 the sum of the roots is −b/a = 7/3." },
  { t: "Quadratic Equations", q: "Which equation has roots −2 and 5?", o: ["x² + 3x − 10 = 0", "x² − 3x + 10 = 0", "x² + 3x + 10 = 0", "x² − 3x − 10 = 0"], a: 3, x: "(x + 2)(x − 5) = x² − 3x − 10." },
  { t: "Quadratic Equations", q: "Find the values of k for which x² + kx + 16 = 0 has equal roots.", o: ["±8", "±4", "16 only", "±16"], a: 0, x: "Equal roots need b² − 4ac = 0: k² − 64 = 0, so k = ±8." },
  { t: "Quadratic Equations", d: "hard", q: "If α and β are the roots of x² − 4x + 1 = 0, find α² + β².", o: ["16", "14", "18", "12"], a: 1, x: "α + β = 4 and αβ = 1, so α² + β² = (α + β)² − 2αβ = 16 − 2 = 14." },
  { t: "Quadratic Equations", q: "Solve 2x² + 5x − 3 = 0.", o: ["x = −1/2 or 3", "x = 1 or −3/2", "x = 1/2 or −3", "x = −1 or 3/2"], a: 2, x: "2x² + 5x − 3 = (2x − 1)(x + 3) = 0, so x = 1/2 or x = −3." },
  { t: "Quadratic Equations", q: "What is the nature of the roots of 2x² − 3x + 5 = 0?", o: ["Two equal real roots", "Two distinct real roots", "One positive and one negative root", "No real roots"], a: 3, x: "The discriminant is (−3)² − 4(2)(5) = 9 − 40 = −31, which is negative, so there are no real roots." },

  // Trigonometry
  { t: "Trigonometry", d: "easy", q: "Evaluate tan 45° + 2 sin 30°.", o: ["1", "2", "1 + √3", "3/2"], a: 1, x: "tan 45° = 1 and sin 30° = 1/2, so 1 + 2(1/2) = 2." },
  { t: "Trigonometry", q: "A 10 m ladder leans against a vertical wall and makes 60° with the ground. How high up the wall does it reach?", o: ["5 m", "5√3 m", "10√3 m", "5√2 m"], a: 1, x: "Height = 10 sin 60° = 10 × √3/2 = 5√3 m." },
  { t: "Trigonometry", d: "hard", q: "If tan θ = 5/12 and θ lies in the third quadrant, find sin θ.", o: ["5/13", "−12/13", "−5/13", "12/13"], a: 2, x: "The hypotenuse is √(5² + 12²) = 13. In the third quadrant sine is negative, so sin θ = −5/13." },
  { t: "Trigonometry", q: "Solve 2 sin θ − 1 = 0 for 0° ≤ θ ≤ 360°.", o: ["30° and 330°", "60° and 120°", "30° only", "30° and 150°"], a: 3, x: "sin θ = 1/2. Sine is positive in the first and second quadrants, so θ = 30° or 180° − 30° = 150°." },
  { t: "Trigonometry", q: "From a point 50 m from the foot of a tower, the angle of elevation of the top is 30°. Find the height of the tower.", o: ["50√3/3 m", "50√3 m", "25 m", "100 m"], a: 0, x: "Height = 50 tan 30° = 50/√3 = 50√3/3 m (about 28.9 m)." },
  { t: "Trigonometry", q: "In triangle ABC, a = 8 cm, A = 30° and B = 45°. Find b.", o: ["4√2 cm", "8√2 cm", "16 cm", "8√3 cm"], a: 1, x: "Sine rule: b = a sin B / sin A = 8 × (√2/2) ÷ (1/2) = 8√2 cm." },

  // Calculus
  { t: "Calculus", d: "easy", q: "Differentiate y = 3x⁴ − 2x² + 5 with respect to x.", o: ["12x³ − 4x + 5", "3x³ − 2x", "12x³ − 4x", "12x⁴ − 4x²"], a: 2, x: "Bring down each power and reduce it by one: 12x³ − 4x; the constant 5 differentiates to 0." },
  { t: "Calculus", q: "Find the gradient of the curve y = 2x² − 5x + 1 at x = 3.", o: ["4", "7", "2", "13"], a: 1, x: "dy/dx = 4x − 5. At x = 3: 12 − 5 = 7." },
  { t: "Calculus", q: "Find ∫(6x² − 4x + 3) dx.", o: ["2x³ − 2x² + 3x + c", "12x − 4 + c", "6x³ − 4x² + 3x + c", "3x³ − 2x² + 3 + c"], a: 0, x: "Integrate term by term: 6x³/3 − 4x²/2 + 3x + c = 2x³ − 2x² + 3x + c." },
  { t: "Calculus", q: "Evaluate ∫ from 0 to 2 of (3x² + 1) dx.", o: ["8", "10", "12", "14"], a: 1, x: "The antiderivative is x³ + x. At 2: 8 + 2 = 10; at 0: 0. The answer is 10." },
  { t: "Calculus", d: "hard", q: "Find the minimum value of y = x³ − 12x for x > 0.", o: ["16", "−2", "−16", "−8"], a: 2, x: "dy/dx = 3x² − 12 = 0 gives x = ±2. At x = 2, d²y/dx² = 6x = 12 > 0, so it is a minimum: y = 8 − 24 = −16." },
  { t: "Calculus", q: "Differentiate y = (2x + 1)⁵.", o: ["5(2x + 1)⁴", "2(2x + 1)⁴", "10(2x + 1)⁵", "10(2x + 1)⁴"], a: 3, x: "Chain rule: 5(2x + 1)⁴ × 2 = 10(2x + 1)⁴." },

  // Probability
  { t: "Probability", d: "easy", q: "Two fair dice are thrown. What is the probability that both show the same number?", o: ["1/36", "1/12", "1/6", "1/3"], a: 2, x: "Six outcomes are doubles, (1,1) to (6,6), out of 36: 6/36 = 1/6." },
  { t: "Probability", q: "A bag has 5 red and 3 blue balls. Two are drawn one after the other without replacement. Find the probability that both are red.", o: ["25/64", "5/14", "5/8", "15/56"], a: 1, x: "P = 5/8 × 4/7 = 20/56 = 5/14." },
  { t: "Probability", q: "A and B are independent events with P(A) = 0.3 and P(B) = 0.5. Find P(A or B).", o: ["0.8", "0.15", "0.65", "0.35"], a: 2, x: "P(A and B) = 0.3 × 0.5 = 0.15, so P(A or B) = 0.3 + 0.5 − 0.15 = 0.65." },
  { t: "Probability", q: "A fair coin is tossed three times. Find the probability of getting exactly two heads.", o: ["1/2", "1/4", "2/3", "3/8"], a: 3, x: "Of the 8 outcomes, HHT, HTH and THH have exactly two heads: 3/8." },
  { t: "Probability", d: "easy", q: "A letter is picked at random from the word STATISTICS. What is the probability that it is T?", o: ["3/10", "1/5", "2/5", "1/10"], a: 0, x: "STATISTICS has 10 letters, and 3 of them are T: 3/10." },
  { t: "Probability", q: "In how many ways can the letters of the word LAGOS be arranged?", o: ["24", "120", "60", "25"], a: 1, x: "The 5 letters are all different, so there are 5! = 120 arrangements." },

  // Statistics
  { t: "Statistics", d: "easy", q: "Find the mean of 2, 5, 7, 8 and 13.", o: ["8", "6", "7", "5"], a: 2, x: "Sum = 35 and there are 5 numbers, so the mean is 35 ÷ 5 = 7." },
  { t: "Statistics", q: "Find the median of 12, 15, 11, 18, 14, 20, 16.", o: ["14", "16", "18", "15"], a: 3, x: "In order: 11, 12, 14, 15, 16, 18, 20. With seven values the median is the 4th: 15." },
  { t: "Statistics", d: "easy", q: "Find the mode of 3, 5, 5, 6, 7, 7, 7, 9.", o: ["7", "5", "6", "9"], a: 0, x: "7 occurs three times, more than any other value." },
  { t: "Statistics", d: "hard", q: "Find the variance of 2, 4 and 6.", o: ["4", "8/3", "2", "8"], a: 1, x: "Mean = 4. Squared deviations: 4, 0, 4. Variance = 8/3." },
  { t: "Statistics", q: "In a pie chart of 72 students, 18 chose Physics. What angle represents Physics?", o: ["18°", "45°", "90°", "72°"], a: 2, x: "Physics is 18 out of 72 students, so its angle is 18/72 × 360° = 90°." },
  { t: "Statistics", q: "The mean of x, x + 2 and x + 4 is 10. Find x.", o: ["10", "6", "4", "8"], a: 3, x: "(3x + 6)/3 = 10, so 3x + 6 = 30 and x = 8." },

  // Geometry
  { t: "Geometry", d: "easy", q: "What is the size of each interior angle of a regular hexagon?", o: ["120°", "108°", "135°", "60°"], a: 0, x: "Each exterior angle is 360°/6 = 60°, so each interior angle is 180° − 60° = 120°." },
  { t: "Geometry", d: "easy", q: "Find the sum of the interior angles of a pentagon.", o: ["360°", "540°", "720°", "450°"], a: 1, x: "(n − 2) × 180° = 3 × 180° = 540°." },
  { t: "Geometry", q: "Find the area of a circle of radius 7 cm. (Take π = 22/7.)", o: ["44 cm²", "49 cm²", "154 cm²", "308 cm²"], a: 2, x: "Area = πr² = 22/7 × 49 = 154 cm²." },
  { t: "Geometry", d: "easy", q: "Find the midpoint of the line joining (−2, 5) and (6, 1).", o: ["(4, 6)", "(8, −4)", "(4, 2)", "(2, 3)"], a: 3, x: "Midpoint = ((−2 + 6)/2, (5 + 1)/2) = (2, 3)." },
  { t: "Geometry", q: "An arc of a circle subtends 110° at the centre. What angle does it subtend at a point on the remaining part of the circumference?", o: ["55°", "110°", "220°", "70°"], a: 0, x: "The angle at the centre is twice the angle at the circumference, so the angle is 110° ÷ 2 = 55°." },
  { t: "Geometry", q: "Find the gradient of the line 3y − 6x + 5 = 0.", o: ["−2", "2", "6", "3"], a: 1, x: "Rearrange to y = mx + c: 3y = 6x − 5, so y = 2x − 5/3 and the gradient is 2." },

  // Indices and Logarithms
  { t: "Indices and Logarithms", q: "Evaluate 16^(3/4).", o: ["12", "4", "8", "6"], a: 2, x: "16^(1/4) = 2, and 2³ = 8." },
  { t: "Indices and Logarithms", d: "easy", q: "Simplify log₂ 8 + log₂ 4.", o: ["6", "12", "log₂ 12", "5"], a: 3, x: "log₂ 8 = 3 and log₂ 4 = 2, so the sum is 5 (which is log₂ 32)." },
  { t: "Indices and Logarithms", q: "Solve 3^(2x − 1) = 27.", o: ["1", "3", "4", "2"], a: 3, x: "27 = 3³, so 2x − 1 = 3 and x = 2." },
  { t: "Indices and Logarithms", q: "If log 2 = 0.3010 and log 3 = 0.4771, find log 6.", o: ["0.1436", "0.7781", "0.1761", "1.4313"], a: 1, x: "log 6 = log 2 + log 3 = 0.3010 + 0.4771 = 0.7781." },
  { t: "Indices and Logarithms", d: "easy", q: "Simplify (x³ × x⁵) ÷ x².", o: ["x¹⁰", "x¹⁵", "x⁶", "x⁴"], a: 2, x: "Add the powers when multiplying and subtract when dividing: 3 + 5 − 2 = 6." },
  { t: "Indices and Logarithms", q: "Solve log₃(x − 1) = 2.", o: ["7", "9", "8", "10"], a: 3, x: "x − 1 = 3² = 9, so x = 10." },

  // Sets
  { t: "Sets", q: "If n(A) = 15, n(B) = 12 and n(A ∩ B) = 5, find n(A ∪ B).", o: ["22", "27", "32", "17"], a: 0, x: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = 15 + 12 − 5 = 22." },
  { t: "Sets", d: "easy", q: "How many subsets does the set {a, b, c, d} have?", o: ["8", "16", "4", "15"], a: 1, x: "A set with n elements has 2ⁿ subsets: 2⁴ = 16." },
  { t: "Sets", q: "In a group of 50 traders, 26 sell rice, 22 sell beans and 6 sell neither. How many sell both?", o: ["8", "6", "14", "4"], a: 3, x: "44 traders sell at least one (50 − 6). Both = 26 + 22 − 44 = 4." },
  { t: "Sets", d: "easy", q: "If U = {1, 2, 3, ..., 10} and A is the set of even numbers in U, find A′.", o: ["{2, 4, 6, 8, 10}", "{1, 3, 5, 7}", "{0, 1, 3, 5, 7, 9}", "{1, 3, 5, 7, 9}"], a: 3, x: "The complement A′ contains the members of U not in A: the odd numbers 1, 3, 5, 7, 9." },
  { t: "Sets", d: "easy", q: "If A = {2, 3, 5, 7} and B = {1, 3, 5, 9}, find A ∩ B.", o: ["{3, 5}", "{1, 2, 3, 5, 7, 9}", "{2, 7}", "{1, 9}"], a: 0, x: "The intersection contains the elements in both sets: 3 and 5." },
  { t: "Sets", q: "How many proper subsets does a set with 3 elements have?", o: ["8", "7", "6", "3"], a: 1, x: "There are 2³ = 8 subsets; excluding the set itself leaves 7 proper subsets." },

  // Functions
  { t: "Functions", d: "easy", q: "If f(x) = 2x − 3, find f(4).", o: ["11", "8", "5", "1"], a: 2, x: "f(4) = 2(4) − 3 = 5." },
  { t: "Functions", q: "If f(x) = 3x + 1 and g(x) = x², find f(g(2)).", o: ["49", "7", "36", "13"], a: 3, x: "g(2) = 4, then f(4) = 3(4) + 1 = 13." },
  { t: "Functions", q: "Find the inverse of f(x) = (x + 4)/3.", o: ["f⁻¹(x) = 3x − 4", "f⁻¹(x) = 3x + 4", "f⁻¹(x) = (x − 4)/3", "f⁻¹(x) = 3/(x + 4)"], a: 0, x: "Let y = (x + 4)/3, so x = 3y − 4. Swapping letters gives f⁻¹(x) = 3x − 4." },
  { t: "Functions", q: "For which value of x is f(x) = 1/(x − 2) not defined?", o: ["x = 0", "x = 2", "x = −2", "x = 1"], a: 1, x: "Division by zero is undefined, and the denominator x − 2 is zero when x = 2." },
  { t: "Functions", q: "If f(x) = x² − 1, find f(x + 1).", o: ["x²", "x² + 1", "x² + 2x", "x² + 2x + 2"], a: 2, x: "f(x + 1) = (x + 1)² − 1 = x² + 2x + 1 − 1 = x² + 2x." },
  { t: "Functions", q: "If g(x) = 2x + 5, find g⁻¹(11).", o: ["27", "8", "6", "3"], a: 3, x: "g⁻¹(11) is the x with 2x + 5 = 11, so x = 3." }
];
