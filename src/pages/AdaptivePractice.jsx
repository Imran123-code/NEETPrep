import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getAdaptiveNextQuestion } from '../data/questions';
import { subjectColors } from '../data/syllabus';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Award, 
  ArrowRight,
  RotateCcw,
  Zap,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

export default function AdaptivePractice() {
  const { recordMCQAttempt, toggleBookmark, progress } = useProgress();

  const [subject, setSubject] = useState('All');
  const [currentDifficulty, setCurrentDifficulty] = useState('Medium');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answeredHistory, setAnsweredHistory] = useState([]); // [{ id, correct, difficulty }]
  const [streak, setStreak] = useState(0);
  const [masteryLevel, setMasteryLevel] = useState(50); // 0 to 100

  // Load next adaptive question
  const loadNextQuestion = (prevAnswers = answeredHistory, diff = currentDifficulty) => {
    const recent5 = prevAnswers.slice(-5);
    const accuracy = recent5.length > 0 
      ? recent5.filter(a => a.correct).length / recent5.length 
      : 0.5;

    const next = getAdaptiveNextQuestion({
      recentAccuracy: accuracy,
      currentDifficulty: diff,
      answeredIds: prevAnswers.map(a => a.id),
      subject,
    });

    setCurrentQuestion(next.question);
    setCurrentDifficulty(next.difficulty);
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  useEffect(() => {
    loadNextQuestion([], 'Medium');
  }, [subject]);

  const handleSubmit = (optionIndex) => {
    if (hasSubmitted || !currentQuestion) return;
    setSelectedOption(optionIndex);
    setHasSubmitted(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const newRecord = { id: currentQuestion.id, correct: isCorrect, difficulty: currentDifficulty };
    const updatedHistory = [...answeredHistory, newRecord];
    setAnsweredHistory(updatedHistory);

    recordMCQAttempt(currentQuestion.id, isCorrect, {
      topic: currentQuestion.topic,
      chapterId: currentQuestion.chapterId,
      subject: currentQuestion.subject,
    });

    // Update streak and mastery level
    if (isCorrect) {
      setStreak(prev => prev + 1);
      const boost = currentDifficulty === 'Hard' ? 12 : currentDifficulty === 'Medium' ? 8 : 4;
      setMasteryLevel(prev => Math.min(100, prev + boost));
    } else {
      setStreak(0);
      const drop = currentDifficulty === 'Hard' ? 4 : currentDifficulty === 'Medium' ? 7 : 10;
      setMasteryLevel(prev => Math.max(0, prev - drop));
    }
  };

  const isBookmarked = currentQuestion && (progress.bookmarks || []).includes(currentQuestion.id);

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="card p-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl mb-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Dynamic Adaptive Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">
              Adaptive Practice Mode
            </h1>
            <p className="text-violet-100 text-sm mt-1 max-w-xl">
              Questions dynamically adjust to your skill. Get questions right to unlock Hard NEET problems and gain higher mastery XP.
            </p>
          </div>

          {/* Mastery Meter */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-[170px]">
            <span className="text-xs text-violet-200 block font-medium mb-1">Live Mastery Score</span>
            <div className="text-3xl font-extrabold">{masteryLevel}%</div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-400 h-full transition-all duration-700"
                style={{ width: `${masteryLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          {['All', 'Physics', 'Chemistry', 'Biology'].map(sub => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                subject === sub
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Live Difficulty Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Current AI Difficulty:</span>
          <span className={`px-3 py-1 rounded-full ${
            currentDifficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
            currentDifficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
            'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          }`}>
            {currentDifficulty} {currentDifficulty === 'Hard' ? '🔥' : ''}
          </span>
        </div>
      </div>

      {/* Active Question Card */}
      {currentQuestion ? (
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: `${subjectColors[currentQuestion.subject]?.primary}15`,
                  color: subjectColors[currentQuestion.subject]?.primary,
                }}
              >
                {currentQuestion.subject} • {currentQuestion.chapterName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {currentQuestion.topic || 'General'}
              </span>
            </div>

            <button
              onClick={() => toggleBookmark(currentQuestion.id)}
              className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Bookmark question"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>

          <h3 className="text-lg md:text-xl font-medium text-slate-900 dark:text-white leading-relaxed mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((opt, i) => {
              let btnStyle = "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10";
              if (hasSubmitted) {
                if (i === currentQuestion.correctAnswer) {
                  btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold";
                } else if (i === selectedOption) {
                  btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 font-semibold";
                }
              } else if (selectedOption === i) {
                btnStyle = "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSubmit(i)}
                  disabled={hasSubmitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm md:text-base">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Solution & Next */}
          {hasSubmitted && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Correct Answer! (+{currentDifficulty === 'Hard' ? 35 : currentDifficulty === 'Medium' ? 20 : 10} XP)
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Incorrect. Check Solution:
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> Leveling Up
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> Calibrating
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              {currentQuestion.keyConcept && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-300">
                  <strong className="block mb-0.5">💡 Key Concept:</strong>
                  {currentQuestion.keyConcept}
                </div>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => loadNextQuestion()}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Next Adaptive Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-8 text-center text-slate-500">
          Loading next question...
        </div>
      )}
    </div>
  );
}
