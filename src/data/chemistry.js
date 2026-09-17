// Chemistry Chapter Data

export const chemistryChapters = [
  {
    id: 'chem-11-04',
    subject: 'Chemistry',
    class: 11,
    chapterNumber: 4,
    name: 'Chemical Bonding and Molecular Structure',
    difficulty: 'Hard',
    estimatedTime: '5 hours',
    color: '#10B981',
    description: 'Types of chemical bonds, VSEPR theory, hybridization, molecular orbital theory.',
    topics: [
      {
        id: 'chem-11-04-t1',
        name: 'Kossel-Lewis Approach',
        content: 'Atoms bond to achieve stable noble gas configuration (octet rule). Lewis structures show bonding and lone pairs. Exceptions to octet: incomplete octet (BF₃), expanded octet (PCl₅, SF₆), odd electron molecules (NO, NO₂).',
        keyPoints: [
          'Octet rule: atoms tend to achieve 8 electrons',
          'Exception: H, He need 2 electrons (duplet)',
          'Formal charge = Valence e⁻ - Lone pair e⁻ - ½ Bonding e⁻',
          'Structure with lowest formal charges is preferred',
        ],
        neetTips: 'Draw Lewis structures step by step. NEET often asks about formal charges.',
        commonMistakes: 'Forgetting exceptions to the octet rule (BeCl₂, BF₃, PCl₅).',
      },
      {
        id: 'chem-11-04-t2',
        name: 'Ionic Bond',
        content: 'Ionic bond forms by transfer of electrons from electropositive metal to electronegative non-metal. Results in ions. Lattice energy stabilizes ionic compounds. High melting point, conduct electricity in molten/aqueous state.',
        keyPoints: [
          'Transfer of electrons → ions',
          'Born-Haber cycle relates lattice energy to formation enthalpy',
          'Lattice energy ∝ (charge product)/(ionic radii sum)',
          'High melting/boiling points',
        ],
        neetTips: 'Know the trend in lattice energy: increases with charge, decreases with size.',
        commonMistakes: 'Assuming all metal-nonmetal compounds are ionic (some are covalent: AlCl₃).',
      },
      {
        id: 'chem-11-04-t3',
        name: 'Covalent Bond',
        content: 'Covalent bond: sharing of electron pairs. Lewis concept. Bond parameters: bond length (distance between nuclei), bond enthalpy (energy to break 1 mole of bonds), bond order (single=1, double=2, triple=3). Higher bond order → shorter, stronger bond.',
        keyPoints: [
          'Sharing of electrons',
          'Bond order ∝ bond strength ∝ 1/bond length',
          'Single bond: 1 pair, Double: 2 pairs, Triple: 3 pairs',
          'Polar covalent: unequal sharing → dipole moment',
        ],
        neetTips: 'Bond order from MO theory: BO = (bonding - antibonding)/2.',
        commonMistakes: 'Confusing bond polarity with molecular polarity (CO₂ is non-polar despite polar bonds).',
      },
      {
        id: 'chem-11-04-t4',
        name: 'VSEPR Theory',
        content: 'Valence Shell Electron Pair Repulsion theory predicts molecular geometry. Electron pairs (bonding and lone pairs) repel each other and arrange to minimize repulsion. Lone pair > bonding pair in repulsion. Order of repulsion: lp-lp > lp-bp > bp-bp.',
        keyPoints: [
          'Geometry determined by total electron pairs (including lone pairs)',
          'Shape determined by bonding pairs only',
          'Lone pairs cause deviation from ideal angles',
          'Examples: H₂O (bent, 104.5°), NH₃ (pyramidal, 107°), CH₄ (tetrahedral, 109.5°)',
        ],
        neetTips: 'Master all VSEPR shapes and bond angles. Very high frequency NEET topic.',
        commonMistakes: 'Confusing geometry (all electron pairs) with shape (bonding pairs only).',
      },
      {
        id: 'chem-11-04-t5',
        name: 'Hybridization',
        content: 'Mixing of atomic orbitals of similar energies to form hybrid orbitals. sp: linear (180°), sp²: trigonal planar (120°), sp³: tetrahedral (109.5°), sp³d: trigonal bipyramidal, sp³d²: octahedral.',
        keyPoints: [
          'sp: 2 hybrid orbitals, linear',
          'sp²: 3 hybrid orbitals, trigonal planar',
          'sp³: 4 hybrid orbitals, tetrahedral',
          'sp³d: 5 hybrid orbitals, trigonal bipyramidal',
          'sp³d²: 6 hybrid orbitals, octahedral',
        ],
        neetTips: 'Quick trick: Count total (σ bonds + lone pairs) on central atom = hybridization.',
        commonMistakes: 'Forgetting that π bonds do not affect hybridization count.',
      },
    ],
    formulas: [
      { name: "Formal Charge", formula: "FC = V - L - B/2", unit: "", category: "Lewis Structures" },
      { name: "Bond Order (MO)", formula: "BO = (Nb - Na)/2", unit: "", category: "MO Theory" },
      { name: "Dipole Moment", formula: "μ = q × d", unit: "Debye (D)", category: "Polarity" },
    ],
    concepts: [
      "VSEPR: electron pairs minimize repulsion",
      "Hybridization = σ bonds + lone pairs on central atom",
      "Resonance: actual structure is average of contributing structures",
      "Dipole moment: vector, zero for symmetric molecules",
    ],
    neetTips: [
      "Chemical bonding: 6-8 questions per NEET paper",
      "Master VSEPR shapes and hybridization",
      "Know exceptions to octet rule",
      "Dipole moments of common molecules must be memorized",
    ],
  },
  {
    id: 'chem-12-09',
    subject: 'Chemistry',
    class: 12,
    chapterNumber: 9,
    name: 'Coordination Compounds',
    difficulty: 'Hard',
    estimatedTime: '5 hours',
    color: '#10B981',
    description: 'Complex ions, ligands, Werner\'s theory, nomenclature, isomerism, bonding theories.',
    topics: [
      {
        id: 'chem-12-09-t1',
        name: 'Introduction to Coordination Compounds',
        content: 'Coordination compounds contain a central metal atom/ion bonded to ligands. Complex ion is enclosed in square brackets. Coordination number = number of ligand atoms directly bonded to metal.',
        keyPoints: [
          'Ligands donate electron pairs (Lewis bases)',
          'Central metal ion acts as Lewis acid',
          'Coordination number: typically 2, 4, or 6',
          'Primary valence = oxidation state; Secondary valence = coordination number',
        ],
        neetTips: 'IUPAC nomenclature is heavily tested. Practice naming compounds.',
        commonMistakes: 'Forgetting to list ligands alphabetically in names (not in formula).',
      },
      {
        id: 'chem-12-09-t2',
        name: 'Nomenclature',
        content: 'IUPAC rules: 1. Cation before anion. 2. In complex: ligands (alphabetical) then metal name. 3. Anionic complex: metal + "ate". 4. Oxidation state in parentheses. 5. Ligand prefixes: mono, di, tri, tetra, penta, hexa.',
        keyPoints: [
          'Ligand names: Cl⁻=chlorido, NH₃=ammine, H₂O=aqua, CN⁻=cyanido, CO=carbonyl',
          'Anionic metal names: Fe=ferrate, Cu=cuprate, Au=aurate',
          'Example: [Co(NH₃)₄Cl₂]Cl = tetraammineichloridocobalt(III) chloride',
        ],
        neetTips: 'Know the IUPAC names of common ligands by heart.',
        commonMistakes: 'Writing ligands in formula order instead of alphabetical order in names.',
      },
    ],
    formulas: [
      { name: "EAN Rule", formula: "EAN = Z - OS + 2×CN", unit: "", category: "Werner's Theory" },
    ],
    concepts: [
      "Werner's theory: primary and secondary valence",
      "Chelate effect increases stability",
      "Crystal Field Theory explains color and magnetism",
    ],
    neetTips: [
      "Coordination compounds: ~5 questions per NEET",
      "IUPAC nomenclature is highly tested",
      "Know all common ligands and their charges",
      "Isomerism types are important",
    ],
  },
];

export const getChapterById = (id) => chemistryChapters.find(c => c.id === id);
export const getChaptersByClass = (classNum) => chemistryChapters.filter(c => c.class === classNum);
