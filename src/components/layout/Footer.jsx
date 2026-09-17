import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Dna className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                NEET<span className="text-blue-600">Prep</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
              Learn. Practice. Improve. Crack NEET.
            </p>
          </div>

          {/* Study */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Study</h4>
            <ul className="space-y-2">
              {[
                { to: '/syllabus', label: 'Syllabus' },
                { to: '/subject/Physics', label: 'Physics' },
                { to: '/subject/Chemistry', label: 'Chemistry' },
                { to: '/subject/Biology', label: 'Biology' },
                { to: '/revision', label: 'Quick Revision' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Practice</h4>
            <ul className="space-y-2">
              {[
                { to: '/mcqs', label: 'Question Bank' },
                { to: '/random-practice', label: 'Random Practice' },
                { to: '/adaptive-practice', label: 'Adaptive Drill' },
                { to: '/mistakes', label: 'My Mistakes' },
                { to: '/weak-topics', label: 'Weak Topics' },
                { to: '/daily-question', label: 'Question of the Day' },
                { to: '/mock-tests', label: 'Mock Tests' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Info</h4>
            <ul className="space-y-2">
              {[
                { to: '/about-neet', label: 'About NEET' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/progress', label: 'My Progress' },
                { to: '/leaderboard', label: 'Leaderboard' },
                { to: '/study-planner', label: 'Study Planner' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} NEETPrep. For educational purposes. Based on NCERT syllabus.
          </p>
          <p className="text-xs text-slate-400">
            ⚠️ Always verify exam details from <a href="https://nta.ac.in" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">official NTA website</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
