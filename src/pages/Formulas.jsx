import React, { useState, useMemo } from 'react';
import { allChapters } from '../data/chapters';
import { subjectColors } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';
import { Search, Copy, Check, RotateCcw } from 'lucide-react';

export default function Formulas() {
  const { addToast } = useProgress();
  const [activeSubject, setActiveSubject] = useState('All');
  const [activeClass, setActiveClass] = useState('All');
  const [search, setSearch] = useState('');
  const [copiedFormula, setCopiedFormula] = useState(null);

  // Filter Physics and Chemistry chapters that contain formulas
  const eligibleChapters = useMemo(() => {
    return allChapters.filter(ch => ch.subject === 'Physics' || ch.subject === 'Chemistry');
  }, []);

  const allFormulas = useMemo(() => {
    return eligibleChapters.flatMap(ch =>
      (ch.formulas || []).map((f, index) => ({
        ...f,
        id: `${ch.id}-f${index}`,
        subject: ch.subject,
        chapter: ch.name,
        chapterId: ch.id,
        class: ch.class,
      }))
    );
  }, [eligibleChapters]);

  const filtered = useMemo(() => {
    return allFormulas.filter(f => {
      const matchSubject = activeSubject === 'All' || f.subject === activeSubject;
      const matchClass = activeClass === 'All' || String(f.class) === String(activeClass);
      const q = search.toLowerCase();
      const matchSearch = !search ||
        f.formula?.toLowerCase().includes(q) ||
        f.name?.toLowerCase().includes(q) ||
        f.chapter?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q);
      return matchSubject && matchClass && matchSearch;
    });
  }, [allFormulas, activeSubject, activeClass, search]);

  const handleCopy = (formulaText, formulaId) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(formulaText);
      setCopiedFormula(formulaId);
      if (addToast) {
        addToast(`Copied formula: ${formulaText}`, 'success');
      }
      setTimeout(() => {
        setCopiedFormula(prev => prev === formulaId ? null : prev);
      }, 2000);
    }
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">NEET Formula Sheet</h1>
        <p className="text-slate-500 dark:text-slate-400">
          High-yield formula repository for NEET Physics and Chemistry with instantaneous copy and unit guides
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="input pl-9 w-full"
              placeholder="Search formulas, variables, or chapter..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {['All', '11', '12'].map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  activeClass === cls
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cls === 'All' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div className="flex gap-2">
            {['All', 'Physics', 'Chemistry'].map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  activeSubject === sub
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {sub === 'Physics' && '⚛️ '}{sub === 'Chemistry' && '🧪 '}{sub}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} formulas found
          </span>
        </div>
      </div>

      {/* Formula Cards Grouped by Chapter */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No formulas matched</h3>
          <p className="text-slate-400 mt-1 text-sm">Try resetting your search query or subject filters.</p>
          <button
            onClick={() => { setSearch(''); setActiveSubject('All'); setActiveClass('All'); }}
            className="btn-secondary mt-4 inline-flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f, i) => {
            const colors = subjectColors[f.subject] || subjectColors.Physics;
            const isCopied = copiedFormula === f.id;

            return (
              <div
                key={f.id || i}
                className="card p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: `${colors.primary}15`, color: colors.primary }}>
                      {f.subject} · Class {f.class}
                    </span>
                    {f.category && (
                      <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                        {f.category}
                      </span>
                    )}
                  </div>

                  <div className="relative group my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="font-mono text-base font-bold text-slate-900 dark:text-white pr-8 break-all">
                      {f.formula}
                    </div>
                    <button
                      onClick={() => handleCopy(f.formula, f.id)}
                      title="Copy formula"
                      className="absolute right-2 top-2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {f.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Chapter: {f.chapter}
                  </div>
                </div>

                {f.unit && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>SI Unit / Dimensions:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">{f.unit}</span>
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
