import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getMCQsByChapter, getMCQsBySubject, getRandomQuestions } from '../data/mcqs';
import { subjectColors } from '../data/syllabus';
import { getChapterById } from '../data/chapters';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Clock, ChevronLeft, ChevronRight, Flag, CheckSquare,
  Bookmark, BookmarkCheck, AlertTriangle, X, CheckCircle, XCircle, Shuffle,
} from 'lucide-react';

// ─── Timer Component ─────────────────────────────────────────────────────────

function Timer({ seconds, onTimeUp }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(interval); onTimeUp(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTimeUp]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining < 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
      urgent
        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
    }`}>
      <Clock className={`w-4 h-4 ${urgent ? 'animate-pulse' : ''}`} />
      <span className="font-mono font-bold text-lg">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

// ─── Submit Confirmation Modal ────────────────────────────────────────────────

function SubmitModal({ total, answered, onCancel, onConfirm, autoSubmit }) {
  const unanswered = total - answered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card max-w-sm w-full p-6 shadow-xl animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              {autoSubmit ? 'Time\'s Up!' : 'Submit Quiz?'}
            </h3>
          </div>
          {!autoSubmit && (
            <button onClick={onCancel} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {autoSubmit && (
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-3">
            Time is up! Your quiz is being submitted automatically.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{answered}</div>
            <div className="text-xs text-slate-500 mt-0.5">Answered</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{unanswered}</div>
            <div className="text-xs text-slate-500 mt-0.5">Unanswered</div>
          </div>
        </div>

        {unanswered > 0 && !autoSubmit && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            ⚠️ {unanswered} question{unanswered > 1 ? 's are' : ' is'} unanswered. Unanswered questions score 0 (no negative marking).
          </p>
        )}

        <div className="flex gap-3">
          {!autoSubmit && (
            <button onClick={onCancel} className="flex-1 btn-secondary">
              Continue Quiz
            </button>
          )}
          <button onClick={onConfirm} className="flex-1 btn-primary bg-red-600 hover:bg-red-700 text-white">
            {autoSubmit ? 'View Result' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChapterTest() {
  const { chapterId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveTestResult, recordMCQAttempt, toggleBookmark, progress } = useProgress();

  // Phases: intro | test | confirm | submitted
  const [phase, setPhase] = useState('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});           // { [idx]: { selected: number } }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(false);

  // Timer setting chosen in intro: null = no timer, number = seconds
  const [timerSetting, setTimerSetting] = useState(null); // null | 1800 | 3600

  const chapter = getChapterById(chapterId);
  const chapterName = chapter?.name || 'Chapter';
  const subject = chapter?.subject || 'Biology';
  const colors = subjectColors[subject] || subjectColors.Biology;

  // ── Question loading (respects ?count= and ?mode=) ────────────────────────
  const countParam = searchParams.get('count');
  const modeParam = searchParams.get('mode');

  const allChapterMCQs = (() => {
    let raw = getMCQsByChapter(chapterId);
    if (raw.length === 0 && subject) {
      raw = getMCQsBySubject(subject).slice(0, 15);
    }
    return raw;
  })();

  const questions = (() => {
    if (!countParam || countParam === 'all') return allChapterMCQs;
    if (countParam === 'random') {
      // Random 25 questions shuffled
      const shuffled = [...allChapterMCQs].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(25, shuffled.length));
    }
    const num = parseInt(countParam, 10);
    if (!isNaN(num) && num > 0) {
      return allChapterMCQs.slice(0, Math.min(num, allChapterMCQs.length));
    }
    return allChapterMCQs;
  })();

  // Freeze questions array using a ref so it doesn't reshuffle on re-render
  const questionsRef = useRef(questions);
  useEffect(() => {
    // Only update on true phase transitions (intro -> test)
    if (phase === 'intro') {
      questionsRef.current = questions;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  const frozenQuestions = phase === 'intro' ? questions : questionsRef.current;

  // ── Derived labels ────────────────────────────────────────────────────────
  const quizLabel = (() => {
    if (countParam === 'random') return 'Random Quiz';
    if (!countParam || countParam === 'all') return 'Full Chapter Quiz';
    return `${countParam}-Question Quiz`;
  })();

  const defaultTimer = frozenQuestions.length > 0 ? frozenQuestions.length * 60 : 1800; // 1 min/Q

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleStart = () => {
    questionsRef.current = questions; // lock in the questions
    setPhase('test');
    setStartTime(Date.now());
    setCurrentIdx(0);
    setAnswers({});
    setMarkedForReview(new Set());
  };

  const handleTimeUp = useCallback(() => {
    setAutoSubmit(true);
    setShowConfirm(true);
  }, []);

  const handleSubmitConfirm = useCallback(() => {
    const qs = questionsRef.current;
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    // Calculate scores
    let correct = 0, incorrect = 0;
    qs.forEach((q, i) => {
      const sel = answers[i]?.selected;
      if (sel !== undefined && sel !== null) {
        if (sel === q.correctAnswer) correct++;
        else incorrect++;
      }
    });
    const unattempted = qs.length - correct - incorrect;
    const percentage = Math.round((correct / qs.length) * 100);
    const neetScore = (correct * 4) - (incorrect * 1);
    const maxNeetScore = qs.length * 4;
    const accuracy = (correct + incorrect) > 0
      ? Math.round((correct / (correct + incorrect)) * 100)
      : 0;

    const result = {
      id: Date.now().toString(),
      chapterId,
      chapterName,
      subject,
      class: chapter?.class,
      mode: modeParam === 'quiz' ? 'quiz' : 'test',
      quizLabel,
      score: correct,
      total: qs.length,
      correct,
      incorrect,
      unattempted,
      percentage,
      neetScore,
      maxNeetScore,
      accuracy,
      timeTaken: elapsed,
      date: new Date().toISOString(),
      questions: qs,
      answers,
      countParam,
    };

    // Save to localStorage for ResultPage to read
    localStorage.setItem(`result_${result.id}`, JSON.stringify(result));

    // Persist to ProgressContext (shows in Dashboard/Recent Tests)
    saveTestResult(result);

    // Auto-save mistakes via recordMCQAttempt for each answered question
    qs.forEach((q, i) => {
      const sel = answers[i]?.selected;
      if (sel !== undefined && sel !== null) {
        const wasCorrect = sel === q.correctAnswer;
        recordMCQAttempt(q.id, wasCorrect, {
          topic: q.topic,
          chapterId: q.chapterId,
          subject: q.subject,
        });
      }
    });

    navigate(`/result/${result.id}`);
  }, [answers, questionsRef, chapterId, chapterName, subject, chapter, startTime, modeParam, quizLabel, countParam, saveTestResult, recordMCQAttempt, navigate]);

  // ─────────────────────────────────────────────────────────────────────────

  if (frozenQuestions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">📝</div>
        <h2 className="text-2xl font-bold">No Questions Available</h2>
        <p className="text-slate-500">Questions for this chapter are being added soon.</p>
        <Link to={`/chapter/${chapterId}`} className="btn-primary">Back to Chapter</Link>
      </div>
    );
  }

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────

  if (phase === 'intro') {
    const timerOptions = [
      { label: 'No Timer', value: null, desc: 'Untimed practice' },
      { label: '30 min', value: 1800, desc: 'Quick attempt' },
      { label: '60 min', value: 3600, desc: 'Relaxed pace' },
      { label: 'Auto', value: defaultTimer, desc: `${Math.ceil(defaultTimer / 60)} min (1 min/Q)` },
    ];

    return (
      <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="card max-w-lg w-full p-8 shadow-lg">
          {/* Top */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📋</div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-1">
              {quizLabel}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{chapterName}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Questions', value: frozenQuestions.length },
              { label: 'Marks / Q', value: '+4 / −1' },
              { label: 'Max NEET Score', value: `${frozenQuestions.length * 4}` },
              { label: 'Mode', value: modeParam === 'quiz' ? 'Quiz' : 'Test' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                <div className="text-xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Timer option */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timer Setting
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timerOptions.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setTimerSetting(opt.value)}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    timerSetting === opt.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">{opt.label}</div>
                  <div className="text-[11px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-6 space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p>• Answers are <strong>revealed only after submission</strong></p>
            <p>• You can navigate between questions freely</p>
            <p>• Correct: <span className="text-emerald-600 font-semibold">+4</span> · Incorrect: <span className="text-red-500 font-semibold">−1</span> · Unanswered: <span className="font-semibold">0</span></p>
            {timerSetting !== null && <p>• Timer will auto-submit when time is up</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link to={`/chapter/${chapterId}`} className="flex-1 btn-secondary text-center">Cancel</Link>
            <button
              onClick={handleStart}
              className="flex-1 btn-primary text-white"
              style={{ background: colors.primary }}
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── TEST SCREEN ───────────────────────────────────────────────────────────

  const qs = frozenQuestions;
  const q = qs[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / qs.length) * 100);
  const isBookmarked = progress.bookmarks.includes(q.id);
  const isMarked = markedForReview.has(currentIdx);

  return (
    <>
      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <SubmitModal
          total={qs.length}
          answered={answeredCount}
          onCancel={() => { setShowConfirm(false); setAutoSubmit(false); }}
          onConfirm={handleSubmitConfirm}
          autoSubmit={autoSubmit}
        />
      )}

      <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <Link to={`/chapter/${chapterId}`} className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 mb-0.5">
              <ChevronLeft className="w-3.5 h-3.5" /> {chapterName}
            </Link>
            <h1 className="font-bold font-display text-slate-900 dark:text-white">{quizLabel}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Q{currentIdx + 1} / {qs.length} · {answeredCount} answered
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {timerSetting !== null && (
              <Timer seconds={timerSetting} onTimeUp={handleTimeUp} />
            )}
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Submit Quiz
            </button>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-4">
          <ProgressBar
            value={progressPct}
            color={subject === 'Physics' ? 'blue' : subject === 'Chemistry' ? 'emerald' : 'violet'}
            className="h-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{answeredCount} answered</span>
            <span>{qs.length - answeredCount} remaining</span>
          </div>
        </div>

        {/* ── Question Navigator ── */}
        <div className="card p-3.5 mb-4 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-2 text-[11px] font-semibold text-slate-500">
            <span>Question Navigator</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> Unanswered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> Flagged
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap max-h-28 overflow-y-auto pt-0.5">
            {qs.map((_, i) => {
              const isAnswered = answers[i]?.selected !== undefined;
              const isCurr = i === currentIdx;
              const isFlagged = markedForReview.has(i);

              let cls = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
              if (isAnswered) cls = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold';
              else if (isFlagged) cls = 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 font-bold';

              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all relative ${
                    isCurr ? 'ring-2 ring-blue-500 ring-offset-1 z-10 shadow-sm' : ''
                  } ${cls}`}
                  style={isCurr ? { background: colors.primary, color: '#fff' } : {}}
                >
                  {i + 1}
                  {isFlagged && !isCurr && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-600 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Question Card ── */}
        <div className="card p-6 mb-4">
          {/* Question header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold text-slate-400">Q{currentIdx + 1} of {qs.length}</span>
                {q.difficulty && (
                  <span className={`badge ${
                    q.difficulty === 'Easy' ? 'badge-easy' : q.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'
                  }`}>{q.difficulty}</span>
                )}
                {q.topic && <span className="text-xs text-slate-400 truncate max-w-[160px]">{q.topic}</span>}
              </div>
              <p className="text-slate-900 dark:text-white font-medium leading-relaxed text-base">{q.question}</p>
            </div>
            {/* Action icons */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setMarkedForReview(prev => {
                  const n = new Set(prev);
                  n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx);
                  return n;
                })}
                title="Flag for review"
                className={`p-2 rounded-lg transition-colors ${
                  isMarked
                    ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Flag className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleBookmark(q.id)}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((option, i) => {
              const isSelected = answers[currentIdx]?.selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: { selected: i } }))}
                  className={`mcq-option ${isSelected ? 'mcq-option-selected' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-current'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clear selection */}
          {answers[currentIdx]?.selected !== undefined && (
            <button
              onClick={() => setAnswers(prev => {
                const n = { ...prev };
                delete n[currentIdx];
                return n;
              })}
              className="mt-3 text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear selection
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="btn-secondary btn-sm flex items-center gap-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs font-semibold text-slate-400">
            {currentIdx + 1} / {qs.length}
          </span>

          {currentIdx < qs.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(i => i + 1)}
              className="btn-primary btn-sm flex items-center gap-1.5"
              style={{ background: colors.primary }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-primary btn-sm flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Submit Quiz
            </button>
          )}
        </div>
      </div>
    </>
  );
}
