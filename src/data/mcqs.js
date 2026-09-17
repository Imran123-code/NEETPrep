// Compatibility re-export bridge for NEET MCQ Bank
// Connects existing imports seamlessly to the new modular question registry

import {
  allQuestions,
  getAllQuestions,
  getQuestionsBySubject,
  getQuestionsByClass,
  getQuestionsByChapter,
  getQuestionsByTopic,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
  getRandomQuestions,
  getWeakTopicQuestions,
  getBookmarkedQuestions,
  getMistakeQuestions,
  getQuestionOfTheDay,
  getAdaptiveNextQuestion,
  filterQuestions,
  getQuestionStats,
} from './questions/index.js';

export const mcqs = allQuestions;

export const getMCQsByChapter = getQuestionsByChapter;
export const getMCQsBySubject = getQuestionsBySubject;
export const getMCQsByClass = getQuestionsByClass;
export const getMCQsByDifficulty = getQuestionsByDifficulty;

export const getDailyChallengeMCQs = () => {
  return getRandomQuestions({
    count: 10,
    subjects: ['Physics', 'Chemistry', 'Biology'],
    difficulties: ['Easy', 'Medium', 'Hard'],
  });
};

export const getMockTestMCQs = (
  subjects = ['Physics', 'Chemistry', 'Biology'],
  classNums = [11, 12],
  count = 30,
  difficulty = 'Mixed'
) => {
  const difficulties = difficulty === 'Mixed' || !difficulty ? ['Easy', 'Medium', 'Hard'] : [difficulty];
  return getRandomQuestions({
    count,
    subjects,
    classNums,
    difficulties,
  });
};

export {
  allQuestions,
  getAllQuestions,
  getQuestionsBySubject,
  getQuestionsByClass,
  getQuestionsByChapter,
  getQuestionsByTopic,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
  getRandomQuestions,
  getWeakTopicQuestions,
  getBookmarkedQuestions,
  getMistakeQuestions,
  getQuestionOfTheDay,
  getAdaptiveNextQuestion,
  filterQuestions,
  getQuestionStats,
};
