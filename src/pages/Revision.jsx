import React, { useState, useMemo } from 'react';
import { allChapters } from '../data/chapters';
import { subjectColors } from '../data/syllabus';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, CheckCircle, BookOpen, Zap, Search, RotateCcw } from 'lucide-react';

export default function Revision() {
  const [activeSubject, setActiveSubject] = useState('All');
  const [activeClass, setActiveClass] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedChapter, setExpandedChapter] = useState(null);

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology'];

  const filtered = useMemo(() => {
    return allChapters.filter(ch => {
      if (activeSubject !== 'All' && ch.subject !== activeSubject) return false;
      if (activeClass !== 'All' && String(ch.class) !== String(activeClass)) return false;
      if (search && !ch.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeSubject, activeClass, search]);

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Quick Revision</h1>
        <p className="text-slate-500 dark:text-slate-400">
          High-yield key points, NEET tips, and core formulas across all {allChapters.length} chapters for rapid revision
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search chapters for revision..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>

          <div className="flex gap-2">
            {['All', '11', '12'].map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeClass === cls
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cls === 'All' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                activeSubject === sub
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {sub === 'Physics' && '⚛️ '}{sub === 'Chemistry' && '🧪 '}{sub === 'Biology' && '🧬 '}{sub}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">
            {filtered.length} chapters
          </span>
        </div>
      </div>

      {/* Chapter Revision Cards */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Chapters Found</h3>
          <p className="text-sm text-slate-400 mt-1">Try resetting your search query or filters.</p>
          <button
            onClick={() => { setSearch(''); setActiveSubject('All'); setActiveClass('All'); }}
            className="btn-secondary mt-4 inline-flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ch => {
            const colors = subjectColors[ch.subject] || subjectColors.Physics;
            const isExpanded = expandedChapter === ch.id;
            const allKeyPoints = ch.topics?.flatMap(t => t.keyPoints || []).slice(0, 8) || [];

            return (
              <div key={ch.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {ch.subject === 'Physics' ? '⚛️' : ch.subject === 'Chemistry' ? '🧪' : '🧬'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{ch.name}</h3>
                        <span className="badge text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Class {ch.class}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">{ch.topics?.length || 0} topics</span>
                        {ch.neetTips && <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">💡 NEET Tips</span>}
                        {ch.formulas?.length > 0 && <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">📐 {ch.formulas.length} formulas</span>}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700 p-5 space-y-4 animate-fade-in">
                    {/* Key Points */}
                    {allKeyPoints.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Key Points
                        </h4>
                        <ul className="space-y-1.5">
                          {allKeyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <span className="text-emerald-500 shrink-0 mt-0.5">▸</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* NEET Tips */}
                    {ch.neetTips && (
                      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-2 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> NEET Tips & High Yield Insights
                        </h4>
                        <ul className="space-y-1.5">
                          {Array.isArray(ch.neetTips) ? (
                            ch.neetTips.map((tip, i) => (
                              <li key={i} className="text-sm text-amber-800 dark:text-amber-300">💡 {tip}</li>
                            ))
                          ) : (
                            <li className="text-sm text-amber-800 dark:text-amber-300">💡 {ch.neetTips}</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Formulas */}
                    {ch.formulas?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Key Formulas
                        </h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {ch.formulas.slice(0, 6).map((f, i) => (
                            <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">{f.formula}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{f.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <Link
                        to={`/chapter/${ch.id}/learn`}
                        className="flex-1 text-center py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
                        style={{ background: colors.primary }}
                      >
                        Detailed Study
                      </Link>
                      <Link
                        to={`/chapter/${ch.id}/mcqs`}
                        className="flex-1 text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        Practice MCQs
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
