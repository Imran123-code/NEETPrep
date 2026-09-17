import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockTestMCQs } from '../data/mcqs';
import { subjectColors } from '../data/syllabus';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Clock, Target, ChevronRight, ChevronLeft, Flag, CheckSquare, Zap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

function Timer({ seconds, onTimeUp }) {
  const [remaining, setRemaining] = React.useState(seconds);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(r => { if (r <= 1) { clearInterval(interval); onTimeUp(); return 0; } return r - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const m = Math.floor(remaining / 60), s = remaining % 60;
  const urgent = remaining < 120;
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${urgent ? 'bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
      <Clock className={`w-4 h-4 ${urgent ? 'animate-pulse' : ''}`} />
      <span className="font-mono font-bold">{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>
    </div>
  );
}

export default function MockTests() {
  const navigate = useNavigate();
  const { saveTestResult } = useProgress();
  const [phase, setPhase] = useState('config'); // config | test | done
  const [config, setConfig] = useState({
    classes: [11, 12],
    subjects: ['Physics', 'Chemistry', 'Biology'],
    difficulty: 'Mixed',
    count: 30,
  });
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [startTime, setStartTime] = useState(null);

  const toggleArr = (arr, val) => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const handleStart = () => {
    const qs = getMockTestMCQs(config.subjects, config.classes, config.count, config.difficulty);
    if (qs.length === 0) { alert('No questions match your selection. Try different filters.'); return; }
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setPhase('test');
    setStartTime(Date.now());
  };

  const handleSubmit = () => {
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const correct = questions.filter((q, i) => answers[i]?.selected === q.correctAnswer).length;
    const incorrect = questions.filter((q, i) => answers[i] && answers[i].selected !== q.correctAnswer).length;
    const unattempted = questions.length - Object.keys(answers).length;
    const percentage = Math.round((correct / questions.length) * 100);
    const result = {
      id: Date.now().toString(),
      chapterId: 'mock',
      chapterName: 'Mock Test',
      subject: 'Mixed',
      mode: 'mock',
      score: correct, total: questions.length,
      correct, incorrect, unattempted, percentage,
      timeTaken: elapsed,
      date: new Date().toISOString(),
      questions, answers,
    };
    localStorage.setItem(`result_${result.id}`, JSON.stringify(result));
    saveTestResult(result);
    navigate(`/result/${result.id}`);
  };

  // Config screen
  if (phase === 'config') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧪</div>
          <h1 className="section-title mb-2">Mock Test Generator</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure your custom NEET mock test</p>
        </div>
        <div className="card p-8 space-y-6">
          {/* Class */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Select Class</label>
            <div className="flex gap-3">
              {[11, 12].map(cls => (
                <button key={cls} onClick={() => setConfig(c => ({ ...c, classes: toggleArr(c.classes, cls) }))}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${config.classes.includes(cls) ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-300'}`}>
                  Class {cls}
                </button>
              ))}
            </div>
          </div>
          {/* Subjects */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Select Subjects</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { name: 'Physics', color: 'blue', emoji: '⚛️' },
                { name: 'Chemistry', color: 'emerald', emoji: '🧪' },
                { name: 'Biology', color: 'violet', emoji: '🧬' },
              ].map(sub => {
                const active = config.subjects.includes(sub.name);
                const colorMap = { blue: 'border-blue-500 bg-blue-500', emerald: 'border-emerald-500 bg-emerald-500', violet: 'border-violet-500 bg-violet-500' };
                return (
                  <button key={sub.name} onClick={() => setConfig(c => ({ ...c, subjects: toggleArr(c.subjects, sub.name) }))}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2 ${active ? `${colorMap[sub.color]} text-white` : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'}`}>
                    {sub.emoji} {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {['Easy', 'Medium', 'Hard', 'Mixed'].map(d => (
                <button key={d} onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${config.difficulty === d ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-300'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Count */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Number of Questions: <span className="text-blue-600">{config.count}</span></label>
            <input type="range" min="10" max="60" step="5" value={config.count}
              onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}
              className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10</span><span>60</span></div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {config.count} minutes</span>
            </div>
            <button onClick={handleStart} disabled={config.subjects.length === 0 || config.classes.length === 0}
              className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              Generate & Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test screen
  const q = questions[currentIdx];
  const pct = Math.round((Object.keys(answers).length / questions.length) * 100);

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="font-bold font-display text-slate-900 dark:text-white">Mock Test</h1>
          <p className="text-xs text-slate-500">Q{currentIdx + 1}/{questions.length} · {Object.keys(answers).length} answered</p>
        </div>
        <Timer seconds={config.count * 60} onTimeUp={handleSubmit} />
      </div>
      <ProgressBar value={pct} color="blue" className="mb-6" />
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {questions.map((_, i) => (
          <button key={i} onClick={() => setCurrentIdx(i)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              i === currentIdx ? 'bg-blue-500 text-white'
              : markedForReview.has(i) ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
              : answers[i] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${q.subject === 'Physics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : q.subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'}`}>
                {q.subject}
              </span>
              <span className={`badge ${q.difficulty === 'Easy' ? 'badge-easy' : q.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'}`}>{q.difficulty}</span>
            </div>
            <p className="text-slate-900 dark:text-white font-medium leading-relaxed">{q.question}</p>
          </div>
          <button onClick={() => setMarkedForReview(prev => { const n = new Set(prev); n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx); return n; })}
            className={`p-2 rounded-lg shrink-0 ${markedForReview.has(currentIdx) ? 'bg-violet-100 text-violet-600' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
            <Flag className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2.5">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: { selected: i } }))}
              className={`mcq-option ${answers[currentIdx]?.selected === i ? 'mcq-option-selected' : ''}`}>
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${answers[currentIdx]?.selected === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-current'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} className="btn-secondary btn-sm flex items-center gap-1.5 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={handleSubmit} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors">
          <CheckSquare className="w-4 h-4" /> Submit
        </button>
        <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1} className="btn-primary btn-sm flex items-center gap-1.5 disabled:opacity-40">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
