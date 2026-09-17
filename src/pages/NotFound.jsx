import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🔬</div>
      <h1 className="text-5xl font-bold font-display text-slate-900 dark:text-white mb-3">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-3">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back to studying!
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary flex items-center gap-2">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </div>
  );
}
