import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getChapterById } from '../data/chapters';
import { subjectColors } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Lightbulb, AlertTriangle, List } from 'lucide-react';

export default function LearnPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { completeTopic, progress } = useProgress();
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('content');

  const chapter = getChapterById(chapterId);

  if (!chapter || !chapter.topics || chapter.topics.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">📖</div>
        <h2 className="text-2xl font-bold">Content Not Available</h2>
        <p className="text-slate-500 max-w-sm">Detailed study material for this chapter is coming soon.</p>
        <Link to="/syllabus" className="btn-primary">Browse Other Chapters</Link>
      </div>
    );
  }

  const colors = subjectColors[chapter.subject] || subjectColors.Physics;
  const topic = chapter.topics[activeTopicIdx] || chapter.topics[0];
  const completedTopics = progress.topicsCompleted[chapterId] || [];
  const isCompleted = completedTopics.includes(activeTopicIdx);
  const totalProgress = Math.round((completedTopics.length / chapter.topics.length) * 100);

  const handleMarkComplete = () => {
    completeTopic(chapterId, activeTopicIdx);
    if (activeTopicIdx < chapter.topics.length - 1) {
      setTimeout(() => setActiveTopicIdx(i => i + 1), 500);
    }
  };

  return (
    <div className="page-enter flex flex-col md:flex-row min-h-screen">
      {/* Sidebar - Topic List */}
      <aside className="md:w-72 lg:w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <Link to={`/chapter/${chapterId}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Chapter
          </Link>
          <h2 className="font-bold text-slate-900 dark:text-white font-display text-sm leading-tight">{chapter.name}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Progress</span>
              <span style={{ color: colors.primary }} className="font-semibold">{totalProgress}%</span>
            </div>
            <ProgressBar value={totalProgress} color={chapter.subject === 'Physics' ? 'blue' : chapter.subject === 'Chemistry' ? 'emerald' : 'violet'} />
            <p className="text-xs text-slate-400 mt-1">{completedTopics.length}/{chapter.topics.length} topics done</p>
          </div>
        </div>
        <nav className="p-2">
          {chapter.topics.map((t, i) => {
            const done = completedTopics.includes(i);
            const active = i === activeTopicIdx;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopicIdx(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 flex items-center gap-3 transition-all duration-150 ${
                  active
                    ? 'text-white shadow-sm'
                    : done
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                style={active ? { background: colors.primary } : {}}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  active ? 'bg-white/20 text-white' : done ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className="text-xs font-medium line-clamp-2">{t.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-3xl">
        {/* Topic header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Topic {activeTopicIdx + 1} of {chapter.topics.length}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">{topic.name}</h1>
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" /> Completed
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
          {[
            { id: 'content', label: 'Content', icon: BookOpen },
            { id: 'keypoints', label: 'Key Points', icon: List },
            { id: 'tips', label: 'NEET Tips', icon: Lightbulb },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="card p-6">
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-base">{topic.content}</p>
              </div>

              {/* Formulas */}
              {topic.formulas && topic.formulas.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span>📐</span> Important Formulas
                  </h3>
                  <div className="space-y-3">
                    {topic.formulas.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${colors.primary}08` }}>
                        <div className="flex-1">
                          <div className="font-mono text-lg font-semibold text-slate-900 dark:text-white">{f.formula}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{f.name} {f.unit && `(${f.unit})`}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'keypoints' && (
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Key Points to Remember</h3>
              {topic.keyPoints && topic.keyPoints.length > 0 ? (
                <ul className="space-y-3">
                  {topic.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ background: colors.primary }}>
                        {i + 1}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-200">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">Key points not available for this topic.</p>
              )}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              {topic.neetTips && (
                <div className="card p-6 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> NEET Tip
                  </h3>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{topic.neetTips}</p>
                </div>
              )}
              {topic.commonMistakes && (
                <div className="card p-6 border-l-4 border-red-400">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Common Mistake
                  </h3>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{topic.commonMistakes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation and complete */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTopicIdx(i => Math.max(0, i - 1))}
            disabled={activeTopicIdx === 0}
            className="flex items-center gap-2 btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={handleMarkComplete}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'text-white shadow-sm hover:shadow-md'
            }`}
            style={!isCompleted ? { background: colors.primary } : {}}
          >
            {isCompleted ? (
              <><CheckCircle className="w-4 h-4" /> Completed</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Mark Complete</>
            )}
          </button>

          <button
            onClick={() => {
              if (activeTopicIdx < chapter.topics.length - 1) {
                setActiveTopicIdx(i => i + 1);
              } else {
                navigate(`/chapter/${chapterId}/mcqs`);
              }
            }}
            className="flex items-center gap-2 btn-primary btn-sm"
          >
            {activeTopicIdx < chapter.topics.length - 1 ? 'Next' : 'Practice MCQs'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
