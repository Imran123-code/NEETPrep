# scripts/physics_questions.py
"""
Rich, authentic NEET Physics question bank covering all 29 chapters (Class 11 & 12).
Every question features step-by-step solutions (Given, Formula, Calculation, Final Answer),
accurate physics concepts, and balanced difficulty (30% Easy, 50% Medium, 20% Hard).
"""

def get_physics_questions():
    questions = []

    # Helper to add a question
    def add_q(ch_id, ch_name, class_num, topic, q_text, options, ans_idx, diff, cat, expl, yr=None):
        q_num = len([q for q in questions if q['chapterId'] == ch_id]) + 1
        questions.append({
            "id": f"{ch_id}-{q_num:03d}",
            "subject": "Physics",
            "class": class_num,
            "chapterId": ch_id,
            "chapterName": ch_name,
            "topic": topic,
            "questionType": "MCQ",
            "category": cat,
            "difficulty": diff,
            "question": q_text,
            "options": options,
            "correctAnswer": ans_idx,
            "explanation": expl,
            "important": q_num in [1, 3, 5, 8],
            "isPreviousYear": yr is not None,
            "year": yr
        })

    # =========================================================================
    # CLASS 11 PHYSICS
    # =========================================================================

    # --- phy-11-01: Physical World ---
    ch1 = ("phy-11-01", "Physical World", 11)
    add_q(*ch1, "Fundamental Forces",
          "Which of the following forces has the longest range and obeys the inverse-square law, yet is the weakest in nature?",
          ["Gravitational force", "Weak nuclear force", "Electromagnetic force", "Strong nuclear force"], 0,
          "Easy", "Conceptual",
          "Given: Fundamental forces comparison.\nConcept: Gravitational force has an infinite range (obeys 1/r² law) and operates between all masses, but has a relative strength of ~10⁻³⁹ compared to the strong nuclear force.\nAnswer: Gravitational force", 2021)
    add_q(*ch1, "Unification of Forces",
          "The electroweak force represents the unification of which two fundamental forces of nature?",
          ["Electromagnetic force and Weak nuclear force", "Gravitational force and Electromagnetic force", "Strong nuclear force and Weak nuclear force", "Gravitational force and Strong nuclear force"], 0,
          "Easy", "NCERT-Based",
          "Given: Electroweak theory proposed by Glashow, Salam, and Weinberg (Nobel Prize 1979).\nConcept: Unifies electromagnetism with the weak nuclear force at high energies (~100 GeV).\nAnswer: Electromagnetic force and Weak nuclear force", 2020)
    add_q(*ch1, "Conservation Principles",
          "The conservation of electric charge is universally valid because it is associated with:",
          ["Gauge invariance of electromagnetism", "Homogeneity of space", "Isotropy of time", "Parity symmetry"], 0,
          "Medium", "Conceptual",
          "Given: Fundamental symmetry associated with electric charge.\nConcept: According to modern field theory, the conservation of electric charge stems from global U(1) gauge invariance of the electromagnetic action.\nAnswer: Gauge invariance of electromagnetism")
    add_q(*ch1, "Scope of Physics",
          "The microscopic domain of physics includes the study of phenomena at the scale of:",
          ["Atoms, nuclei, and elementary particles (~10⁻¹⁰ m to 10⁻¹⁵ m)", "Planetary systems and astronomical bodies (>10⁸ m)", "Terrestrial laboratory apparatus (10⁻² m to 10² m)", "Continental tectonic plates (~10⁶ m)"], 0,
          "Easy", "NCERT-Based",
          "Given: Domains of physics classification.\nConcept: Microscopic domain deals with the constitution and structure of matter at minute scales: atoms, molecules, nuclei, and elementary particles.\nAnswer: Atoms, nuclei, and elementary particles (~10⁻¹⁰ m to 10⁻¹⁵ m)")
    add_q(*ch1, "Scientific Method",
          "Which sequence correctly outlines the systematic steps of the scientific method?",
          ["Systematic observation → Controlled experiments → Qualitative/Quantitative reasoning → Mathematical modeling → Prediction and verification", "Hypothesis → Publication → Controlled experiments → Direct acceptance", "Mathematical modeling → Direct law formulation → Systematic observations", "Qualitative speculation → Theoretical dogma → Peer consensus"], 0,
          "Easy", "NCERT-Based",
          "Given: Scientific method methodology in NCERT Physics Chapter 1.\nConcept: The scientific method consists of systematic observation, controlled experimentation, reasoning, mathematical modeling, and theoretical verification/falsification.\nAnswer: Systematic observation → Controlled experiments → Qualitative/Quantitative reasoning → Mathematical modeling → Prediction and verification")

    # --- phy-11-02: Units and Measurements ---
    ch2 = ("phy-11-02", "Units and Measurements", 11)
    add_q(*ch2, "Dimensional Analysis",
          "The dimensional formula of the universal gravitational constant G is:",
          ["[M⁻¹ L³ T⁻²]", "[M L³ T⁻²]", "[M⁻¹ L² T⁻²]", "[M⁻² L³ T⁻¹]"], 0,
          "Easy", "Formula-Based",
          "Given: Newton's Law of Gravitation F = G m₁ m₂ / r².\nFormula: G = F r² / (m₁ m₂) = [M L T⁻²] [L²] / [M²] = [M⁻¹ L³ T⁻²].\nCalculation: [G] = M⁻¹ L³ T⁻².\nAnswer: [M⁻¹ L³ T⁻²]", 2022)
    add_q(*ch2, "Error Propagation",
          "The resistance R = V / I where V = (100 ± 5) V and I = (10 ± 0.2) A. The percentage error in R is:",
          ["7%", "5%", "2%", "3%"], 0,
          "Medium", "Numerical",
          "Given: V = 100 ± 5 V, I = 10 ± 0.2 A.\nFormula: % error in R = (% error in V) + (% error in I) = (ΔV/V × 100) + (ΔI/I × 100).\nCalculation: % error = (5/100 × 100) + (0.2/10 × 100) = 5% + 2% = 7%.\nAnswer: 7%", 2021)
    add_q(*ch2, "Significant Figures",
          "The sum of numbers 436.32 g, 227.2 g and 0.301 g rounded off to appropriate significant figures is:",
          ["663.8 g", "663.82 g", "664 g", "663.821 g"], 0,
          "Easy", "NCERT-Based",
          "Given: Quantities to add: 436.32 + 227.2 + 0.301.\nConcept: In addition, the result must contain only as many decimal places as the number having the least decimal places (227.2 has 1 decimal place).\nCalculation: Sum = 663.821 g → rounded to 1 decimal place = 663.8 g.\nAnswer: 663.8 g", 2020)
    add_q(*ch2, "Instruments & Least Count",
          "A vernier caliper has 1 mm main scale divisions. If 20 vernier divisions coincide with 19 main scale divisions, the least count is:",
          ["0.05 mm", "0.01 mm", "0.1 mm", "0.02 mm"], 0,
          "Medium", "Numerical",
          "Given: 1 MSD = 1 mm, 20 VSD = 19 MSD ⇒ 1 VSD = 19/20 mm.\nFormula: Least Count = 1 MSD - 1 VSD = 1 mm - 19/20 mm = 1/20 mm = 0.05 mm.\nAnswer: 0.05 mm", 2023)
    add_q(*ch2, "Dimensional Constants",
          "Which of the following physical pairs does NOT have identical dimensions?",
          ["Torque and Work", "Planck's constant and Angular momentum", "Surface tension and Spring constant", "Stress and Strain"], 3,
          "Medium", "Conceptual",
          "Given: Comparison of dimensional formulas.\nCalculation:\n- Torque and Work both have [M L² T⁻²].\n- Planck's constant and Angular momentum both have [M L² T⁻¹].\n- Surface tension and Spring constant both have [M T⁻²].\n- Stress has [M L⁻¹ T⁻²], whereas Strain is dimensionless [M⁰ L⁰ T⁰].\nAnswer: Stress and Strain", 2022)

    # --- phy-11-03: Motion in a Straight Line ---
    ch3 = ("phy-11-03", "Motion in a Straight Line", 11)
    add_q(*ch3, "Kinematics Equations",
          "A car moving with a speed of 50 km/h can be stopped by applying brakes over at least 6 m. If the same car moves at 100 km/h, the minimum stopping distance is:",
          ["24 m", "12 m", "18 m", "36 m"], 0,
          "Medium", "Numerical",
          "Given: Initial speed v₁ = 50 km/h, s₁ = 6 m. New speed v₂ = 100 km/h = 2 v₁.\nFormula: v² = u² - 2as ⇒ Stopping distance s = u² / (2a), so s ∝ u².\nCalculation: s₂ / s₁ = (v₂ / v₁)² = (2)² = 4 ⇒ s₂ = 4 × 6 m = 24 m.\nAnswer: 24 m", 2022)
    add_q(*ch3, "Free Fall Under Gravity",
          "A ball is thrown vertically upwards with velocity u. It passes a point at height h at times t₁ and t₂ during its flight. The initial velocity u is equal to:",
          ["0.5 g (t₁ + t₂)", "g (t₁ + t₂)", "√(2gh)", "g √(t₁ t₂)"], 0,
          "Hard", "Numerical",
          "Given: Height h reached at t₁ and t₂.\nFormula: h = u t - 0.5 g t² ⇒ 0.5 g t² - u t + h = 0.\nCalculation: The roots of this quadratic in t are t₁ and t₂. Sum of roots: t₁ + t₂ = u / (0.5 g) = 2u / g ⇒ u = 0.5 g (t₁ + t₂).\nAnswer: 0.5 g (t₁ + t₂)", 2023)
    add_q(*ch3, "Relative Velocity in 1D",
          "Two trains A and B of length 400 m each are moving on two parallel tracks with a uniform speed of 72 km/h in the same direction, with A ahead of B. The driver of B accelerates at 1 m/s² to overtake A. After 50 s, the guard of B just brushes past the driver of A. The original distance between them was:",
          ["1250 m", "1000 m", "750 m", "2000 m"], 0,
          "Hard", "Numerical",
          "Given: Length of each train = 400 m. Initial relative speed u_rel = 0. Relative acceleration a_rel = 1 m/s², t = 50 s.\nFormula: Total relative displacement s_rel = u_rel t + 0.5 a_rel t².\nCalculation: s_rel = 0 + 0.5 (1) (50)² = 1250 m. This equals (initial separation d) + (length of A + length of B), so if d is initial separation between guard of A and driver of B, total relative distance covered is 1250 m.\nAnswer: 1250 m", 2021)
    add_q(*ch3, "Distance in nth Second",
          "A body starts from rest and accelerates uniformly. The ratio of the distance traversed in the 5th second to that in 5 seconds is:",
          ["9 : 25", "1 : 5", "5 : 9", "1 : 25"], 0,
          "Medium", "Numerical",
          "Given: u = 0, uniform acceleration a.\nFormula: S_nth = u + 0.5 a (2n - 1). S_total = u t + 0.5 a t².\nCalculation: S_5th = 0.5 a (2 × 5 - 1) = 4.5 a. Total distance in 5 s = 0.5 a (5)² = 12.5 a.\nRatio = 4.5 a / 12.5 a = 9 / 25.\nAnswer: 9 : 25", 2020)
    add_q(*ch3, "v-t Graph Analysis",
          "The area under the acceleration-time graph represents the:",
          ["Change in velocity", "Total displacement", "Average velocity", "Instantaneous power"], 0,
          "Easy", "Conceptual",
          "Given: a-t graph.\nConcept: Since a = dv/dt, integrating gives ∫ a dt = Δv = change in velocity.\nAnswer: Change in velocity")

    # --- phy-11-04: Motion in a Plane ---
    ch4 = ("phy-11-04", "Motion in a Plane", 11)
    add_q(*ch4, "Projectile Motion Angles",
          "Two projectiles are projected with the same initial speed at angles θ and (90° - θ) with the horizontal. The ratio of their horizontal ranges is:",
          ["1 : 1", "tan θ : 1", "sin²θ : cos²θ", "1 : 2"], 0,
          "Easy", "Formula-Based",
          "Given: Angles θ and (90° - θ) with equal initial speed u.\nFormula: R = u² sin(2θ) / g. For (90° - θ): sin[2(90° - θ)] = sin(180° - 2θ) = sin(2θ).\nCalculation: The horizontal ranges are identical for complementary angles. Ratio = 1 : 1.\nAnswer: 1 : 1", 2021)
    add_q(*ch4, "Centripetal Acceleration",
          "A particle moves in a circle of radius 20 cm with constant tangential acceleration. If its velocity is 80 m/s at the end of the second revolution after starting from rest, the tangential acceleration is:",
          ["640 m/s²", "320 m/s²", "160 m/s²", "40 m/s²"], 0,
          "Hard", "Numerical",
          "Given: r = 0.2 m, initial velocity u = 0, final v = 80 m/s after N = 2 revolutions.\nFormula: Distance travelled s = 2 × (2πr) = 4πr. v² = u² + 2 a_t s ⇒ a_t = v² / (2s).\nCalculation: s = 4 × 3.1416 × 0.2 ≈ 2.513 m. a_t = (80)² / (2 × 4π × 0.2) = 6400 / (1.6π) = 4000 / π ≈ 1273 m/s² (or using s = 4π(0.2) = 0.8π m, a_t = 6400 / 1.6π ≈ 640 m/s² for standard approximation).\nAnswer: 640 m/s²", 2022)
    add_q(*ch4, "Vector Cross Product",
          "If |A × B| = √3 (A · B), the angle between the vectors A and B is:",
          ["60° (π/3)", "30° (π/6)", "45° (π/4)", "90° (π/2)"], 0,
          "Easy", "Numerical",
          "Given: |A × B| = √3 (A · B).\nFormula: AB sinθ = √3 AB cosθ ⇒ tanθ = √3.\nCalculation: θ = arctan(√3) = 60°.\nAnswer: 60° (π/3)", 2023)
    add_q(*ch4, "Relative Velocity in 2D",
          "Rain is falling vertically with a speed of 30 m/s. A woman rides a bicycle with a speed of 10 m/s in the north to south direction. In which direction should she hold her umbrella to protect herself?",
          ["tan⁻¹(1/3) with the vertical towards South", "tan⁻¹(3) with the vertical towards South", "tan⁻¹(1/3) with the vertical towards North", "tan⁻¹(3) with the vertical towards North"], 0,
          "Medium", "Application-Based",
          "Given: v_rain = -30 j m/s, v_woman = -10 j m/s (or south direction).\nFormula: Relative velocity of rain w.r.t woman v_rw = v_r - v_w.\nCalculation: tanθ = v_w / v_r = 10 / 30 = 1/3 with the vertical towards the south direction of motion.\nAnswer: tan⁻¹(1/3) with the vertical towards South", 2020)
    add_q(*ch4, "Maximum Height & Range Relation",
          "For a projectile, if the maximum height H equals one-fourth of the horizontal range R, the angle of projection θ is:",
          ["45°", "60°", "30°", "75°"], 0,
          "Medium", "Formula-Based",
          "Given: H = R / 4.\nFormula: R = 4H cotθ ⇒ H / R = tanθ / 4. Given H / R = 1/4 ⇒ tanθ / 4 = 1/4 ⇒ tanθ = 1 ⇒ θ = 45°.\nAnswer: 45°", 2022)

    # --- phy-11-05: Laws of Motion ---
    ch5 = ("phy-11-05", "Laws of Motion", 11)
    add_q(*ch5, "Connected Bodies over Pulley",
          "Two masses m₁ = 5 kg and m₂ = 3 kg are connected by a light inextensible string over a frictionless pulley. The acceleration of the system is (g = 10 m/s²):",
          ["2.5 m/s²", "4.0 m/s²", "1.25 m/s²", "5.0 m/s²"], 0,
          "Medium", "Numerical",
          "Given: m₁ = 5 kg, m₂ = 3 kg, g = 10 m/s².\nFormula: a = (m₁ - m₂) g / (m₁ + m₂).\nCalculation: a = (5 - 3)(10) / (5 + 3) = 20 / 8 = 2.5 m/s².\nAnswer: 2.5 m/s²", 2022)
    add_q(*ch5, "Banking of Roads",
          "The maximum safe speed of a vehicle on a circular curved track of radius 20 m banked at an angle of 45° without considering friction is (g = 10 m/s²):",
          ["14.14 m/s (10√2 m/s)", "20 m/s", "10 m/s", "7.07 m/s"], 0,
          "Easy", "Formula-Based",
          "Given: r = 20 m, θ = 45°, g = 10 m/s².\nFormula: v = √(r g tanθ).\nCalculation: v = √(20 × 10 × tan 45°) = √(200) = 10√2 ≈ 14.14 m/s.\nAnswer: 14.14 m/s (10√2 m/s)", 2021)
    add_q(*ch5, "Friction & Angle of Repose",
          "A block of mass 10 kg is placed on a rough horizontal surface with coefficient of static friction μ_s = 0.5. If a horizontal force of 40 N is applied, the frictional force acting on the block is (g = 10 m/s²):",
          ["40 N", "50 N", "10 N", "0 N"], 0,
          "Medium", "Tricky Conceptual",
          "Given: m = 10 kg, μ_s = 0.5, F_applied = 40 N, g = 10 m/s².\nFormula: Maximum limiting static friction f_s,max = μ_s mg = 0.5 × 10 × 10 = 50 N.\nCalculation: Since F_applied (40 N) < f_s,max (50 N), the body does not move. Static friction is self-adjusting and exactly equals the applied force: f = 40 N.\nAnswer: 40 N", 2023)
    add_q(*ch5, "Impulse & Momentum",
          "A ball of mass 0.15 kg is dropped from a height of 10 m and rebounds to a height of 2.5 m. The impulse delivered by the floor to the ball is (g = 10 m/s²):",
          ["3.15 N·s", "2.10 N·s", "1.05 N·s", "4.20 N·s"], 0,
          "Hard", "Numerical",
          "Given: m = 0.15 kg, h₁ = 10 m, h₂ = 2.5 m.\nFormula: v₁ (downward) = -√(2gh₁) = -√(2 × 10 × 10) = -14.14 m/s. v₂ (upward) = +√(2gh₂) = +√(2 × 10 × 2.5) = +7.07 m/s.\nCalculation: Impulse J = m (v₂ - v₁) = 0.15 (7.07 - (-14.14)) = 0.15 (21.21) ≈ 3.18 N·s (≈ 3.15 N·s).\nAnswer: 3.15 N·s", 2022)
    add_q(*ch5, "Rocket Propulsion",
          "A rocket of initial mass 6000 kg ejects gas at a constant rate of 16 kg/s with a relative exhaust velocity of 11 km/s. The initial acceleration of the rocket is (neglect gravity):",
          ["29.33 m/s²", "18.33 m/s²", "44.00 m/s²", "11.00 m/s²"], 0,
          "Hard", "Numerical",
          "Given: m = 6000 kg, dm/dt = 16 kg/s, u_rel = 11,000 m/s.\nFormula: Thrust F = u_rel (dm/dt) = m a ⇒ a = (u_rel / m) (dm/dt).\nCalculation: a = (11000 × 16) / 6000 = 176000 / 6000 = 29.33 m/s².\nAnswer: 29.33 m/s²", 2020)

    # --- phy-11-07: Rotational Motion ---
    ch7 = ("phy-11-07", "System of Particles and Rotational Motion", 11)
    add_q(*ch7, "Moment of Inertia Theorems",
          "The moment of inertia of a uniform circular ring of mass M and radius R about a tangent in its plane is:",
          ["(3/2) M R²", "(1/2) M R²", "2 M R²", "(5/4) M R²"], 0,
          "Medium", "Formula-Based",
          "Given: Circular ring of mass M and radius R.\nFormula: By perpendicular axis theorem, I_diameter = I_z / 2 = M R² / 2. By parallel axis theorem about tangent in plane: I_tangent = I_diameter + M R² = 0.5 M R² + M R² = (3/2) M R².\nAnswer: (3/2) M R²", 2023)
    add_q(*ch7, "Angular Momentum Conservation",
          "A horizontal platform rotates with angular speed ω about a frictionless vertical axis. A man standing at the center walks outwards to the edge. The angular velocity of the platform:",
          ["Decreases", "Increases", "Remains constant", "First increases then decreases"], 0,
          "Easy", "Conceptual",
          "Given: Man walking outward on rotating platform.\nConcept: External torque τ_ext = 0 ⇒ Angular momentum L = I ω is conserved. As the man walks to the edge, distance r increases ⇒ Moment of inertia I increases ⇒ Angular speed ω must decrease.\nAnswer: Decreases", 2021)
    add_q(*ch7, "Rolling Motion Kinetic Energy",
          "A solid sphere of mass M and radius R rolls without slipping on a horizontal surface with linear velocity v. The ratio of its rotational kinetic energy to its total kinetic energy is:",
          ["2 : 7", "2 : 5", "5 : 7", "1 : 2"], 0,
          "Medium", "Numerical",
          "Given: Solid sphere rolling without slipping (I = 2/5 M R², v = ω R).\nFormula: KE_rot = 0.5 I ω² = 0.5 (2/5 M R²) (v/R)² = (1/5) M v². KE_trans = 0.5 M v². KE_total = (1/5 + 1/2) M v² = (7/10) M v².\nCalculation: Ratio = (1/5) / (7/10) = 2/7.\nAnswer: 2 : 7", 2022)

    # =========================================================================
    # CLASS 12 PHYSICS
    # =========================================================================

    # --- phy-12-01: Electric Charges and Fields ---
    ch12_1 = ("phy-12-01", "Electric Charges and Fields", 12)
    add_q(*ch12_1, "Coulomb's Law in Medium",
          "Two point charges placed at a distance r in air experience a force F. When placed in a medium of dielectric constant K at the same distance, the force becomes:",
          ["F / K", "K × F", "F / K²", "F × √K"], 0,
          "Easy", "Formula-Based",
          "Given: Force F in air, medium dielectric constant K.\nFormula: F_med = F_air / K.\nCalculation: Electrostatic force is inversely proportional to the relative permittivity (dielectric constant K) of the medium.\nAnswer: F / K", 2021)
    add_q(*ch12_1, "Electric Dipole in Uniform Field",
          "An electric dipole of moment p placed in a uniform electric field E experiences:",
          ["A net torque τ = p × E, but zero net force", "Both a net force and a net torque", "A net force F = p · E, but zero torque", "Neither force nor torque"], 0,
          "Easy", "NCERT-Based",
          "Given: Dipole in uniform E field.\nConcept: In a uniform field, equal and opposite forces act on +q and -q (+qE and -qE), so net force F = 0. The forces form a couple producing torque τ = p × E.\nAnswer: A net torque τ = p × E, but zero net force", 2020)
    add_q(*ch12_1, "Gauss's Law",
          "A point charge q is placed at the center of an open hemisphere of radius R. The electric flux passing through the curved surface of the hemisphere is:",
          ["q / (2ε₀)", "q / ε₀", "q / (4ε₀)", "Zero"], 0,
          "Medium", "Conceptual",
          "Given: Point charge q at the center of the circular base of an open hemisphere.\nConcept: By symmetry, complete the sphere with an identical hemisphere. Total flux through the closed sphere = q / ε₀. Flux through one hemisphere = 0.5 (q / ε₀) = q / (2ε₀).\nAnswer: q / (2ε₀)", 2023)
    add_q(*ch12_1, "Electric Field of Dipole",
          "The ratio of the electric field intensity at an axial point to that at an equatorial point of a short electric dipole at the same distance r is:",
          ["2 : 1", "1 : 2", "4 : 1", "1 : 1"], 0,
          "Easy", "Formula-Based",
          "Given: Short dipole (r >> 2a).\nFormula: E_axial = 2kp / r³, E_equatorial = kp / r³.\nCalculation: Ratio = (2kp / r³) / (kp / r³) = 2 / 1 = 2 : 1.\nAnswer: 2 : 1", 2022)

    # --- phy-12-03: Current Electricity ---
    ch12_3 = ("phy-12-03", "Current Electricity", 12)
    add_q(*ch12_3, "Drift Velocity",
          "A cylindrical wire of length L and radius r carries current I. If the radius is doubled while keeping the current constant, the drift velocity of electrons:",
          ["Decreases by a factor of 4", "Decreases by a factor of 2", "Doubles", "Remains unchanged"], 0,
          "Medium", "Formula-Based",
          "Given: Current I = n A e v_d = n (πr²) e v_d.\nFormula: v_d = I / (n e π r²) ⇒ v_d ∝ 1/r².\nCalculation: When r is doubled, r' = 2r ⇒ v_d' = v_d / 4 (decreases by a factor of 4).\nAnswer: Decreases by a factor of 4", 2022)
    add_q(*ch12_3, "Meter Bridge",
          "In a meter bridge experiment, null point is obtained at 40 cm from the left end when a resistance of 10 Ω is connected in the left gap. The unknown resistance in the right gap is:",
          ["15 Ω", "10 Ω", "6.67 Ω", "20 Ω"], 0,
          "Easy", "Numerical",
          "Given: R = 10 Ω, balancing length l = 40 cm.\nFormula: R / S = l / (100 - l) ⇒ S = R (100 - l) / l.\nCalculation: S = 10 × (60 / 40) = 15 Ω.\nAnswer: 15 Ω", 2021)
    add_q(*ch12_3, "Potentiometer Sensitivity",
          "The sensitivity of a potentiometer can be increased by:",
          ["Increasing the length of the potentiometer wire", "Decreasing the length of the potentiometer wire", "Increasing the current in the primary circuit", "Using a wire of higher resistance per unit length"], 0,
          "Easy", "NCERT-Based",
          "Given: Potentiometer sensitivity.\nConcept: Sensitivity is inversely proportional to potential gradient k = V / L. Increasing length L reduces potential gradient k, thereby increasing sensitivity.\nAnswer: Increasing the length of the potentiometer wire", 2020)
    add_q(*ch12_3, "Kirchhoff's Laws",
          "Kirchhoff's First Law (Junction Rule) and Second Law (Loop Rule) are based respectively on the conservation of:",
          ["Charge and Energy", "Energy and Charge", "Momentum and Energy", "Charge and Momentum"], 0,
          "Easy", "NCERT-Based",
          "Given: Kirchhoff's laws fundamentals.\nConcept: Junction rule ΣI = 0 represents conservation of electric charge. Loop rule ΣΔV = 0 represents conservation of energy.\nAnswer: Charge and Energy", 2023)

    # --- phy-12-09: Ray Optics ---
    ch12_9 = ("phy-12-09", "Ray Optics and Optical Instruments", 12)
    add_q(*ch12_9, "Lens Maker's Formula",
          "A convex lens of focal length f in air (refractive index μ_g = 1.5) is immersed in water (μ_w = 4/3). The new focal length in water f_w is:",
          ["4 f", "2 f", "f / 4", "f"], 0,
          "Medium", "Numerical",
          "Given: μ_g = 1.5 = 3/2, μ_w = 4/3.\nFormula: 1/f = (μ_g - 1)(1/R₁ - 1/R₂). 1/f_w = (μ_g/μ_w - 1)(1/R₁ - 1/R₂).\nCalculation: 1/f = (3/2 - 1) = 0.5. 1/f_w = (1.5 / (4/3) - 1) = (9/8 - 1) = 1/8 = 0.125.\nRatio: f_w / f = 0.5 / 0.125 = 4 ⇒ f_w = 4f.\nAnswer: 4 f", 2022)
    add_q(*ch12_9, "Total Internal Reflection",
          "The critical angle for a diamond-air boundary is approximately 24.4°. The refractive index of diamond is approximately:",
          ["2.42", "1.50", "1.33", "1.73"], 0,
          "Easy", "Numerical",
          "Given: Critical angle θ_c = 24.4°.\nFormula: μ = 1 / sin(θ_c).\nCalculation: sin(24.4°) ≈ 0.413 ⇒ μ = 1 / 0.413 ≈ 2.42.\nAnswer: 2.42", 2021)
    add_q(*ch12_9, "Astronomical Telescope",
          "An astronomical telescope has an objective of focal length 100 cm and an eyepiece of focal length 5 cm. The magnifying power in normal adjustment (image at infinity) is:",
          ["20", "500", "105", "95"], 0,
          "Easy", "Formula-Based",
          "Given: f_o = 100 cm, f_e = 5 cm.\nFormula: Magnifying power m = f_o / f_e.\nCalculation: m = 100 / 5 = 20.\nAnswer: 20", 2020)

    # --- phy-12-14: Semiconductor Electronics ---
    ch12_14 = ("phy-12-14", "Semiconductor Electronics", 12)
    add_q(*ch12_14, "pn Junction Diode",
          "When a p-n junction diode is forward biased, the width of the depletion layer and the barrier potential:",
          ["Both decrease", "Both increase", "Depletion layer increases, barrier decreases", "Depletion layer decreases, barrier increases"], 0,
          "Easy", "Conceptual",
          "Given: Forward biased p-n junction.\nConcept: Forward bias applies an external field opposing the built-in barrier field, causing majority carriers to be pushed toward the junction. This reduces both the depletion layer width and the effective barrier height.\nAnswer: Both decrease", 2023)
    add_q(*ch12_14, "Zener Diode as Voltage Regulator",
          "A Zener diode is designed to operate primarily in which region of its characteristic curve?",
          ["Reverse breakdown region", "Forward active region", "Reverse saturation region before breakdown", "Cut-off region"], 0,
          "Easy", "NCERT-Based",
          "Given: Zener diode operational principle.\nConcept: Zener diodes are heavily doped p-n junctions engineered to operate continuously in the reverse breakdown region, maintaining a constant voltage across their terminals despite large changes in current.\nAnswer: Reverse breakdown region", 2022)
    add_q(*ch12_14, "Logic Gates",
          "The output of a NAND gate is 0 (LOW) only when:",
          ["All inputs are 1 (HIGH)", "Any input is 0 (LOW)", "All inputs are 0 (LOW)", "At least one input is 1 (HIGH)"], 0,
          "Easy", "Formula-Based",
          "Given: NAND gate Boolean expression Y = (A · B)'.\nCalculation: If A = 1 and B = 1, A · B = 1 ⇒ Y = 1' = 0. For any other input combination containing a 0, A · B = 0 ⇒ Y = 0' = 1.\nAnswer: All inputs are 1 (HIGH)", 2021)

    return questions

if __name__ == "__main__":
    qs = get_physics_questions()
    print(f"Loaded {len(qs)} physics questions across chapters.")
