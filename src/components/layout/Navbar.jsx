import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import {
  Sun, Moon, Search, Menu, X, BookOpen, FlaskConical,
  Dna, BarChart2, Target, LogOut, User, ChevronDown,
  Zap, Home, Library, Video
} from 'lucide-react';
import { mcqs } from '../../data/mcqs';
import { syllabus } from '../../data/syllabus';

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const results = [];
    // Search chapters
    Object.entries(syllabus).forEach(([subject, classes]) => {
      Object.entries(classes).forEach(([cls, chapters]) => {
        chapters.forEach(ch => {
          if (ch.name.toLowerCase().includes(lower)) {
            results.push({ type: 'chapter', subject, class: cls, ...ch });
          }
        });
      });
    });
    // Search MCQs
    mcqs.filter(q => q.question.toLowerCase().includes(lower)).slice(0, 3).forEach(q => {
      results.push({ type: 'mcq', ...q });
    });
    setSearchResults(results.slice(0, 8));
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/neet-syllabus', label: 'NEET Syllabus', icon: Library },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/mcqs', label: 'MCQs', icon: Target },
    { to: '/videos', label: 'Videos', icon: Video },
    { to: '/mock-tests', label: 'Mock Tests', icon: FlaskConical },
    { to: '/revision', label: 'Revision', icon: Zap },
    { to: '/progress', label: 'Progress', icon: BarChart2 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Dna className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
              NEET<span className="text-blue-600">Prep</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3 animate-slide-up">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search chapters, topics, MCQs..."
                    className="input text-sm"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {searchResults.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (r.type === 'chapter') navigate(`/chapter/${r.id}`);
                            else navigate(`/mcqs`);
                            setSearchOpen(false); setSearchQuery(''); setSearchResults([]);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                              r.type === 'chapter'
                                ? r.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : r.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {r.type === 'chapter' ? r.subject?.substring(0, 3) : 'MCQ'}
                            </span>
                            <span className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
                              {r.type === 'chapter' ? r.name : r.question?.substring(0, 60) + '...'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-3">No results found</p>
                  )}
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Dashboard / XP */}
            {user && (
              <Link to="/dashboard" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-colors">
                <Zap className="w-3.5 h-3.5" />
                {progress.xp} XP
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar || user.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block max-w-[80px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 animate-slide-up">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <BarChart2 className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/progress" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Target className="w-4 h-4" /> Progress
                    </Link>
                    <Link to="/video-bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <Video className="w-4 h-4" /> Saved Videos
                    </Link>
                    <hr className="my-1 border-slate-100 dark:border-slate-700" />
                    <button onClick={() => { logout(); setProfileOpen(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary btn-sm hidden sm:inline-flex">Login</Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
                end={to === '/'}
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex-1 btn-secondary text-sm">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm text-center">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm text-center">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for search/profile dropdowns */}
      {(searchOpen || profileOpen) && (
        <div className="fixed inset-0 z-[-1]" onClick={() => { setSearchOpen(false); setProfileOpen(false); }} />
      )}
    </nav>
  );
}
