// WAEC-style Mathematics, batch 2. Same format as waec-mathematics.js.

export default [
  // Algebra
  { t: "Algebra", q: "Convert 47 in base ten to base two.", o: ["101111", "110111", "101101", "111011"], a: 0, x: "47 = 32 + 8 + 4 + 2 + 1 = 1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 1×2 + 1, which is 101111 in base two." },
  { t: "Algebra", q: "If 31 in base x equals 16 in base ten, find x.", o: ["5", "4", "6", "3"], a: 0, x: "3x + 1 = 16, so 3x = 15 and x = 5." },
  { t: "Algebra", d: "easy", q: "A man shares ₦12,000 between his two sons in the ratio 3 : 5. Find the larger share.", o: ["₦7,500", "₦4,500", "₦6,000", "₦8,000"], a: 0, x: "There are 8 parts, each worth ₦1,500. The larger share is 5 × ₦1,500 = ₦7,500." },
  { t: "Algebra", q: "What principal will earn ₦1,800 simple interest in 3 years at 5% per annum?", o: ["₦12,000", "₦9,000", "₦10,800", "₦6,000"], a: 0, x: "P = (I × 100)/(R × T) = (1800 × 100)/(5 × 3) = ₦12,000." },
  { t: "Algebra", q: "A trader sold a phone for ₦27,000 at a loss of 10%. Find the cost price.", o: ["₦30,000", "₦29,700", "₦24,300", "₦25,000"], a: 0, x: "The selling price is 90% of the cost price, so cost = 27,000 × 100/90 = ₦30,000." },
  { t: "Algebra", q: "Simplify (x² − 4)/(x² + x − 6).", o: ["(x + 2)/(x + 3)", "(x − 2)/(x + 3)", "(x + 2)/(x − 3)", "2/3"], a: 0, x: "(x − 2)(x + 2) / ((x + 3)(x − 2)) = (x + 2)/(x + 3) after cancelling x − 2." },
  { t: "Algebra", q: "Solve (x + 1)/2 − (x − 1)/3 = 2.", o: ["x = 7", "x = 5", "x = 1", "x = 11"], a: 0, x: "Multiply by 6: 3(x + 1) − 2(x − 1) = 12, so x + 5 = 12 and x = 7." },
  { t: "Algebra", d: "easy", q: "The nth term of a sequence is 3n² − 1. Find the 4th term.", o: ["47", "35", "11", "143"], a: 0, x: "3 × 4² − 1 = 3 × 16 − 1 = 47." },
  { t: "Algebra", q: "Find the determinant of the matrix with rows (2, −1) and (3, 4).", o: ["11", "5", "−11", "−5"], a: 0, x: "ad − bc = 2 × 4 − (−1 × 3) = 8 + 3 = 11." },
  { t: "Algebra", q: "If x = 2 and y = −3, evaluate x²y − xy².", o: ["−30", "6", "30", "−6"], a: 0, x: "x²y = 4 × (−3) = −12 and xy² = 2 × 9 = 18, so −12 − 18 = −30." },

  // Quadratic Equations
  { t: "Quadratic Equations", d: "easy", q: "Solve x² + 2x − 15 = 0.", o: ["x = 3 or −5", "x = −3 or 5", "x = 3 or 5", "x = −3 or −5"], a: 0, x: "(x + 5)(x − 3) = 0, so x = 3 or x = −5." },
  { t: "Quadratic Equations", q: "Solve 4x² − 9 = 0.", o: ["x = ±3/2", "x = ±9/4", "x = 3/2 only", "x = ±2/3"], a: 0, x: "4x² = 9, so x² = 9/4 and x = ±3/2. It is also a difference of two squares: (2x − 3)(2x + 3) = 0." },
  { t: "Quadratic Equations", q: "Solve 2x² − 7x + 3 = 0.", o: ["x = 1/2 or 3", "x = −1/2 or −3", "x = 2 or 3", "x = 1/2 or −3"], a: 0, x: "(2x − 1)(x − 3) = 0, so x = 1/2 or x = 3." },
  { t: "Quadratic Equations", q: "Find the quadratic equation whose roots have a sum of 5 and a product of −14.", o: ["x² − 5x − 14 = 0", "x² + 5x − 14 = 0", "x² − 5x + 14 = 0", "x² + 14x − 5 = 0"], a: 0, x: "x² − (sum)x + (product) = 0 gives x² − 5x − 14 = 0." },
  { t: "Quadratic Equations", q: "The product of two consecutive positive integers is 132. Find them.", o: ["11 and 12", "12 and 13", "10 and 11", "6 and 22"], a: 0, x: "n(n + 1) = 132, so n² + n − 132 = 0 and (n + 12)(n − 11) = 0. The positive root is n = 11." },
  { t: "Quadratic Equations", q: "Where does the graph of y = x² − 2x − 3 cross the x-axis?", o: ["x = −1 and x = 3", "x = 1 and x = −3", "x = 3 only", "x = −3 and x = −1"], a: 0, x: "Set y = 0: (x − 3)(x + 1) = 0, so x = 3 or x = −1." },
  { t: "Quadratic Equations", q: "Find the equation of the line of symmetry of y = 2x² − 8x + 1.", o: ["x = 2", "x = −2", "x = 4", "x = 8"], a: 0, x: "The axis of symmetry is x = −b/(2a) = 8/4 = 2." },
  { t: "Quadratic Equations", q: "x = −2 is a root of x² + kx − 10 = 0. Find k.", o: ["−3", "3", "7", "−7"], a: 0, x: "4 − 2k − 10 = 0, so −2k = 6 and k = −3." },
  { t: "Quadratic Equations", q: "Solve x(x − 4) = 12.", o: ["x = 6 or −2", "x = −6 or 2", "x = 4 or 12", "x = 0 or 4"], a: 0, x: "x² − 4x − 12 = 0, so (x − 6)(x + 2) = 0 and x = 6 or −2." },
  { t: "Quadratic Equations", q: "The sum of a positive number and its square is 56. Find the number.", o: ["7", "8", "6", "14"], a: 0, x: "x² + x − 56 = 0, so (x + 8)(x − 7) = 0. The positive number is 7." },

  // Trigonometry
  { t: "Trigonometry", d: "easy", q: "Find the value of sin 150°.", o: ["1/2", "−1/2", "√3/2", "−√3/2"], a: 0, x: "150° is in the second quadrant, where sine is positive: sin 150° = sin 30° = 1/2." },
  { t: "Trigonometry", q: "Find the value of tan 240°.", o: ["√3", "−√3", "1/√3", "−1/√3"], a: 0, x: "240° is in the third quadrant, where tangent is positive: tan 240° = tan 60° = √3." },
  { t: "Trigonometry", q: "A man walks 5 km due east and then 12 km due north. How far is he from his starting point?", o: ["13 km", "17 km", "7 km", "√119 km"], a: 0, x: "The two walks are at right angles: √(5² + 12²) = √169 = 13 km." },
  { t: "Trigonometry", q: "Q is 10 km due east of P, and R is 10 km due north of Q. Find the bearing of R from P.", o: ["045°", "135°", "315°", "090°"], a: 0, x: "PQR is a right-angled isosceles triangle, so the angle at P is 45°. Measured clockwise from north, the bearing is 045°." },
  { t: "Trigonometry", q: "From the top of a building 20 m high, the angle of depression of a car on level ground is 30°. How far is the car from the foot of the building?", o: ["20√3 m", "20/√3 m", "40 m", "10 m"], a: 0, x: "tan 30° = 20/d, so d = 20/tan 30° = 20 × √3 = 20√3 m." },
  { t: "Trigonometry", d: "hard", q: "If sin x = 0.8 and x is obtuse, find cos x.", o: ["−0.6", "0.6", "−0.8", "0.75"], a: 0, x: "cos²x = 1 − 0.64 = 0.36, so cos x = ±0.6. Cosine is negative for an obtuse angle, so cos x = −0.6." },
  { t: "Trigonometry", d: "easy", q: "Evaluate cos 0° + sin 270°.", o: ["0", "2", "1", "−1"], a: 0, x: "cos 0° = 1 and sin 270° = −1, so the sum is 0." },
  { t: "Trigonometry", q: "Find x if 2 cos x = √3 and 0° ≤ x ≤ 90°.", o: ["30°", "60°", "45°", "90°"], a: 0, x: "cos x = √3/2, so x = 30°." },
  { t: "Trigonometry", d: "easy", q: "A ladder 13 m long reaches 12 m up a vertical wall. How far is the foot of the ladder from the wall?", o: ["5 m", "1 m", "25 m", "√313 m"], a: 0, x: "By Pythagoras: √(13² − 12²) = √(169 − 144) = √25 = 5 m." },
  { t: "Trigonometry", q: "Find the area of a triangle with sides 10 cm and 12 cm and an included angle of 150°.", o: ["30 cm²", "60 cm²", "30√3 cm²", "120 cm²"], a: 0, x: "Area = ½ × 10 × 12 × sin 150° = 60 × 0.5 = 30 cm²." },

  // Calculus
  { t: "Calculus", d: "easy", q: "Differentiate y = 7x² − 3x + 4.", o: ["14x − 3", "7x − 3", "14x + 4", "14x² − 3"], a: 0, x: "d/dx(7x²) = 14x, d/dx(−3x) = −3 and the constant 4 gives 0." },
  { t: "Calculus", q: "Differentiate y = 1/x².", o: ["−2/x³", "2/x³", "−1/x³", "−2/x"], a: 0, x: "y = x⁻², so dy/dx = −2x⁻³ = −2/x³." },
  { t: "Calculus", q: "Differentiate y = √x.", o: ["1/(2√x)", "2√x", "√x/2", "−1/(2√x)"], a: 0, x: "y = x^(1/2), so dy/dx = ½x^(−1/2) = 1/(2√x)." },
  { t: "Calculus", d: "easy", q: "Find ∫(3x² − 2) dx.", o: ["x³ − 2x + C", "6x + C", "x³ − 2 + C", "3x³ − 2x + C"], a: 0, x: "∫3x² dx = x³ and ∫2 dx = 2x, so the answer is x³ − 2x + C." },
  { t: "Calculus", q: "Evaluate the integral of (x² + 1) from x = 0 to x = 3.", o: ["12", "9", "10", "13"], a: 0, x: "[x³/3 + x] from 0 to 3 = 9 + 3 − 0 = 12." },
  { t: "Calculus", q: "Find the gradient of the tangent to y = x³ at x = −1.", o: ["3", "−3", "1", "−1"], a: 0, x: "dy/dx = 3x² = 3 × 1 = 3 at x = −1." },
  { t: "Calculus", q: "The area of a circle is A = πr². Find dA/dr when r = 5.", o: ["10π", "25π", "5π", "2π"], a: 0, x: "dA/dr = 2πr = 2π × 5 = 10π." },
  { t: "Calculus", q: "For what value of x is the gradient of y = x² − 10x + 4 equal to zero?", o: ["5", "10", "−5", "4"], a: 0, x: "dy/dx = 2x − 10 = 0, so x = 5." },
  { t: "Calculus", d: "hard", q: "Find the x-values of the turning points of y = x³ − 3x.", o: ["x = ±1", "x = ±3", "x = 0 or 3", "x = 1 only"], a: 0, x: "dy/dx = 3x² − 3 = 0, so x² = 1 and x = 1 or x = −1." },
  { t: "Calculus", q: "The velocity of a body is v = 3t² + 2t m/s. Find its acceleration when t = 2 s.", o: ["14 m/s²", "16 m/s²", "12 m/s²", "8 m/s²"], a: 0, x: "a = dv/dt = 6t + 2 = 12 + 2 = 14 m/s²." },

  // Probability
  { t: "Probability", d: "easy", q: "A number is chosen at random from 1 to 30. Find the probability that it is a multiple of 5.", o: ["1/5", "1/6", "1/3", "6/25"], a: 0, x: "The multiples of 5 are 5, 10, 15, 20, 25, 30: 6 of 30 numbers, so P = 1/5." },
  { t: "Probability", q: "A fair die is thrown. Find the probability of getting an even number or a prime number.", o: ["5/6", "1", "2/3", "1/2"], a: 0, x: "Even: 2, 4, 6. Prime: 2, 3, 5. Together {2, 3, 4, 5, 6}: 5 of 6 outcomes." },
  { t: "Probability", d: "easy", q: "A card is drawn from a pack of 52 playing cards. Find the probability that it is not an ace.", o: ["12/13", "1/13", "4/13", "11/13"], a: 0, x: "There are 4 aces, so 48 cards are not aces: 48/52 = 12/13." },
  { t: "Probability", q: "A bag has red, blue and white beads only. P(red) = 1/4 and P(blue) = 1/3. Find P(white).", o: ["5/12", "7/12", "1/12", "1/2"], a: 0, x: "The probabilities add to 1: P(white) = 1 − 1/4 − 1/3 = 1 − 7/12 = 5/12." },
  { t: "Probability", q: "The probabilities that Ngozi and Tunde pass a test are 0.8 and 0.6, independently. Find the probability that both fail.", o: ["0.08", "0.48", "0.92", "0.32"], a: 0, x: "P(Ngozi fails) = 0.2 and P(Tunde fails) = 0.4, so P(both fail) = 0.2 × 0.4 = 0.08." },
  { t: "Probability", d: "hard", q: "The probabilities that Kemi and Femi solve a problem are 0.8 and 0.6, independently. Find the probability that exactly one of them solves it.", o: ["0.44", "0.32", "0.12", "0.56"], a: 0, x: "Kemi only: 0.8 × 0.4 = 0.32. Femi only: 0.2 × 0.6 = 0.12. Total = 0.44." },
  { t: "Probability", q: "A coin is tossed and a die is thrown. Find the probability of a head and a 6.", o: ["1/12", "1/6", "1/2", "2/3"], a: 0, x: "The events are independent: 1/2 × 1/6 = 1/12." },
  { t: "Probability", q: "In how many ways can a president and a secretary be chosen from 7 candidates?", o: ["42", "21", "49", "13"], a: 0, x: "Order matters (different posts): 7 choices for president, then 6 for secretary, so 7 × 6 = 42." },
  { t: "Probability", q: "At a meeting, each of 10 people shakes hands once with every other person. How many handshakes are there?", o: ["45", "90", "20", "100"], a: 0, x: "Each handshake is a pair: ¹⁰C₂ = 10 × 9 / 2 = 45." },
  { t: "Probability", d: "easy", q: "A fair die is thrown 120 times. How many times would you expect to get a 3?", o: ["20", "40", "30", "6"], a: 0, x: "Expected number = probability × trials = 1/6 × 120 = 20." },

  // Statistics
  { t: "Statistics", d: "easy", q: "Find the mean of 15, 20, 25, 30, 35, 40.", o: ["27.5", "25", "30", "27"], a: 0, x: "Sum = 165 and there are 6 numbers, so the mean is 165/6 = 27.5." },
  { t: "Statistics", d: "easy", q: "Find the median of 2, 9, 4, 11, 6.", o: ["6", "4", "9", "6.4"], a: 0, x: "In order: 2, 4, 6, 9, 11. The middle value is 6." },
  { t: "Statistics", q: "Find the class mark of the class 20 – 29.", o: ["24.5", "25", "20", "9"], a: 0, x: "Class mark = (20 + 29)/2 = 24.5, the midpoint of the class." },
  { t: "Statistics", q: "Find the class boundaries of the class 10 – 19.", o: ["9.5 and 19.5", "10 and 19", "10.5 and 19.5", "9.5 and 20.5"], a: 0, x: "Subtract 0.5 from the lower limit and add 0.5 to the upper limit: 9.5 and 19.5." },
  { t: "Statistics", d: "easy", q: "The scores 0, 1, 2, 3, 4 occur with frequencies 4, 6, 5, 3, 2. Find the mode.", o: ["1", "6", "2", "4"], a: 0, x: "The mode is the score with the highest frequency. The highest frequency is 6, for the score 1." },
  { t: "Statistics", d: "hard", q: "The ages 12, 13, 14 and 15 have frequencies 3, 7, 6 and 4. Find the median age.", o: ["13.5", "13", "14", "13.6"], a: 0, x: "There are 20 pupils, so the median is the mean of the 10th and 11th. Cumulative frequencies are 3, 10, 16, 20, so the 10th is 13 and the 11th is 14. Median = 13.5." },
  { t: "Statistics", q: "Find the mean deviation of 2, 4, 6, 8.", o: ["2", "5", "1.5", "4"], a: 0, x: "Mean = 5. The absolute deviations are 3, 1, 1, 3, total 8. Mean deviation = 8/4 = 2." },
  { t: "Statistics", q: "The mean of a set of numbers is 15. If 4 is added to each number, find the new mean.", o: ["19", "15", "60", "11"], a: 0, x: "Adding the same amount to every number adds that amount to the mean: 15 + 4 = 19." },
  { t: "Statistics", q: "In a pie chart, a sector of 72° represents 18 pupils. How many pupils are represented altogether?", o: ["90", "72", "180", "50"], a: 0, x: "72° is 72/360 = 1/5 of the circle, so the total is 18 × 5 = 90 pupils." },
  { t: "Statistics", q: "The lower and upper quartiles of a distribution are 22 and 38. Find the semi-interquartile range.", o: ["8", "16", "30", "60"], a: 0, x: "Interquartile range = 38 − 22 = 16. The semi-interquartile range is half of it: 8." },

  // Geometry
  { t: "Geometry", q: "Find the sum of the interior angles of a nonagon (9 sides).", o: ["1260°", "1440°", "1080°", "1620°"], a: 0, x: "(n − 2) × 180° = 7 × 180° = 1260°." },
  { t: "Geometry", d: "easy", q: "Find the area of a trapezium with parallel sides 8 cm and 12 cm, 5 cm apart.", o: ["50 cm²", "100 cm²", "480 cm²", "25 cm²"], a: 0, x: "Area = ½(a + b)h = ½ × 20 × 5 = 50 cm²." },
  { t: "Geometry", d: "easy", q: "Find the volume of a cuboid 5 cm long, 4 cm wide and 3 cm high.", o: ["60 cm³", "47 cm³", "94 cm³", "12 cm³"], a: 0, x: "V = l × b × h = 5 × 4 × 3 = 60 cm³." },
  { t: "Geometry", q: "Find the total surface area of a closed cylinder of radius 7 cm and height 5 cm. (Take π = 22/7.)", o: ["528 cm²", "220 cm²", "374 cm²", "770 cm²"], a: 0, x: "TSA = 2πr(r + h) = 2 × 22/7 × 7 × 12 = 528 cm²." },
  { t: "Geometry", q: "An arc of a circle subtends 48° at a point on the circumference. Find the angle it subtends at the centre.", o: ["96°", "24°", "48°", "132°"], a: 0, x: "The angle at the centre is twice the angle at the circumference: 2 × 48° = 96°." },
  { t: "Geometry", d: "easy", q: "Two angles of a triangle are 47° and 68°. Find the third angle.", o: ["65°", "75°", "115°", "55°"], a: 0, x: "The angles of a triangle add to 180°: 180° − 47° − 68° = 65°." },
  { t: "Geometry", q: "Find the volume of a cone of base radius 6 cm and height 7 cm. (Take π = 22/7.)", o: ["264 cm³", "792 cm³", "132 cm³", "88 cm³"], a: 0, x: "V = ⅓πr²h = ⅓ × 22/7 × 36 × 7 = 264 cm³." },
  { t: "Geometry", q: "The hypotenuse of a right-angled triangle is 25 cm and one side is 7 cm. Find the third side.", o: ["24 cm", "18 cm", "26 cm", "32 cm"], a: 0, x: "√(25² − 7²) = √(625 − 49) = √576 = 24 cm." },
  { t: "Geometry", q: "Find the equation of the line through (0, −2) and (4, 6).", o: ["y = 2x − 2", "y = 2x + 2", "y = x − 2", "y = −2x + 6"], a: 0, x: "Gradient = (6 − (−2))/(4 − 0) = 2, and the y-intercept is −2, so y = 2x − 2." },
  { t: "Geometry", q: "Find the gradient of a line perpendicular to y = 3x + 1.", o: ["−1/3", "3", "1/3", "−3"], a: 0, x: "Perpendicular gradients multiply to −1, so m = −1/3." },

  // Indices and Logarithms
  { t: "Indices and Logarithms", q: "Evaluate 125^(−1/3).", o: ["1/5", "−5", "5", "−1/5"], a: 0, x: "The cube root of 125 is 5, and the negative index gives the reciprocal: 1/5." },
  { t: "Indices and Logarithms", d: "easy", q: "Simplify (2⁵ × 2⁻²) ÷ 2².", o: ["2", "8", "1/2", "4"], a: 0, x: "5 + (−2) − 2 = 1, so the result is 2¹ = 2." },
  { t: "Indices and Logarithms", q: "Solve 5^(2x − 3) = 125.", o: ["x = 3", "x = 2", "x = 6", "x = 1"], a: 0, x: "125 = 5³, so 2x − 3 = 3 and x = 3." },
  { t: "Indices and Logarithms", d: "easy", q: "Evaluate log₄ 64.", o: ["3", "16", "4", "2"], a: 0, x: "4³ = 64, so log₄ 64 = 3." },
  { t: "Indices and Logarithms", q: "Simplify 2 log 5 + log 4, where log means log₁₀.", o: ["2", "log 14", "1", "log 29"], a: 0, x: "2 log 5 = log 25, and log 25 + log 4 = log 100 = 2." },
  { t: "Indices and Logarithms", q: "Solve log x + log 4 = log 20.", o: ["x = 5", "x = 16", "x = 80", "x = 24"], a: 0, x: "log 4x = log 20, so 4x = 20 and x = 5." },
  { t: "Indices and Logarithms", d: "easy", q: "Write 3.142857 correct to 3 decimal places.", o: ["3.143", "3.142", "3.14", "3.1429"], a: 0, x: "The 4th decimal digit is 8, which is 5 or more, so the 3rd digit rounds up: 3.143." },
  { t: "Indices and Logarithms", q: "Express 45 600 000 in standard form.", o: ["4.56 × 10⁷", "4.56 × 10⁶", "45.6 × 10⁶", "4.56 × 10⁸"], a: 0, x: "Move the decimal point 7 places left so one non-zero digit is before it: 4.56 × 10⁷." },
  { t: "Indices and Logarithms", q: "Simplify (x^(1/2))⁴ × x⁻¹.", o: ["x", "x²", "x³", "1"], a: 0, x: "(x^(1/2))⁴ = x², and x² × x⁻¹ = x." },
  { t: "Indices and Logarithms", q: "Simplify (√5 + 2)(√5 − 2).", o: ["1", "9", "3", "√5"], a: 0, x: "Difference of two squares: (√5)² − 2² = 5 − 4 = 1." },

  // Sets
  { t: "Sets", q: "U = {1, 2, 3, …, 10} and A is the set of prime numbers in U. Find A′.", o: ["{1, 4, 6, 8, 9, 10}", "{4, 6, 8, 9, 10}", "{1, 2, 4, 6, 8, 9, 10}", "{2, 3, 5, 7}"], a: 0, x: "A = {2, 3, 5, 7}. A′ holds the other elements of U, including 1, which is not prime." },
  { t: "Sets", d: "easy", q: "X is the set of letters in the word NIGERIA. Find n(X).", o: ["6", "7", "5", "4"], a: 0, x: "The distinct letters are N, I, G, E, R, A. The repeated I is counted once." },
  { t: "Sets", d: "easy", q: "A = {b, d, f} and B = {a, b, c, d}. Find A ∪ B.", o: ["{a, b, c, d, f}", "{b, d}", "{a, c, f}", "{a, b, c, d}"], a: 0, x: "The union contains every element in either set, each listed once." },
  { t: "Sets", q: "In a town of 100 people, 60 read newspaper M, 50 read newspaper F and 25 read both. How many read neither?", o: ["15", "25", "35", "10"], a: 0, x: "n(M ∪ F) = 60 + 50 − 25 = 85, so 100 − 85 = 15 read neither." },
  { t: "Sets", q: "How many subsets of {p, q, r} have exactly two elements?", o: ["3", "6", "4", "8"], a: 0, x: "They are {p, q}, {p, r} and {q, r}: ³C₂ = 3." },
  { t: "Sets", d: "easy", q: "Two sets A and B with A ∩ B = ∅ are called", o: ["equal sets", "disjoint sets", "equivalent sets", "universal sets"], a: 1, x: "Sets with no element in common are disjoint." },
  { t: "Sets", q: "Which of these describes all x greater than or equal to −2 and less than 5?", o: ["{x : −2 ≤ x < 5}", "{x : −2 < x ≤ 5}", "{x : −2 < x < 5}", "{x : −2 ≤ x ≤ 5}"], a: 0, x: "'Greater than or equal to −2' is −2 ≤ x, and 'less than 5' is x < 5." },
  { t: "Sets", q: "In a class of 30, 18 take French and 15 take Hausa, and every student takes at least one. How many take both?", o: ["3", "33", "12", "15"], a: 0, x: "n(F ∪ H) = 30, so 18 + 15 − both = 30 and both = 3." },
  { t: "Sets", d: "easy", q: "Two sets are equivalent if they have", o: ["the same elements", "the same number of elements", "no common elements", "exactly one common element"], a: 1, x: "Equivalent sets have the same number of elements. Equal sets have exactly the same elements." },

  // Functions
  { t: "Functions", d: "easy", q: "If f(x) = 5 − 2x, find f(−3).", o: ["11", "−1", "1", "−11"], a: 0, x: "f(−3) = 5 − 2(−3) = 5 + 6 = 11." },
  { t: "Functions", q: "If f(x) = x² + 2x, find f(a − 1).", o: ["a² − 1", "a² + 1", "a² − 2a", "a² + 2a − 1"], a: 0, x: "(a − 1)² + 2(a − 1) = a² − 2a + 1 + 2a − 2 = a² − 1." },
  { t: "Functions", q: "If f(x) = 7x + 2, find f⁻¹(30).", o: ["4", "212", "32/7", "28"], a: 0, x: "Solve 7x + 2 = 30: 7x = 28, so x = 4." },
  { t: "Functions", d: "easy", q: "Under the mapping x → 2x² − 1, find the image of 3.", o: ["17", "35", "11", "5"], a: 0, x: "2 × 3² − 1 = 2 × 9 − 1 = 17." },
  { t: "Functions", q: "If f(x) = (x + 3)/(x − 1), find f(3).", o: ["3", "0", "6", "−3"], a: 0, x: "f(3) = (3 + 3)/(3 − 1) = 6/2 = 3." },
  { t: "Functions", q: "A binary operation * is defined by a * b = 2a + b. Find 3 * (−1).", o: ["5", "7", "1", "−5"], a: 0, x: "3 * (−1) = 2 × 3 + (−1) = 6 − 1 = 5." },
  { t: "Functions", d: "hard", q: "A binary operation ⊕ is defined by a ⊕ b = ab − b. Find (2 ⊕ 3) ⊕ 4.", o: ["8", "12", "3", "20"], a: 0, x: "2 ⊕ 3 = 6 − 3 = 3. Then 3 ⊕ 4 = 12 − 4 = 8." },
  { t: "Functions", q: "Where does the graph of f(x) = 3x − 6 cross the x-axis?", o: ["x = 2", "x = −6", "x = 6", "x = −2"], a: 0, x: "Set f(x) = 0: 3x − 6 = 0, so x = 2." },
  { t: "Functions", q: "f(x) = 2x + k and f(3) = 11. Find k.", o: ["5", "3", "11", "8"], a: 0, x: "2 × 3 + k = 11, so k = 5." }
];
