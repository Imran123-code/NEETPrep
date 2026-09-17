import React, { useState } from 'react';
import { physicsChapters } from '../data/physics';
import { chemistryChapters } from '../data/chemistry';
import { subjectColors } from '../data/syllabus';
import { Search } from 'lucide-react';

const allChapters = [...physicsChapters, ...chemistryChapters];

export default function Formulas() {
  const [activeSubject, setActiveSubject] = useState('All');
  const [search, setSearch] = useState('');

  const allFormulas = allChapters.flatMap(ch =>
    (ch.formulas || []).map(f => ({ ...f, subject: ch.subject, chapter: ch.name }))
  );

  const filtered = allFormulas.filter(f => {
    const matchSubject = activeSubject === 'All' || f.subject === activeSubject;
    const matchSearch = !search || f.formula?.toLowerCase().includes(search.toLowerCase())
      || f.name?.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Formula Sheet</h1>
        <p className="text-slate-500 dark:text-slate-400">All important formulas for NEET Physics and Chemistry</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" className="input pl-9" placeholder="Search formulas..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'Physics', 'Chemistry'].map(sub => (
            <button key={sub} onClick={() => setActiveSubject(sub)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeSubject === sub
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}>
              {sub}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6">{filtered.length} formulas</p>

      {/* Group by chapter */}
      {allChapters
        .filter(ch => activeSubject === 'All' || ch.subject === activeSubject)
        .filter(ch => ch.formulas?.some(f =>
          !search || f.formula?.toLowerCase().includes(search.toLowerCase()) || f.name?.toLowerCase().includes(search.toLowerCase())
        ))
        .map(ch => {
          const formulas = (ch.formulas || []).filter(f =>
            !search || f.formula?.toLowerCase().includes(search.toLowerCase()) || f.name?.toLowerCase().includes(search.toLowerCase())
          );
          if (formulas.length === 0) return null;
          const colors = subjectColors[ch.subject];
          return (
            <div key={ch.id} className="card p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{ch.subject === 'Physics' ? '⚛️' : '🧪'}</span>
                <h2 className="font-bold text-slate-900 dark:text-white">{ch.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${colors.primary}20`, color: colors.primary }}>
                  {ch.subject}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {formulas.map((f, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{f.category}</div>
                    <div className="font-mono text-base font-bold text-slate-900 dark:text-white mb-1">{f.formula}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{f.name}</div>
                    {f.unit && <div className="text-xs text-slate-400 mt-1">Unit: {f.unit}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No formulas found</h3>
          <p className="text-slate-400 mt-1">Try a different search or filter</p>
        </div>
      )}
    </div>
  );
}
