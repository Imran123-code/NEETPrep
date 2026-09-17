import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mcqs } from '../data/mcqs';
import { useProgress } from '../context/ProgressContext';
import { CheckCircle, XCircle, Clock, Flame, Target } from 'lucide-react';
import { subjectColors } from '../data/syllabus';

function getRandomMCQ() {
  return mcqs[Math.floor(Math.random() * mcqs.length)];
}

export default function DailyChallenge() {
  const { recordMCQAttempt, progress } = useProgress();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(() => getRandomMCQ());
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const totalQuestions = 10;

  const colors = subjectColors[currentQuestion.subject] || subjectColors.Physics;

  const handleAnswer = (idx) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const correct = idx === currentQuestion.correctAnswer;
    recordMCQAttempt(currentQuestion.id, correct);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setQuestionsAnswered(n => n + 1);
  };

  const handleNext = () => {
    if (questionsAnswered >= totalQuestions) return;
    setCurrentQuestion(getRandomMCQ());
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (questionsAnswered >= totalQuestions) {
    const pct = Math.round((score.correct / totalQuestions) * 100);
    return (
      <div className="page-enter min-h-[70vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Challenge Complete!</h2>
          <p className="text-slate-500 mb-6">Today's NEET Challenge</p>
          <div className="w-28 h-28 mx-auto mb-6 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={pct >= 80 ? '#10B981' : pct >= 60 ? '#3B82F6' : '#F59E0B'} strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40 * pct / 100} ${2 * Math.PI * 40}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">{pct}%</div>
                <div className="text-xs text-slate-400 text-center">{score.correct}/{totalQuestions}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/mock-tests" className="btn-primary">Take Mock Test</Link>
            <Link to="/" className="btn-secondary">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-orange-600 dark:text-orange-400 font-semibold text-sm mb-3">
          <Flame className="w-4 h-4" /> Daily Challenge
        </div>
        <h1 className="section-title mb-2">Today's NEET Challenge</h1>
        <p className="text-slate-500">Question {questionsAnswered + 1} of {totalQuestions}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400">{score.correct} correct</span>
        </div>
        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(questionsAnswered / totalQuestions) * 100}%` }} />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Target className="w-4 h-4 text-blue-500" />
          <span className="text-blue-600 dark:text-blue-400">{score.total} done</span>
        </div>
      </div>

      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${colors.primary}20`, color: colors.primary }}>
            {currentQuestion.subject}
          </span>
          <span className={`badge ${currentQuestion.difficulty === 'Easy' ? 'badge-easy' : currentQuestion.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'}`}>
            {currentQuestion.difficulty}
          </span>
          <span className="text-xs text-slate-400">{currentQuestion.topic}</span>
        </div>
        <p className="text-slate-900 dark:text-white font-medium leading-relaxed text-base mb-5">{currentQuestion.question}</p>
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, i) => {
            let cls = 'mcq-option';
            if (showExplanation) {
              if (i === currentQuestion.correctAnswer) cls += ' mcq-option-correct';
              else if (i === selectedAnswer) cls += ' mcq-option-incorrect';
              else cls += ' opacity-50';
            } else if (i === selectedAnswer) {
              cls += ' mcq-option-selected';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    showExplanation && i === currentQuestion.correctAnswer ? 'border-emerald-500 bg-emerald-500 text-white'
                    : showExplanation && i === selectedAnswer ? 'border-red-400 bg-red-400 text-white'
                    : 'border-current'
                  }`}>{String.fromCharCode(65+i)}</span>
                  {opt}
                  {showExplanation && i === currentQuestion.correctAnswer && <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
                  {showExplanation && i === selectedAnswer && i !== currentQuestion.correctAnswer && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                </span>
              </button>
            );
          })}
        </div>
        {showExplanation && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === currentQuestion.correctAnswer
                ? <><CheckCircle className="w-4 h-4 text-emerald-500" /><span className="text-sm font-semibold text-emerald-600">Correct! +1</span></>
                : <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-semibold text-red-600">Incorrect</span></>
              }
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="flex justify-center">
          <button onClick={handleNext} className="btn-primary px-8 py-3" style={{ background: colors.primary }}>
            {questionsAnswered + 1 >= totalQuestions ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
