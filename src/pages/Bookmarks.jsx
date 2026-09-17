import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { mcqs } from '../data/mcqs';
import { BookmarkX, BookOpen, Target, Trash2, Search } from 'lucide-react';

export default function Bookmarks() {
  const { progress, toggleBookmark } = useProgress();
  const [search, setSearch] = useState('');

  const bookmarkedMCQs = mcqs.filter(q => progress.bookmarks.includes(q.id));
  const filtered = bookmarkedMCQs.filter(q =>
    !search || q.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title mb-1">Bookmarks</h1>
          <p className="text-slate-500 dark:text-slate-400">{bookmarkedMCQs.length} saved MCQs</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" className="input pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookmarkX className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {bookmarkedMCQs.length === 0 ? 'No Bookmarks Yet' : 'No results found'}
          </h3>
          <p className="text-slate-400 mb-6">
            {bookmarkedMCQs.length === 0 ? 'Bookmark MCQs during practice to review them later.' : 'Try a different search.'}
          </p>
          {bookmarkedMCQs.length === 0 && (
            <Link to="/mcqs" className="btn-primary">Browse MCQs</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(q => (
            <div key={q.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${
                      q.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : q.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    }`}>{q.subject}</span>
                    <span className={`badge ${q.difficulty === 'Easy' ? 'badge-easy' : q.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'}`}>{q.difficulty}</span>
                    <span className="text-xs text-slate-400">{q.topic}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{q.question}</p>
                </div>
                <button onClick={() => toggleBookmark(q.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                {q.options.map((opt, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    i === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    <span className="font-bold text-xs">{String.fromCharCode(65+i)}.</span>
                    {opt}
                    {i === q.correctAnswer && <span className="text-emerald-500 ml-auto text-xs">✓ Correct</span>}
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-xs text-slate-600 dark:text-slate-300">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
