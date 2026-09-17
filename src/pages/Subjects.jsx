import React from 'react';
import { Link } from 'react-router-dom';
import { subjectColors, subjectIcons, syllabus } from '../data/syllabus';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { CircularProgress } from '../components/ui/ProgressBar';

const subjects = ['Physics', 'Chemistry', 'Biology'];

export default function Subjects() {
  const { getSubjectStats } = useProgress();

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Subjects</h1>
        <p className="text-slate-500 dark:text-slate-400">Choose a subject to start your chapter-wise preparation</p>
      </div>

      <div className="space-y-6">
        {subjects.map(subject => {
          const colors = subjectColors[subject];
          const icon = subjectIcons[subject];
          const class11 = syllabus[subject]?.[11] || [];
          const class12 = syllabus[subject]?.[12] || [];
          const totalChapters = class11.length + class12.length;
          const stats = getSubjectStats(subject);

          return (
            <div key={subject} className="card overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Subject info */}
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${colors.primary}20` }}>
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">{subject}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {totalChapters} chapters · {subject === 'Biology' ? '360 marks (50%)' : '180 marks (25%)'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{class11.length}</div>
                      <div className="text-xs text-slate-500">Class 11 Chapters</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{class12.length}</div>
                      <div className="text-xs text-slate-500">Class 12 Chapters</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{stats.tests}</div>
                      <div className="text-xs text-slate-500">Tests Taken</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{stats.avgScore}%</div>
                      <div className="text-xs text-slate-500">Avg Score</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/subject/${subject}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200" style={{ background: colors.primary }}>
                      Explore Chapters <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to={`/chapter/${subject === 'Physics' ? 'phy-11-05' : subject === 'Chemistry' ? 'chem-11-04' : 'bio-11-08'}/mcqs`} className="px-4 py-2.5 text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      Practice MCQs
                    </Link>
                  </div>
                </div>

                {/* Chapter preview list */}
                <div className="md:w-72 p-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Class 11 Chapters</p>
                  <ul className="space-y-1.5">
                    {class11.slice(0, 6).map(ch => (
                      <li key={ch.id}>
                        <Link to={`/chapter/${ch.id}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-0.5">
                          <span className="text-xs text-slate-400 w-5">{ch.number}.</span>
                          <span className="line-clamp-1">{ch.name}</span>
                        </Link>
                      </li>
                    ))}
                    {class11.length > 6 && (
                      <li>
                        <Link to={`/subject/${subject}`} className="text-xs font-semibold transition-colors" style={{ color: colors.primary }}>
                          +{class11.length - 6} more chapters →
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
