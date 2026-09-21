import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle, XCircle, Clock, Target, RotateCcw, BookOpen,
  ChevronDown, ChevronUp, Trophy, AlertTriangle, TrendingUp, Zap, Video, Percent,
} from 'lucide-react';
import { CircularProgress } from '../components/ui/ProgressBar';
import { subjectColors } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60), s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── Performance message (per requirements) ──────────────────────────────────

function getPerformance(percentage) {
  if (percentage >= 90) return {
    label: 'Excellent! 🎉',
    message: 'Your preparation is strong. Keep it up!',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    border: 'border-emerald-200 dark:border-emerald-800',
  };
  if (percentage >= 75) return {
    label: 'Very Good! 👍',
    message: 'Great score! Keep practicing to reach excellence.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800',
  };
  if (percentage >= 50) return {
    label: 'Good Effort! 💪',
    message: 'Revise the weak topics and practice more MCQs.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-200 dark:border-amber-800',
  };
  return {
    label: 'Keep Practicing 📚',
    message: 'Revise the chapter again and solve more MCQs. You\'ve got this!',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-red-200 dark:border-red-800',
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [showReview, setShowReview] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);

  // Load result from localStorage first, then fall back to ProgressContext
  let result = null;
  try {
    const raw = localStorage.getItem(`result_${id}`);
    if (raw) result = JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse result from localStorage', e);
  }

  if (!result && progress?.testResults) {
    result = progress.testResults.find(r => r.id === id || String(r.id) === String(id));
  }

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold">Result Not Found</h2>
        <p className="text-slate-500">This result has expired or doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const colors = subjectColors[result.subject] || subjectColors.Physics;
  const {
    score, total, correct, incorrect, unattempted,
    percentage, timeTaken, chapterName, subject, mode,
    questions, answers, neetScore, maxNeetScore, accuracy,
    quizLabel, countParam,
  } = result;

  const perf = getPerformance(percentage ?? 0);
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  // NEET score calculation (use stored value or compute on the fly for old results)
  const displayNeetScore = neetScore !== undefined
    ? neetScore
    : (correct ?? score) * 4 - (incorrect ?? (total - (score ?? 0) - (unattempted ?? 0))) * 1;
  const displayMaxNeetScore = maxNeetScore !== undefined ? maxNeetScore : total * 4;

  // Accuracy (use stored or compute)
  const displayAccuracy = accuracy !== undefined
    ? accuracy
    : ((correct ?? score) + (incorrect ?? 0)) > 0
      ? Math.round(((correct ?? score) / ((correct ?? score) + (incorrect ?? 0))) * 100)
      : 0;

  // Retry URL — reconstruct the original quiz URL
  const retryUrl = countParam
    ? `/chapter/${result.chapterId}/test?count=${countParam}&mode=${mode === 'quiz' ? 'quiz' : 'test'}`
    : `/chapter/${result.chapterId}/test`;

  // Weak / strong topic analysis
  const wrongQuestions = questions?.filter((q, i) => {
    const ans = answers?.[i] || answers?.[q.id];
    return ans && ans.selected !== undefined && ans.selected !== null && ans.selected !== q.correctAnswer;
  }) || [];
  const weakTopics = [...new Set(wrongQuestions.map(q => q.topic).filter(Boolean))];
  const strongTopics = [...new Set(
    questions?.filter((q, i) => {
      const ans = answers?.[i] || answers?.[q.id];
      return ans && ans.selected === q.correctAnswer;
    }).map(q => q.topic).filter(Boolean) || []
  )].filter(t => !weakTopics.includes(t));

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{isPerfect ? '🏆' : isGood ? '🎯' : '📊'}</div>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">
          Quiz Completed!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {chapterName} · {subject}
          {quizLabel && <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{quizLabel}</span>}
        </p>
      </div>

      {/* ── Score card ── */}
      <div className="card p-8 mb-6 text-center" style={{ background: `${colors.primary}08`, borderColor: `${colors.primary}30` }}>
        <div className="flex justify-center mb-4">
          <CircularProgress value={percentage ?? 0} size={130} color={colors.primary} />
        </div>
        <div className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-1">
          {correct ?? score} / {total}
        </div>
        <div className="text-slate-500 text-sm mb-3">{percentage}%</div>

        {/* Performance message */}
        <div className={`inline-flex items-start gap-2 text-sm font-semibold px-4 py-2 rounded-xl border ${perf.bg} ${perf.border} ${perf.color} max-w-sm mx-auto`}>
          <span>{perf.label}</span>
        </div>
        <p className={`text-xs mt-2 ${perf.color}`}>{perf.message}</p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Correct',
            value: correct ?? score,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/10',
          },
          {
            label: 'Incorrect',
            value: incorrect ?? (total - (score ?? 0)),
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50 dark:bg-red-900/10',
          },
          {
            label: 'Unanswered',
            value: unattempted ?? 0,
            icon: Target,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/10',
          },
          {
            label: 'Accuracy',
            value: `${displayAccuracy}%`,
            icon: Percent,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/10',
          },
        ].map(stat => (
          <div key={stat.label} className={`card p-4 text-center ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── NEET Score card ── */}
      <div className="card p-5 mb-6 flex items-center justify-between gap-4 border-2" style={{ borderColor: `${colors.primary}30`, background: `${colors.primary}05` }}>
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> NEET Scoring (+4 / −1 / 0)
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {displayNeetScore}
            <span className="text-lg text-slate-400 font-normal"> / {displayMaxNeetScore}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ({correct ?? score} × 4) − ({incorrect ?? (total - (score ?? 0) - (unattempted ?? 0))} × 1)
          </div>
        </div>
        <div className="text-right">
          {timeTaken > 0 && (
            <>
              <div className="text-xs text-slate-400">Time Taken</div>
              <div className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 justify-end">
                <Clock className="w-4 h-4" /> {formatTime(timeTaken)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Performance Analysis (weak/strong topics) ── */}
      {(weakTopics.length > 0 || strongTopics.length > 0) && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Performance Analysis
          </h2>
          {strongTopics.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">✓ Strong Areas</div>
              <div className="flex flex-wrap gap-2">
                {strongTopics.map(t => (
                  <span key={t} className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{t}</span>
                ))}
              </div>
            </div>
          )}
          {weakTopics.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">⚠ Needs Improvement</div>
              <div className="space-y-2">
                {weakTopics.map(t => (
                  <div key={t} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 gap-2">
                    <span className="font-medium text-xs text-red-800 dark:text-red-300">{t}</span>
                    <Link
                      to={`/videos?chapter=${result.chapterId}&topic=${encodeURIComponent(t)}&subject=${subject}`}
                      className="btn-sm btn-secondary py-1 px-2.5 text-xs inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 self-start sm:self-auto hover:border-red-300"
                    >
                      <Video className="w-3.5 h-3.5" /> Watch Video Lectures
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm text-blue-700 dark:text-blue-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              💡 <strong>Recommendation:</strong>{' '}
              {weakTopics.length > 0
                ? `Revise "${weakTopics[0]}" and solve practice MCQs on weak topics.`
                : 'Great performance! Try the full chapter test for more practice.'
              }
            </div>
            {weakTopics.length > 0 && (
              <button
                onClick={() => navigate('/random-practice', {
                  state: { customTopics: weakTopics, title: `Weak Topics: ${chapterName}` }
                })}
                className="btn-primary py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Zap className="w-3.5 h-3.5 fill-current" /> Practice Weak Topics
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Question Review ── */}
      {questions && questions.length > 0 && (
        <div className="card mb-6">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Review Answers</span>
              <span className="ml-2 text-xs text-slate-400">
                {wrongQuestions.length} incorrect · {unattempted ?? 0} unanswered
              </span>
            </div>
            {showReview
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
            }
          </button>

          {showReview && (
            <div className="border-t border-slate-100 dark:border-slate-700">
              {questions.map((q, i) => {
                const userAns = answers?.[i]?.selected ?? answers?.[q.id]?.selected;
                const wasAttempted = userAns !== undefined && userAns !== null;
                const isCorrect = wasAttempted && userAns === q.correctAnswer;
                const isExpanded = expandedQ === i;

                return (
                  <div key={q.id || i} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <button
                      className="w-full text-left px-5 py-3 flex items-start gap-3"
                      onClick={() => setExpandedQ(isExpanded ? null : i)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        !wasAttempted
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : isCorrect
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {!wasAttempted ? '–' : isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
                          Q{i + 1}. {q.question}
                        </p>
                        {!isExpanded && (
                          <p className={`text-xs mt-0.5 ${
                            !wasAttempted ? 'text-amber-500'
                            : isCorrect ? 'text-emerald-500'
                            : 'text-red-500'
                          }`}>
                            {!wasAttempted
                              ? '⚪ Not Attempted'
                              : isCorrect
                                ? '✅ Correct'
                                : `❌ Your: ${q.options[userAns] || '–'} · Correct: ${q.options[q.correctAnswer]}`
                            }
                          </p>
                        )}
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      }
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-3 animate-fade-in">
                        {/* Options with correct/incorrect highlight */}
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`flex items-center gap-2 p-2.5 rounded-xl text-sm ${
                                oi === q.correctAnswer
                                  ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 font-semibold'
                                  : oi === userAns && !isCorrect
                                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                                    : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <span className="font-bold w-5 shrink-0">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                              {oi === q.correctAnswer && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />}
                              {oi === userAns && !isCorrect && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto shrink-0" />}
                            </div>
                          ))}
                        </div>

                        {/* Status label */}
                        <div className={`text-xs font-semibold py-1 px-2 rounded-lg w-fit ${
                          !wasAttempted ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                          : isCorrect ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {!wasAttempted ? '⚪ Not Attempted' : isCorrect ? '✅ Correct' : '❌ Incorrect'}
                          {wasAttempted && !isCorrect && (
                            <span className="ml-1 opacity-70">
                              (Your answer: {String.fromCharCode(65 + userAns)})
                            </span>
                          )}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-sm text-slate-700 dark:text-slate-200">
                            <span className="font-semibold text-blue-700 dark:text-blue-400">Explanation: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-3 justify-center">
        {weakTopics.length > 0 && (
          <button
            onClick={() => navigate('/random-practice', {
              state: { customTopics: weakTopics, title: `Weak Topics Practice (${chapterName})` }
            })}
            className="btn-primary flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Zap className="w-4 h-4 fill-current" /> Practice Weak Topics
          </button>
        )}
        <Link
          to={retryUrl}
          className="btn-primary flex items-center gap-2"
          style={{ background: colors.primary }}
        >
          <RotateCcw className="w-4 h-4" /> Retry Quiz
        </Link>
        <Link to={`/chapter/${result.chapterId}/mcqs`} className="btn-secondary flex items-center gap-2">
          <Target className="w-4 h-4" /> Practice MCQs
        </Link>
        <Link to={`/mistakes`} className="btn-secondary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Review Mistakes
        </Link>
        <Link to={`/chapter/${result.chapterId}`} className="btn-secondary flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Back to Chapter
        </Link>
      </div>
    </div>
  );
}
