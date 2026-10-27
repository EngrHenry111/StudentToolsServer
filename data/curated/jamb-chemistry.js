// JAMB-style Chemistry, batch 1. Original questions. Relative atomic masses:
// H 1, C 12, O 16, Na 23, Ca 40, Cu 64, Ag 108. Same format as jamb-mathematics.js.

export default [
  // Atomic Structure
  { t: "Atomic Structure", q: "An ion X²⁺ has 10 electrons and a mass number of 24. How many protons does X have?", o: ["10", "12", "24", "14"], a: 1, x: "X²⁺ has lost 2 electrons, so the neutral atom has 12 electrons and therefore 12 protons. X is magnesium." },
  { t: "Atomic Structure", d: "easy", q: "Which element has the electron configuration 2, 8, 3?", o: ["Sodium", "Magnesium", "Aluminium", "Silicon"], a: 2, x: "2 + 8 + 3 = 13 electrons, so the atomic number is 13: aluminium." },
  { t: "Atomic Structure", q: "Which pair are isotopes?", o: ["¹²C and ¹⁴C", "¹⁴C and ¹⁴N", "O₂ and O₃", "Diamond and graphite"], a: 0, x: "Isotopes are atoms of the same element with different mass numbers. O₂/O₃ and diamond/graphite are allotropes; ¹⁴C and ¹⁴N are different elements." },
  { t: "Atomic Structure", q: "Chlorine is 75% chlorine-35 and 25% chlorine-37. Find its relative atomic mass.", o: ["36.0", "35.5", "35.0", "36.5"], a: 1, x: "(75 × 35 + 25 × 37)/100 = (2625 + 925)/100 = 35.5." },
  { t: "Atomic Structure", q: "What is the maximum number of electrons the third shell (n = 3) can hold?", o: ["8", "32", "18", "6"], a: 2, x: "The maximum is 2n² = 2 × 9 = 18." },
  { t: "Atomic Structure", d: "easy", q: "Which particle has a negligible mass compared with the others?", o: ["Proton", "Neutron", "Alpha particle", "Electron"], a: 3, x: "An electron's mass is about 1/1840 of a proton's, so it is usually treated as negligible." },

  // Chemical Bonding
  { t: "Chemical Bonding", q: "Which of these compounds is held together by covalent bonds?", o: ["MgO", "KCl", "CaF₂", "CCl₄"], a: 3, x: "In CCl₄ two non-metals share electrons. The others are metal–non-metal compounds with ionic bonds." },
  { t: "Chemical Bonding", q: "What is the approximate bond angle in a water molecule?", o: ["180°", "109.5°", "104.5°", "120°"], a: 2, x: "Oxygen has two bonding pairs and two lone pairs. The lone pairs repel more strongly, squeezing the angle below the tetrahedral 109.5° to about 104.5°." },
  { t: "Chemical Bonding", q: "Which of these substances has hydrogen bonding between its molecules?", o: ["CH₄", "H₂S", "H₂O", "HCl"], a: 2, x: "Hydrogen bonding needs hydrogen bonded to a very electronegative atom (N, O or F). Water's O–H bonds give it hydrogen bonding, which is why its boiling point is so high." },
  { t: "Chemical Bonding", q: "What type of covalent bond joins the two atoms in a nitrogen molecule (N₂)?", o: ["Single bond", "Double bond", "Dative bond", "Triple bond"], a: 3, x: "Each nitrogen atom shares three electrons, forming a triple bond (N≡N), which makes N₂ very unreactive." },
  { t: "Chemical Bonding", q: "How many lone pairs of electrons are on the nitrogen atom in ammonia (NH₃)?", o: ["0", "1", "2", "3"], a: 1, x: "Nitrogen has 5 outer electrons: 3 form bonds with hydrogen and 2 make one lone pair. This lone pair lets NH₃ form a dative bond with H⁺." },
  { t: "Chemical Bonding", q: "Metallic bonding explains why metals", o: ["have low melting points", "conduct electricity", "dissolve in water", "are brittle"], a: 1, x: "Metals have a 'sea' of delocalised electrons that move freely and carry current." },

  // Acids and Bases
  { t: "Acids and Bases", q: "What is the pH of a 0.001 mol/dm³ solution of hydrochloric acid?", o: ["1", "0.001", "3", "11"], a: 2, x: "[H⁺] = 10⁻³ mol/dm³, so pH = −log[H⁺] = 3." },
  { t: "Acids and Bases", q: "What volume of 0.1 mol/dm³ NaOH neutralises 25 cm³ of 0.2 mol/dm³ HCl?", o: ["25 cm³", "12.5 cm³", "100 cm³", "50 cm³"], a: 3, x: "They react 1:1. Moles of HCl = 0.2 × 0.025 = 0.005 mol, so the volume of NaOH = 0.005/0.1 = 0.05 dm³ = 50 cm³." },
  { t: "Acids and Bases", d: "easy", q: "Which of these is a weak acid?", o: ["Ethanoic acid", "Hydrochloric acid", "Nitric acid", "Sulphuric acid"], a: 0, x: "Ethanoic acid ionises only partly in water. The other three ionise completely, so they are strong acids." },
  { t: "Acids and Bases", q: "Which of these is an acid salt?", o: ["Na₂SO₄", "NaHSO₄", "NaCl", "Pb(OH)Cl"], a: 1, x: "NaHSO₄ still has a replaceable hydrogen ion. Pb(OH)Cl is a basic salt; the others are normal salts." },
  { t: "Acids and Bases", q: "Which indicator is most suitable for titrating a strong acid against a weak base?", o: ["Phenolphthalein", "Litmus", "Methyl orange", "Universal indicator"], a: 2, x: "At the end point of a strong acid–weak base titration the solution is slightly acidic, which suits methyl orange (it changes between pH 3 and 4.5)." },
  { t: "Acids and Bases", d: "easy", q: "An acid reacts with a metal carbonate to give", o: ["salt and hydrogen", "salt and water only", "base and water", "salt, water and carbon dioxide"], a: 3, x: "For example, CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. The CO₂ causes the fizzing." },

  // Stoichiometry
  { t: "Stoichiometry", d: "easy", q: "How many moles are in 9 g of water? (H = 1, O = 16)", o: ["0.5 mol", "2 mol", "9 mol", "0.25 mol"], a: 0, x: "The molar mass of H₂O is 18 g/mol, so 9/18 = 0.5 mol." },
  { t: "Stoichiometry", d: "easy", q: "What is the molar mass of calcium carbonate, CaCO₃?", o: ["68 g/mol", "100 g/mol", "84 g/mol", "116 g/mol"], a: 1, x: "40 + 12 + (3 × 16) = 100 g/mol." },
  { t: "Stoichiometry", q: "What mass of carbon dioxide is produced when 25 g of calcium carbonate is completely decomposed? (CaCO₃ → CaO + CO₂)", o: ["11 g", "14 g", "22 g", "44 g"], a: 0, x: "100 g of CaCO₃ gives 44 g of CO₂, so 25 g gives 11 g." },
  { t: "Stoichiometry", q: "How many atoms are in 1 mol of carbon dioxide? (Avogadro's constant = 6.02 × 10²³)", o: ["6.02 × 10²³", "1.81 × 10²⁴", "1.2 × 10²⁴", "3.01 × 10²³"], a: 1, x: "Each CO₂ molecule has 3 atoms, so 1 mol contains 3 × 6.02 × 10²³ = 1.81 × 10²⁴ atoms." },
  { t: "Stoichiometry", q: "What mass of oxygen gas (O₂) occupies 11.2 dm³ at s.t.p.? (O = 16; molar volume = 22.4 dm³)", o: ["32 g", "8 g", "16 g", "11.2 g"], a: 2, x: "11.2/22.4 = 0.5 mol, and 0.5 × 32 g/mol = 16 g." },
  { t: "Stoichiometry", d: "hard", q: "A hydrocarbon contains 80% carbon and 20% hydrogen by mass. Find its empirical formula.", o: ["CH", "CH₂", "CH₄", "CH₃"], a: 3, x: "Moles: C 80/12 = 6.67, H 20/1 = 20. The ratio 6.67 : 20 = 1 : 3, so CH₃ (the molecule is ethane, C₂H₆)." },

  // Periodic Table
  { t: "Periodic Table", d: "easy", q: "Elements in the same group of the periodic table have the same", o: ["number of shells", "mass number", "number of valence electrons", "number of neutrons"], a: 2, x: "A group shares the same outer-electron arrangement, which is why its members react in similar ways." },
  { t: "Periodic Table", q: "Across a period from left to right, electronegativity generally", o: ["decreases", "increases", "stays the same", "falls to zero"], a: 1, x: "Increasing nuclear charge and smaller atoms make the atoms attract bonding electrons more strongly." },
  { t: "Periodic Table", d: "easy", q: "Which halogen is a liquid at room temperature?", o: ["Fluorine", "Chlorine", "Bromine", "Iodine"], a: 2, x: "Bromine is a red-brown liquid. Fluorine and chlorine are gases; iodine is a solid." },
  { t: "Periodic Table", q: "An element has the electron configuration 2, 8, 2. In which group and period is it?", o: ["Group 3, period 2", "Group 2, period 3", "Group 2, period 2", "Group 8, period 3"], a: 1, x: "There are 2 valence electrons (group 2) in 3 shells (period 3). It is magnesium." },
  { t: "Periodic Table", d: "easy", q: "Noble gases are unreactive because", o: ["they are gases", "they have large atoms", "they have a stable full outer shell", "they have no electrons"], a: 2, x: "Their outer shells are complete (an octet, or a duplet for helium), so they have little tendency to gain, lose or share electrons." },
  { t: "Periodic Table", q: "Down a group, the first ionisation energy", o: ["increases", "stays constant", "first increases then decreases", "decreases"], a: 3, x: "The outer electron is further from the nucleus and more shielded, so it is removed more easily." },

  // States of Matter
  { t: "States of Matter", d: "easy", q: "The direct change from solid to gas is called", o: ["sublimation", "evaporation", "condensation", "fusion"], a: 0, x: "Sublimation skips the liquid state, as when solid iodine turns straight into violet vapour." },
  { t: "States of Matter", d: "easy", q: "Which of these substances sublimes on heating?", o: ["Sodium chloride", "Iodine", "Copper(II) sulphate", "Sand"], a: 1, x: "Iodine crystals turn directly into vapour when warmed." },
  { t: "States of Matter", d: "hard", q: "Under the same conditions, a gas diffuses half as fast as oxygen (M = 32). Find its relative molecular mass.", o: ["64", "16", "8", "128"], a: 3, x: "rate/rate(O₂) = √(32/M) = 1/2, so 32/M = 1/4 and M = 128." },
  { t: "States of Matter", d: "easy", q: "Diffusion is fastest in", o: ["solids", "liquids", "metals", "gases"], a: 3, x: "Gas particles move fastest and have the most space between them." },
  { t: "States of Matter", q: "A liquid boils when its saturated vapour pressure", o: ["equals the external (atmospheric) pressure", "is zero", "is less than atmospheric pressure", "is twice atmospheric pressure"], a: 0, x: "When the vapour pressure equals the pressure above the liquid, bubbles of vapour can form throughout it. This is why water boils below 100 °C on a mountain." },
  { t: "States of Matter", q: "According to the kinetic theory, the average kinetic energy of gas molecules is proportional to", o: ["volume", "absolute temperature", "pressure only", "molar mass"], a: 1, x: "Average kinetic energy ∝ T in kelvin. Doubling the absolute temperature doubles the average kinetic energy." },

  // Electrolysis
  { t: "Electrolysis", q: "Copper(II) sulphate solution is electrolysed using copper electrodes. What happens at the anode?", o: ["Copper dissolves", "Oxygen is given off", "Copper is deposited", "Hydrogen is given off"], a: 0, x: "The copper anode is oxidised: Cu → Cu²⁺ + 2e⁻. This is how copper is purified." },
  { t: "Electrolysis", q: "What mass of copper is deposited by 2 faradays of electricity? (Cu²⁺ + 2e⁻ → Cu; Cu = 64)", o: ["32 g", "128 g", "16 g", "64 g"], a: 3, x: "2 faradays (2 mol of electrons) deposit 1 mol of copper = 64 g." },
  { t: "Electrolysis", q: "What mass of silver is deposited by 9650 C? (Ag⁺ + e⁻ → Ag; Ag = 108; F = 96 500 C/mol)", o: ["10.8 g", "108 g", "1.08 g", "5.4 g"], a: 0, x: "9650 C = 0.1 mol of electrons, which deposits 0.1 mol of silver = 10.8 g." },
  { t: "Electrolysis", d: "easy", q: "When electroplating a spoon with silver, the spoon is made the", o: ["anode", "cathode", "electrolyte", "salt bridge"], a: 1, x: "Silver ions are reduced to silver metal at the cathode, so the object to be plated is the cathode." },
  { t: "Electrolysis", q: "What is produced at the anode during the electrolysis of concentrated sodium chloride solution (brine)?", o: ["Oxygen", "Sodium", "Chlorine", "Hydrogen"], a: 2, x: "In concentrated solution, Cl⁻ ions are discharged in preference to OH⁻, giving chlorine gas." },
  { t: "Electrolysis", d: "easy", q: "One faraday is the charge carried by", o: ["one electron", "one coulomb", "one ampere for one hour", "one mole of electrons"], a: 3, x: "1 F = 96 500 C, the charge on one mole of electrons." },

  // Organic Chemistry
  { t: "Organic Chemistry", d: "easy", q: "What is the molecular formula of the alkene with three carbon atoms?", o: ["C₃H₈", "C₃H₆", "C₃H₄", "C₂H₄"], a: 1, x: "Alkenes are CₙH₂ₙ, so with n = 3 it is C₃H₆ (propene)." },
  { t: "Organic Chemistry", d: "easy", q: "What is the IUPAC name of CH₃CHO?", o: ["Methanal", "Ethanol", "Ethanal", "Ethanoic acid"], a: 2, x: "It has two carbons (eth-) and an aldehyde group, –CHO (-al): ethanal." },
  { t: "Organic Chemistry", q: "Which reagent distinguishes ethanoic acid from ethanol?", o: ["Water", "Bromine water", "Sodium hydrogencarbonate solution", "Sodium chloride solution"], a: 2, x: "Ethanoic acid fizzes with sodium hydrogencarbonate, giving off CO₂. Ethanol does not react." },
  { t: "Organic Chemistry", d: "easy", q: "What is the functional group of the carboxylic acids?", o: ["–OH", "–CHO", "–CO–", "–COOH"], a: 3, x: "Carboxylic acids such as ethanoic acid (CH₃COOH) contain the carboxyl group, –COOH." },
  { t: "Organic Chemistry", q: "What is the IUPAC name of CH₃COOCH₃?", o: ["Ethyl methanoate", "Methyl ethanoate", "Methyl methanoate", "Ethyl ethanoate"], a: 1, x: "The CH₃COO– part comes from ethanoic acid (ethanoate) and the –CH₃ from methanol (methyl): methyl ethanoate." },
  { t: "Organic Chemistry", q: "Nylon is made by", o: ["addition polymerisation", "condensation polymerisation", "cracking", "fermentation"], a: 1, x: "Monomers join with the loss of small molecules such as water, which is condensation polymerisation. Polythene forms by addition." },

  // Gas Laws
  { t: "Gas Laws", q: "A gas at 2 atm occupies 3 dm³. At constant temperature the pressure is raised to 6 atm. Find the new volume.", o: ["9 dm³", "4 dm³", "1 dm³", "0.5 dm³"], a: 2, x: "Boyle's law: V₂ = P₁V₁/P₂ = 2 × 3/6 = 1 dm³." },
  { t: "Gas Laws", d: "hard", q: "A gas occupies 4 dm³ at 27 °C. At constant pressure, what is its volume at 127 °C?", o: ["18.8 dm³", "3 dm³", "4.27 dm³", "5.33 dm³"], a: 3, x: "Convert to kelvin: 300 K and 400 K. V₂ = 4 × 400/300 = 5.33 dm³. Using °C directly would wrongly give 18.8." },
  { t: "Gas Laws", d: "easy", q: "Which equation is the ideal gas equation?", o: ["PV = nRT", "PV = constant", "P/T = nR", "V = nRT/T"], a: 0, x: "PV = nRT combines Boyle's, Charles's and Avogadro's laws; R = 8.314 J/mol K." },
  { t: "Gas Laws", d: "easy", q: "A container holds oxygen at a partial pressure of 40 kPa and nitrogen at 60 kPa. Find the total pressure.", o: ["20 kPa", "100 kPa", "50 kPa", "2400 kPa"], a: 1, x: "Dalton's law of partial pressures: the total pressure is the sum, 40 + 60 = 100 kPa." },
  { t: "Gas Laws", q: "2H₂(g) + O₂(g) → 2H₂O(g). What volume of oxygen reacts with 20 cm³ of hydrogen at the same temperature and pressure?", o: ["20 cm³", "40 cm³", "10 cm³", "5 cm³"], a: 2, x: "By Gay-Lussac's law, gas volumes react in the ratio of their moles, 2 : 1, so 20 cm³ of H₂ needs 10 cm³ of O₂." },
  { t: "Gas Laws", d: "easy", q: "Standard temperature and pressure (s.t.p.) means", o: ["0 K and 1 atm", "25 °C and 1 atm", "273 °C and 760 mmHg", "273 K and 760 mmHg"], a: 3, x: "s.t.p. is 0 °C (273 K) and 1 atmosphere (760 mmHg or 101 325 Pa)." },

  // Chemical Equilibrium
  { t: "Chemical Equilibrium", q: "2SO₂(g) + O₂(g) ⇌ 2SO₃(g). What happens if SO₃ is removed as it forms?", o: ["The equilibrium shifts right, producing more SO₃", "The equilibrium shifts left", "There is no effect", "The reaction stops"], a: 0, x: "Le Chatelier: removing a product makes the system replace it, so the equilibrium shifts to the right." },
  { t: "Chemical Equilibrium", q: "What is the effect of a catalyst on a reaction at equilibrium?", o: ["It shifts the equilibrium to the right", "It makes equilibrium reached faster but does not change its position", "It increases the yield", "It shifts the equilibrium to the left"], a: 1, x: "A catalyst speeds up the forward and backward reactions equally, so equilibrium is reached sooner with the same yield." },
  { t: "Chemical Equilibrium", q: "For an endothermic forward reaction at equilibrium, increasing the temperature", o: ["decreases the yield of product", "has no effect", "increases the yield of product", "stops the reaction"], a: 2, x: "Higher temperature favours the endothermic direction, which here is the forward reaction, so the yield rises." },
  { t: "Chemical Equilibrium", q: "What is the equilibrium constant expression, Kc, for H₂(g) + I₂(g) ⇌ 2HI(g)?", o: ["[H₂][I₂]/[HI]²", "[HI]/([H₂][I₂])", "2[HI]/([H₂][I₂])", "[HI]²/([H₂][I₂])"], a: 3, x: "Kc = [products]/[reactants], each concentration raised to the power of its coefficient in the equation." },
  { t: "Chemical Equilibrium", d: "easy", q: "A reaction is in dynamic equilibrium when", o: ["the forward and backward rates are equal", "the reaction has stopped", "all reactants are used up", "the concentrations of reactants and products are equal"], a: 0, x: "Both reactions continue at the same rate, so the concentrations stay constant, though they are not necessarily equal." },
  { t: "Chemical Equilibrium", d: "easy", q: "What catalyst is used in the Contact process for making sulphuric acid?", o: ["Iron", "Vanadium(V) oxide", "Nickel", "Manganese(IV) oxide"], a: 1, x: "Vanadium(V) oxide catalyses 2SO₂ + O₂ ⇌ 2SO₃. Iron is the Haber process catalyst." }
];
