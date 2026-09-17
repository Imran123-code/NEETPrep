import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { mcqs } from '../data/mcqs';
import { allChapters } from '../data/chapters';
import { BookmarkX, BookOpen, Target, Trash2, Search, Play, Filter, RotateCcw } from 'lucide-react';

export default function Bookmarks() {
  const navigate = useNavigate();
  const { progress, toggleBookmark } = useProgress();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedChapter, setSelectedChapter] = useState('All');

  // Map chapterId to chapterName
  const chapterMap = useMemo(() => {
    const map = {};
    allChapters.forEach(c => {
      map[c.id] = c.name;
    });
    return map;
  }, []);

  const bookmarkedMCQs = useMemo(() => {
    return mcqs.filter(q => progress.bookmarks.includes(q.id));
  }, [progress.bookmarks]);

  // Derived chapters present in bookmarks
  const availableChapters = useMemo(() => {
    let list = bookmarkedMCQs;
    if (selectedSubject !== 'All') {
      list = list.filter(q => q.subject === selectedSubject);
    }
    if (selectedClass !== 'All') {
      list = list.filter(q => String(q.class) === String(selectedClass));
    }
    const chapterIds = [...new Set(list.map(q => q.chapterId).filter(Boolean))];
    return chapterIds.map(id => ({
      id,
      name: chapterMap[id] || id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [bookmarkedMCQs, selectedSubject, selectedClass, chapterMap]);

  // Filtered bookmarks
  const filtered = useMemo(() => {
    return bookmarkedMCQs.filter(q => {
      if (search && !q.question.toLowerCase().includes(search.toLowerCase()) && !q.topic?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedSubject !== 'All' && q.subject !== selectedSubject) {
        return false;
      }
      if (selectedClass !== 'All' && String(q.class) !== String(selectedClass)) {
        return false;
      }
      if (selectedChapter !== 'All' && q.chapterId !== selectedChapter) {
        return false;
      }
      return true;
    });
  }, [bookmarkedMCQs, search, selectedSubject, selectedClass, selectedChapter]);

  const handleStartPractice = () => {
    if (filtered.length === 0) return;
    navigate('/random-practice', {
      state: {
        customQuestions: filtered,
        title: `Bookmarked MCQs Practice (${filtered.length})`
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSubject('All');
    setSelectedClass('All');
    setSelectedChapter('All');
  };

  const hasActiveFilters = search || selectedSubject !== 'All' || selectedClass !== 'All' || selectedChapter !== 'All';

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title mb-1">Bookmarked Questions</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {bookmarkedMCQs.length} saved MCQs for revision & practice
          </p>
        </div>

        {filtered.length > 0 && (
          <button
            onClick={handleStartPractice}
            className="btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice Bookmarked MCQs ({filtered.length})</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="input pl-9 w-full"
              placeholder="Search question or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value);
              setSelectedChapter('All');
            }}
            aria-label="Filter by subject"
            className="input w-full sm:w-36 text-sm"
          >
            <option value="All">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value);
              setSelectedChapter('All');
            }}
            aria-label="Filter by class"
            className="input w-full sm:w-32 text-sm"
          >
            <option value="All">All Classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>

          {/* Chapter Filter */}
          <select
            value={selectedChapter}
            onChange={e => setSelectedChapter(e.target.value)}
            aria-label="Filter by chapter"
            className="input w-full sm:w-44 text-sm"
          >
            <option value="All">All Chapters ({availableChapters.length})</option>
            {availableChapters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Showing {filtered.length} of {bookmarkedMCQs.length} bookmarked items</span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <BookmarkX className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {bookmarkedMCQs.length === 0 ? 'No Bookmarks Yet' : 'No matching bookmarks'}
          </h3>
          <p className="text-slate-400 mb-6 text-sm max-w-sm mx-auto">
            {bookmarkedMCQs.length === 0
              ? 'Bookmark important questions during practice to review and drill them whenever needed.'
              : 'Try relaxing your search or filters to see more saved questions.'}
          </p>
          {bookmarkedMCQs.length === 0 ? (
            <Link to="/mcqs" className="btn-primary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Browse MCQs
            </Link>
          ) : (
            <button onClick={handleResetFilters} className="btn-secondary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(q => {
            const chapterDisplayName = chapterMap[q.chapterId] || q.chapterId;
            return (
              <div key={q.id} className="card p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge ${
                        q.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : q.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                      }`}>{q.subject}</span>
                      <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Class {q.class || (q.chapterId?.includes('12') ? '12' : '11')}
                      </span>
                      <span className={`badge ${q.difficulty === 'Easy' ? 'badge-easy' : q.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'}`}>
                        {q.difficulty}
                      </span>
                      {chapterDisplayName && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {chapterDisplayName}
                        </span>
                      )}
                      {q.topic && (
                        <span className="text-xs text-slate-400">· {q.topic}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{q.question}</p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors shrink-0"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      i === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      <span className="font-bold text-xs">{String.fromCharCode(65+i)}.</span>
                      <span>{opt}</span>
                      {i === q.correctAnswer && <span className="text-emerald-600 dark:text-emerald-400 ml-auto text-xs font-semibold">✓ Correct</span>}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Explanation:</strong> {q.explanation}
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
