import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getChaptersBySubjectAndClass, getChapterById } from '../data/chapters';
import { subjectColors, subjectIcons } from '../data/syllabus';
import { getMCQsByChapter } from '../data/mcqs';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Search, BookOpen, Clock, Target, FileText, ChevronDown, ChevronUp,
  PlayCircle, CheckCircle, Sparkles, Filter, Layers, ArrowRight
} from 'lucide-react';

const difficultyConfig = {
  Easy: { label: 'Easy', class: 'badge-easy' },
  Medium: { label: 'Medium', class: 'badge-medium' },
  Hard: { label: 'Hard', class: 'badge-hard' },
};

export default function Syllabus() {
  const [activeClass, setActiveClass] = useState(11);
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const { getChapterProgress, progress } = useProgress();
  const navigate = useNavigate();

  const subjects = [
    { name: 'Physics', icon: '⚛️', color: 'blue', marks: '180 Marks', weightage: '25%' },
    { name: 'Chemistry', icon: '🧪', color: 'emerald', marks: '180 Marks', weightage: '25%' },
    { name: 'Biology', icon: '🧬', color: 'violet', marks: '360 Marks', weightage: '50%' },
  ];

  // Calculate subject-level progress
  const subjectProgressMap = useMemo(() => {
    const map = {};
    subjects.forEach(sub => {
      const allClassChapters = [
        ...getChaptersBySubjectAndClass(sub.name, 11),
        ...getChaptersBySubjectAndClass(sub.name, 12),
      ];
      if (allClassChapters.length === 0) {
        map[sub.name] = 0;
        return;
      }
      const totalPct = allClassChapters.reduce((acc, ch) => {
        const totalTopics = Array.isArray(ch.topics) ? ch.topics.length : 4;
        return acc + getChapterProgress(ch.id, totalTopics);
      }, 0);
      map[sub.name] = Math.round(totalPct / allClassChapters.length);
    });
    return map;
  }, [getChapterProgress, progress.topicsCompleted]);

  // Retrieve chapters for active class and active subject
  const currentChapters = useMemo(() => {
    let list = [];
    if (activeSubject === 'All') {
      list = [
        ...getChaptersBySubjectAndClass('Physics', activeClass),
        ...getChaptersBySubjectAndClass('Chemistry', activeClass),
        ...getChaptersBySubjectAndClass('Biology', activeClass),
      ];
    } else {
      list = getChaptersBySubjectAndClass(activeSubject, activeClass);
    }

    if (!searchQuery.trim()) return list;

    const lower = searchQuery.toLowerCase().trim();
    return list.filter(ch => {
      const matchName = ch.name.toLowerCase().includes(lower);
      const matchSubject = ch.subject.toLowerCase().includes(lower);
      const matchTopics = Array.isArray(ch.topics) && ch.topics.some(t => {
        const topicName = typeof t === 'string' ? t : t.name;
        return topicName && topicName.toLowerCase().includes(lower);
      });
      return matchName || matchSubject || matchTopics;
    });
  }, [activeSubject, activeClass, searchQuery]);

  const toggleTopicExpand = (chapterId) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            NTA NEET UG Curriculum
          </span>
          <span className="text-xs text-slate-400 font-medium">Updated & NCERT-Aligned</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-2 tracking-tight">
          NEET Syllabus
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          Complete Class 11 & 12 syllabus for NEET preparation with chapter learning modules, notes, and topic-wise MCQ practice.
        </p>
      </div>

      {/* 2. Top Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {subjects.map(sub => {
          const colors = subjectColors[sub.name] || subjectColors.Physics;
          const pct = subjectProgressMap[sub.name] || 0;
          const chaptersCount11 = getChaptersBySubjectAndClass(sub.name, 11).length;
          const chaptersCount12 = getChaptersBySubjectAndClass(sub.name, 12).length;
          const isSelected = activeSubject === sub.name;

          return (
            <div
              key={sub.name}
              onClick={() => setActiveSubject(sub.name)}
              className={`card p-5 cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              style={isSelected ? { borderColor: colors.primary } : {}}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{sub.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {chaptersCount11 + chaptersCount12} Chapters · {sub.marks}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: `${colors.primary}15`, color: colors.primary }}
                >
                  {pct}%
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Syllabus Progress</span>
                  <span className="font-semibold" style={{ color: colors.primary }}>{pct}% Completed</span>
                </div>
                <ProgressBar
                  value={pct}
                  color={sub.name === 'Physics' ? 'blue' : sub.name === 'Chemistry' ? 'emerald' : 'violet'}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Controls & Filter Section */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Class Selection Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1 hidden sm:inline">Class:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
              {[11, 12].map(cls => (
                <button
                  key={cls}
                  onClick={() => setActiveClass(cls)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeClass === cls
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 mr-1 hidden sm:inline">Subject:</span>
            {['Physics', 'Chemistry', 'Biology', 'All'].map(sub => {
              const active = activeSubject === sub;
              const colorConfig = subjectColors[sub] || { primary: '#3b82f6' };
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSubject(sub)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    active
                      ? 'text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                  style={active ? { background: colorConfig.primary, borderColor: colorConfig.primary } : {}}
                >
                  {sub === 'Physics' && '⚛️ '}
                  {sub === 'Chemistry' && '🧪 '}
                  {sub === 'Biology' && '🧬 '}
                  {sub === 'All' ? 'All Subjects' : sub}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search syllabus, chapters, topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Chapter Count Badge */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-white font-display text-lg">
            {activeSubject === 'All' ? 'All Subjects' : activeSubject} · Class {activeClass}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {currentChapters.length} Chapters
          </span>
        </div>
        {searchQuery && (
          <span className="text-xs text-slate-400">
            Filtering by: "<strong className="text-slate-700 dark:text-slate-200">{searchQuery}</strong>"
          </span>
        )}
      </div>

      {/* 4. Chapters Grid */}
      {currentChapters.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No Chapters Found</h3>
          <p className="text-sm text-slate-500 mb-4">No chapter or topic matches your search query "{searchQuery}".</p>
          <button onClick={() => setSearchQuery('')} className="btn-secondary btn-sm">
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {currentChapters.map(ch => {
            const colors = subjectColors[ch.subject] || subjectColors.Physics;
            const mcqsList = getMCQsByChapter(ch.id);
            const totalTopics = Array.isArray(ch.topics) ? ch.topics.length : 4;
            const progressPct = getChapterProgress(ch.id, totalTopics);
            const diff = difficultyConfig[ch.difficulty] || difficultyConfig.Medium;
            const isTopicsExpanded = expandedTopics.has(ch.id);

            return (
              <div
                key={ch.id}
                className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border border-slate-100 dark:border-slate-800 group"
              >
                <div>
                  {/* Top Bar: Chapter Number, Subject Badge & Difficulty */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{ background: `${colors.primary}18`, color: colors.primary }}
                      >
                        {String(ch.chapterNumber || ch.number).padStart(2, '0')}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: `${colors.primary}12`, color: colors.primary }}
                      >
                        {subjectIcons[ch.subject]} {ch.subject}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold ${diff.class}`}>
                      {diff.label}
                    </span>
                  </div>

                  {/* Chapter Title */}
                  <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ch.name}
                  </h2>

                  {/* Key Meta Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {totalTopics} Topics
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      {mcqsList.length} MCQs
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {ch.estimatedTime}
                    </span>
                  </div>

                  {/* Completion Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Completion Progress</span>
                      <span className="font-bold" style={{ color: colors.primary }}>
                        {progressPct}%
                      </span>
                    </div>
                    <ProgressBar
                      value={progressPct}
                      color={ch.subject === 'Physics' ? 'blue' : ch.subject === 'Chemistry' ? 'emerald' : 'violet'}
                    />
                  </div>

                  {/* Important Topics Accordion */}
                  {Array.isArray(ch.topics) && ch.topics.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => toggleTopicExpand(ch.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          Important Topics ({ch.topics.length})
                        </span>
                        {isTopicsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isTopicsExpanded && (
                        <div className="mt-2.5 space-y-1.5 animate-slide-up">
                          {ch.topics.map((t, idx) => {
                            const topicTitle = typeof t === 'string' ? t : t.name;
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300"
                              >
                                <span
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                  style={{ background: colors.primary }}
                                >
                                  {idx + 1}
                                </span>
                                <span className="line-clamp-1">{topicTitle}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/chapter/${ch.id}/learn`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                      style={{ background: colors.primary }}
                    >
                      <PlayCircle className="w-4 h-4" />
                      Start Learning
                    </Link>

                    <Link
                      to={`/chapter/${ch.id}/mcqs`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5"
                    >
                      <Target className="w-4 h-4 text-slate-500" />
                      Practice MCQs
                    </Link>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/chapter/${ch.id}`}
                      className="flex-1 text-center py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      Chapter Overview →
                    </Link>
                    <Link
                      to={`/chapter/${ch.id}/test`}
                      className="flex-1 text-center py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      Timed Test →
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
