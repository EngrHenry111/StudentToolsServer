// JAMB-style Physics, batch 2. g = 10 m/s². Same format as jamb-mathematics.js.

export default [
  // Newton's Laws
  { t: "Newton's Laws", d: "easy", q: "Find the weight of a 5 kg bag on Earth.", o: ["5 N", "0.5 N", "50 N", "500 N"], a: 2, x: "W = mg = 5 × 10 = 50 N." },
  { t: "Newton's Laws", q: "A 2 kg body moving at 10 m/s is brought to rest in 4 s. Find the average retarding force.", o: ["20 N", "80 N", "2.5 N", "5 N"], a: 3, x: "Deceleration = 10/4 = 2.5 m/s², so F = ma = 2 × 2.5 = 5 N." },
  { t: "Newton's Laws", q: "A book rests on a table. By Newton's third law, the reaction to the book's weight (the Earth pulling the book down) is", o: ["the book pulling the Earth up", "the table pushing the book up", "friction on the book", "the book pushing the table down"], a: 0, x: "Action and reaction act on different bodies and are the same type of force. The Earth pulls the book down by gravity, so the book pulls the Earth up by gravity." },
  { t: "Newton's Laws", q: "Two blocks of 2 kg and 3 kg in contact on a smooth floor are pushed by a horizontal force of 10 N. Find their acceleration.", o: ["5 m/s²", "2 m/s²", "3.3 m/s²", "50 m/s²"], a: 1, x: "Treat them as one 5 kg body: a = 10/5 = 2 m/s²." },

  // Work and Energy
  { t: "Work and Energy", d: "easy", q: "Find the potential energy of a 2 kg mass 5 m above the ground.", o: ["10 J", "1000 J", "100 J", "25 J"], a: 2, x: "PE = mgh = 2 × 10 × 5 = 100 J." },
  { t: "Work and Energy", q: "How much work is done to increase the speed of a 1000 kg car from 10 m/s to 20 m/s?", o: ["50 000 J", "200 000 J", "10 000 J", "150 000 J"], a: 3, x: "Work = change in KE = ½ × 1000 × (20² − 10²) = 500 × 300 = 150 000 J." },
  { t: "Work and Energy", q: "A pump raises 500 kg of water through 12 m in 1 minute. Find its useful power output.", o: ["1000 W", "60 000 W", "100 W", "6000 W"], a: 0, x: "Work = mgh = 500 × 10 × 12 = 60 000 J in 60 s, so P = 1000 W." },
  { t: "Work and Energy", q: "An inclined plane is 5 m long and rises 1 m. Find its velocity ratio.", o: ["1/5", "5", "4", "6"], a: 1, x: "VR of an inclined plane = length of slope ÷ height = 5/1 = 5." },
  { t: "Work and Energy", d: "easy", q: "In a hydroelectric power station, the main energy change is from", o: ["chemical to electrical", "nuclear to heat", "gravitational potential energy to electrical energy", "sound to electrical"], a: 2, x: "Falling water loses potential energy, gains kinetic energy and turns turbines that drive generators." },

  // Waves
  { t: "Waves", d: "easy", q: "Which electromagnetic waves have the longest wavelength?", o: ["Gamma rays", "X-rays", "Ultraviolet", "Radio waves"], a: 3, x: "In order of increasing wavelength: gamma, X-rays, ultraviolet, visible, infrared, microwaves, radio waves." },
  { t: "Waves", q: "Light travels at 3 × 10⁸ m/s in air. Find its speed in glass of refractive index 1.5.", o: ["2 × 10⁸ m/s", "4.5 × 10⁸ m/s", "1.5 × 10⁸ m/s", "3 × 10⁸ m/s"], a: 0, x: "n = c/v, so v = 3 × 10⁸/1.5 = 2 × 10⁸ m/s." },
  { t: "Waves", q: "In a stationary wave, adjacent nodes are 15 cm apart. Find the wavelength.", o: ["15 cm", "30 cm", "7.5 cm", "60 cm"], a: 1, x: "Adjacent nodes are half a wavelength apart, so λ = 2 × 15 = 30 cm." },
  { t: "Waves", q: "Two tuning forks of 256 Hz and 260 Hz are sounded together. Find the beat frequency.", o: ["516 Hz", "258 Hz", "4 Hz", "2 Hz"], a: 2, x: "Beat frequency = difference in frequencies = 260 − 256 = 4 Hz." },
  { t: "Waves", q: "Which property shows that light waves are transverse, and that sound waves cannot show?", o: ["Reflection", "Refraction", "Diffraction", "Polarisation"], a: 3, x: "Only transverse waves can be polarised. All waves can be reflected, refracted and diffracted." },

  // Electricity
  { t: "Electricity", d: "hard", q: "A wire is 10 m long with a cross-sectional area of 1 × 10⁻⁶ m² and a resistivity of 1.7 × 10⁻⁸ Ω m. Find its resistance.", o: ["0.17 Ω", "1.7 Ω", "0.017 Ω", "17 Ω"], a: 0, x: "R = ρL/A = 1.7 × 10⁻⁸ × 10 / 10⁻⁶ = 0.17 Ω." },
  { t: "Electricity", q: "Which fuse is best for a 2.4 kW kettle on a 240 V supply?", o: ["3 A", "13 A", "5 A", "30 A"], a: 1, x: "I = P/V = 2400/240 = 10 A. The fuse should be rated a little above this: 13 A." },
  { t: "Electricity", q: "A 12 V supply is connected across 4 Ω and 8 Ω resistors in series. Find the voltage across the 8 Ω resistor.", o: ["4 V", "6 V", "8 V", "12 V"], a: 2, x: "I = 12/12 = 1 A, so V = IR = 1 × 8 = 8 V. Voltage divides in proportion to resistance." },
  { t: "Electricity", d: "easy", q: "Capacitors of 2 μF and 3 μF are connected in parallel. Find the combined capacitance.", o: ["1.2 μF", "6 μF", "1 μF", "5 μF"], a: 3, x: "In parallel, capacitances add: 2 + 3 = 5 μF. (In series they would combine to 1.2 μF.)" },
  { t: "Electricity", d: "easy", q: "Which instrument measures potential difference and is connected in parallel with a component?", o: ["Voltmeter", "Ammeter", "Galvanometer in series", "Rheostat"], a: 0, x: "A voltmeter goes in parallel and has a very high resistance. An ammeter goes in series." },

  // Heat and Thermodynamics
  { t: "Heat and Thermodynamics", q: "At what temperature does water have its greatest density?", o: ["0 °C", "4 °C", "100 °C", "−4 °C"], a: 1, x: "Water contracts as it is heated from 0 °C to 4 °C, then expands. This is why ponds freeze from the top." },
  { t: "Heat and Thermodynamics", q: "0.2 kg of water at 80 °C is mixed with 0.3 kg of water at 20 °C. Ignoring heat losses, find the final temperature.", o: ["50 °C", "40 °C", "44 °C", "60 °C"], a: 2, x: "Heat lost = heat gained: 0.2(80 − θ) = 0.3(θ − 20). So 16 − 0.2θ = 0.3θ − 6, giving θ = 44 °C." },
  { t: "Heat and Thermodynamics", q: "A gas at 300 K has a pressure of 100 kPa. At constant volume it is heated to 450 K. Find the new pressure.", o: ["66.7 kPa", "450 kPa", "250 kPa", "150 kPa"], a: 3, x: "Pressure law: P₂ = P₁T₂/T₁ = 100 × 450/300 = 150 kPa." },
  { t: "Heat and Thermodynamics", q: "Evaporation causes cooling because", o: ["the most energetic molecules escape from the liquid", "the liquid absorbs heat from the air", "the boiling point falls", "the liquid's mass increases"], a: 0, x: "The faster molecules leave, so the average kinetic energy of those left behind, and therefore the temperature, falls." },

  // Magnetism
  { t: "Magnetism", q: "The only sure test that a metal bar is a magnet is that it", o: ["attracts iron filings", "repels one pole of a known magnet", "attracts a compass needle", "is heavy"], a: 1, x: "An unmagnetised iron bar is also attracted to a magnet. Only a magnet can repel another magnet." },
  { t: "Magnetism", q: "Lenz's law states that the induced current", o: ["is proportional to the resistance", "flows from north to south", "flows in a direction that opposes the change producing it", "is always alternating"], a: 2, x: "The induced current's own magnetic field opposes the change in flux. This follows from conservation of energy." },
  { t: "Magnetism", q: "According to Faraday's law, the size of the induced e.m.f. depends on", o: ["the colour of the wire", "the resistance of the coil only", "the direction of the magnet only", "the rate of change of magnetic flux linkage"], a: 3, x: "e.m.f. = rate of change of flux linkage. Moving the magnet faster or using more turns increases it." },
  { t: "Magnetism", d: "easy", q: "The magnetic field lines around a long straight wire carrying a current are", o: ["concentric circles around the wire", "straight lines parallel to the wire", "radial lines out of the wire", "absent"], a: 0, x: "The field forms circles centred on the wire. The right-hand grip rule gives their direction." },
  { t: "Magnetism", d: "hard", q: "An electron (charge 1.6 × 10⁻¹⁹ C) moves at 2 × 10⁶ m/s at right angles to a 0.5 T magnetic field. Find the force on it.", o: ["3.2 × 10⁻¹³ N", "1.6 × 10⁻¹³ N", "1.6 × 10⁻¹⁹ N", "8 × 10⁻¹⁴ N"], a: 1, x: "F = qvB = 1.6 × 10⁻¹⁹ × 2 × 10⁶ × 0.5 = 1.6 × 10⁻¹³ N." },

  // Optics
  { t: "Optics", d: "easy", q: "A convex mirror is used as a driving mirror because it", o: ["forms real images", "magnifies objects", "gives a wide field of view", "forms inverted images"], a: 2, x: "It always forms an upright, diminished virtual image covering a wide area behind the vehicle." },
  { t: "Optics", q: "When white light passes through a glass prism, which colour is deviated most?", o: ["Red", "Yellow", "Green", "Violet"], a: 3, x: "Glass has its highest refractive index for violet light, so violet bends most and red least." },
  { t: "Optics", q: "A pool is 2 m deep. If the refractive index of water is 4/3, how deep does it appear when viewed from directly above?", o: ["1.5 m", "2.67 m", "2 m", "0.67 m"], a: 0, x: "Apparent depth = real depth ÷ n = 2 ÷ 4/3 = 1.5 m." },
  { t: "Optics", q: "Long sight (hypermetropia) is corrected with", o: ["a diverging lens", "a converging lens", "a plane mirror", "a prism"], a: 1, x: "In long sight, near objects focus behind the retina. A converging lens adds bending power to bring the focus forward." },

  // Motion
  { t: "Motion", d: "easy", q: "A stone is dropped from rest. Find its speed after falling for 2 s.", o: ["5 m/s", "10 m/s", "20 m/s", "40 m/s"], a: 2, x: "v = u + gt = 0 + 10 × 2 = 20 m/s." },
  { t: "Motion", d: "easy", q: "Two cars travel in the same direction at 60 km/h and 40 km/h. What is the speed of the faster car relative to the slower one?", o: ["100 km/h", "50 km/h", "2400 km/h", "20 km/h"], a: 3, x: "In the same direction, subtract the speeds: 60 − 40 = 20 km/h." },
  { t: "Motion", d: "easy", q: "A horizontal straight line on a velocity–time graph shows", o: ["constant velocity", "constant acceleration", "the body at rest", "increasing deceleration"], a: 0, x: "The velocity is not changing, so the gradient (the acceleration) is zero." },
  { t: "Motion", d: "hard", q: "A ball rolls off a table 0.8 m high at 3 m/s horizontally. How far from the table does it land?", o: ["2.4 m", "1.2 m", "0.4 m", "3 m"], a: 1, x: "Time to fall: h = ½gt², so t = √(2 × 0.8/10) = 0.4 s. Horizontal distance = 3 × 0.4 = 1.2 m." },
  { t: "Motion", q: "A wheel turns at 120 revolutions per minute. Find its angular velocity.", o: ["2π rad/s", "120 rad/s", "4π rad/s", "240π rad/s"], a: 2, x: "120 rev/min = 2 rev/s, and each revolution is 2π rad, so ω = 4π rad/s." },

  // Pressure
  { t: "Pressure", d: "easy", q: "As you climb a high mountain, atmospheric pressure", o: ["increases", "stays the same", "doubles", "decreases"], a: 3, x: "There is less air above you, so the pressure falls with altitude." },
  { t: "Pressure", q: "A water manometer shows a difference in levels of 10 cm. Find the excess pressure of the gas. (Density of water = 1000 kg/m³)", o: ["1000 Pa", "100 Pa", "10 000 Pa", "10 Pa"], a: 0, x: "P = hρg = 0.1 × 1000 × 10 = 1000 Pa." },
  { t: "Pressure", d: "easy", q: "Hydraulic brakes in a car work on the principle of", o: ["Archimedes' principle", "transmission of pressure in liquids (Pascal's principle)", "Boyle's law", "Bernoulli's principle"], a: 1, x: "Pressure applied to an enclosed liquid is transmitted equally in all directions, so a small pedal force acts at every wheel." },
  { t: "Pressure", q: "A ship made of steel floats because", o: ["steel is less dense than water", "air pushes it up", "it displaces a weight of water equal to its own weight", "water has no pressure at the surface"], a: 2, x: "By the principle of flotation, a floating body displaces its own weight of fluid. The hollow hull displaces a large volume of water." },

  // Gravitation
  { t: "Gravitation", q: "Kepler's third law states that, for planets orbiting the Sun,", o: ["T ∝ r", "T² ∝ r²", "T ∝ r³", "T² ∝ r³"], a: 3, x: "The square of the orbital period is proportional to the cube of the mean distance from the Sun." },
  { t: "Gravitation", d: "easy", q: "Which quantity stays the same when a body is taken from the Earth to the Moon?", o: ["Mass", "Weight", "Acceleration due to gravity", "Gravitational force on it"], a: 0, x: "Mass is the amount of matter and does not change. Weight depends on the local g." },
  { t: "Gravitation", q: "What is the acceleration due to gravity at the centre of the Earth?", o: ["9.8 m/s²", "Zero", "Infinite", "4.9 m/s²"], a: 1, x: "At the centre the Earth's mass pulls equally in all directions, so the resultant gravitational pull is zero." },
  { t: "Gravitation", d: "easy", q: "What provides the centripetal force that keeps a satellite in orbit around the Earth?", o: ["The satellite's engines", "Air resistance", "The gravitational pull of the Earth", "The Sun's magnetic field"], a: 2, x: "Gravity acts towards the Earth's centre and supplies exactly the centripetal force the circular orbit needs." }
];
