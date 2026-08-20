// FILE: /data/curatedQuestions.js
//
// Original, exam-accurate practice questions written to match the real
// WAEC and JAMB syllabus and question style for each topic — NOT copied
// from any actual past paper (that would be a copyright problem; these
// are freshly authored to the same standard). Run scripts/seedCuratedQuestions.js
// to load these into the database. Add more over time by appending here
// and re-running the script (it skips duplicates).

export const curatedQuestions = [

  // ===================== MATHEMATICS =====================
  {
    subject: "mathematics", topic: "Algebra", examBody: "WAEC", difficulty: "medium",
    question: "If 3x - 7 = 2x + 5, find the value of x.",
    options: ["10", "12", "-12", "2"],
    correctAnswer: "12",
    explanation: "3x - 2x = 5 + 7, so x = 12."
  },
  {
    subject: "mathematics", topic: "Algebra", examBody: "JAMB", difficulty: "medium",
    question: "Simplify: 2(x + 3) - 3(x - 1)",
    options: ["-x + 9", "x + 9", "-x + 3", "5x + 3"],
    correctAnswer: "-x + 9",
    explanation: "2x + 6 - 3x + 3 = -x + 9."
  },
  {
    subject: "mathematics", topic: "Quadratic Equations", examBody: "WAEC", difficulty: "medium",
    question: "Solve for x: x² - 5x + 6 = 0",
    options: ["x = 2 or 3", "x = -2 or -3", "x = 1 or 6", "x = -1 or -6"],
    correctAnswer: "x = 2 or 3",
    explanation: "Factorizing: (x - 2)(x - 3) = 0, so x = 2 or x = 3."
  },
  {
    subject: "mathematics", topic: "Trigonometry", examBody: "JAMB", difficulty: "medium",
    question: "If sin θ = 3/5, and θ is acute, find cos θ.",
    options: ["4/5", "5/4", "3/4", "5/3"],
    correctAnswer: "4/5",
    explanation: "Using Pythagoras: opposite=3, hypotenuse=5, adjacent=4, so cos θ = 4/5."
  },
  {
    subject: "mathematics", topic: "Indices and Logarithms", examBody: "WAEC", difficulty: "medium",
    question: "Evaluate: log₂ 8",
    options: ["2", "3", "4", "8"],
    correctAnswer: "3",
    explanation: "2³ = 8, so log₂ 8 = 3."
  },
  {
    subject: "mathematics", topic: "Sets", examBody: "JAMB", difficulty: "easy",
    question: "If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, find A ∩ B.",
    options: ["{3, 4}", "{1, 2, 5, 6}", "{1, 2, 3, 4, 5, 6}", "{}"],
    correctAnswer: "{3, 4}",
    explanation: "Intersection means elements common to both sets: 3 and 4."
  },
  {
    subject: "mathematics", topic: "Statistics", examBody: "WAEC", difficulty: "medium",
    question: "Find the mean of: 4, 8, 6, 10, 12",
    options: ["8", "7", "9", "10"],
    correctAnswer: "8",
    explanation: "Sum = 40, number of values = 5, mean = 40/5 = 8."
  },
  {
    subject: "mathematics", topic: "Geometry", examBody: "WAEC", difficulty: "medium",
    question: "The sum of interior angles of a hexagon is:",
    options: ["720°", "360°", "540°", "900°"],
    correctAnswer: "720°",
    explanation: "Sum = (n-2) × 180° = (6-2) × 180° = 720°."
  },

  // ===================== ENGLISH LANGUAGE =====================
  {
    subject: "englishLanguage", topic: "Lexis and Structure (Grammar)", examBody: "JAMB", difficulty: "medium",
    question: "Choose the option that best completes the sentence: 'Neither the teacher nor the students ___ ready for the test.'",
    options: ["was", "were", "is", "have been"],
    correctAnswer: "were",
    explanation: "With 'neither...nor', the verb agrees with the subject nearer to it — 'students' is plural, so 'were' is correct."
  },
  {
    subject: "englishLanguage", topic: "Figures of Speech", examBody: "WAEC", difficulty: "easy",
    question: "'The classroom was a zoo during the break.' This sentence contains an example of:",
    options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
    correctAnswer: "Metaphor",
    explanation: "A metaphor directly states one thing IS another, without using 'like' or 'as'."
  },
  {
    subject: "englishLanguage", topic: "Parts of Speech", examBody: "JAMB", difficulty: "easy",
    question: "In the sentence 'She sang beautifully,' the word 'beautifully' is a/an:",
    options: ["Adverb", "Adjective", "Noun", "Verb"],
    correctAnswer: "Adverb",
    explanation: "'Beautifully' describes how she sang — modifying the verb — making it an adverb."
  },
  {
    subject: "englishLanguage", topic: "Tenses", examBody: "WAEC", difficulty: "medium",
    question: "By the time we arrived, the film ___ already.",
    options: ["had started", "has started", "started", "starts"],
    correctAnswer: "had started",
    explanation: "Past perfect ('had started') is used for an action completed before another past action."
  },
  {
    subject: "englishLanguage", topic: "Comprehension", examBody: "JAMB", difficulty: "medium",
    question: "The word 'meticulous' most nearly means:",
    options: ["Careless", "Careful and precise", "Quick", "Confused"],
    correctAnswer: "Careful and precise",
    explanation: "'Meticulous' describes someone who pays great attention to detail."
  },

  // ===================== PHYSICS =====================
  {
    subject: "physics", topic: "Newton's Laws", examBody: "WAEC", difficulty: "medium",
    question: "A resultant force of 10N acts on a mass of 2kg. Calculate the acceleration produced.",
    options: ["5 m/s²", "20 m/s²", "0.2 m/s²", "12 m/s²"],
    correctAnswer: "5 m/s²",
    explanation: "F = ma, so a = F/m = 10/2 = 5 m/s²."
  },
  {
    subject: "physics", topic: "Electricity", examBody: "JAMB", difficulty: "medium",
    question: "A current of 2A flows through a resistor of 5Ω. Find the voltage across it.",
    options: ["10V", "2.5V", "7V", "0.4V"],
    correctAnswer: "10V",
    explanation: "V = IR = 2 × 5 = 10V."
  },
  {
    subject: "physics", topic: "Work and Energy", examBody: "WAEC", difficulty: "medium",
    question: "Calculate the work done when a force of 20N moves an object through a distance of 5m in the direction of the force.",
    options: ["100 J", "25 J", "4 J", "15 J"],
    correctAnswer: "100 J",
    explanation: "Work = Force × distance = 20 × 5 = 100 Joules."
  },
  {
    subject: "physics", topic: "Motion", examBody: "JAMB", difficulty: "medium",
    question: "A car accelerates from rest to 20 m/s in 4 seconds. What is its acceleration?",
    options: ["5 m/s²", "80 m/s²", "0.2 m/s²", "16 m/s²"],
    correctAnswer: "5 m/s²",
    explanation: "a = (v - u)/t = (20 - 0)/4 = 5 m/s²."
  },
  {
    subject: "physics", topic: "Waves", examBody: "WAEC", difficulty: "medium",
    question: "A wave has a frequency of 50Hz and wavelength of 4m. Calculate its speed.",
    options: ["200 m/s", "12.5 m/s", "54 m/s", "0.08 m/s"],
    correctAnswer: "200 m/s",
    explanation: "Speed = frequency × wavelength = 50 × 4 = 200 m/s."
  },

  // ===================== CHEMISTRY =====================
  {
    subject: "chemistry", topic: "Stoichiometry", examBody: "WAEC", difficulty: "medium",
    question: "What is the molar mass of water (H₂O)? (H=1, O=16)",
    options: ["18 g/mol", "16 g/mol", "17 g/mol", "20 g/mol"],
    correctAnswer: "18 g/mol",
    explanation: "H₂O = (2 × 1) + 16 = 18 g/mol."
  },
  {
    subject: "chemistry", topic: "Acids and Bases", examBody: "JAMB", difficulty: "easy",
    question: "A solution with pH 3 is:",
    options: ["Strongly acidic", "Strongly basic", "Neutral", "Slightly basic"],
    correctAnswer: "Strongly acidic",
    explanation: "pH values below 7 indicate acidity; the lower the value, the stronger the acid."
  },
  {
    subject: "chemistry", topic: "Periodic Table", examBody: "WAEC", difficulty: "easy",
    question: "Elements in the same group of the periodic table have the same number of:",
    options: ["Valence electrons", "Neutrons", "Protons", "Energy levels"],
    correctAnswer: "Valence electrons",
    explanation: "Elements in a group share the same number of electrons in their outermost shell, giving them similar chemical properties."
  },
  {
    subject: "chemistry", topic: "Chemical Bonding", examBody: "JAMB", difficulty: "medium",
    question: "The type of bond formed by the complete transfer of electrons from one atom to another is called:",
    options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
    correctAnswer: "Ionic bond",
    explanation: "An ionic bond forms when electrons are transferred, creating oppositely charged ions that attract each other."
  },

  // ===================== BIOLOGY =====================
  {
    subject: "biology", topic: "Cell Structure and Function", examBody: "WAEC", difficulty: "easy",
    question: "The organelle responsible for photosynthesis in plant cells is the:",
    options: ["Chloroplast", "Mitochondrion", "Nucleus", "Ribosome"],
    correctAnswer: "Chloroplast",
    explanation: "Chloroplasts contain chlorophyll, which captures light energy for photosynthesis."
  },
  {
    subject: "biology", topic: "Respiration", examBody: "JAMB", difficulty: "medium",
    question: "The site of aerobic respiration in a cell is the:",
    options: ["Mitochondrion", "Nucleus", "Chloroplast", "Golgi body"],
    correctAnswer: "Mitochondrion",
    explanation: "Mitochondria are the site of aerobic respiration, producing ATP energy for the cell."
  },
  {
    subject: "biology", topic: "Classification of Living Things", examBody: "WAEC", difficulty: "medium",
    question: "Organisms that can manufacture their own food using sunlight are called:",
    options: ["Autotrophs", "Heterotrophs", "Saprophytes", "Parasites"],
    correctAnswer: "Autotrophs",
    explanation: "Autotrophs (like green plants) produce their own food through photosynthesis."
  },
  {
    subject: "biology", topic: "Genetics and Heredity", examBody: "JAMB", difficulty: "medium",
    question: "In genetics, an allele that is expressed even when only one copy is present is called:",
    options: ["Dominant", "Recessive", "Homozygous", "Codominant"],
    correctAnswer: "Dominant",
    explanation: "A dominant allele masks the effect of a recessive allele when both are present."
  }
];
