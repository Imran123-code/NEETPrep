import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar';
import { subjectColors } from '../data/syllabus';
import { syllabus } from '../data/syllabus';
import { TrendingUp, Target, CheckCircle, Award, BarChart2, Filter } from 'lucide-react';

const subjects = ['Physics', 'Chemistry', 'Biology'];
const subjectBarColors = { Physics: 'blue', Chemistry: 'emerald', Biology: 'violet' };

export default function Progress() {
  const { progress, getOverallStats, getSubjectStats, getChapterProgress } = useProgress();
  const [activeSubject, setActiveSubject] = useState('All');
  const stats = getOverallStats();

  const getTestsBySubject = (sub) => progress.testResults.filter(t => sub === 'All' || t.subject === sub);
  const filteredTests = getTestsBySubject(activeSubject);

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">My Progress</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your NEET preparation journey</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'MCQs Attempted', value: stats.totalAttempts, icon: '✏️', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Correct Answers', value: stats.totalCorrect, icon: '✅', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Tests Completed', value: stats.testsCompleted, icon: '📋', color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/10' },
          { label: 'Overall Accuracy', value: `${stats.accuracy}%`, icon: '🎯', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/10' },
        ].map(stat => (
          <div key={stat.label} className={`card p-5 text-center ${stat.color}`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold font-display">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Progress */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5">Subject-wise Performance</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {subjects.map(sub => {
                const subStats = getSubjectStats(sub);
                const colors = subjectColors[sub];
                return (
                  <div key={sub} className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex justify-center mb-3">
                      <CircularProgress value={subStats.avgScore} size={72} color={colors.primary} />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{sub}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{subStats.tests} tests · {subStats.avgScore}% avg</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chapter Progress per Subject */}
          {subjects.map(sub => {
            const chapters11 = syllabus[sub]?.[11] || [];
            const chapters12 = syllabus[sub]?.[12] || [];
            const allCh = [...chapters11, ...chapters12];
            const colors = subjectColors[sub];
            const completed = allCh.filter(ch => getChapterProgress(ch.id, ch.topics) === 100).length;
            return (
              <div key={sub} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{sub === 'Physics' ? '⚛️' : sub === 'Chemistry' ? '🧪' : '🧬'}</span>
                    {sub} Chapters
                  </h2>
                  <div className="text-sm font-semibold" style={{ color: colors.primary }}>{completed}/{allCh.length} done</div>
                </div>
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {allCh.map(ch => {
                    const p = getChapterProgress(ch.id, ch.topics);
                    return (
                      <div key={ch.id} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                          p === 100 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}>
                          {p === 100 ? '✓' : ch.number}
                        </div>
                        <Link to={`/chapter/${ch.id}`} className="flex-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                          {ch.name}
                        </Link>
                        <div className="w-16">
                          <ProgressBar value={p} color={subjectBarColors[sub]} className="h-1.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 w-8 text-right">{p}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Streak & XP */}
          <div className="card p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border-orange-100 dark:border-orange-800">
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold font-display text-orange-600 dark:text-orange-400">{stats.streak.count} Days</div>
              <div className="text-sm text-slate-500 mt-1">Study Streak</div>
              <div className="mt-3 pt-3 border-t border-orange-100 dark:border-orange-800">
                <div className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400">⚡ {stats.xp} XP</div>
                <div className="text-xs text-slate-400">Experience Points</div>
              </div>
            </div>
          </div>

          {/* Test History */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 dark:text-white">Test History</h2>
              <select className="input text-xs py-1 px-2" value={activeSubject} onChange={e => setActiveSubject(e.target.value)}>
                <option>All</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
              </select>
            </div>
            {filteredTests.length > 0 ? (
              <div className="space-y-2.5">
                {filteredTests.slice(0, 10).map(test => (
                  <Link key={test.id} to={`/result/${test.id}`} className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500 truncate max-w-[140px]">{test.chapterName}</span>
                      <span className={`text-xs font-bold ${
                        test.percentage >= 80 ? 'text-emerald-600' : test.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>{test.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={test.percentage} color={
                        test.percentage >= 80 ? 'emerald' : test.percentage >= 60 ? 'amber' : 'red'
                      } className="flex-1 h-1" />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{test.score}/{test.total} · {new Date(test.date).toLocaleDateString()}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BarChart2 className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No tests recorded yet</p>
                <Link to="/syllabus" className="text-xs text-blue-600 font-medium hover:underline mt-1 block">Take a test</Link>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-3">🏆 Achievements</h2>
            {stats.badges.length > 0 ? (
              <div className="space-y-2">
                {stats.badges.map(b => (
                  <div key={b} className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                    <span className="text-xl">🏅</span>
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{b}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Complete tests to earn achievements</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
