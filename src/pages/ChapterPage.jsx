import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getChapterById } from '../data/chapters';
import { subjectColors } from '../data/syllabus';
import { getMCQsByChapter } from '../data/mcqs';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar';
import { BookOpen, Clock, Target, FileText, ChevronRight, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';

export default function ChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { getChapterProgress, progress } = useProgress();

  const chapterData = getChapterById(chapterId);

  if (!chapterData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">📖</div>
        <h2 className="text-2xl font-bold">Chapter Not Found</h2>
        <p className="text-slate-500 max-w-md">This chapter's detailed content is coming soon. Try browsing from the syllabus.</p>
        <Link to="/syllabus" className="btn-primary">Browse Syllabus</Link>
      </div>
    );
  }

  const colors = subjectColors[chapterData.subject] || subjectColors.Physics;
  const mcqs = getMCQsByChapter(chapterId);
  const topicsCompleted = (progress.topicsCompleted[chapterId] || []).length;
  const totalTopics = Array.isArray(chapterData.topics) ? chapterData.topics.length : (typeof chapterData.topics === 'number' ? chapterData.topics : 4);
  const chapterProgress = getChapterProgress(chapterId, totalTopics);

  const testResults = (progress.testResults || []).filter(r => r.chapterId === chapterId);
  const bestScore = testResults.length ? Math.max(...testResults.map(r => r.percentage)) : null;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8" style={{ background: `${colors.primary}10` }}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/subject/${chapterData.subject}`} className="hover:text-blue-600">{chapterData.subject}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-200">{chapterData.name}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${
                  chapterData.difficulty === 'Easy' ? 'badge-easy' : chapterData.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'
                }`}>
                  {chapterData.difficulty}
                </span>
                <span className="text-xs text-slate-500">Chapter {chapterData.chapterNumber || chapterData.number}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
                {chapterData.name}
              </h1>
              {chapterData.description && (
                <p className="text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">{chapterData.description}</p>
              )}

              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <BookOpen className="w-4 h-4" style={{ color: colors.primary }} />
                  <span>{totalTopics} topics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                  <span>{chapterData.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Target className="w-4 h-4" style={{ color: colors.primary }} />
                  <span>{mcqs.length} MCQs available</span>
                </div>
                {bestScore !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Best: {bestScore}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center gap-3">
              <CircularProgress value={chapterProgress} size={100} color={colors.primary} />
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {topicsCompleted}/{totalTopics} topics done
                </div>
                <div className="text-xs text-slate-400">Chapter Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Action Cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Continue Learning', desc: 'Study topics with notes', icon: PlayCircle, to: `/chapter/${chapterId}/learn`, primary: true },
              { label: 'Practice MCQs', desc: `${mcqs.length} questions available`, icon: Target, to: `/chapter/${chapterId}/mcqs`, primary: false },
              { label: 'Chapter Test', desc: 'Timed exam mode', icon: FileText, to: `/chapter/${chapterId}/test`, primary: false },
              { label: 'View Formulas', desc: 'Key formulas & concepts', icon: BookOpen, to: `/formulas`, primary: false },
            ].map(action => (
              <Link key={action.label} to={action.to}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl text-center transition-all duration-200 ${
                  action.primary
                    ? 'text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : 'card hover:shadow-md hover:-translate-y-0.5'
                }`}
                style={action.primary ? { background: colors.primary } : {}}
              >
                <action.icon className={`w-7 h-7 ${action.primary ? 'text-white' : ''}`} style={!action.primary ? { color: colors.primary } : {}} />
                <div>
                  <div className={`font-semibold text-sm ${action.primary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{action.label}</div>
                  <div className={`text-xs mt-0.5 ${action.primary ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Practice Mode Presets */}
          <div className="card p-6 mb-8">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white mb-3 flex items-center justify-between">
              <span>⚡ Quick MCQ Practice Modes</span>
              <span className="text-xs text-slate-400 font-normal">{mcqs.length} questions available</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Practice 10', count: 10, desc: 'Quick 10 questions' },
                { label: 'Practice 25', count: 25, desc: 'Standard practice' },
                { label: 'Practice 50', count: 50, desc: 'In-depth drill' },
                { label: 'Practice All', count: 'all', desc: 'All chapter questions' },
              ].map(opt => (
                <Link
                  key={opt.label}
                  to={`/chapter/${chapterId}/mcqs?count=${opt.count}`}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-center group"
                >
                  <div className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{opt.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </Link>
              ))}
            </div>
          </div>

        {/* Topics list */}
        {chapterData?.topics && Array.isArray(chapterData.topics) && chapterData.topics.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">Topics in This Chapter</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {chapterData.topics.map((topic, i) => {
                const done = (progress.topicsCompleted[chapterId] || []).includes(i);
                return (
                  <div key={topic.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      done ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{topic.name}</span>
                  </div>
                );
              })}
            </div>
            <Link to={`/chapter/${chapterId}/learn`} className="mt-4 inline-flex items-center gap-2 font-semibold text-sm transition-colors" style={{ color: colors.primary }}>
              Start studying all topics <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Key formulas preview */}
        {chapterData?.formulas && chapterData.formulas.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">Key Formulas</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {chapterData.formulas.slice(0, 6).map((f, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs text-slate-500 mb-1">{f.category}</div>
                  <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{f.formula}</div>
                  <div className="text-xs text-slate-500 mt-1">{f.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEET Tips */}
        {chapterData?.neetTips && chapterData.neetTips.length > 0 && (
          <div className="card p-6 border-l-4 mb-6" style={{ borderLeftColor: colors.primary }}>
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-3">NEET Tips for This Chapter</h2>
            <ul className="space-y-2">
              {chapterData.neetTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-amber-500 mt-0.5">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
