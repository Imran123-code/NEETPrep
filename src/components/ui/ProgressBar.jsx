import React from 'react';

export function ProgressBar({ value, max = 100, color = 'blue', className = '', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className={`progress-fill ${colors[color] || 'bg-blue-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function CircularProgress({ value, size = 80, stroke = 6, color = '#3B82F6', label, sublabel }) {
  const radius = (size - stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} className="dark:stroke-slate-700" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontSize: size > 90 ? 20 : 14 }}>
          {value}%
        </span>
        {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
      </div>
    </div>
  );
}
