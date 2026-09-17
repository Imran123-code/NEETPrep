import React, { useState, useMemo } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, Clock, Award, TrendingUp, CheckSquare } from 'lucide-react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const subjects = ['Physics', 'Chemistry', 'Biology'];
const subjectColors = { Physics: '#3B82F6', Chemistry: '#10B981', Biology: '#8B5CF6' };

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || initial; }
    catch { return initial; }
  });
  const set = (v) => { setValue(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [value, set];
}

export default function StudyPlanner() {
  const [plan, setPlan] = useLocalStorage('neet_study_plan', {});
  const [adding, setAdding] = useState(null); // day string
  const [form, setForm] = useState({ subject: 'Physics', activity: '', time: '1 hour' });

  // Compute weekly statistics
  const weeklyStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    daysOfWeek.forEach(day => {
      const tasks = plan[day] || [];
      total += tasks.length;
      completed += tasks.filter(t => t.done).length;
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [plan]);

  const addTask = () => {
    if (!form.activity.trim()) return;
    const task = { id: Date.now().toString(), ...form, done: false };
    setPlan(p => ({ ...p, [adding]: [...(p[adding] || []), task] }));
    setAdding(null);
    setForm({ subject: 'Physics', activity: '', time: '1 hour' });
  };

  const toggleDone = (day, taskId) => {
    setPlan(p => ({
      ...p,
      [day]: (p[day] || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    }));
  };

  const removeTask = (day, taskId) => {
    setPlan(p => ({
      ...p,
      [day]: (p[day] || []).filter(t => t.id !== taskId)
    }));
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title mb-2">NEET Study Planner</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Structure your weekly schedule, set study targets, and maintain high consistency
          </p>
        </div>
      </div>

      {/* Weekly Progress Overview Bar */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-blue-100 dark:border-blue-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Schedule Progress</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {weeklyStats.completed} of {weeklyStats.total} tasks completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-display text-blue-600 dark:text-blue-400">
              {weeklyStats.percentage}%
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {weeklyStats.percentage === 100 && weeklyStats.total > 0
                ? 'All Targets Met! 🎯'
                : weeklyStats.percentage >= 50
                ? 'On Track 👍'
                : 'In Progress ⏳'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${weeklyStats.percentage}%` }}
          />
        </div>
      </div>

      {/* Day Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {daysOfWeek.map(day => {
          const tasks = plan[day] || [];
          const doneCount = tasks.filter(t => t.done).length;
          const dayPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

          return (
            <div key={day} className="card p-4 min-h-52 flex flex-col justify-between">
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white">{day}</h3>
                    {tasks.length > 0 && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                        dayPct === 100
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {doneCount}/{tasks.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setAdding(day)}
                    className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm"
                    title={`Add task to ${day}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day mini progress bar */}
                {tasks.length > 0 && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all ${
                        dayPct === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${dayPct}%` }}
                    />
                  </div>
                )}

                {/* Task List */}
                <div className="space-y-2 mt-2">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-2.5 rounded-xl text-xs transition-all border border-slate-200/60 dark:border-slate-700/60 ${
                        task.done ? 'opacity-60 bg-slate-50 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-800 shadow-2xs'
                      }`}
                      style={{ borderLeftWidth: '3px', borderLeftColor: subjectColors[task.subject] }}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className={`flex-1 font-medium leading-snug ${
                          task.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {task.activity}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <button
                            onClick={() => toggleDone(day, task.id)}
                            className={`p-1 rounded transition-colors ${
                              task.done ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'
                            }`}
                            title={task.done ? 'Mark as incomplete' : 'Mark as done'}
                          >
                            <CheckCircle className={`w-3.5 h-3.5 ${task.done ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => removeTask(day, task.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{task.time}</span>
                        <span>·</span>
                        <span className="font-medium" style={{ color: subjectColors[task.subject] }}>
                          {task.subject}
                        </span>
                      </div>
                    </div>
                  ))}

                  {tasks.length === 0 && (
                    <p className="text-xs text-slate-300 dark:text-slate-600 italic text-center py-4">
                      No tasks scheduled
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setAdding(null)}
        >
          <div className="card max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">
              Add Task for {adding}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                <select
                  className="input w-full text-sm"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Target Activity</label>
                <input
                  type="text"
                  className="input w-full text-sm"
                  placeholder="e.g., Read NCERT Ch. 4, Practice 30 MCQs..."
                  value={form.activity}
                  onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Estimated Time</label>
                <select
                  className="input w-full text-sm"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                >
                  {['30 min', '45 min', '1 hour', '1.5 hours', '2 hours', '3 hours'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-3">
                <button onClick={addTask} className="flex-1 btn-primary">Add to Schedule</button>
                <button onClick={() => setAdding(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
