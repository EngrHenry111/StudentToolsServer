// JAMB-style Chemistry, batch 2. Same format as jamb-mathematics.js.

export default [
  // Atomic Structure
  { t: "Atomic Structure", d: "easy", q: "Which two particles have approximately the same mass?", o: ["Proton and electron", "Neutron and electron", "Proton and neutron", "Electron and positron only"], a: 2, x: "Protons and neutrons each have a mass of about 1 atomic mass unit. An electron is about 1840 times lighter." },
  { t: "Atomic Structure", q: "Rutherford's gold-foil (alpha-scattering) experiment showed that", o: ["electrons orbit in fixed shells", "atoms are indivisible", "neutrons exist", "an atom has a small, dense, positively charged nucleus"], a: 3, x: "Most alpha particles passed straight through, but a few bounced back. This showed the atom's mass and positive charge are concentrated in a tiny nucleus." },
  { t: "Atomic Structure", d: "easy", q: "What is the maximum number of electrons a p sub-level can hold?", o: ["6", "2", "10", "8"], a: 0, x: "A p sub-level has 3 orbitals, each holding 2 electrons: 6 in total." },
  { t: "Atomic Structure", q: "Which is the electron configuration of sodium (atomic number 11) in s and p notation?", o: ["1s² 2s² 2p⁷", "1s² 2s² 2p⁶ 3s¹", "1s² 2s² 2p⁶ 3p¹", "1s² 2s⁶ 2p³"], a: 1, x: "Fill in order 1s, 2s, 2p, 3s: 2 + 2 + 6 + 1 = 11 electrons." },

  // Chemical Bonding
  { t: "Chemical Bonding", q: "In solid iodine, the I₂ molecules are held together by", o: ["ionic bonds", "metallic bonds", "van der Waals forces", "hydrogen bonds"], a: 2, x: "Within each I₂ molecule the bond is covalent, but between molecules there are only weak van der Waals forces. That is why iodine sublimes easily." },
  { t: "Chemical Bonding", q: "Ionic compounds conduct electricity", o: ["as solids", "never", "only as gases", "when molten or dissolved in water"], a: 3, x: "Their ions can move only when the lattice is broken down, by melting or by dissolving." },
  { t: "Chemical Bonding", d: "easy", q: "How many electrons are shared in a double covalent bond?", o: ["4", "2", "6", "8"], a: 0, x: "Each bond is one shared pair. A double bond is two pairs: 4 electrons." },
  { t: "Chemical Bonding", q: "Which substance has a giant covalent structure?", o: ["Sodium chloride", "Diamond", "Iodine", "Water"], a: 1, x: "In diamond every carbon atom is covalently bonded to four others in a continuous network, which makes it very hard." },
  { t: "Chemical Bonding", q: "What is the shape of a carbon dioxide molecule?", o: ["Bent", "Tetrahedral", "Linear", "Pyramidal"], a: 2, x: "Carbon forms two double bonds and has no lone pairs, so O=C=O is linear (180°)." },

  // Acids and Bases
  { t: "Acids and Bases", d: "easy", q: "According to Brønsted and Lowry, an acid is a", o: ["proton acceptor", "electron donor", "hydroxide donor", "proton donor"], a: 3, x: "Acids donate H⁺ ions (protons) and bases accept them." },
  { t: "Acids and Bases", d: "easy", q: "Which salt forms when sulphuric acid is completely neutralised by potassium hydroxide?", o: ["K₂SO₄", "KSO₄", "KHSO₄", "K₂SO₃"], a: 0, x: "H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O. KHSO₄ would form with only one mole of KOH." },
  { t: "Acids and Bases", q: "An aqueous solution of sodium carbonate is", o: ["neutral", "alkaline", "acidic", "amphoteric"], a: 1, x: "It is the salt of a strong base and a weak acid. The carbonate ion hydrolyses to produce OH⁻ ions." },
  { t: "Acids and Bases", q: "What is the pH of a 0.01 mol/dm³ sodium hydroxide solution?", o: ["2", "10", "12", "14"], a: 2, x: "[OH⁻] = 10⁻² mol/dm³, so pOH = 2 and pH = 14 − 2 = 12." },
  { t: "Acids and Bases", q: "What is the basicity of tetraoxophosphate(V) acid, H₃PO₄?", o: ["1", "2", "4", "3"], a: 3, x: "Basicity is the number of replaceable hydrogen ions per molecule. H₃PO₄ has 3." },

  // Stoichiometry
  { t: "Stoichiometry", q: "Balance the equation C₃H₈ + xO₂ → 3CO₂ + 4H₂O. Find x.", o: ["5", "7", "10", "3"], a: 0, x: "The right-hand side has 6 + 4 = 10 oxygen atoms, so x = 10/2 = 5." },
  { t: "Stoichiometry", q: "4 g of sodium hydroxide is dissolved to make 500 cm³ of solution. Find its concentration. (NaOH = 40)", o: ["0.1 mol/dm³", "0.2 mol/dm³", "8 mol/dm³", "0.4 mol/dm³"], a: 1, x: "4/40 = 0.1 mol in 0.5 dm³, so the concentration is 0.1/0.5 = 0.2 mol/dm³." },
  { t: "Stoichiometry", d: "hard", q: "Find the percentage by mass of nitrogen in ammonium nitrate, NH₄NO₃. (N = 14, H = 1, O = 16)", o: ["17.5%", "28%", "35%", "46.7%"], a: 2, x: "Molar mass = 80 g/mol, of which nitrogen is 2 × 14 = 28 g. 28/80 × 100% = 35%." },
  { t: "Stoichiometry", q: "4 mol of hydrogen react with 1 mol of oxygen: 2H₂ + O₂ → 2H₂O. How many moles of water form?", o: ["4 mol", "1 mol", "3 mol", "2 mol"], a: 3, x: "Oxygen is the limiting reagent. 1 mol of O₂ reacts with 2 mol of H₂ to give 2 mol of water, and 2 mol of H₂ is left over." },
  { t: "Stoichiometry", q: "Find the mass of 3.01 × 10²³ carbon atoms. (C = 12; Avogadro's constant = 6.02 × 10²³)", o: ["6 g", "12 g", "3 g", "24 g"], a: 0, x: "3.01 × 10²³ atoms is 0.5 mol, and 0.5 × 12 = 6 g." },

  // Periodic Table
  { t: "Periodic Table", d: "easy", q: "Which of these is a transition metal?", o: ["Sodium", "Iron", "Calcium", "Aluminium"], a: 1, x: "Iron is in the d-block. Transition metals form coloured compounds, show variable valency and act as catalysts." },
  { t: "Periodic Table", q: "Which group 1 metal reacts most vigorously with water?", o: ["Lithium", "Sodium", "Rubidium", "Potassium"], a: 2, x: "Reactivity increases down group 1 as the outer electron is lost more easily. Rubidium is lowest of these four." },
  { t: "Periodic Table", q: "Which of these oxides is amphoteric?", o: ["Na₂O", "SO₂", "CO₂", "Al₂O₃"], a: 3, x: "Aluminium oxide reacts with both acids and alkalis. Na₂O is basic; SO₂ and CO₂ are acidic." },
  { t: "Periodic Table", d: "easy", q: "Who arranged the elements in order of atomic mass and left gaps for undiscovered elements?", o: ["Mendeleev", "Dalton", "Rutherford", "Bohr"], a: 0, x: "Mendeleev's 1869 table predicted elements such as gallium and germanium before they were found." },

  // States of Matter
  { t: "States of Matter", q: "An impure solid, compared with the pure substance, melts", o: ["at a higher, sharp temperature", "at a lower temperature and over a range", "at exactly the same temperature", "without absorbing heat"], a: 1, x: "Impurities lower the melting point and make it melt over a range. This is used as a test of purity." },
  { t: "States of Matter", d: "easy", q: "Brownian motion provides evidence that", o: ["gases are heavy", "liquids are incompressible", "particles of matter are in constant random motion", "atoms contain electrons"], a: 2, x: "Pollen grains or smoke particles jiggle because they are hit unevenly by moving, invisible molecules." },
  { t: "States of Matter", q: "A substance that absorbs moisture from the air until it dissolves in it is described as", o: ["efflorescent", "hygroscopic only", "volatile", "deliquescent"], a: 3, x: "Deliquescent substances, such as sodium hydroxide pellets and fused calcium chloride, absorb enough water to form a solution." },
  { t: "States of Matter", q: "Washing soda crystals (Na₂CO₃·10H₂O) lose some of their water of crystallisation when left in air. This is", o: ["efflorescence", "deliquescence", "sublimation", "condensation"], a: 0, x: "Efflorescent crystals give water to the atmosphere and become powdery." },

  // Electrolysis
  { t: "Electrolysis", q: "Which of these conducts electricity and is decomposed by it?", o: ["Solid sodium chloride", "Molten sodium chloride", "Sugar solution", "Ethanol"], a: 1, x: "Molten NaCl has mobile ions, so it is an electrolyte. Solid NaCl's ions are fixed, and sugar and ethanol do not form ions." },
  { t: "Electrolysis", d: "easy", q: "During electrolysis, negative ions (anions) move towards the", o: ["cathode", "electrolyte surface", "anode", "battery"], a: 2, x: "Anions are attracted to the positive electrode, the anode, where they lose electrons." },
  { t: "Electrolysis", d: "hard", q: "What volume of oxygen at s.t.p. is liberated at the anode by 4 faradays? (4OH⁻ → 2H₂O + O₂ + 4e⁻; molar volume 22.4 dm³)", o: ["5.6 dm³", "11.2 dm³", "89.6 dm³", "22.4 dm³"], a: 3, x: "4 mol of electrons give 1 mol of O₂, which occupies 22.4 dm³." },
  { t: "Electrolysis", q: "Which metal is the strongest reducing agent?", o: ["Potassium", "Copper", "Silver", "Zinc"], a: 0, x: "Potassium is highest in the electrochemical series, so it loses electrons most readily." },

  // Organic Chemistry
  { t: "Organic Chemistry", d: "easy", q: "Which homologous series has the general formula CₙH₂ₙ₋₂?", o: ["Alkanes", "Alkynes", "Alkenes", "Alkanols"], a: 1, x: "Alkynes contain a C≡C triple bond. An example is ethyne, C₂H₂." },
  { t: "Organic Chemistry", q: "Cracking of large alkane molecules produces", o: ["only hydrogen", "esters", "smaller alkanes and alkenes", "carbon and water"], a: 2, x: "Heat and a catalyst break long chains into more useful smaller molecules, such as petrol-range alkanes and alkenes for plastics." },
  { t: "Organic Chemistry", q: "Fermentation of glucose to ethanol is catalysed by", o: ["platinum", "iron", "dilute acid", "the enzyme zymase in yeast"], a: 3, x: "Yeast enzymes convert C₆H₁₂O₆ into 2C₂H₅OH + 2CO₂ without oxygen." },
  { t: "Organic Chemistry", q: "Methane reacts with chlorine in sunlight. This is an example of", o: ["substitution", "addition", "polymerisation", "esterification"], a: 0, x: "A hydrogen atom is replaced by chlorine: CH₄ + Cl₂ → CH₃Cl + HCl. Saturated alkanes undergo substitution." },
  { t: "Organic Chemistry", q: "Ethanol is heated under reflux with acidified potassium dichromate(VI). The final organic product is", o: ["ethene", "ethanoic acid", "ethane", "ethyl ethanoate"], a: 1, x: "The oxidising agent converts ethanol first to ethanal and then to ethanoic acid. The orange dichromate turns green." },

  // Gas Laws
  { t: "Gas Laws", d: "hard", q: "A gas occupies 2 dm³ at 27 °C and 1 atm. Find its volume at 327 °C and 2 atm.", o: ["1 dm³", "4 dm³", "2 dm³", "24 dm³"], a: 2, x: "V₂ = V₁ × (P₁/P₂) × (T₂/T₁) = 2 × (1/2) × (600/300) = 2 dm³. Doubling the pressure and doubling the absolute temperature cancel out." },
  { t: "Gas Laws", d: "easy", q: "Absolute zero on the Celsius scale is approximately", o: ["0 °C", "−100 °C", "273 °C", "−273 °C"], a: 3, x: "0 K = −273 °C, the temperature at which an ideal gas would have zero volume." },
  { t: "Gas Laws", q: "Equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules. This is", o: ["Avogadro's law", "Boyle's law", "Graham's law", "Dalton's law"], a: 0, x: "Avogadro's law is why one mole of any gas occupies 22.4 dm³ at s.t.p." },
  { t: "Gas Laws", q: "A gas has a vapour density of 22. Find its relative molecular mass.", o: ["11", "44", "22", "66"], a: 1, x: "Relative molecular mass = 2 × vapour density = 44. It could be CO₂." },
  { t: "Gas Laws", q: "A gas is collected over water at a total pressure of 101 kPa. The vapour pressure of water is 3 kPa. Find the pressure of the dry gas.", o: ["104 kPa", "101 kPa", "98 kPa", "3 kPa"], a: 2, x: "By Dalton's law, the total pressure = p(gas) + p(water vapour), so p(gas) = 101 − 3 = 98 kPa." },

  // Chemical Equilibrium
  { t: "Chemical Equilibrium", q: "In the Contact process, a temperature of about 450 °C is used because it", o: ["gives the highest possible yield", "is needed to melt the catalyst", "prevents explosions", "is a compromise between a good rate and a reasonable yield"], a: 3, x: "The forward reaction is exothermic, so lower temperatures favour yield but make the reaction too slow. 450 °C balances the two." },
  { t: "Chemical Equilibrium", q: "H₂(g) + I₂(g) ⇌ 2HI(g). What is the effect of increasing the pressure on the position of equilibrium?", o: ["No effect", "It shifts to the right", "It shifts to the left", "HI decomposes completely"], a: 0, x: "There are 2 moles of gas on each side, so pressure does not favour either direction." },
  { t: "Chemical Equilibrium", q: "White anhydrous copper(II) sulphate is added to water. It turns", o: ["green", "blue", "black", "colourless"], a: 1, x: "It forms blue hydrated copper(II) sulphate. The colour change is a test for water, and heating reverses it." },
  { t: "Chemical Equilibrium", q: "For the equilibrium H₂(g) + I₂(g) ⇌ 2HI(g), the equilibrium constant Kc has", o: ["units of mol/dm³", "units of dm³/mol", "no units", "units of (mol/dm³)²"], a: 2, x: "Kc = [HI]²/([H₂][I₂]). The units are (mol/dm³)² on top and on the bottom, so they cancel." }
];
