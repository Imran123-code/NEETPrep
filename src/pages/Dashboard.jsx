import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar';
import { allChapters } from '../data/chapters';
import { subjectColors } from '../data/syllabus';
import { Target, BookOpen, Zap, Flame, Trophy, Clock, ArrowRight, CheckCircle, Circle, Video, Play } from 'lucide-react';
const subjects = ['Physics', 'Chemistry', 'Biology'];

const badges = {
  'first-test': { label: 'First Test', emoji: '🏆' },
  '5-tests': { label: '5 Tests', emoji: '📝' },
  '100-mcqs': { label: '100 MCQs', emoji: '🎯' },
  '7-day-streak': { label: '7 Day Streak', emoji: '🔥' },
  'perfect-score': { label: 'Perfect Score', emoji: '💯' },
};

const subjectBarColors = { Physics: 'blue', Chemistry: 'emerald', Biology: 'violet' };
const subjectMarks = { Physics: 180, Chemistry: 180, Biology: 360 };

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, getSubjectStats, getOverallStats, watchHistory } = useProgress();
  const stats = getOverallStats();
  const today = new Date().toLocaleDateString();

  const recentTests = progress.testResults.slice(0, 5);
  const lastChapter = allChapters.find(c => progress.topicsCompleted[c.id]?.length > 0) || allChapters[0];
  const lastWatched = watchHistory?.[0] || null;

  const getHour = () => new Date().getHours();
  const greeting = getHour() < 12 ? 'Good Morning' : getHour() < 17 ? 'Good Afternoon' : 'Good Evening';

  const todayGoals = [
    { id: 'topics', label: 'Complete 2 topics', done: false },
    { id: 'mcqs', label: 'Solve 30 MCQs', done: stats.totalAttempts > 0 },
    { id: 'test', label: 'Complete 1 chapter test', done: recentTests.length > 0 },
    { id: 'revision', label: 'Quick revision session', done: false },
  ];

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title">
            {greeting}, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-orange-600 dark:text-orange-400">{stats.streak.count} Day Streak</span>
          </div>
          {/* XP */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400">{stats.xp} XP</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Hub */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Continue Learning</h2>
              <Link to="/syllabus" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View Syllabus</Link>
            </div>

            <div className="space-y-3">
              {/* 1. Continue Chapter */}
              {lastChapter && (
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-white dark:bg-slate-800 shadow-2xs shrink-0">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-slate-400">Continue Chapter</div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{lastChapter.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <ProgressBar
                        value={Math.round(((progress.topicsCompleted[lastChapter.id]?.length || 0) / (lastChapter.topics?.length || 1)) * 100)}
                        color={subjectBarColors[lastChapter.subject]}
                        className="flex-1 h-1.5"
                      />
                      <span className="text-[11px] font-semibold text-slate-500">
                        {Math.round(((progress.topicsCompleted[lastChapter.id]?.length || 0) / (lastChapter.topics?.length || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/chapter/${lastChapter.id}/learn`}
                    className="btn-primary btn-sm text-xs shrink-0"
                    style={{ background: subjectColors[lastChapter.subject]?.primary }}
                  >
                    Study Notes
                  </Link>
                </div>
              )}

              {/* 2. Continue Watching */}
              {lastWatched ? (
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-50/40 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                  <div className="relative w-14 h-10 rounded-lg bg-black overflow-hidden shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${lastWatched.youtubeId}/hqdefault.jpg`}
                      alt={lastWatched.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-red-600 dark:text-red-400">Continue Watching</div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{lastWatched.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{lastWatched.chapterName || lastWatched.subject}</p>
                  </div>
                  <Link
                    to={`/videos/${lastWatched.id}`}
                    className="btn-primary btn-sm text-xs shrink-0 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Resume Video
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-red-50 dark:bg-red-950/40 text-red-500 shrink-0">
                      🎥
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">Video Lectures</div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Watch NEET concept videos & one-shots</div>
                    </div>
                  </div>
                  <Link to="/videos" className="btn-secondary btn-sm text-xs">
                    Browse Videos
                  </Link>
                </div>
              )}

              {/* 3. Continue MCQs */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 shrink-0">
                    📝
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">Continue MCQs</div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {stats.totalAttempts > 0 ? `${stats.totalAttempts} questions attempted · Practice more` : 'Solve high-yield chapter MCQs'}
                    </div>
                  </div>
                </div>
                <Link to="/mcqs" className="btn-primary btn-sm text-xs">
                  Practice MCQs
                </Link>
              </div>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Subject Progress</h2>
              <Link to="/progress" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">Detailed View</Link>
            </div>
            <div className="space-y-4">
              {subjects.map(sub => {
                const subStats = getSubjectStats(sub);
                const colors = subjectColors[sub];
                return (
                  <div key={sub} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: `${colors.primary}15` }}>
                      {sub === 'Physics' ? '⚛️' : sub === 'Chemistry' ? '🧪' : '🧬'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{sub}</span>
                        <span className="font-semibold" style={{ color: colors.primary }}>{subStats.avgScore}%</span>
                      </div>
                      <ProgressBar value={subStats.avgScore} color={subjectBarColors[sub]} />
                    </div>
                    <div className="text-xs text-slate-400 w-16 text-right">{subjectMarks[sub]} marks</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Tests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Recent Tests</h2>
              <Link to="/progress" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</Link>
            </div>
            {recentTests.length > 0 ? (
              <div className="space-y-3">
                {recentTests.map(test => (
                  <div key={test.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      test.percentage >= 80 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : test.percentage >= 60 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {test.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{test.chapterName}</p>
                      <p className="text-xs text-slate-400">{test.score}/{test.total} · {test.subject} · {new Date(test.date).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/result/${test.id}`} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline whitespace-nowrap">Review</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-3">No tests completed yet</p>
                <Link to="/syllabus" className="btn-primary btn-sm">Take Your First Test</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Today's Goal */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Today's Goals</h2>
            <div className="space-y-3">
              {todayGoals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3">
                  {goal.done
                    ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    : <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                  }
                  <span className={`text-sm ${goal.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {goal.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <ProgressBar value={todayGoals.filter(g => g.done).length * 25} color="emerald" />
              <p className="text-xs text-slate-400 mt-1.5">{todayGoals.filter(g => g.done).length}/{todayGoals.length} goals completed</p>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Overall Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'MCQs Solved', value: stats.totalAttempts, icon: '✏️' },
                { label: 'Correct', value: stats.totalCorrect, icon: '✅' },
                { label: 'Tests Done', value: stats.testsCompleted, icon: '📋' },
                { label: 'Best Score', value: `${stats.bestScore}%`, icon: '🏆' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
              <div className="text-xs text-slate-500 mb-1">Overall Accuracy</div>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">{stats.accuracy}%</div>
            </div>
          </div>

          {/* Badges */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Badges</h2>
            {stats.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.badges.map(b => (
                  <div key={b} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                    <span>{badges[b]?.emoji || '🏅'}</span>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{badges[b]?.label || b}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Trophy className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Complete tests to earn badges</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: '/daily-challenge', label: '🔥 Daily Challenge', color: 'text-orange-600' },
                { to: '/mock-tests', label: '📋 Mock Test', color: 'text-blue-600' },
                { to: '/revision', label: '📖 Quick Revision', color: 'text-violet-600' },
                { to: '/study-planner', label: '📅 Study Planner', color: 'text-emerald-600' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <span className={`text-sm font-medium ${link.color}`}>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
