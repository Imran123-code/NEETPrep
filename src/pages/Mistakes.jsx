import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { getMistakeQuestions } from '../data/questions';
import { subjectColors } from '../data/syllabus';
import { 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  BookOpen, 
  Trash2,
  Filter,
  Sparkles
} from 'lucide-react';

export default function Mistakes() {
  const { progress, recordMCQAttempt, clearMistake, toggleBookmark } = useProgress();
  const mistakeIds = progress.mistakes || [];
  const mistakesList = getMistakeQuestions(mistakeIds);

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, cleared: 0 });

  // Filter mistakes
  const filteredMistakes = mistakesList.filter(q => {
    if (selectedSubject !== 'All' && q.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
    return true;
  });

  const activeQuestion = filteredMistakes[currentIndex];

  const handleAnswerSubmit = (optionIndex) => {
    if (hasSubmitted) return;
    setSelectedOption(optionIndex);
    setHasSubmitted(true);
    const isCorrect = optionIndex === activeQuestion.correctAnswer;

    recordMCQAttempt(activeQuestion.id, isCorrect, {
      topic: activeQuestion.topic,
      chapterId: activeQuestion.chapterId,
      subject: activeQuestion.subject,
    });

    if (isCorrect) {
      clearMistake(activeQuestion.id);
      setPracticeStats(prev => ({ correct: prev.correct + 1, cleared: prev.cleared + 1 }));
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    if (currentIndex < filteredMistakes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setPracticeMode(false);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Mistakes Notebook & Error Analysis</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            My Mistakes ({mistakesList.length})
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and re-attempt all questions you previously answered incorrectly.
          </p>
        </div>

        {mistakesList.length > 0 && !practiceMode && (
          <button
            onClick={() => {
              setPracticeMode(true);
              setCurrentIndex(0);
              setSelectedOption(null);
              setHasSubmitted(false);
              setPracticeStats({ correct: 0, cleared: 0 });
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Practice Mistakes Now ({filteredMistakes.length})</span>
          </button>
        )}
      </div>

      {/* Practice Mode Active */}
      {practiceMode && activeQuestion ? (
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg">
                Mistake Drill
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Question {currentIndex + 1} of {filteredMistakes.length}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="text-emerald-600 dark:text-emerald-400">
                ✓ Cleared: {practiceStats.cleared}
              </span>
              <button
                onClick={() => setPracticeMode(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
              >
                Exit Drill
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="card p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span 
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: `${subjectColors[activeQuestion.subject]?.primary}15`,
                  color: subjectColors[activeQuestion.subject]?.primary,
                }}
              >
                {activeQuestion.subject} • {activeQuestion.chapterName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {activeQuestion.topic || 'General'}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-medium text-slate-900 dark:text-white leading-relaxed mb-6">
              {activeQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {activeQuestion.options.map((opt, i) => {
                let btnStyle = "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600";
                if (hasSubmitted) {
                  if (i === activeQuestion.correctAnswer) {
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
                    onClick={() => handleAnswerSubmit(i)}
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

            {/* Solution and Explanation Box */}
            {hasSubmitted && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {selectedOption === activeQuestion.correctAnswer ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Correct! Mistake Cleared!
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Still Incorrect. Review Solution:
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeQuestion.explanation}
                </p>

                {activeQuestion.keyConcept && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-300">
                    <strong className="block mb-0.5">💡 Key Concept:</strong>
                    {activeQuestion.keyConcept}
                  </div>
                )}

                {activeQuestion.ncertReference && (
                  <p className="text-xs text-slate-400">
                    📖 Reference: {activeQuestion.ncertReference}
                  </p>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                  >
                    {currentIndex < filteredMistakes.length - 1 ? 'Next Mistake →' : 'Finish Drill'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Subject:
            </span>
            {['All', 'Physics', 'Chemistry', 'Biology'].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSubject === sub
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {sub} {sub === 'All' ? `(${mistakesList.length})` : `(${mistakesList.filter(m => m.subject.toLowerCase() === sub.toLowerCase()).length})`}
              </button>
            ))}
          </div>

          {/* Mistakes List */}
          {filteredMistakes.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {mistakesList.length === 0 ? "No Mistakes Recorded Yet!" : `No ${selectedSubject} Mistakes!`}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Whenever you answer an MCQ incorrectly during practice or tests, it will appear here so you can master your weak spots.
              </p>
              <Link to="/mcqs" className="btn-primary inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Practice Question Bank</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMistakes.map((q, idx) => {
                const isExpanded = expandedId === q.id;
                const isBookmarked = (progress.bookmarks || []).includes(q.id);

                return (
                  <div key={q.id} className="card p-5 md:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-600">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span 
                            className="text-xs font-semibold px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${subjectColors[q.subject]?.primary}15`,
                              color: subjectColors[q.subject]?.primary,
                            }}
                          >
                            {q.subject}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {q.chapterName} • {q.topic || 'Concept'}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>

                        <h4 className="text-base md:text-lg font-medium text-slate-900 dark:text-white leading-snug">
                          {idx + 1}. {q.question}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleBookmark(q.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Bookmark question"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-blue-600 fill-current" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => clearMistake(q.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Remove from mistakes"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Solution */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:underline"
                      >
                        {isExpanded ? (
                          <>Hide Solution <ChevronUp className="w-3.5 h-3.5" /></>
                        ) : (
                          <>View Solution & Key Concept <ChevronDown className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-2.5 text-sm">
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {q.explanation}
                        </p>
                        {q.keyConcept && (
                          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-300">
                            <strong>💡 Key Concept:</strong> {q.keyConcept}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
