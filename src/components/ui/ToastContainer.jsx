import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { CheckCircle, AlertCircle, Info, Star, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
  xp: <Star className="w-4 h-4" />,
  badge: <span className="text-sm">🏆</span>,
};

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  xp: 'bg-amber-500',
  badge: 'bg-violet-500',
};

export default function ToastContainer() {
  const { toasts, setToasts } = useProgress();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg pointer-events-auto animate-slide-up max-w-xs ${colors[toast.type] || colors.success}`}
        >
          {icons[toast.type] || icons.success}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))} className="opacity-70 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
