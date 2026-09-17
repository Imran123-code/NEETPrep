import React from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <div className="page-enter max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🔐</div>
      <h1 className="section-title mb-3">Admin Panel</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Admin features are coming soon. This section will allow managing MCQs, chapters, and users.</p>
      <Link to="/" className="btn-primary">Go Back Home</Link>
    </div>
  );
}
