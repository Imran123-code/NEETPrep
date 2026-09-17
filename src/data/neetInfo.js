// NEET Information Data
// Structured so exam pattern details can be easily updated without touching components

export const neetInfo = {
  fullForm: "National Eligibility cum Entrance Test",
  conductedBy: "National Testing Agency (NTA)",
  purpose: "Admission to MBBS, BDS, AYUSH, and other medical courses in India",
  eligibility: {
    age: "17 years minimum at the time of admission",
    qualification: "10+2 or equivalent with Physics, Chemistry, Biology/Biotechnology, and English",
    minMarks: {
      general: "50% in PCB",
      sc_st_obc: "40% in PCB",
      pwd: "45% in PCB",
    },
    attempts: "No limit on number of attempts (as per current NTA guidelines)",
  },
  examPattern: {
    duration: "3 hours 20 minutes (200 minutes)",
    totalQuestions: 200,
    attemptQuestions: 180,
    totalMarks: 720,
    language: "13 languages including English and Hindi",
    mode: "Offline (Pen and Paper)",
    sections: [
      {
        subject: "Physics",
        sectionA: { questions: 35, marks: 140 },
        sectionB: { questions: 15, attempt: 10, marks: 40 },
        total: { questions: 50, attempt: 45, marks: 180 },
        color: "blue",
      },
      {
        subject: "Chemistry",
        sectionA: { questions: 35, marks: 140 },
        sectionB: { questions: 15, attempt: 10, marks: 40 },
        total: { questions: 50, attempt: 45, marks: 180 },
        color: "emerald",
      },
      {
        subject: "Biology",
        subsections: ["Botany", "Zoology"],
        sectionA: { questions: 70, marks: 280 },
        sectionB: { questions: 30, attempt: 20, marks: 80 },
        total: { questions: 100, attempt: 90, marks: 360 },
        color: "violet",
      },
    ],
    markingScheme: {
      correct: "+4 marks",
      incorrect: "-1 mark",
      unattempted: "0 marks",
    },
  },
  preparationStrategy: [
    {
      title: "Master NCERT First",
      description: "NCERT textbooks are the bible for NEET. At least 80% of questions come directly from NCERT.",
      icon: "📚",
    },
    {
      title: "Chapter-wise Study",
      description: "Study chapter by chapter, complete one before moving to the next. Don't rush.",
      icon: "📖",
    },
    {
      title: "Practice MCQs Daily",
      description: "Solve at least 50 MCQs daily. Focus on previous year questions.",
      icon: "✏️",
    },
    {
      title: "Regular Revision",
      description: "Revise completed chapters regularly. Use flashcards, mind maps, and notes.",
      icon: "🔄",
    },
    {
      title: "Mock Tests",
      description: "Take full-length mock tests every week under exam conditions.",
      icon: "🎯",
    },
    {
      title: "Analyze Mistakes",
      description: "After every test, analyze each wrong answer. Understand why you were wrong.",
      icon: "🔍",
    },
    {
      title: "Time Management",
      description: "In exam: Biology first (fastest), then Chemistry, then Physics.",
      icon: "⏱️",
    },
    {
      title: "Stay Consistent",
      description: "Study 6-8 hours daily. Consistency beats intensity.",
      icon: "💪",
    },
  ],
  commonMistakes: [
    "Ignoring NCERT and relying only on reference books",
    "Skipping revision of completed chapters",
    "Not solving previous year papers",
    "Attempting all Section B questions without reading carefully",
    "Poor time management during exam",
    "Neglecting Biology (it has 360 marks — the most)",
    "Not analyzing mistakes after mock tests",
    "Starting preparation too late",
  ],
  subjectWeightage: [
    { subject: "Biology", marks: 360, percentage: 50, color: "#8B5CF6" },
    { subject: "Chemistry", marks: 180, percentage: 25, color: "#10B981" },
    { subject: "Physics", marks: 180, percentage: 25, color: "#3B82F6" },
  ],
};
