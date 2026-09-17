import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { getWeakTopicQuestions } from '../data/questions';
import { subjectColors } from '../data/syllabus';
import { 
  Target, 
  AlertTriangle, 
  Flame, 
  ArrowRight, 
  CheckCircle, 
  BookOpen, 
  Activity,
  Zap
} from 'lucide-react';

export default function WeakTopics() {
  const navigate = useNavigate();
  const { getWeakTopics, progress } = useProgress();
  const weakTopics = getWeakTopics();

  const [selectedTopics, setSelectedTopics] = useState(
    weakTopics.map(t => t.topic)
  );

  const toggleTopicSelect = (topicName) => {
    setSelectedTopics(prev => 
      prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
    );
  };

  const handleStartWeakTopicPractice = () => {
    if (selectedTopics.length === 0) return;
    navigate('/random-practice', {
      state: {
        customTopics: selectedTopics,
        title: `Weak Topics Drill (${selectedTopics.length} topics)`
      }
    });
  };

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="card p-6 md:p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/40 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-full mb-3">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>AI Performance Diagnostics</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Weak Topic Analysis
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              We monitor your question attempts and automatically identify topics where your accuracy is below 65%. Focus your revision here to see maximum score improvement.
            </p>
          </div>

          {weakTopics.length > 0 && (
            <button
              onClick={handleStartWeakTopicPractice}
              disabled={selectedTopics.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>Practice Selected ({selectedTopics.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Weak Topics List */}
      {weakTopics.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Critical Weak Areas Detected!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            As you solve more questions and take chapter tests, any topics where you struggle will be automatically charted here with personalized remediation drills.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/mcqs" className="btn-primary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Practice Questions</span>
            </Link>
            <Link to="/mock-tests" className="btn-secondary inline-flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Take a Mock Test</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakTopics.map((item) => {
            const isSelected = selectedTopics.includes(item.topic);
            const subColor = subjectColors[item.subject]?.primary || '#3b82f6';

            return (
              <div 
                key={item.topic}
                onClick={() => toggleTopicSelect(item.topic)}
                className={`card p-5 cursor-pointer transition-all border-2 ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/10 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-xs font-semibold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${subColor}15`, color: subColor }}
                      >
                        {item.subject}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
                        Accuracy: {item.accuracy}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {item.topic}
                    </h3>
                  </div>

                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => {}} 
                    className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 mt-1 cursor-pointer"
                  />
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{item.correct} correct out of {item.total} attempts</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    Needs Attention ⚠️
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
