import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { syllabus, subjectColors, subjectIcons } from '../data/syllabus';
import { physicsChapters } from '../data/physics';
import { chemistryChapters } from '../data/chemistry';
import { biologyChapters } from '../data/biology';
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { Clock, BookOpen, Target, ArrowRight, ChevronRight } from 'lucide-react';

const allDetailedChapters = [...physicsChapters, ...chemistryChapters, ...biologyChapters];

export default function SubjectPage() {
  const { subject: rawSubject } = useParams();
  const [activeClass, setActiveClass] = useState(11);
  const { getChapterProgress } = useProgress();
  const navigate = useNavigate();

  const subject = rawSubject
    ? rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase()
    : 'Physics';

  const colors = subjectColors[subject] || subjectColors.Physics;
  const chapters = syllabus[subject]?.[activeClass] || [];
  const icon = subjectIcons[subject] || '📚';

  const colorMap = { Physics: 'blue', Chemistry: 'emerald', Biology: 'violet' };
  const barColor = colorMap[subject] || 'blue';

  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(ch => getChapterProgress(ch.id, ch.topics) === 100).length;
  const avgProgress = totalChapters > 0
    ? Math.round(chapters.reduce((sum, ch) => sum + getChapterProgress(ch.id, ch.topics), 0) / totalChapters)
    : 0;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8" style={{ background: `${colors.primary}12` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/subjects" className="hover:text-blue-600 transition-colors">Subjects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: colors.primary }}>{subject}</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{icon}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white">{subject}</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {subject === 'Biology' ? 'Highest weightage — 360 marks' : '180 marks'} · {totalChapters} chapters
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <CircularProgress value={avgProgress} size={88} color={colors.primary} />
              <div>
                <div className="text-sm text-slate-500">Overall Progress</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{completedChapters}/{totalChapters} done</div>
              </div>
            </div>
          </div>

          {/* Class selector */}
          <div className="flex gap-2 mt-6">
            {[11, 12].map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeClass === cls
                    ? `text-white shadow-sm`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                style={activeClass === cls ? { background: colors.primary } : {}}
              >
                Class {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {chapters.map(ch => {
            const progress = getChapterProgress(ch.id, ch.topics);
            const hasDetailed = allDetailedChapters.find(d => d.id === ch.id);
            return (
              <div
                key={ch.id}
                className="card p-5 hover:shadow-md transition-all duration-200 group cursor-pointer"
                onClick={() => navigate(`/chapter/${ch.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">
                    Chapter {String(ch.number).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    {hasDetailed && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                        Content Ready
                      </span>
                    )}
                    <span className={`badge ${
                      ch.difficulty === 'Easy' ? 'badge-easy' : ch.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'
                    }`}>
                      {ch.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ch.name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{ch.topics} topics</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ch.estimatedTime}</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold" style={{ color: colors.primary }}>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} color={barColor} />
                </div>

                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <Link to={`/chapter/${ch.id}/learn`} className="flex-1 text-center py-2 text-xs font-semibold text-white rounded-lg transition-colors" style={{ background: colors.primary }}>
                    Learn
                  </Link>
                  <Link to={`/chapter/${ch.id}/mcqs`} className="flex-1 text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    MCQs
                  </Link>
                  <Link to={`/chapter/${ch.id}/test`} className="flex-1 text-center py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Test
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
