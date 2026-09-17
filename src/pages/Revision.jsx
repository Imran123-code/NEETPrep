import React, { useState } from 'react';
import { physicsChapters } from '../data/physics';
import { chemistryChapters } from '../data/chemistry';
import { biologyChapters } from '../data/biology';
import { subjectColors } from '../data/syllabus';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, CheckCircle, BookOpen, Zap } from 'lucide-react';

const allChapters = [...physicsChapters, ...chemistryChapters, ...biologyChapters];

export default function Revision() {
  const [activeSubject, setActiveSubject] = useState('All');
  const [expandedChapter, setExpandedChapter] = useState(null);

  const subjects = ['All', 'Physics', 'Chemistry', 'Biology'];
  const filtered = allChapters.filter(ch => activeSubject === 'All' || ch.subject === activeSubject);

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Quick Revision</h1>
        <p className="text-slate-500 dark:text-slate-400">Key points, NEET tips, and formulas for rapid revision before your exam</p>
      </div>

      {/* Subject Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {subjects.map(sub => (
          <button key={sub} onClick={() => setActiveSubject(sub)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeSubject === sub
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}>
            {sub === 'Physics' && '⚛️ '}{sub === 'Chemistry' && '🧪 '}{sub === 'Biology' && '🧬 '}{sub}
          </button>
        ))}
      </div>

      {/* Chapter Revision Cards */}
      <div className="space-y-3">
        {filtered.map(ch => {
          const colors = subjectColors[ch.subject];
          const isExpanded = expandedChapter === ch.id;
          const allKeyPoints = ch.topics?.flatMap(t => t.keyPoints || []).slice(0, 8) || [];

          return (
            <div key={ch.id} className="card overflow-hidden">
              <button
                onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{ch.subject === 'Physics' ? '⚛️' : ch.subject === 'Chemistry' ? '🧪' : '🧬'}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{ch.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">{ch.topics?.length || 0} topics</span>
                      {ch.neetTips && <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">💡 NEET Tips available</span>}
                      {ch.formulas?.length > 0 && <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">📐 {ch.formulas.length} formulas</span>}
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
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
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* NEET Tips */}
                  {ch.neetTips && ch.neetTips.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> NEET Tips
                      </h4>
                      <ul className="space-y-1.5">
                        {ch.neetTips.map((tip, i) => (
                          <li key={i} className="text-sm text-amber-800 dark:text-amber-300">💡 {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Formulas */}
                  {ch.formulas?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Formulas
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
                    <Link to={`/chapter/${ch.id}/learn`} className="flex-1 text-center py-2 text-xs font-semibold text-white rounded-lg transition-colors" style={{ background: colors.primary }}>
                      Detailed Study
                    </Link>
                    <Link to={`/chapter/${ch.id}/mcqs`} className="flex-1 text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 transition-colors">
                      Practice MCQs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
