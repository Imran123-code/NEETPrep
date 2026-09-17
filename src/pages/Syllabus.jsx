import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { syllabus, subjectColors, subjectIcons } from '../data/syllabus';
import { Clock, BookOpen, BarChart2, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';

const difficultyConfig = {
  Easy: { label: 'Easy', class: 'badge-easy' },
  Medium: { label: 'Medium', class: 'badge-medium' },
  Hard: { label: 'Hard', class: 'badge-hard' },
};

export default function Syllabus() {
  const [activeClass, setActiveClass] = useState(11);
  const [activeSubject, setActiveSubject] = useState('All');
  const { getChapterProgress } = useProgress();

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology'];

  const getChapters = () => {
    if (activeSubject === 'All') {
      return Object.entries(syllabus).flatMap(([subject, classes]) =>
        (classes[activeClass] || []).map(ch => ({ ...ch, subject }))
      );
    }
    return (syllabus[activeSubject]?.[activeClass] || []).map(ch => ({ ...ch, subject: activeSubject }));
  };

  const chapters = getChapters();

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">NEET Syllabus</h1>
        <p className="text-slate-500 dark:text-slate-400">Complete NCERT-aligned chapter list for NEET preparation</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Class selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          {[11, 12].map(cls => (
            <button
              key={cls}
              onClick={() => setActiveClass(cls)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeClass === cls
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>
        {/* Subject selector */}
        <div className="flex flex-wrap gap-2">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                activeSubject === sub
                  ? sub === 'Physics' ? 'bg-blue-600 text-white border-blue-600'
                  : sub === 'Chemistry' ? 'bg-emerald-600 text-white border-emerald-600'
                  : sub === 'Biology' ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {sub === 'Physics' && '⚛️ '}
              {sub === 'Chemistry' && '🧪 '}
              {sub === 'Biology' && '🧬 '}
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter count */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {chapters.length} chapters · Class {activeClass} · {activeSubject === 'All' ? 'All Subjects' : activeSubject}
      </p>

      {/* Chapter grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {chapters.map(ch => {
          const colors = subjectColors[ch.subject];
          const progress = getChapterProgress(ch.id, ch.topics);
          const diff = difficultyConfig[ch.difficulty];
          return (
            <div key={ch.id} className="card p-5 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-6">
                    {String(ch.number).padStart(2, '0')}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full`}
                    style={{ background: `${colors.primary}15`, color: colors.primary }}
                  >
                    {subjectIcons[ch.subject]} {ch.subject}
                  </span>
                </div>
                <span className={diff.class}>{diff.label}</span>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ch.name}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{ch.topics} topics</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ch.estimatedTime}</span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold" style={{ color: colors.primary }}>{progress}%</span>
                </div>
                <ProgressBar value={progress} color={
                  ch.subject === 'Physics' ? 'blue' : ch.subject === 'Chemistry' ? 'emerald' : 'violet'
                } />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Link to={`/chapter/${ch.id}`} className="flex-1 text-center py-2 text-xs font-semibold text-white rounded-lg transition-colors"
                  style={{ background: colors.primary }}>
                  Study
                </Link>
                <Link to={`/chapter/${ch.id}/mcqs`} className="flex-1 text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  MCQs
                </Link>
                <Link to={`/chapter/${ch.id}/test`} className="flex-1 text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Test
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
