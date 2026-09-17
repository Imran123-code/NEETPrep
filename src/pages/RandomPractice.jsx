import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRandomQuestions, getWeakTopicQuestions } from '../data/questions';
import { useProgress } from '../context/ProgressContext';
import { subjectColors } from '../data/syllabus';
import { 
  Shuffle, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight,
  RotateCcw,
  Sliders,
  Filter
} from 'lucide-react';

export default function RandomPractice() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordMCQAttempt, toggleBookmark, progress } = useProgress();

  // Preset or custom config from state
  const stateTopics = location.state?.customTopics;
  const stateTitle = location.state?.title;

  const [questionCount, setQuestionCount] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');

  const [testActive, setTestActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOption }
  const [isCompleted, setIsCompleted] = useState(false);

  const startPractice = (count = questionCount) => {
    let generated = [];
    if (stateTopics && stateTopics.length > 0) {
      generated = getWeakTopicQuestions(stateTopics, count);
    } else {
      generated = getRandomQuestions({
        count,
        subjects: selectedSubject === 'All' ? ['Physics', 'Chemistry', 'Biology'] : [selectedSubject],
        difficulties: selectedDifficulty === 'All' ? ['Easy', 'Medium', 'Hard'] : [selectedDifficulty],
        classNum: selectedClass === 'All' ? null : selectedClass,
      });
    }

    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setTestActive(true);
  };

  const handleSelectOption = (optionIndex) => {
    if (userAnswers[activeQuestion.id] !== undefined) return;
    const isCorrect = optionIndex === activeQuestion.correctAnswer;
    setUserAnswers(prev => ({ ...prev, [activeQuestion.id]: optionIndex }));

    recordMCQAttempt(activeQuestion.id, isCorrect, {
      topic: activeQuestion.topic,
      chapterId: activeQuestion.chapterId,
      subject: activeQuestion.subject,
    });
  };

  const activeQuestion = questions[currentIndex];
  const isAnswered = activeQuestion && userAnswers[activeQuestion.id] !== undefined;
  const selectedOption = activeQuestion ? userAnswers[activeQuestion.id] : null;

  // Score stats upon completion
  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const attemptedCount = Object.keys(userAnswers).length;
  const score = correctCount * 4 - (attemptedCount - correctCount); // NEET marking (+4, -1)

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!testActive ? (
        <div className="max-w-3xl mx-auto">
          {/* Configurator Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-full mb-3">
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Practice Generator</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              {stateTitle || "Custom Quick Practice"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Select your question count, subject, and difficulty to generate an instant practice session.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[10, 25, 50].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setQuestionCount(num);
                  startPractice(num);
                }}
                className="card p-5 text-center hover:border-blue-500 hover:shadow-md transition-all group active:scale-95"
              >
                <div className="text-2xl font-extrabold text-blue-600 group-hover:scale-110 transition-transform">
                  {num}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  Random {num} MCQs
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ~{Math.round(num * 1.2)} mins
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Filter Options */}
          <div className="card p-6 md:p-8 space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Sliders className="w-4 h-4 text-blue-600" /> Custom Practice Parameters
            </h3>

            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Subject
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['All', 'Physics', 'Chemistry', 'Biology'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSubject === sub
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Target Class
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All', '11', '12'].map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedClass === cls
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cls === 'All' ? 'Class 11 & 12' : `Class ${cls}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {diff === 'All' ? 'Mixed' : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => startPractice(questionCount)}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base shadow-md"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Launch Custom Practice Session ({questionCount} MCQs)</span>
              </button>
            </div>
          </div>
        </div>
      ) : isCompleted ? (
        /* Completion Summary Screen */
        <div className="max-w-2xl mx-auto card p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              Practice Session Completed!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Here is your performance summary for this drill.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-2xl font-extrabold text-blue-600">
                {correctCount} / {questions.length}
              </div>
              <div className="text-xs text-slate-400">Score</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600">
                {questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%
              </div>
              <div className="text-xs text-slate-400">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-indigo-600">
                {score} pts
              </div>
              <div className="text-xs text-slate-400">NEET Marks</div>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setTestActive(false)}
              className="btn-secondary px-6 py-2.5 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Session</span>
            </button>
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentIndex(0);
              }}
              className="btn-primary px-6 py-2.5"
            >
              Review All Solutions
            </button>
          </div>
        </div>
      ) : activeQuestion ? (
        /* Active Question Display */
        <div className="max-w-3xl mx-auto">
          {/* Progress Banner */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                Random Drill
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <button
              onClick={() => setTestActive(false)}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Exit Practice
            </button>
          </div>

          {/* Question Card */}
          <div className="card p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span 
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: `${subjectColors[activeQuestion.subject]?.primary}15`,
                  color: subjectColors[activeQuestion.subject]?.primary,
                }}
              >
                {activeQuestion.subject} • {activeQuestion.chapterName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {activeQuestion.topic || 'General'}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-medium text-slate-900 dark:text-white leading-relaxed mb-6">
              {activeQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {activeQuestion.options.map((opt, i) => {
                let btnStyle = "border-slate-200 dark:border-slate-700 hover:border-blue-400";
                if (isAnswered) {
                  if (i === activeQuestion.correctAnswer) {
                    btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold";
                  } else if (i === selectedOption) {
                    btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 font-semibold";
                  }
                } else if (selectedOption === i) {
                  btnStyle = "border-blue-500 bg-blue-50 text-blue-700";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm md:text-base">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Solution and Navigation */}
            {isAnswered && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {selectedOption === activeQuestion.correctAnswer ? (
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Correct Answer! (+4 Marks)
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Incorrect (-1 Mark). Correct: Option {String.fromCharCode(65 + activeQuestion.correctAnswer)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeQuestion.explanation}
                </p>

                {activeQuestion.keyConcept && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-300">
                    <strong className="block mb-0.5">💡 Key Concept:</strong>
                    {activeQuestion.keyConcept}
                  </div>
                )}

                <div className="pt-3 flex justify-between items-center">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                      } else {
                        setIsCompleted(true);
                      }
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Drill'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
