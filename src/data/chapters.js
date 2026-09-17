// Unified NEET Chapters Registry
// Provides complete normalized chapter information and topic content across Physics, Chemistry, and Biology

import { syllabus, subjectColors } from './syllabus.js';
import { physicsChapters } from './physics.js';
import { chemistryChapters } from './chemistry.js';
import { biologyChapters } from './biology.js';

// Pre-compiled map of chapters with rich detailed notes
const detailedChaptersMap = new Map();
[...physicsChapters, ...chemistryChapters, ...biologyChapters].forEach(ch => {
  detailedChaptersMap.set(ch.id, ch);
});

// Generate default structured study topics for any syllabus chapter that doesn't have custom handwritten notes
const generateDefaultTopics = (chapterId, chapterName, subject, classNum, topicCount = 5) => {
  const topics = [];
  const count = typeof topicCount === 'number' && topicCount > 0 ? topicCount : 4;
  
  const subjectTerms = {
    Physics: ['Fundamental Principles & Units', 'Derivation and Mathematical Formulation', 'Core Physical Laws & Applications', 'NEET High-Yield Problem Patterns', 'Key Graphs and Dimensions'],
    Chemistry: ['Classification and Electronic Basis', 'Reaction Mechanism and Thermodynamics', 'Important Chemical Trends & Exceptions', 'NCERT High-Yield Reactions', 'Numerical Problem Approaches'],
    Biology: ['Morphological & Structural Basis', 'Key Biological Processes & Pathways', 'Cellular & Molecular Mechanisms', 'NCERT Crucial Definitions & Tables', 'NEET Past-Year Focal Points'],
  };

  const genericTitles = subjectTerms[subject] || ['Basic Concept Overview', 'Detailed Mechanics & Principles', 'NCERT Core Highlights', 'Application & Practice Problems'];

  for (let i = 0; i < count; i++) {
    const topicTitle = genericTitles[i % genericTitles.length] || `Topic ${i + 1}`;
    topics.push({
      id: `${chapterId}-t${i + 1}`,
      name: `${chapterName} — ${topicTitle}`,
      content: `This section covers ${topicTitle.toLowerCase()} in ${chapterName} (${subject} Class ${classNum}). Key points include foundational definitions from the NCERT syllabus, conceptual clarity, and high-frequency problem patterns tested in NEET. Make sure to understand the underlying principles and practice related MCQs.`,
      keyPoints: [
        `Core NCERT concept definition for ${chapterName}`,
        `Fundamental formula or biological mechanism critical for NEET`,
        `High-yield concept frequently tested in past NEET question papers`,
        `Standard exceptions and boundary conditions to keep in mind`,
      ],
      neetTips: `Focus on direct NCERT statements and practice numericals/reactions related to ${chapterName}.`,
      commonMistakes: `Avoid confusing similar formulas or definitions. Always verify SI units and dimensional consistency.`,
    });
  }

  return topics;
};

// Build master array of all 97 syllabus chapters with normalized properties
const masterChaptersList = [];

Object.entries(syllabus).forEach(([subject, classesObj]) => {
  Object.entries(classesObj).forEach(([classNumStr, chList]) => {
    const classNum = parseInt(classNumStr, 10);
    chList.forEach((rawCh) => {
      const existingDetailed = detailedChaptersMap.get(rawCh.id);

      const normalized = {
        id: rawCh.id,
        number: rawCh.number,
        chapterNumber: rawCh.number,
        name: rawCh.name,
        subject: subject,
        class: classNum,
        difficulty: rawCh.difficulty || 'Medium',
        estimatedTime: rawCh.estimatedTime || '4 hours',
        color: subjectColors[subject]?.primary || '#3b82f6',
        description: existingDetailed?.description || `Complete NCERT study module for ${rawCh.name} covering all concepts, key takeaways, and NEET practice.`,
        topics: existingDetailed?.topics || generateDefaultTopics(rawCh.id, rawCh.name, subject, classNum, rawCh.topics),
        formulas: existingDetailed?.formulas || [],
        concepts: existingDetailed?.concepts || [
          `Master fundamental NCERT concepts of ${rawCh.name}`,
          `Memorize key definitions and high-weightage formulas`,
          `Practice at least 30-50 MCQs to build speed and accuracy`,
        ],
        neetTips: existingDetailed?.neetTips || [
          `Focus on direct NCERT textbook lines and summary points`,
          `Solve previous years NEET questions for ${rawCh.name}`,
        ],
      };

      masterChaptersList.push(normalized);
    });
  });
});

export const allChapters = masterChaptersList;

export const getChapterById = (chapterId) => {
  if (!chapterId) return null;
  return masterChaptersList.find(c => c.id.toLowerCase() === chapterId.toLowerCase()) || null;
};

export const getChaptersBySubject = (subject) => {
  if (!subject || subject === 'All') return masterChaptersList;
  return masterChaptersList.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
};

export const getChaptersByClass = (classNum) => {
  if (!classNum || classNum === 'All') return masterChaptersList;
  const num = parseInt(classNum, 10);
  return masterChaptersList.filter(c => c.class === num);
};

export const getChaptersBySubjectAndClass = (subject, classNum) => {
  let list = masterChaptersList;
  if (subject && subject !== 'All') {
    list = list.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
  }
  if (classNum && classNum !== 'All') {
    const num = parseInt(classNum, 10);
    list = list.filter(c => c.class === num);
  }
  return list;
};
