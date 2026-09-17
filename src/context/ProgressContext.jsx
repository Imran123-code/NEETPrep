import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'neetprep_progress';

const defaultProgress = {
  topicsCompleted: {},
  chapterProgress: {},
  mcqAttempts: {},
  mistakes: [], // Array of question IDs where the user answered incorrectly
  testResults: [],
  bookmarks: [],
  streak: { count: 0, lastDate: null },
  xp: 0,
  badges: [],
  studyPlan: [],
  dailyChallenge: {},
  plannerTasks: {},
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
    } catch { return defaultProgress; }
  });

  const [toasts, setToasts] = useState([]);

  const save = useCallback((p) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const awardXP = useCallback((amount, reason) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const updated = { ...prev, xp: newXP };
      save(updated);
      return updated;
    });
    addToast(`+${amount} XP — ${reason}`, 'xp');
  }, [save]);

  const checkBadge = useCallback((newProgress) => {
    const newBadges = [];
    const { testResults, mcqAttempts, badges } = newProgress;
    if (testResults.length >= 1 && !badges.includes('first-test')) newBadges.push('first-test');
    if (testResults.length >= 5 && !badges.includes('5-tests')) newBadges.push('5-tests');
    const totalMCQs = Object.keys(mcqAttempts).length;
    if (totalMCQs >= 100 && !badges.includes('100-mcqs')) newBadges.push('100-mcqs');
    if (newProgress.streak.count >= 7 && !badges.includes('7-day-streak')) newBadges.push('7-day-streak');
    const perfectTests = testResults.filter(r => r.percentage === 100);
    if (perfectTests.length >= 1 && !badges.includes('perfect-score')) newBadges.push('perfect-score');
    return newBadges;
  }, []);

  const completeTopic = useCallback((chapterId, topicIndex) => {
    setProgress(prev => {
      const existing = prev.topicsCompleted[chapterId] || [];
      if (existing.includes(topicIndex)) return prev;
      const updated = {
        ...prev,
        topicsCompleted: {
          ...prev.topicsCompleted,
          [chapterId]: [...existing, topicIndex],
        },
      };
      save(updated);
      awardXP(10, 'Topic completed');
      return updated;
    });
  }, [save, awardXP]);

  const saveTestResult = useCallback((result) => {
    setProgress(prev => {
      const newResults = [result, ...prev.testResults].slice(0, 50);
      const updated = { ...prev, testResults: newResults };
      const newBadges = checkBadge(updated);
      if (newBadges.length) {
        updated.badges = [...updated.badges, ...newBadges];
        newBadges.forEach(b => addToast(`🏆 Badge unlocked: ${b.replace('-', ' ')}!`, 'badge'));
      }
      save(updated);
      awardXP(25, 'Test completed');
      return updated;
    });
  }, [save, awardXP, checkBadge]);

  const recordMCQAttempt = useCallback((mcqId, correct, meta = {}) => {
    setProgress(prev => {
      const prevAttempt = prev.mcqAttempts[mcqId] || { attempts: 0, correctCount: 0 };
      const newAttempts = {
        ...prev.mcqAttempts,
        [mcqId]: {
          attempted: true,
          correct,
          attempts: (prevAttempt.attempts || 0) + 1,
          correctCount: (prevAttempt.correctCount || 0) + (correct ? 1 : 0),
          lastAttempted: Date.now(),
          topic: meta.topic || prevAttempt.topic,
          chapterId: meta.chapterId || prevAttempt.chapterId,
          subject: meta.subject || prevAttempt.subject,
        },
      };

      // Update mistakes array: add if wrong, remove if right on re-attempt
      const currentMistakes = prev.mistakes || [];
      let updatedMistakes = currentMistakes;
      if (!correct && !currentMistakes.includes(mcqId)) {
        updatedMistakes = [...currentMistakes, mcqId];
      } else if (correct && currentMistakes.includes(mcqId)) {
        updatedMistakes = currentMistakes.filter(id => id !== mcqId);
      }

      const updated = {
        ...prev,
        mcqAttempts: newAttempts,
        mistakes: updatedMistakes,
      };

      save(updated);
      if (correct) awardXP(5, 'Correct answer');
      return updated;
    });
  }, [save, awardXP]);

  const clearMistake = useCallback((mcqId) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        mistakes: (prev.mistakes || []).filter(id => id !== mcqId),
      };
      save(updated);
      return updated;
    });
  }, [save]);

  const toggleBookmark = useCallback((mcqId) => {
    setProgress(prev => {
      const exists = prev.bookmarks.includes(mcqId);
      const updated = {
        ...prev,
        bookmarks: exists ? prev.bookmarks.filter(b => b !== mcqId) : [...prev.bookmarks, mcqId],
      };
      save(updated);
      addToast(exists ? 'Bookmark removed' : '🔖 Bookmarked!', exists ? 'info' : 'success');
      return updated;
    });
  }, [save]);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    setProgress(prev => {
      if (prev.streak.lastDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newCount = prev.streak.lastDate === yesterday ? prev.streak.count + 1 : 1;
      const updated = { ...prev, streak: { count: newCount, lastDate: today } };
      save(updated);
      if (newCount === 7) addToast('🔥 7 Day Streak! Amazing!', 'badge');
      else if (newCount > 1) addToast(`🔥 ${newCount} Day Streak!`, 'success');
      return updated;
    });
  }, [save]);

  const saveDailyChallenge = useCallback((date, result) => {
    setProgress(prev => {
      const updated = { ...prev, dailyChallenge: { ...prev.dailyChallenge, [date]: result } };
      save(updated);
      return updated;
    });
    updateStreak();
  }, [save, updateStreak]);

  const updatePlannerTask = useCallback((date, taskId, completed) => {
    setProgress(prev => {
      const dateTasks = prev.plannerTasks[date] || {};
      const updated = {
        ...prev,
        plannerTasks: { ...prev.plannerTasks, [date]: { ...dateTasks, [taskId]: completed } },
      };
      save(updated);
      if (completed) awardXP(15, 'Study plan task completed');
      return updated;
    });
  }, [save, awardXP]);

  // Computed values
  const getChapterProgress = (chapterId, totalTopics) => {
    const completed = (progress.topicsCompleted[chapterId] || []).length;
    return totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;
  };

  const getSubjectStats = (subject) => {
    const subjectTests = progress.testResults.filter(r => r.subject === subject);
    const avgScore = subjectTests.length ? Math.round(subjectTests.reduce((a, r) => a + r.percentage, 0) / subjectTests.length) : 0;
    const attempts = Object.entries(progress.mcqAttempts)
      .filter(([id]) => id.startsWith(subject.toLowerCase().substring(0, 3)))
      .length;
    const correct = Object.entries(progress.mcqAttempts)
      .filter(([id, v]) => id.startsWith(subject.toLowerCase().substring(0, 3)) && v.correct)
      .length;
    return { avgScore, tests: subjectTests.length, attempts, correct };
  };

  const getOverallStats = () => {
    const attempts = Object.keys(progress.mcqAttempts).length;
    const correct = Object.values(progress.mcqAttempts).filter(v => v.correct).length;
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    return {
      totalAttempts: attempts,
      totalCorrect: correct,
      accuracy,
      testsCompleted: progress.testResults.length,
      bestScore: progress.testResults.length ? Math.max(...progress.testResults.map(r => r.percentage)) : 0,
      xp: progress.xp,
      streak: progress.streak,
      badges: progress.badges,
    };
  };

  // Compute Weak Topics based on questions attempted (< 60% accuracy or mistakes recorded)
  const getWeakTopics = useCallback(() => {
    const topicMap = {};
    Object.entries(progress.mcqAttempts || {}).forEach(([_, data]) => {
      if (!data.topic) return;
      if (!topicMap[data.topic]) {
        topicMap[data.topic] = {
          topic: data.topic,
          chapterId: data.chapterId || '',
          subject: data.subject || 'General',
          total: 0,
          correct: 0,
        };
      }
      topicMap[data.topic].total += data.attempts || 1;
      topicMap[data.topic].correct += data.correctCount || (data.correct ? 1 : 0);
    });

    const weakList = Object.values(topicMap)
      .map(t => ({
        ...t,
        accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
      }))
      .filter(t => t.total >= 1 && t.accuracy < 65)
      .sort((a, b) => a.accuracy - b.accuracy);

    return weakList;
  }, [progress.mcqAttempts]);

  return (
    <ProgressContext.Provider value={{
      progress, toasts, setToasts,
      completeTopic, saveTestResult, recordMCQAttempt, clearMistake,
      toggleBookmark, updateStreak, saveDailyChallenge, updatePlannerTask,
      getChapterProgress, getSubjectStats, getOverallStats, getWeakTopics, addToast,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
