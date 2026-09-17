import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, BarChart2, Zap, CheckCircle, Star, FlaskConical, Dna, Atom } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { getQuestionStats } from '../data/questions';
import { syllabus } from '../data/syllabus';

const subjects = [
  {
    name: 'Physics',
    icon: '⚛️',
    color: 'physics',
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
    link: '/subject/Physics',
    description: 'Mechanics, Thermodynamics, Optics, Electricity, Modern Physics',
    chapters: '29 chapters',
    mcqs: '180 marks',
    features: ['Class 11 & 12', 'Chapter-wise MCQs', 'Formula Sheets', 'Chapter Tests'],
  },
  {
    name: 'Chemistry',
    icon: '🧪',
    color: 'chemistry',
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700',
    link: '/subject/Chemistry',
    description: 'Physical, Organic & Inorganic Chemistry — all NCERT chapters',
    chapters: '30 chapters',
    mcqs: '180 marks',
    features: ['Class 11 & 12', 'Reactions & Formulas', 'MCQ Practice', 'Chapter Tests'],
  },
  {
    name: 'Biology',
    icon: '🧬',
    color: 'biology',
    border: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    btnClass: 'bg-violet-600 hover:bg-violet-700',
    link: '/subject/Biology',
    description: 'Botany & Zoology — the highest weightage subject in NEET',
    chapters: '38 chapters',
    mcqs: '360 marks',
    features: ['Class 11 & 12', 'NCERT-focused Notes', 'MCQ Practice', 'Chapter Tests'],
  },
];

const stats = [
  { label: 'Subjects', value: '3', icon: '📚', color: 'text-blue-600' },
  { label: 'Classes', value: '11 & 12', icon: '🏫', color: 'text-emerald-600' },
  { label: 'MCQs Available', value: '1000+', icon: '✏️', color: 'text-violet-600' },
  { label: 'Chapter Tests', value: '97+', icon: '📝', color: 'text-amber-600' },
  { label: 'Progress Tracking', value: '100%', icon: '📊', color: 'text-rose-600' },
];

const features = [
  { icon: BookOpen, title: 'Chapter-wise Learning', desc: 'Study each chapter with structured notes, key concepts, and NEET-focused tips.', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { icon: Target, title: 'MCQ Practice', desc: 'Practice thousands of MCQs with instant feedback and detailed explanations.', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: Zap, title: 'Chapter Tests', desc: 'Take timed chapter tests in exam mode and review your mistakes.', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  { icon: BarChart2, title: 'Progress Tracking', desc: 'Track your preparation with detailed analytics and performance charts.', color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30' },
  { icon: Star, title: 'Gamification', desc: 'Earn XP, unlock badges, maintain study streaks, and stay motivated.', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
  { icon: CheckCircle, title: 'Smart Recommendations', desc: 'Get personalized suggestions on what to study next based on your performance.', color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30' },
];

const learningFlow = [
  'Choose Class', 'Choose Subject', 'Choose Chapter', 'Study Material',
  'Complete Topics', 'Practice MCQs', 'Chapter Test', 'View Result', 'Track Progress',
];

export default function Home() {
  const { progress } = useProgress();
  const qStats = useMemo(() => getQuestionStats(), []);

  const totalChapters = useMemo(() => {
    let count = 0;
    Object.values(syllabus).forEach(sub => {
      Object.values(sub).forEach(arr => { count += arr.length; });
    });
    return count;
  }, []);

  const dynamicStats = [
    { label: 'Subjects', value: '3', icon: '📚', color: 'text-blue-600' },
    { label: 'Classes', value: '11 & 12', icon: '🏫', color: 'text-emerald-600' },
    { label: 'Questions in Bank', value: `${qStats.total}`, icon: '✏️', color: 'text-violet-600' },
    { label: 'Chapters Covered', value: `${totalChapters}`, icon: '📝', color: 'text-amber-600' },
    { label: 'PYQ-Style Questions', value: `${qStats.pyqCount}`, icon: '⭐', color: 'text-rose-600' },
  ];

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-48 h-48 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Class 11 & 12 NEET Preparation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Your Complete{' '}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  NEET Preparation
                </span>{' '}
                Platform
              </h1>
              <p className="text-lg text-blue-100/80 mb-8 leading-relaxed max-w-lg">
                Prepare smarter for NEET with chapter-wise learning, MCQs, tests, notes, and progress tracking. All subjects. All chapters. One platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/subjects" className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25">
                  Start Preparing <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/syllabus" className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-200 border border-white/20">
                  Explore Syllabus
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold font-display">3</div>
                  <div className="text-sm text-blue-200/70">Subjects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{totalChapters}</div>
                  <div className="text-sm text-blue-200/70">Chapters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{qStats.total}</div>
                  <div className="text-sm text-blue-200/70">MCQs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">720</div>
                  <div className="text-sm text-blue-200/70">Marks</div>
                </div>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                {/* Central atom */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500/30 to-violet-500/30 backdrop-blur rounded-full border border-white/20 flex items-center justify-center text-5xl animate-pulse-slow">
                    🎯
                  </div>
                </div>
                {/* Orbiting subjects */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-500/20 backdrop-blur border border-blue-400/30 rounded-2xl flex items-center justify-center text-2xl">⚛️</div>
                <div className="absolute bottom-8 left-4 w-16 h-16 bg-emerald-500/20 backdrop-blur border border-emerald-400/30 rounded-2xl flex items-center justify-center text-2xl">🧪</div>
                <div className="absolute bottom-8 right-4 w-16 h-16 bg-violet-500/20 backdrop-blur border border-violet-400/30 rounded-2xl flex items-center justify-center text-2xl">🧬</div>
                {/* Progress rings */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 card p-3 bg-white/10 border-white/20 text-xs text-white">
                  <div className="font-semibold">Physics</div>
                  <div className="text-blue-300">{qStats.physicsCount} MCQs</div>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 card p-3 bg-white/10 border-white/20 text-xs text-white">
                  <div className="font-semibold">Biology</div>
                  <div className="text-violet-300">{qStats.biologyCount} MCQs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {dynamicStats.map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className={`text-xl font-bold font-display ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Choose Your Subject</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Complete NEET syllabus coverage for all three subjects across Class 11 and 12
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {subjects.map(sub => (
            <div key={sub.name} className={`card-hover ${sub.bg} ${sub.border} border overflow-hidden`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-4xl mb-2 block">{sub.icon}</span>
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{sub.name}</h3>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className={`badge ${sub.badge}`}>{sub.chapters}</span>
                    <span className="text-xs text-slate-500 font-semibold">{sub.mcqs}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{sub.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {sub.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Link to={sub.link} className={`flex-1 text-center py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 ${sub.btnClass}`}>
                    Start Learning
                  </Link>
                  <Link to={`/chapter/${sub.name === 'Physics' ? 'phy-11-05' : sub.name === 'Chemistry' ? 'chem-11-04' : 'bio-11-08'}/mcqs`} className="px-3 py-2.5 text-sm font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200">
                    MCQs
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Flow */}
      <section className="py-14 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-slate-800 dark:to-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Your Learning Journey</h2>
            <p className="text-slate-500 dark:text-slate-400">A clear, structured path from chapter selection to completion</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-0">
            {learningFlow.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${
                      i < 4 ? 'bg-blue-500' : i < 7 ? 'bg-violet-500' : 'bg-emerald-500'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1.5 text-center max-w-[70px]">{step}</span>
                  </div>
                </div>
                {i < learningFlow.length - 1 && (
                  <div className="hidden md:flex items-start pt-4">
                    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-1" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Everything You Need to Crack NEET</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A complete preparation ecosystem designed for NEET aspirants
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(feat => (
            <div key={feat.title} className="card p-6 hover:shadow-md transition-shadow duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-10 bg-gradient-to-br from-blue-600 to-violet-600 border-0">
            <h2 className="text-3xl font-bold font-display text-white mb-4">Ready to Start Preparing?</h2>
            <p className="text-blue-100 mb-8 text-lg">Join thousands of NEET aspirants. Start with any chapter today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                Create Free Account
              </Link>
              <Link to="/daily-challenge" className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                Daily Challenge 🔥
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
