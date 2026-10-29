import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white/95 text-slate-800';
      case 'error':
        return 'border-rose-200 bg-white/95 text-slate-800';
      case 'warning':
        return 'border-amber-200 bg-white/95 text-slate-800';
      default:
        return 'border-sky-200 bg-white/95 text-slate-800';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${getBorderColor(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-700 transition p-1 -mr-1 -mt-1 rounded-lg"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
