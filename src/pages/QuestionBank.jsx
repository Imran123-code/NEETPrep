import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { allQuestions, filterQuestions, getQuestionStats } from '../data/questions';
import { syllabus, subjectColors } from '../data/syllabus';
import { useProgress } from '../context/ProgressContext';
import { 
  Search, 
  Filter, 
  Shuffle, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  RotateCcw,
  Target
} from 'lucide-react';

export default function QuestionBank() {
  const navigate = useNavigate();
  const { progress, toggleBookmark } = useProgress();
  const stats = useMemo(() => getQuestionStats(), []);

  // Filter States
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination & Display
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedSolutions, setExpandedSolutions] = useState({});

  // Dynamic chapter list based on selected subject and class
  const availableChapters = useMemo(() => {
    if (selectedSubject === 'All') {
      const allChaps = [];
      ['Physics', 'Chemistry', 'Biology'].forEach(sub => {
        if (selectedClass === 'All' || selectedClass === '11') allChaps.push(...syllabus[sub][11]);
        if (selectedClass === 'All' || selectedClass === '12') allChaps.push(...syllabus[sub][12]);
      });
      return allChaps;
    }
    const subObj = syllabus[selectedSubject];
    if (!subObj) return [];
    if (selectedClass === '11') return subObj[11] || [];
    if (selectedClass === '12') return subObj[12] || [];
    return [...(subObj[11] || []), ...(subObj[12] || [])];
  }, [selectedSubject, selectedClass]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return filterQuestions({
      classNum: selectedClass,
      subject: selectedSubject,
      chapterId: selectedChapter,
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      status: selectedStatus,
      searchQuery,
      bookmarks: progress.bookmarks || [],
      attempts: progress.mcqAttempts || {},
    });
  }, [selectedClass, selectedSubject, selectedChapter, selectedTopic, selectedDifficulty, selectedCategory, selectedStatus, searchQuery, progress]);

  // Paginated slice
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const toggleSolution = (qId) => {
    setExpandedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const resetFilters = () => {
    setSelectedClass('All');
    setSelectedSubject('All');
    setSelectedChapter('All');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner with Real Dynamic Stats */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-3xl mb-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Comprehensive NEET Question Bank</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-bold">
              NEET Practice & Question Bank
            </h1>
            <p className="text-blue-100 text-sm mt-2 max-w-2xl leading-relaxed">
              Explore chapter-wise, topic-wise, and NCERT-aligned MCQs with step-by-step solutions, key takeaways, and difficulty calibration.
            </p>
          </div>

          {/* Real Statistics Pills */}
          <div className="grid grid-cols-3 gap-3 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div>
              <div className="text-2xl font-extrabold">{stats.total}</div>
              <div className="text-[11px] text-blue-200">Total MCQs</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">{stats.totalChaptersCovered}</div>
              <div className="text-[11px] text-blue-200">Chapters</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">{stats.pyqCount}</div>
              <div className="text-[11px] text-blue-200">PYQ Style</div>
            </div>
          </div>
        </div>

        {/* Quick Mode Launchers */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/15">
          <Link 
            to="/random-practice"
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Practice (10/25/50)</span>
          </Link>

          <Link 
            to="/adaptive-practice"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adaptive AI Drill</span>
          </Link>

          <Link 
            to="/mistakes"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>My Mistakes ({progress.mistakes?.length || 0})</span>
          </Link>

          <Link 
            to="/weak-topics"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Weak Topics</span>
          </Link>
        </div>
      </div>

      {/* Main Filter Section */}
      <div className="card p-5 md:p-6 mb-8 space-y-4">
        {/* Search Bar & Reset */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by keyword, formula, concept, topic, or question text..."
              className="input pl-10 text-sm"
            />
          </div>

          {(selectedSubject !== 'All' || selectedClass !== 'All' || selectedDifficulty !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-3 py-2 shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Class Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
              className="input py-2 text-xs"
            >
              <option value="All">All Classes (11 & 12)</option>
              <option value="11">Class 11 ({stats.class11Count})</option>
              <option value="12">Class 12 ({stats.class12Count})</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => { 
                setSelectedSubject(e.target.value); 
                setSelectedChapter('All');
                setCurrentPage(1); 
              }}
              className="input py-2 text-xs font-medium"
            >
              <option value="All">All Subjects ({stats.total})</option>
              <option value="Physics">🔵 Physics ({stats.physicsCount})</option>
              <option value="Chemistry">🟢 Chemistry ({stats.chemistryCount})</option>
              <option value="Biology">🟣 Biology ({stats.biologyCount})</option>
            </select>
          </div>

          {/* Chapter Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Chapter</label>
            <select 
              value={selectedChapter} 
              onChange={(e) => { setSelectedChapter(e.target.value); setCurrentPage(1); }}
              className="input py-2 text-xs"
            >
              <option value="All">All Chapters</option>
              {availableChapters.map(chap => (
                <option key={chap.id} value={chap.id}>
                  {chap.number}. {chap.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Difficulty</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
              className="input py-2 text-xs"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy ({stats.easyCount})</option>
              <option value="Medium">Medium ({stats.mediumCount})</option>
              <option value="Hard">Hard ({stats.hardCount})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="input py-2 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Conceptual">Conceptual</option>
              <option value="Numerical">Numerical</option>
              <option value="NCERT-Based">NCERT-Based</option>
              <option value="NEET-Level">NEET-Level</option>
              <option value="Formula-Based">Formula-Based</option>
              <option value="Reaction-Based">Reaction-Based</option>
              <option value="Statement-Based">Statement-Based</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="input py-2 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Unattempted">Unattempted</option>
              <option value="Attempted">Attempted</option>
              <option value="Correct">Solved Correctly</option>
              <option value="Incorrect">Incorrect Mistakes</option>
              <option value="Bookmarked">Bookmarked 🔖</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Header & Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredQuestions.length}</span> matching MCQs 
          {filteredQuestions.length > 0 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Show per page:</span>
          {[10, 20, 50].map(sz => (
            <button
              key={sz}
              onClick={() => { setPageSize(sz); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                pageSize === sz 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {paginatedQuestions.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            No Questions Match Your Filters
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Try adjusting your search keyword, subject, difficulty, or status filters.
          </p>
          <button onClick={resetFilters} className="btn-primary inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedQuestions.map((q, idx) => {
            const isBookmarked = (progress.bookmarks || []).includes(q.id);
            const attempt = progress.mcqAttempts?.[q.id];
            const isExpanded = expandedSolutions[q.id];
            const subColor = subjectColors[q.subject]?.primary || '#3b82f6';
            const globalIndex = (currentPage - 1) * pageSize + idx + 1;

            return (
              <div key={q.id} className="card p-5 md:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-600">
                {/* Header Row with Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-md"
                      style={{ backgroundColor: `${subColor}15`, color: subColor }}
                    >
                      {q.subject} • Class {q.class}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {q.chapterName} {q.topic ? `• ${q.topic}` : ''}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {q.difficulty}
                    </span>
                    {q.category && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {q.category}
                      </span>
                    )}
                    {q.isPreviousYear && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        PYQ {q.year || 'Style'}
                      </span>
                    )}
                    {attempt && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        attempt.correct 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {attempt.correct ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {attempt.correct ? 'Solved' : 'Mistake'}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-blue-600 fill-current" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Question Text */}
                <h3 className="text-base md:text-lg font-medium text-slate-900 dark:text-white leading-relaxed mb-4">
                  <span className="font-bold text-slate-400 mr-2">{globalIndex}.</span>
                  {q.question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, i) => (
                    <div 
                      key={i} 
                      className={`flex items-start gap-2.5 p-3 rounded-xl text-xs md:text-sm border transition-all ${
                        isExpanded && i === q.correctAnswer
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isExpanded && i === q.correctAnswer && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? (
                      <>Hide Detailed Solution <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Show Detailed Solution & Key Concept <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {q.topic && (
                      <button
                        onClick={() => {
                          navigate('/random-practice', {
                            state: {
                              customTopics: [q.topic],
                              title: `Topic Practice: ${q.topic}`
                            }
                          });
                        }}
                        className="text-slate-500 hover:text-blue-600 font-medium px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Practice 5 Similar Questions →
                      </button>
                    )}
                    <Link
                      to={`/practice/${q.chapterId}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Chapter Practice
                    </Link>
                  </div>
                </div>

                {/* Expandable Solution Content */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-3 text-sm">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs md:text-sm">
                      Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)} — {q.options[q.correctAnswer]}
                    </p>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs md:text-sm">
                      {q.explanation}
                    </p>

                    {q.keyConcept && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-300">
                        <strong className="block mb-0.5">💡 Key Concept & Formula:</strong>
                        {q.keyConcept}
                      </div>
                    )}

                    {q.quickTip && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs text-blue-900 dark:text-blue-300">
                        <strong className="block mb-0.5">⚡ Quick Solution Tip:</strong>
                        {q.quickTip}
                      </div>
                    )}

                    {q.ncertReference && (
                      <p className="text-[11px] text-slate-400 italic">
                        📖 NCERT Reference: {q.ncertReference}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
