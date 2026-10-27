// JAMB-style Physics, batch 1. Original questions; g = 10 m/s² throughout.
// Same format as jamb-mathematics.js.

export default [
  // Newton's Laws
  { t: "Newton's Laws", d: "easy", q: "A resultant force of 30 N gives a body an acceleration of 6 m/s². Find the mass of the body.", o: ["180 kg", "0.2 kg", "5 kg", "36 kg"], a: 2, x: "m = F/a = 30/6 = 5 kg." },
  { t: "Newton's Laws", d: "easy", q: "Find the momentum of a 2 kg body moving at 3 m/s.", o: ["6 kg m/s", "1.5 kg m/s", "5 kg m/s", "9 kg m/s"], a: 0, x: "Momentum p = mv = 2 × 3 = 6 kg m/s." },
  { t: "Newton's Laws", q: "A force of 10 N acts on a 2 kg body at rest for 3 s. Find its final velocity.", o: ["5 m/s", "6.7 m/s", "60 m/s", "15 m/s"], a: 3, x: "a = F/m = 5 m/s², and v = u + at = 0 + 5 × 3 = 15 m/s. (Or: impulse Ft = 30 N s = change in momentum, so v = 30/2.)" },
  { t: "Newton's Laws", q: "Passengers in a bus jerk forward when the bus stops suddenly. This is explained by", o: ["Newton's third law", "inertia", "the principle of moments", "friction alone"], a: 1, x: "By Newton's first law, the passengers' bodies tend to keep moving forward when the bus stops: this is inertia." },
  { t: "Newton's Laws", q: "A 60 kg man stands in a lift accelerating upwards at 2 m/s². Find the reaction of the floor on him.", o: ["480 N", "600 N", "120 N", "720 N"], a: 3, x: "R − mg = ma, so R = m(g + a) = 60 × 12 = 720 N." },
  { t: "Newton's Laws", q: "A 4 kg gun fires a 0.02 kg bullet at 400 m/s. Find the recoil velocity of the gun.", o: ["2 m/s", "8 m/s", "0.5 m/s", "20 m/s"], a: 0, x: "Momentum is conserved: 0.02 × 400 = 4v, so v = 8/4 = 2 m/s, in the opposite direction." },

  // Work and Energy
  { t: "Work and Energy", d: "easy", q: "Find the work done in lifting a 20 kg load through a height of 3 m.", o: ["60 J", "600 J", "6000 J", "200 J"], a: 1, x: "Work = mgh = 20 × 10 × 3 = 600 J." },
  { t: "Work and Energy", d: "easy", q: "Find the kinetic energy of a 4 kg body moving at 5 m/s.", o: ["20 J", "100 J", "40 J", "50 J"], a: 3, x: "KE = ½mv² = ½ × 4 × 25 = 50 J." },
  { t: "Work and Energy", q: "A machine does 3000 J of work in 1 minute. Find its power.", o: ["3000 W", "50 W", "180 kW", "300 W"], a: 1, x: "Power = work ÷ time = 3000 J ÷ 60 s = 50 W." },
  { t: "Work and Energy", q: "A pulley system with a velocity ratio of 4 lifts a 600 N load with an effort of 200 N. Find its efficiency.", o: ["75%", "133%", "25%", "80%"], a: 0, x: "MA = load/effort = 600/200 = 3. Efficiency = MA/VR × 100% = 3/4 × 100% = 75%." },
  { t: "Work and Energy", q: "A stone is dropped from a height of 20 m. Neglecting air resistance, find its speed just before it hits the ground.", o: ["200 m/s", "10 m/s", "20 m/s", "40 m/s"], a: 2, x: "Potential energy becomes kinetic energy: v = √(2gh) = √(2 × 10 × 20) = √400 = 20 m/s." },
  { t: "Work and Energy", q: "One kilowatt-hour (kWh) is equal to", o: ["3.6 × 10⁶ J", "1000 J", "3600 J", "3.6 × 10⁵ J"], a: 0, x: "1 kWh = 1000 W × 3600 s = 3 600 000 J = 3.6 × 10⁶ J." },

  // Waves
  { t: "Waves", q: "A radio station broadcasts at 100 MHz. Find the wavelength of its waves. (Speed of electromagnetic waves = 3 × 10⁸ m/s)", o: ["30 m", "0.3 m", "300 m", "3 m"], a: 3, x: "λ = v/f = 3 × 10⁸ / (100 × 10⁶) = 3 m." },
  { t: "Waves", d: "easy", q: "Which of these is a longitudinal wave?", o: ["Light", "Sound in air", "Radio waves", "Water ripples"], a: 1, x: "In sound, air particles vibrate along the direction the wave travels, making it longitudinal. Light and radio waves are transverse." },
  { t: "Waves", d: "easy", q: "Find the period of a wave of frequency 25 Hz.", o: ["25 s", "0.25 s", "0.04 s", "4 s"], a: 2, x: "T = 1/f = 1/25 = 0.04 s." },
  { t: "Waves", q: "A boy hears the echo of his shout from a cliff 2 s after shouting. If sound travels at 340 m/s, how far away is the cliff?", o: ["170 m", "680 m", "340 m", "1360 m"], a: 2, x: "The sound goes to the cliff and back: 2d = 340 × 2, so d = 340 m." },
  { t: "Waves", d: "hard", q: "A pipe closed at one end is 0.85 m long. If the speed of sound is 340 m/s, find its fundamental frequency.", o: ["100 Hz", "200 Hz", "400 Hz", "50 Hz"], a: 0, x: "For a closed pipe the fundamental has λ = 4L = 3.4 m, so f = v/λ = 340/3.4 = 100 Hz." },
  { t: "Waves", q: "Diffraction of a wave through a gap is most noticeable when the gap width is", o: ["much larger than the wavelength", "about the same as the wavelength", "zero", "twice the amplitude"], a: 1, x: "Waves spread out most when the gap is comparable to their wavelength." },

  // Electricity
  { t: "Electricity", q: "Find the effective resistance of three 6 Ω resistors connected in parallel.", o: ["18 Ω", "2 Ω", "6 Ω", "0.5 Ω"], a: 1, x: "1/R = 1/6 + 1/6 + 1/6 = 3/6, so R = 2 Ω. Identical resistors in parallel: R ÷ number of resistors." },
  { t: "Electricity", d: "easy", q: "What current flows through a 6 Ω resistor connected to 12 V?", o: ["72 A", "0.5 A", "18 A", "2 A"], a: 3, x: "I = V/R = 12/6 = 2 A." },
  { t: "Electricity", d: "easy", q: "A 100 W bulb is left on for 10 hours. How much electrical energy does it use?", o: ["1 kWh", "1000 kWh", "10 kWh", "0.1 kWh"], a: 0, x: "Energy = 0.1 kW × 10 h = 1 kWh." },
  { t: "Electricity", q: "A battery of e.m.f. 12 V and internal resistance 2 Ω drives a current of 1.5 A through an external resistor. Find the external resistance.", o: ["8 Ω", "6 Ω", "4 Ω", "18 Ω"], a: 1, x: "E = I(R + r): 12 = 1.5(R + 2), so R + 2 = 8 and R = 6 Ω." },
  { t: "Electricity", q: "A current of 2 A flows for 5 minutes. How much charge passes?", o: ["10 C", "2.5 C", "600 C", "150 C"], a: 2, x: "Q = It = 2 × 300 s = 600 C." },
  { t: "Electricity", q: "Find the power dissipated when a current of 3 A flows through a 10 Ω resistor.", o: ["30 W", "3.3 W", "300 W", "90 W"], a: 3, x: "P = I²R = 9 × 10 = 90 W." },

  // Heat and Thermodynamics
  { t: "Heat and Thermodynamics", q: "A 0.5 kg copper block is heated from 20 °C to 100 °C. How much heat does it absorb? (Specific heat capacity of copper = 400 J/kg K)", o: ["16 000 J", "20 000 J", "4000 J", "160 000 J"], a: 0, x: "Q = mcΔθ = 0.5 × 400 × 80 = 16 000 J." },
  { t: "Heat and Thermodynamics", d: "easy", q: "A thermometer reads −23 °C. What is this temperature in kelvin?", o: ["296 K", "250 K", "−250 K", "23 K"], a: 1, x: "T = θ + 273 = −23 + 273 = 250 K." },
  { t: "Heat and Thermodynamics", q: "A gas occupies 2 L at 300 K. At constant pressure, what is its volume at 450 K?", o: ["1.33 L", "4.5 L", "3 L", "2.5 L"], a: 2, x: "Charles's law: V₂ = V₁T₂/T₁ = 2 × 450/300 = 3 L." },
  { t: "Heat and Thermodynamics", q: "How much heat turns 0.2 kg of boiling water at 100 °C into steam? (Specific latent heat of vaporisation = 2.26 × 10⁶ J/kg)", o: ["2.26 × 10⁵ J", "1.13 × 10⁷ J", "4.52 × 10⁶ J", "4.52 × 10⁵ J"], a: 3, x: "Q = mL = 0.2 × 2.26 × 10⁶ = 4.52 × 10⁵ J. The temperature stays at 100 °C while it boils." },
  { t: "Heat and Thermodynamics", d: "easy", q: "A vacuum flask reduces heat loss by conduction and convection mainly because of its", o: ["silvered walls", "vacuum between the double walls", "plastic outer case", "narrow neck"], a: 1, x: "Conduction and convection need particles, and the vacuum has none. The silvered walls reduce heat transfer by radiation." },
  { t: "Heat and Thermodynamics", q: "A gas at 4 atm occupies 6 L. At constant temperature it is compressed to 3 L. Find the new pressure.", o: ["2 atm", "8 atm", "12 atm", "6 atm"], a: 1, x: "Boyle's law: P₁V₁ = P₂V₂, so P₂ = 4 × 6/3 = 8 atm." },

  // Magnetism
  { t: "Magnetism", q: "A wire 0.5 m long carries 4 A at right angles to a magnetic field of 0.2 T. Find the force on it.", o: ["0.1 N", "10 N", "0.4 N", "1.6 N"], a: 2, x: "F = BIL = 0.2 × 4 × 0.5 = 0.4 N." },
  { t: "Magnetism", d: "easy", q: "The best material for the core of an electromagnet is", o: ["steel", "copper", "aluminium", "soft iron"], a: 3, x: "Soft iron magnetises and demagnetises easily, so the magnet switches off when the current stops. Steel keeps its magnetism." },
  { t: "Magnetism", q: "A transformer has 200 turns in the primary and 50 in the secondary. If the primary voltage is 240 V, find the secondary voltage.", o: ["60 V", "960 V", "48 V", "120 V"], a: 0, x: "Vs/Vp = Ns/Np, so Vs = 240 × 50/200 = 60 V. It is a step-down transformer." },
  { t: "Magnetism", q: "Which rule gives the direction of the force on a current-carrying conductor in a magnetic field?", o: ["Fleming's right-hand rule", "Fleming's left-hand rule", "Lenz's law", "Right-hand grip rule"], a: 1, x: "Fleming's left-hand rule is the motor rule. The right-hand rule gives the direction of induced current in a generator." },
  { t: "Magnetism", q: "What is the angle of dip at the magnetic equator?", o: ["90°", "45°", "0°", "180°"], a: 2, x: "At the magnetic equator the Earth's field is horizontal, so a freely suspended needle does not dip: 0°." },
  { t: "Magnetism", d: "hard", q: "An ideal transformer steps 240 V down to 12 V. If the primary current is 0.5 A, find the secondary current.", o: ["0.025 A", "1 A", "20 A", "10 A"], a: 3, x: "Power in = power out: 240 × 0.5 = 12 × Is, so Is = 120/12 = 10 A." },

  // Optics
  { t: "Optics", q: "An object is placed 20 cm from a concave mirror of focal length 15 cm. Find the image distance.", o: ["60 cm", "8.6 cm", "35 cm", "5 cm"], a: 0, x: "1/v = 1/f − 1/u = 1/15 − 1/20 = 1/60, so v = 60 cm (a real, magnified image)." },
  { t: "Optics", q: "Light passes from air into glass with an angle of incidence of 45° and an angle of refraction of 30°. Find the refractive index of the glass.", o: ["1.5", "√2", "√3", "0.71"], a: 1, x: "n = sin i/sin r = (√2/2)/(1/2) = √2 ≈ 1.41." },
  { t: "Optics", q: "The critical angle of a transparent material is 30°. Find its refractive index.", o: ["1.5", "2", "0.5", "1.33"], a: 1, x: "n = 1/sin C = 1/sin 30° = 1/0.5 = 2." },
  { t: "Optics", d: "easy", q: "The image formed by a plane mirror is", o: ["real and inverted", "real and magnified", "virtual and diminished", "virtual, upright and laterally inverted"], a: 3, x: "A plane mirror forms a virtual, upright image of the same size, laterally inverted (left and right swapped)." },
  { t: "Optics", q: "A diverging lens has a power of −5 D. Find its focal length.", o: ["−20 cm", "−5 cm", "−50 cm", "+20 cm"], a: 0, x: "f = 1/P = 1/(−5) = −0.2 m = −20 cm. The negative sign marks a diverging lens." },
  { t: "Optics", q: "An object 20 cm from a lens forms an image 60 cm from the lens. Find the magnification.", o: ["1/3", "3", "40", "80"], a: 1, x: "m = v/u = 60/20 = 3." },

  // Motion
  { t: "Motion", q: "A car starts from rest and accelerates at 2 m/s² for 5 s. How far does it travel?", o: ["10 m", "50 m", "25 m", "20 m"], a: 2, x: "s = ut + ½at² = 0 + ½ × 2 × 25 = 25 m." },
  { t: "Motion", d: "easy", q: "The area under a velocity–time graph represents", o: ["acceleration", "speed", "force", "displacement"], a: 3, x: "Velocity × time = displacement, so the area under the graph gives displacement. The gradient gives acceleration." },
  { t: "Motion", q: "A car slows uniformly from 20 m/s to rest in 4 s. Find its deceleration.", o: ["5 m/s²", "80 m/s²", "0.2 m/s²", "16 m/s²"], a: 0, x: "a = (v − u)/t = (0 − 20)/4 = −5 m/s², a deceleration of 5 m/s²." },
  { t: "Motion", d: "hard", q: "A ball is projected at 20 m/s at 30° above the horizontal. Find its time of flight.", o: ["1 s", "2 s", "4 s", "3.5 s"], a: 1, x: "T = 2u sin θ/g = 2 × 20 × 0.5/10 = 2 s." },
  { t: "Motion", q: "A ball is thrown vertically upwards at 30 m/s. Find the maximum height it reaches.", o: ["90 m", "30 m", "45 m", "60 m"], a: 2, x: "At the top v = 0: h = u²/2g = 900/20 = 45 m." },
  { t: "Motion", q: "A body moves in a circle of radius 2 m at a constant speed of 4 m/s. Find its centripetal acceleration.", o: ["2 m/s²", "16 m/s²", "32 m/s²", "8 m/s²"], a: 3, x: "a = v²/r = 16/2 = 8 m/s², directed towards the centre." },

  // Pressure
  { t: "Pressure", q: "Find the pressure due to water at a depth of 2 m. (Density of water = 1000 kg/m³)", o: ["2 × 10⁴ Pa", "2 × 10³ Pa", "5 × 10³ Pa", "2 × 10⁵ Pa"], a: 0, x: "P = hρg = 2 × 1000 × 10 = 2 × 10⁴ Pa (not counting atmospheric pressure)." },
  { t: "Pressure", q: "In a hydraulic press, a force of 50 N acts on a piston of area 0.01 m². What force acts on the larger piston of area 0.5 m²?", o: ["250 N", "2500 N", "1 N", "25 000 N"], a: 1, x: "Pressure is transmitted equally: 50/0.01 = F/0.5, so F = 5000 × 0.5 = 2500 N." },
  { t: "Pressure", d: "easy", q: "A force of 600 N acts on an area of 0.3 m². Find the pressure.", o: ["180 Pa", "200 Pa", "2000 Pa", "1800 Pa"], a: 2, x: "P = F/A = 600/0.3 = 2000 Pa." },
  { t: "Pressure", d: "easy", q: "Standard atmospheric pressure supports a column of mercury of height", o: ["10 m", "100 cm", "760 cm", "76 cm"], a: 3, x: "Standard atmospheric pressure equals 76 cm (760 mm) of mercury." },
  { t: "Pressure", q: "A body weighs 20 N in air and 15 N when fully immersed in water. Find the upthrust on it.", o: ["5 N", "35 N", "15 N", "1.33 N"], a: 0, x: "Upthrust = apparent loss in weight = 20 − 15 = 5 N (Archimedes' principle)." },
  { t: "Pressure", q: "A block of wood of density 800 kg/m³ floats in water. What fraction of its volume is under water?", o: ["0.2", "0.8", "1.25", "All of it"], a: 1, x: "A floating body displaces its own weight of water, so the fraction submerged = 800/1000 = 0.8." },

  // Gravitation
  { t: "Gravitation", d: "easy", q: "Find the weight of a 60 kg astronaut on the Moon, where g = 1.6 m/s².", o: ["600 N", "37.5 N", "96 N", "60 N"], a: 2, x: "W = mg = 60 × 1.6 = 96 N. The mass is still 60 kg." },
  { t: "Gravitation", q: "Two masses attract each other with a force F. If each mass is doubled and the distance between them is unchanged, the force becomes", o: ["2F", "F/4", "4F", "F"], a: 2, x: "F ∝ m₁m₂, so doubling both masses multiplies the force by 2 × 2 = 4." },
  { t: "Gravitation", q: "The escape velocity from the surface of a planet of radius R is", o: ["√(2gR)", "√(gR)", "2gR", "gR²"], a: 0, x: "Setting ½mv² equal to the work needed to escape (mgR) gives v = √(2gR)." },
  { t: "Gravitation", d: "easy", q: "What is the period of a geostationary satellite?", o: ["12 hours", "24 hours", "1 hour", "365 days"], a: 1, x: "It orbits once every 24 hours, matching the Earth's rotation, so it stays above the same point." },
  { t: "Gravitation", d: "hard", q: "At a height above the Earth's surface equal to the Earth's radius, the acceleration due to gravity is", o: ["g/2", "2g", "g/4", "g"], a: 2, x: "The distance from the centre doubles, so g falls by a factor of 2² = 4." },
  { t: "Gravitation", q: "What is the SI unit of the universal gravitational constant G?", o: ["N kg⁻¹", "N m kg⁻¹", "m s⁻²", "N m² kg⁻²"], a: 3, x: "From F = Gm₁m₂/r², G = Fr²/(m₁m₂), so its unit is N m² kg⁻²." }
];
