import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Target, RotateCcw, BookOpen, ChevronDown, ChevronUp, Trophy, AlertTriangle, TrendingUp, Zap, Video } from 'lucide-react';
import { CircularProgress } from '../components/ui/ProgressBar';
import { subjectColors } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60), s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [showReview, setShowReview] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);

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
  const { score, total, correct, incorrect, unattempted, percentage, timeTaken, chapterName, subject, mode, questions, answers } = result;
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  const performance = percentage >= 90 ? { label: 'Excellent! 🎉', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' }
    : percentage >= 70 ? { label: 'Good Job! 👍', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' }
    : percentage >= 50 ? { label: 'Keep Practicing 💪', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' }
    : { label: 'Needs Improvement ⚠️', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' };

  // Analyze weak topics
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
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{isPerfect ? '🏆' : isGood ? '🎯' : '📊'}</div>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">
          {mode === 'test' ? 'Test Completed!' : 'Practice Complete!'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">{chapterName} · {subject}</p>
      </div>

      {/* Score Card */}
      <div className="card p-8 mb-6 text-center" style={{ background: `${colors.primary}08`, borderColor: `${colors.primary}30` }}>
        <div className="flex justify-center mb-4">
          <CircularProgress value={percentage} size={120} color={colors.primary} />
        </div>
        <div className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-1">
          {score} / {total}
        </div>
        <div className={`text-lg font-semibold ${performance.color} mt-2`}>{performance.label}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Correct', value: correct ?? score, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Incorrect', value: incorrect ?? (total - score), icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
          { label: 'Unattempted', value: unattempted ?? 0, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Time Taken', value: timeTaken ? formatTime(timeTaken) : 'N/A', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        ].map(stat => (
          <div key={stat.label} className={`card p-4 text-center ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Performance Analysis */}
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
              <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">⚠ Needs Improvement — Recommended Video Lectures</div>
              <div className="space-y-2">
                {weakTopics.map(t => (
                  <div key={t} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 gap-2">
                    <span className="font-medium text-xs text-red-800 dark:text-red-300">
                      {t}
                    </span>
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
                  state: {
                    customTopics: weakTopics,
                    title: `Weak Topics: ${chapterName}`
                  }
                })}
                className="btn-primary py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Zap className="w-3.5 h-3.5 fill-current" /> Practice Weak Topics
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Review Toggle */}
      {questions && questions.length > 0 && (
        <div className="card mb-6">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="font-semibold text-slate-900 dark:text-white">Question Review</span>
            {showReview ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {showReview && (
            <div className="border-t border-slate-100 dark:border-slate-700">
              {questions.map((q, i) => {
                const userAns = answers?.[i]?.selected ?? answers?.[q.id]?.selected;
                const wasAttempted = userAns !== undefined && userAns !== null;
                const isCorrect = wasAttempted && userAns === q.correctAnswer;
                const isExpanded = expandedQ === i;
                return (
                  <div key={q.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <button className="w-full text-left px-5 py-3 flex items-start gap-3" onClick={() => setExpandedQ(isExpanded ? null : i)}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        !wasAttempted ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        : isCorrect ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {!wasAttempted ? '–' : isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2">Q{i+1}. {q.question}</p>
                        {!isExpanded && (
                          <p className={`text-xs mt-0.5 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                            {!wasAttempted ? 'Not attempted' : isCorrect ? 'Correct' : `Your: ${q.options[userAns] || '-'} · Correct: ${q.options[q.correctAnswer]}`}
                          </p>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-4 space-y-3 animate-fade-in">
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`flex items-center gap-2 p-2.5 rounded-xl text-sm ${
                              oi === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 font-semibold'
                              : oi === userAns && !isCorrect ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                              : 'text-slate-600 dark:text-slate-300'
                            }`}>
                              <span className="font-bold w-4">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                              {oi === q.correctAnswer && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />}
                              {oi === userAns && !isCorrect && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto shrink-0" />}
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm text-slate-700 dark:text-slate-200">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {weakTopics.length > 0 && (
          <button
            onClick={() => navigate('/random-practice', {
              state: {
                customTopics: weakTopics,
                title: `Weak Topics Practice (${chapterName})`
              }
            })}
            className="btn-primary flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Zap className="w-4 h-4 fill-current" /> Practice Weak Topics
          </button>
        )}
        <Link to={`/chapter/${result.chapterId}/test`} className="btn-primary flex items-center gap-2" style={{ background: colors.primary }}>
          <RotateCcw className="w-4 h-4" /> Retry Test
        </Link>
        <Link to={`/chapter/${result.chapterId}/mcqs`} className="btn-secondary flex items-center gap-2">
          <Target className="w-4 h-4" /> Practice Again
        </Link>
        <Link to={`/chapter/${result.chapterId}/learn`} className="btn-secondary flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Review Notes
        </Link>
        <Link to={`/chapter/${result.chapterId}`} className="btn-secondary flex items-center gap-2">
          Back to Chapter
        </Link>
      </div>
    </div>
  );
}
