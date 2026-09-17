import React from 'react';
import { neetInfo } from '../data/neetInfo';
import { BookOpen, Clock, Target, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

export default function AboutNEET() {
  const info = neetInfo;
  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="section-title mb-3">About NEET UG</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          National Eligibility cum Entrance Test — your gateway to MBBS, BDS, AYUSH, and other medical courses in India
        </p>
      </div>

      {/* Exam overview */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Marks', value: '720', icon: '📊', color: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600' },
          { label: 'Questions', value: '180', icon: '✏️', color: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' },
          { label: 'Duration', value: '3h 20m', icon: '⏱️', color: 'bg-violet-50 dark:bg-violet-900/10 text-violet-600' },
          { label: 'Marking', value: '+4 / -1', icon: '🎯', color: 'bg-amber-50 dark:bg-amber-900/10 text-amber-600' },
        ].map(s => (
          <div key={s.label} className={`card p-5 text-center ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold font-display">{s.value}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subject distribution */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">Subject Distribution</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left py-2 px-3 text-slate-500 font-semibold">Subject</th>
                <th className="text-center py-2 px-3 text-slate-500 font-semibold">Questions</th>
                <th className="text-center py-2 px-3 text-slate-500 font-semibold">Marks</th>
                <th className="text-center py-2 px-3 text-slate-500 font-semibold">% Weightage</th>
                <th className="text-right py-2 px-3 text-slate-500 font-semibold">Section</th>
              </tr>
            </thead>
            <tbody>
              {info.subjectDistribution.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{row.subject}</td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">{row.questions}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-800 dark:text-slate-200">{row.marks}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {row.percentage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">{row.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-sm text-amber-700 dark:text-amber-300">
          ⚠️ From 2024: 2 sections per subject — Section A (35 Q, all compulsory) + Section B (15 Q, attempt any 10)
        </div>
      </div>

      {/* Exam pattern */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">Exam Pattern</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {info.examPattern.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">Eligibility Criteria</h2>
        <ul className="space-y-2">
          {info.eligibility.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Preparation tips */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">🎯 Preparation Strategy</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {info.preparationTips.map((tip, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">{i + 1}. {tip.title}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Official link */}
      <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/10 dark:to-violet-900/10 border-blue-100 dark:border-blue-800">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h2 className="font-bold text-slate-900 dark:text-white mb-2">Always Check Official Sources</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Exam dates, eligibility, and patterns may change. Verify from NTA's official website.
        </p>
        <a href="https://nta.ac.in" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
          Visit NTA Official Site <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
