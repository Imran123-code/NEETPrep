// Master NEET Question Bank Registry & Service Engine
// Aggregates Physics, Chemistry, and Biology questions with deduplication & advanced querying

import { physicsClass11Questions } from './physics/class11.js';
import { physicsClass12Questions } from './physics/class12.js';
import { chemistryClass11Questions } from './chemistry/class11.js';
import { chemistryClass12Questions } from './chemistry/class12.js';
import { biologyClass11Questions } from './biology/class11.js';
import { biologyClass12Questions } from './biology/class12.js';

// Duplicate detection and normalization utility
export const normalizeText = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
};

const rawAllQuestions = [
  ...physicsClass11Questions,
  ...physicsClass12Questions,
  ...chemistryClass11Questions,
  ...chemistryClass12Questions,
  ...biologyClass11Questions,
  ...biologyClass12Questions,
];

// Deduplicate questions based on ID and normalized question text
const seenIds = new Set();
const seenQuestionTexts = new Set();

export const allQuestions = rawAllQuestions.filter((q) => {
  if (!q || !q.id || !q.question) return false;
  if (seenIds.has(q.id)) {
    console.warn(`Duplicate question ID detected and filtered: ${q.id}`);
    return false;
  }
  const normalized = normalizeText(q.question);
  if (seenQuestionTexts.has(normalized)) {
    console.warn(`Duplicate question text detected and filtered: ${q.id}`);
    return false;
  }
  seenIds.add(q.id);
  seenQuestionTexts.add(normalized);
  return true;
});

// Primary Query Functions
export const getAllQuestions = () => allQuestions;

export const getQuestionsBySubject = (subject) => {
  if (!subject || subject === 'All') return allQuestions;
  return allQuestions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
};

export const getQuestionsByClass = (classNum) => {
  if (!classNum || classNum === 'All') return allQuestions;
  const c = parseInt(classNum, 10);
  return allQuestions.filter(q => q.class === c);
};

export const getQuestionsByChapter = (chapterId) => {
  if (!chapterId || chapterId === 'All') return allQuestions;
  return allQuestions.filter(q => q.chapterId === chapterId);
};

export const getQuestionsByTopic = (topic, chapterId = null) => {
  return allQuestions.filter(q => {
    const matchTopic = q.topic && q.topic.toLowerCase().includes(topic.toLowerCase());
    const matchChapter = chapterId ? q.chapterId === chapterId : true;
    return matchTopic && matchChapter;
  });
};

export const getQuestionsByDifficulty = (difficulty) => {
  if (!difficulty || difficulty === 'All') return allQuestions;
  return allQuestions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
};

export const getQuestionsByCategory = (category) => {
  if (!category || category === 'All') return allQuestions;
  return allQuestions.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
};

// Filter questions with multi-criteria
export const filterQuestions = ({
  classNum = 'All',
  subject = 'All',
  chapterId = 'All',
  topic = 'All',
  difficulty = 'All',
  category = 'All',
  status = 'All',
  searchQuery = '',
  bookmarks = [],
  attempts = {},
} = {}) => {
  return allQuestions.filter(q => {
    // Class filter
    if (classNum !== 'All' && q.class !== parseInt(classNum, 10)) return false;

    // Subject filter
    if (subject !== 'All' && q.subject.toLowerCase() !== subject.toLowerCase()) return false;

    // Chapter filter
    if (chapterId !== 'All' && q.chapterId !== chapterId) return false;

    // Topic filter
    if (topic !== 'All' && q.topic !== topic) return false;

    // Difficulty filter
    if (difficulty !== 'All' && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;

    // Category filter
    if (category !== 'All' && q.category && q.category.toLowerCase() !== category.toLowerCase()) return false;

    // Status filter
    if (status !== 'All') {
      const isBookmarked = bookmarks.includes(q.id);
      const attempt = attempts[q.id];
      if (status === 'Bookmarked' && !isBookmarked) return false;
      if (status === 'Unattempted' && attempt) return false;
      if (status === 'Attempted' && !attempt) return false;
      if (status === 'Correct' && (!attempt || !attempt.isCorrect)) return false;
      if (status === 'Incorrect' && (!attempt || attempt.isCorrect)) return false;
    }

    // Search query filter (matches question text, topic, chapterName, explanation, keyConcept)
    if (searchQuery && searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim();
      const matchText = q.question.toLowerCase().includes(qLower);
      const matchTopic = q.topic ? q.topic.toLowerCase().includes(qLower) : false;
      const matchChapter = q.chapterName ? q.chapterName.toLowerCase().includes(qLower) : false;
      const matchKey = q.keyConcept ? q.keyConcept.toLowerCase().includes(qLower) : false;
      if (!matchText && !matchTopic && !matchChapter && !matchKey) return false;
    }

    return true;
  });
};

// Random question generator with configurable distributions
export const getRandomQuestions = ({
  count = 10,
  subjects = ['Physics', 'Chemistry', 'Biology'],
  difficulties = ['Easy', 'Medium', 'Hard'],
  classNums = null,
  classNum = null,
  chapterId = null,
} = {}) => {
  let pool = allQuestions.filter(q => {
    const matchSub = subjects.includes('All') || subjects.some(s => s.toLowerCase() === q.subject.toLowerCase());
    const matchDiff = difficulties.includes('All') || difficulties.some(d => d.toLowerCase() === q.difficulty.toLowerCase());
    const targetClasses = Array.isArray(classNums) ? classNums : (classNum && classNum !== 'All' ? [parseInt(classNum, 10)] : [11, 12]);
    const matchClass = targetClasses.includes(q.class);
    const matchChap = !chapterId || chapterId === 'All' || (q.chapterId && q.chapterId.toLowerCase() === chapterId.toLowerCase());
    return matchSub && matchDiff && matchClass && matchChap;
  });

  if (pool.length === 0) pool = allQuestions;

  // Shuffle and slice
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Practice Weak Topics generator
export const getWeakTopicQuestions = (weakTopicNames = [], count = 15) => {
  if (!weakTopicNames || weakTopicNames.length === 0) {
    return getRandomQuestions({ count });
  }

  const pool = allQuestions.filter(q => 
    weakTopicNames.some(t => q.topic && q.topic.toLowerCase().includes(t.toLowerCase()))
  );

  if (pool.length === 0) return getRandomQuestions({ count });

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Bookmarks & Mistakes retrievers
export const getBookmarkedQuestions = (bookmarkIds = []) => {
  if (!bookmarkIds || bookmarkIds.length === 0) return [];
  const set = new Set(bookmarkIds);
  return allQuestions.filter(q => set.has(q.id));
};

export const getMistakeQuestions = (mistakeIds = []) => {
  if (!mistakeIds || mistakeIds.length === 0) return [];
  const set = new Set(mistakeIds);
  return allQuestions.filter(q => set.has(q.id));
};

// Question of the Day (Deterministic based on current date)
export const getQuestionOfTheDay = () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % allQuestions.length;
  return allQuestions[index] || allQuestions[0];
};

// Adaptive Practice selector
export const getAdaptiveNextQuestion = ({
  recentAccuracy = 0.5, // 0 to 1
  currentDifficulty = 'Medium',
  answeredIds = [],
  subject = 'All',
}) => {
  let targetDifficulty = 'Medium';
  if (recentAccuracy >= 0.75) {
    targetDifficulty = currentDifficulty === 'Easy' ? 'Medium' : 'Hard';
  } else if (recentAccuracy < 0.4) {
    targetDifficulty = currentDifficulty === 'Hard' ? 'Medium' : 'Easy';
  } else {
    targetDifficulty = currentDifficulty;
  }

  const answeredSet = new Set(answeredIds);
  let available = allQuestions.filter(q => {
    const unattempted = !answeredSet.has(q.id);
    const matchSub = subject === 'All' || q.subject.toLowerCase() === subject.toLowerCase();
    const matchDiff = q.difficulty === targetDifficulty;
    return unattempted && matchSub && matchDiff;
  });

  if (available.length === 0) {
    available = allQuestions.filter(q => !answeredSet.has(q.id));
  }
  if (available.length === 0) {
    available = allQuestions;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return {
    question: available[randomIndex],
    difficulty: targetDifficulty,
  };
};

// Real-Time Dynamic Statistics Calculator (NO hardcoded fake numbers!)
export const getQuestionStats = () => {
  const total = allQuestions.length;
  const physicsCount = allQuestions.filter(q => q.subject === 'Physics').length;
  const chemistryCount = allQuestions.filter(q => q.subject === 'Chemistry').length;
  const biologyCount = allQuestions.filter(q => q.subject === 'Biology').length;

  const class11Count = allQuestions.filter(q => q.class === 11).length;
  const class12Count = allQuestions.filter(q => q.class === 12).length;

  const easyCount = allQuestions.filter(q => q.difficulty === 'Easy').length;
  const mediumCount = allQuestions.filter(q => q.difficulty === 'Medium').length;
  const hardCount = allQuestions.filter(q => q.difficulty === 'Hard').length;

  const pyqCount = allQuestions.filter(q => q.isPreviousYear).length;

  // Distinct chapters and topics covered
  const chaptersSet = new Set(allQuestions.map(q => q.chapterId));
  const topicsSet = new Set(allQuestions.map(q => q.topic).filter(Boolean));

  // Category breakdown
  const categoryCounts = allQuestions.reduce((acc, q) => {
    const cat = q.category || 'Conceptual';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    physicsCount,
    chemistryCount,
    biologyCount,
    class11Count,
    class12Count,
    easyCount,
    mediumCount,
    hardCount,
    pyqCount,
    totalChaptersCovered: chaptersSet.size,
    totalTopicsCovered: topicsSet.size,
    categoryCounts,
  };
};
