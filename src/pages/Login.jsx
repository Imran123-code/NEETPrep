import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Dna, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result?.success) navigate('/dashboard');
    else setError('Invalid email or password. Try demo@neetprep.com / demo123');
  };

  const handleDemo = async () => {
    setLoading(true);
    await loginAsDemo();
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              NEET<span className="text-blue-600">Prep</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your preparation</p>
        </div>
        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email</label>
              <input type="email" className="input" placeholder="your@email.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-3" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-700" /></div>
            <div className="relative flex justify-center text-xs text-slate-400"><span className="px-3 bg-white dark:bg-slate-900">or</span></div>
          </div>
          <button onClick={handleDemo} className="w-full btn-secondary py-3" disabled={loading}>
            🎯 Try Demo Account
          </button>
          <p className="text-center text-sm text-slate-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign Up Free</Link>
          </p>
        </div>
        <Link to="/" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
