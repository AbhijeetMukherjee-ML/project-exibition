import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger' || toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300'
                : isDanger
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-300'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/95 border-indigo-500/50 text-indigo-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isDanger && <XCircle className="w-5 h-5 text-rose-400" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {!isSuccess && !isDanger && !isWarning && <Info className="w-5 h-5 text-indigo-400" />}
                </div>

                <div>
                  <h5 className="text-xs font-bold text-white leading-snug">{toast.title}</h5>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 block">{toast.time}</span>
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
