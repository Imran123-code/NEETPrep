import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getMCQsByChapter, getMCQsBySubject } from '../data/mcqs';
import { subjectColors } from '../data/syllabus';
import { getChapterById } from '../data/chapters';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, CheckCircle, XCircle, Flag, SkipForward, Clock, CheckSquare, Video } from 'lucide-react';

const diffColors = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

function PracticeTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
      <Clock className="w-3.5 h-3.5 text-blue-500" />
      <span>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
    </div>
  );
}

export default function MCQPractice() {
  const { chapterId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recordMCQAttempt, toggleBookmark, progress } = useProgress();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [answers, setAnswers] = useState({});

  const chapter = getChapterById(chapterId);
  const chapterName = chapter?.name || 'Chapter';
  const subject = chapter?.subject || 'Physics';
  const colors = subjectColors[subject] || subjectColors.Physics;

  let rawQuestions = getMCQsByChapter(chapterId);
  if (rawQuestions.length === 0 && subject) {
    // Gracefully use subject questions as fallback
    rawQuestions = getMCQsBySubject(subject).slice(0, 15);
  }

  const countParam = searchParams.get('count');
  let questions = rawQuestions;
  if (countParam && countParam !== 'all') {
    const num = parseInt(countParam, 10);
    if (!isNaN(num) && num > 0) {
      questions = rawQuestions.slice(0, num);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">📝</div>
        <h2 className="text-2xl font-bold">No MCQs Available</h2>
        <p className="text-slate-500 max-w-sm">MCQs for this chapter are being added soon.</p>
        <div className="flex gap-3">
          <Link to={`/chapter/${chapterId}`} className="btn-secondary">Back to Chapter</Link>
          <Link to="/mcqs" className="btn-primary">Browse All MCQs</Link>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const isBookmarked = progress.bookmarks.includes(q.id);
  const isReview = markedForReview.has(currentIdx);
  const attempted = answers[currentIdx];

  const handleAnswer = (idx) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const correct = idx === q.correctAnswer;
    setAnswers(prev => ({ ...prev, [currentIdx]: { selected: idx, correct } }));
    recordMCQAttempt(q.id, correct);
  };

  const handleFinish = () => {
    const score = Object.values(answers).filter(a => a.correct).length;
    const correct = score;
    const attemptedCount = Object.keys(answers).length;
    const incorrect = Object.values(answers).filter(a => !a.correct && !a.skipped).length;
    const unattempted = questions.length - attemptedCount;
    const result = {
      id: Date.now().toString(),
      chapterId,
      chapterName,
      subject,
      mode: 'practice',
      score,
      total: questions.length,
      correct,
      incorrect,
      unattempted,
      percentage: Math.round((score / questions.length) * 100),
      date: new Date().toISOString(),
      answers: Object.fromEntries(questions.map((q, i) => [q.id, answers[i]])),
      questions,
    };
    localStorage.setItem(`result_${result.id}`, JSON.stringify(result));
    navigate(`/result/${result.id}`);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    setAnswers(prev => ({ ...prev, [currentIdx]: { selected: null, correct: false, skipped: true } }));
    handleNext();
  };

  const pct = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <Link to={`/chapter/${chapterId}`} className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> {chapterName}
          </Link>
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">MCQ Practice</h1>
        </div>
        <div className="flex items-center gap-3">
          <PracticeTimer />
          <span className="text-sm font-semibold text-slate-500">{currentIdx + 1} of {questions.length}</span>
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" /> Submit Practice
          </button>
        </div>
      </div>

      {/* Preset Modes */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Presets:</span>
        {[10, 25, 50, 'all'].map(cnt => {
          const active = (countParam === String(cnt)) || (!countParam && cnt === 10 && rawQuestions.length >= 10);
          return (
            <button
              key={cnt}
              onClick={() => {
                setSearchParams({ count: String(cnt) });
                setCurrentIdx(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setAnswers({});
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cnt === 'all' ? 'Practice All' : `Practice ${cnt}`}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <ProgressBar value={pct} color={subject === 'Physics' ? 'blue' : subject === 'Chemistry' ? 'emerald' : 'violet'} className="h-2" />
      </div>

      {/* Question Navigator Palette */}
      <div className="card p-3.5 mb-5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-500">
          <span>Question Navigator Palette</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Answered</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" /> Not Answered</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Marked</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full ring-2 ring-blue-500" /> Current</span>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap max-h-32 overflow-y-auto pt-1">
          {questions.map((_, i) => {
            const ans = answers[i];
            const isCurr = i === currentIdx;
            const isMarked = markedForReview.has(i);
            const isAnswered = ans && !ans.skipped;

            let badgeClass = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
            if (isAnswered) {
              badgeClass = ans.correct
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold';
            } else if (ans?.skipped) {
              badgeClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
            } else if (isMarked) {
              badgeClass = 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 font-bold';
            }

            return (
              <button
                key={i}
                onClick={() => {
                  setCurrentIdx(i);
                  setSelectedAnswer(answers[i]?.selected ?? null);
                  setShowExplanation(!!answers[i]);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all relative ${
                  isCurr ? 'ring-2 ring-blue-500 ring-offset-1 z-10 shadow-xs' : ''
                } ${badgeClass}`}
              >
                {i + 1}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-600 rounded-full border-2 border-white dark:border-slate-800" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MCQ Card */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${diffColors[q.difficulty] || 'badge-medium'}`}>{q.difficulty}</span>
              <span className="text-xs text-slate-400">{q.topic}</span>
            </div>
            <p className="text-slate-900 dark:text-white font-medium leading-relaxed text-base">{q.question}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setMarkedForReview(prev => {
                const n = new Set(prev);
                n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx);
                return n;
              })}
              className={`p-2 rounded-lg transition-colors ${isReview ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Mark for review"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmark(q.id)}
              className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Bookmark"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((option, i) => {
            let cls = 'mcq-option';
            if (showExplanation) {
              if (i === q.correctAnswer) cls += ' mcq-option-correct';
              else if (i === selectedAnswer && selectedAnswer !== q.correctAnswer) cls += ' mcq-option-incorrect';
              else cls += ' opacity-60';
            } else if (i === selectedAnswer) {
              cls += ' mcq-option-selected';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    showExplanation && i === q.correctAnswer ? 'border-emerald-500 bg-emerald-500 text-white'
                    : showExplanation && i === selectedAnswer ? 'border-red-400 bg-red-400 text-white'
                    : 'border-current'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                  {showExplanation && i === q.correctAnswer && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
                  {showExplanation && i === selectedAnswer && i !== q.correctAnswer && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === q.correctAnswer
                ? <><CheckCircle className="w-4 h-4 text-emerald-500" /><span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Correct!</span></>
                : <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-semibold text-red-600 dark:text-red-400">Incorrect</span></>
              }
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{q.explanation}</p>
            {selectedAnswer !== q.correctAnswer && (
              <div className="mt-3 pt-3 border-t border-blue-200/70 dark:border-blue-800/60 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Need help with this concept?
                </span>
                <Link
                  to={`/videos?chapter=${q.chapterId}&topic=${encodeURIComponent(q.topic || '')}&subject=${q.subject}&class=${q.class}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" /> Watch Related Video
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => { setCurrentIdx(i => Math.max(0, i - 1)); setSelectedAnswer(null); setShowExplanation(false); }}
          disabled={currentIdx === 0}
          className="btn-secondary btn-sm flex items-center gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={handleSkip} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <SkipForward className="w-4 h-4" /> Skip
        </button>
        <button
          onClick={handleNext}
          className="btn-primary btn-sm flex items-center gap-1.5"
          style={{ background: colors.primary }}
        >
          {currentIdx < questions.length - 1 ? 'Next' : 'Submit & See Result'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
