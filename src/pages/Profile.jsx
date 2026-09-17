import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { User, Mail, GraduationCap, Calendar, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', class: user?.class || 11, targetYear: user?.targetYear || 2025 });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Please log in to view your profile</h2>
        <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">My Profile</h1>
      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.avatar || user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Class {user.class}</span>
              <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Target {user.targetYear}</span>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Name</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Class</label>
                <select className="input" value={form.class} onChange={e => setForm(p => ({ ...p, class: Number(e.target.value) }))}>
                  <option value={11}>Class 11</option>
                  <option value={12}>Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Target Year</label>
                <select className="input" value={form.targetYear} onChange={e => setForm(p => ({ ...p, targetYear: Number(e.target.value) }))}>
                  {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 btn-primary">Save Changes</button>
              <button onClick={() => setEditing(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {[
              { label: 'Name', value: user.name, icon: User },
              { label: 'Email', value: user.email, icon: Mail },
              { label: 'Class', value: `Class ${user.class}`, icon: GraduationCap },
              { label: 'Target Year', value: user.targetYear || '2025', icon: Calendar },
            ].map(field => (
              <div key={field.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <field.icon className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-400">{field.label}</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{field.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" /> Edit Profile
            </button>
          )}
          <button onClick={() => { logout(); navigate('/'); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border border-red-200 dark:border-red-800 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
