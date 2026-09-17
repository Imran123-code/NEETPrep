import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuestionOfTheDay } from '../data/questions';
import { useProgress } from '../context/ProgressContext';
import { subjectColors } from '../data/syllabus';
import { 
  Flame, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function DailyQuestion() {
  const { progress, recordMCQAttempt, toggleBookmark } = useProgress();
  const dailyQuestion = getQuestionOfTheDay();

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isBookmarked = (progress.bookmarks || []).includes(dailyQuestion.id);
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = (i) => {
    if (hasSubmitted) return;
    setSelectedOption(i);
    setHasSubmitted(true);
    const isCorrect = i === dailyQuestion.correctAnswer;

    recordMCQAttempt(dailyQuestion.id, isCorrect, {
      topic: dailyQuestion.topic,
      chapterId: dailyQuestion.chapterId,
      subject: dailyQuestion.subject,
    });
  };

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-semibold text-xs rounded-full mb-3">
          <Flame className="w-4 h-4 fill-current" />
          <span>Daily NEET Challenge</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
          Question of the Day
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{todayStr}</span>
        </p>
      </div>

      {/* Main Question Card */}
      <div className="card p-6 md:p-8 max-w-3xl mx-auto border-2 border-orange-200 dark:border-orange-900/30">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: `${subjectColors[dailyQuestion.subject]?.primary}15`,
                color: subjectColors[dailyQuestion.subject]?.primary,
              }}
            >
              {dailyQuestion.subject} • {dailyQuestion.chapterName}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
              {dailyQuestion.topic || 'Core Concept'}
            </span>
          </div>

          <button
            onClick={() => toggleBookmark(dailyQuestion.id)}
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
          {dailyQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {dailyQuestion.options.map((opt, i) => {
            let btnStyle = "border-slate-200 dark:border-slate-700 hover:border-orange-400";
            if (hasSubmitted) {
              if (i === dailyQuestion.correctAnswer) {
                btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold";
              } else if (i === selectedOption) {
                btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 font-semibold";
              }
            } else if (selectedOption === i) {
              btnStyle = "border-orange-500 bg-orange-50 text-orange-700";
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

        {/* Detailed Explanation */}
        {hasSubmitted && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              {selectedOption === dailyQuestion.correctAnswer ? (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Correct Answer! Streak Maintained 🔥
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Incorrect. Correct Answer is Option {String.fromCharCode(65 + dailyQuestion.correctAnswer)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {dailyQuestion.explanation}
            </p>

            {dailyQuestion.keyConcept && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-300">
                <strong className="block mb-0.5">💡 Key Concept:</strong>
                {dailyQuestion.keyConcept}
              </div>
            )}

            {dailyQuestion.ncertReference && (
              <p className="text-xs text-slate-400">
                📖 Reference: {dailyQuestion.ncertReference}
              </p>
            )}

            <div className="pt-3 flex flex-wrap gap-3 justify-between items-center">
              <Link 
                to={`/practice/${dailyQuestion.chapterId}`}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Practice more {dailyQuestion.chapterName} MCQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/mcqs"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Go to Question Bank
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
