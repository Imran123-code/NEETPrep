import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getMCQsByChapter, getMCQsBySubject } from '../data/mcqs';
import { subjectColors } from '../data/syllabus';
import { getChapterById } from '../data/chapters';
import { useProgress } from '../context/ProgressContext';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckSquare } from 'lucide-react';

function Timer({ seconds, onTimeUp }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(interval); onTimeUp(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / seconds) * 100;
  const urgent = remaining < 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${urgent ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}>
      <Clock className={`w-4 h-4 ${urgent ? 'animate-pulse' : ''}`} />
      <span className="font-mono font-bold text-lg">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</span>
    </div>
  );
}

export default function ChapterTest() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { saveTestResult } = useProgress();

  const [phase, setPhase] = useState('intro'); // intro | test | submitted
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [timeUsed, setTimeUsed] = useState(0);

  const chapter = getChapterById(chapterId);
  const chapterName = chapter?.name || 'Chapter';
  const subject = chapter?.subject || 'Physics';
  const colors = subjectColors[subject] || subjectColors.Physics;

  let rawQuestions = getMCQsByChapter(chapterId);
  if (rawQuestions.length === 0 && subject) {
    rawQuestions = getMCQsBySubject(subject).slice(0, 15);
  }
  const questions = rawQuestions;
  const testDuration = Math.max(questions.length, 10) * 60; // 1 min per question, min 10 min

  const handleStart = () => {
    setPhase('test');
    setStartTime(Date.now());
  };

  const handleSubmit = useCallback(() => {
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    setTimeUsed(elapsed);
    const correct = questions.filter((q, i) => answers[i]?.selected === q.correctAnswer).length;
    const incorrect = questions.filter((q, i) => answers[i] && answers[i].selected !== q.correctAnswer).length;
    const unattempted = questions.length - Object.keys(answers).length;
    const percentage = Math.round((correct / questions.length) * 100);

    const result = {
      id: Date.now().toString(),
      chapterId,
      chapterName,
      subject,
      mode: 'test',
      score: correct,
      total: questions.length,
      correct, incorrect, unattempted,
      percentage,
      timeTaken: elapsed,
      date: new Date().toISOString(),
      questions,
      answers,
    };
    localStorage.setItem(`result_${result.id}`, JSON.stringify(result));
    saveTestResult(result);
    navigate(`/result/${result.id}`);
  }, [answers, questions, chapterId, chapterName, subject, startTime, saveTestResult, navigate]);

  if (questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="text-6xl">📝</div>
        <h2 className="text-2xl font-bold">No Questions Available</h2>
        <p className="text-slate-500">Test questions for this chapter are being added.</p>
        <Link to={`/chapter/${chapterId}`} className="btn-primary">Back to Chapter</Link>
      </div>
    );
  }

  // INTRO SCREEN
  if (phase === 'intro') {
    return (
      <div className="page-enter min-h-[80vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Chapter Test</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{chapterName}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Questions', value: questions.length },
              { label: 'Time', value: `${Math.floor(testDuration / 60)} min` },
              { label: 'Marks/Q', value: '+4 / -1' },
              { label: 'Difficulty', value: 'NEET Level' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-lg font-bold font-display text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-left space-y-1.5">
            <p>• All {questions.length} MCQs from this chapter</p>
            <p>• Answers revealed only after submission</p>
            <p>• Timer will auto-submit when time is up</p>
            <p>• You can navigate between questions</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/chapter/${chapterId}`} className="flex-1 btn-secondary">Cancel</Link>
            <button onClick={handleStart} className="flex-1 btn-primary text-white" style={{ background: colors.primary }}>
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Test Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="font-bold font-display text-slate-900 dark:text-white">{chapterName} — Test</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Q{currentIdx + 1}/{questions.length} · {Object.keys(answers).length} answered
          </p>
        </div>
        <Timer seconds={testDuration} onTimeUp={handleSubmit} />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar value={Math.round((Object.keys(answers).length / questions.length) * 100)}
          color={subject === 'Physics' ? 'blue' : subject === 'Chemistry' ? 'emerald' : 'violet'} />
      </div>

      {/* Question Navigator */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              i === currentIdx ? 'text-white shadow-sm' : ''
            } ${
              markedForReview.has(i) ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
              : answers[i] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            style={i === currentIdx ? { background: colors.primary } : {}}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-5">
          <p className="text-slate-900 dark:text-white font-medium leading-relaxed text-base">{q.question}</p>
          <button
            onClick={() => setMarkedForReview(prev => { const n = new Set(prev); n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx); return n; })}
            className={`p-2 rounded-lg shrink-0 transition-colors ${markedForReview.has(currentIdx) ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: { selected: i } }))}
              className={`mcq-option ${answers[currentIdx]?.selected === i ? 'mcq-option-selected' : ''}`}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                  answers[currentIdx]?.selected === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-current'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} className="btn-secondary btn-sm flex items-center gap-1.5 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          <CheckSquare className="w-4 h-4" /> Submit Test
        </button>
        <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1} className="btn-primary btn-sm flex items-center gap-1.5 disabled:opacity-40" style={{ background: colors.primary }}>
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
