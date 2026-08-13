// FILE: /services/topicBank.js
//
// Curriculum coverage for WAEC/NECO/JAMB (senior secondary) and the
// Nigerian Basic Education Curriculum (junior secondary). Grouped below
// by category purely for readability — the AI quiz engine just sees a
// flat map of subject -> topics, exactly as before.

export const topicBank = {

  // ===================== SCIENCES (Senior Secondary) =====================

  mathematics: [
    "Algebra", "Quadratic Equations", "Trigonometry", "Calculus",
    "Probability", "Statistics", "Geometry", "Indices and Logarithms",
    "Sets", "Functions"
  ],

  physics: [
    "Newton's Laws", "Work and Energy", "Waves", "Electricity",
    "Heat and Thermodynamics", "Magnetism", "Optics", "Motion",
    "Pressure", "Gravitation"
  ],

  chemistry: [
    "Atomic Structure", "Chemical Bonding", "Acids and Bases", "Stoichiometry",
    "Periodic Table", "States of Matter", "Electrolysis", "Organic Chemistry",
    "Gas Laws", "Chemical Equilibrium"
  ],

  biology: [
    "Cell Structure and Function", "Classification of Living Things",
    "Ecology and Ecosystems", "Nutrition in Plants and Animals",
    "Reproduction in Plants", "Reproduction in Animals",
    "Genetics and Heredity", "Respiration", "Excretion",
    "Nervous System and Coordination"
  ],

  agriculturalScience: [
    "Soil and Soil Fertility", "Crop Production", "Livestock Production",
    "Farm Tools and Machinery", "Agricultural Economics",
    "Pests and Disease Control", "Forestry and Wildlife", "Fisheries",
    "Farm Management", "Agroforestry"
  ],

  computerScience: [
    "Introduction to Computers", "Number Systems",
    "Algorithms and Flowcharts", "Programming Basics (Python)",
    "Data Structures", "Computer Networks", "Database Concepts",
    "Internet and Web Technologies", "Cybersecurity Basics",
    "Operating Systems"
  ],

  // ===================== LANGUAGE & LITERATURE =====================

  englishLanguage: [
    "Comprehension", "Lexis and Structure (Grammar)", "Essay Writing",
    "Letter Writing", "Summary Writing", "Oral English (Phonetics)",
    "Figures of Speech", "Parts of Speech", "Tenses", "Report Writing"
  ],

  literatureInEnglish: [
    "Prose Analysis", "Poetry Analysis", "Drama Analysis",
    "Themes in African Literature", "Literary Devices", "Characterization",
    "Setting and Plot", "Non-African Literary Texts",
    "Figures of Speech in Literature", "Critical Appreciation"
  ],

  // ===================== ARTS / COMMERCIAL =====================

  government: [
    "Basic Concepts in Government", "Forms of Government",
    "The Nigerian Constitution", "Arms of Government", "Political Parties",
    "Pressure Groups", "Citizenship", "International Organizations (UN, AU)",
    "Local Government Administration", "Electoral Process"
  ],

  economics: [
    "Basic Economic Concepts", "Demand and Supply", "Theory of Production",
    "Market Structures", "Money and Banking", "National Income",
    "Inflation", "International Trade", "Economic Planning",
    "Population and Economic Development"
  ],

  geography: [
    "Map Reading and Interpretation", "Weather and Climate",
    "Landforms and Relief", "Population Geography",
    "Economic Geography of Nigeria", "Vegetation Belts",
    "Rivers and Drainage Systems", "Soil Types and Erosion",
    "Settlement Patterns", "Environmental Issues"
  ],

  history: [
    "Pre-colonial Nigerian Societies", "Trans-Atlantic Slave Trade",
    "Colonization of Nigeria", "Nationalism and Independence Movements",
    "Nigerian Civil War", "Post-Independence Nigeria",
    "West African Empires", "Colonial Administration",
    "Amalgamation of Nigeria", "Constitutional Development"
  ],

  civicEducation: [
    "Citizenship and National Identity", "Human Rights", "Rule of Law",
    "Democracy and Democratic Institutions", "Corruption and Its Effects",
    "National Values", "Duties and Responsibilities of Citizens",
    "Conflict Resolution", "Federal Character Principle", "Civil Society"
  ],

  commerce: [
    "Introduction to Commerce", "Trade and Types of Trade",
    "Business Organizations", "Insurance", "Banking Services",
    "Warehousing", "Advertising", "Stock Exchange",
    "Consumer Protection", "E-commerce"
  ],

  financialAccounting: [
    "Accounting Concepts and Principles", "The Accounting Equation",
    "Double Entry Bookkeeping", "Trial Balance", "Final Accounts",
    "Depreciation", "Bank Reconciliation Statements",
    "Accounting for Partnerships", "Control Accounts",
    "Correction of Errors"
  ],

  // ===================== JUNIOR SECONDARY (JSS) =====================

  basicScience: [
    "Living and Non-living Things", "Human Body Systems",
    "States of Matter", "Simple Machines", "Energy and Its Forms",
    "Basic Ecology", "Water and Its Uses", "Weather and Climate Basics",
    "Force and Motion", "Health and Hygiene"
  ],

  basicTechnology: [
    "Introduction to Technology", "Tools and Their Uses",
    "Technical Drawing Basics", "Woodwork Basics", "Metalwork Basics",
    "Electrical and Electronics Basics", "Building and Construction Basics",
    "Safety in the Workshop", "Basic Machines", "Plastic and Rubber Technology"
  ]

};

// Human-friendly display labels, since a few subject keys don't
// title-case cleanly on their own (e.g. "crs" or camelCase compounds).
// The client mirrors this list — keep both in sync when adding subjects.
export const subjectLabels = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  agriculturalScience: "Agricultural Science",
  computerScience: "Computer Science",
  englishLanguage: "English Language",
  literatureInEnglish: "Literature in English",
  government: "Government",
  economics: "Economics",
  geography: "Geography",
  history: "History",
  civicEducation: "Civic Education",
  commerce: "Commerce",
  financialAccounting: "Financial Accounting",
  basicScience: "Basic Science (JSS)",
  basicTechnology: "Basic Technology (JSS)"
};
