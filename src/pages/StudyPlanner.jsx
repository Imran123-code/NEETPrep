import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';

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
  const [adding, setAdding] = useState(null); // { day }
  const [form, setForm] = useState({ subject: 'Physics', activity: '', time: '1 hour' });

  const addTask = () => {
    if (!form.activity) return;
    const task = { id: Date.now().toString(), ...form, done: false };
    setPlan(p => ({ ...p, [adding]: [...(p[adding] || []), task] }));
    setAdding(null);
    setForm({ subject: 'Physics', activity: '', time: '1 hour' });
  };

  const toggleDone = (day, taskId) => {
    setPlan(p => ({ ...p, [day]: p[day].map(t => t.id === taskId ? { ...t, done: !t.done } : t) }));
  };

  const removeTask = (day, taskId) => {
    setPlan(p => ({ ...p, [day]: p[day].filter(t => t.id !== taskId) }));
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Study Planner</h1>
        <p className="text-slate-500 dark:text-slate-400">Plan your weekly NEET study schedule</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {daysOfWeek.map(day => (
          <div key={day} className="card p-4 min-h-40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">{day}</h3>
              <button onClick={() => setAdding(day)} className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {(plan[day] || []).map(task => (
                <div key={task.id} className={`p-2 rounded-lg text-xs transition-all ${task.done ? 'opacity-50' : ''}`}
                  style={{ borderLeft: `3px solid ${subjectColors[task.subject]}`, background: `${subjectColors[task.subject]}10` }}>
                  <div className="flex items-start justify-between gap-1">
                    <span className={`flex-1 font-medium ${task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{task.activity}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => toggleDone(day, task.id)} className="text-emerald-500 hover:text-emerald-600">
                        <CheckCircle className={`w-3.5 h-3.5 ${task.done ? 'fill-current' : ''}`} />
                      </button>
                      <button onClick={() => removeTask(day, task.id)} className="text-red-400 hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    {task.time} · <span style={{ color: subjectColors[task.subject] }}>{task.subject}</span>
                  </div>
                </div>
              ))}
              {(plan[day] || []).length === 0 && (
                <p className="text-xs text-slate-300 dark:text-slate-600 italic text-center py-3">No tasks yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAdding(null)}>
          <div className="card max-w-sm w-full p-6 mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Add Task — {adding}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                <select className="input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Activity</label>
                <input type="text" className="input" placeholder="e.g., Read Chapter 5, Solve 30 MCQs..." value={form.activity}
                  onChange={e => setForm(p => ({ ...p, activity: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Time</label>
                <select className="input" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                  {['30 min', '1 hour', '1.5 hours', '2 hours', '3 hours'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={addTask} className="flex-1 btn-primary">Add Task</button>
                <button onClick={() => setAdding(null)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
