import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  Clock3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="bottom-4 fixed max-w-[380px] pointer-events-none right-4 w-[calc(100%-2rem)] z-[100]">
      <div className="flex flex-col gap-2.5">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isDanger =
            toast.type === 'danger' || toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const config = isSuccess
            ? {
                icon: CheckCircle2,
                iconColor: 'text-emerald-400',
                iconBg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                rail: 'bg-emerald-500',
                glow: 'shadow-emerald-950/20'
              }
            : isDanger
            ? {
                icon: XCircle,
                iconColor: 'text-rose-400',
                iconBg: 'bg-rose-500/10',
                border: 'border-rose-500/20',
                rail: 'bg-rose-500',
                glow: 'shadow-rose-950/20'
              }
            : isWarning
            ? {
                icon: AlertTriangle,
                iconColor: 'text-amber-400',
                iconBg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                rail: 'bg-amber-500',
                glow: 'shadow-amber-950/20'
              }
            : {
                icon: Info,
                iconColor: 'text-indigo-400',
                iconBg: 'bg-indigo-500/10',
                border: 'border-indigo-500/20',
                rail: 'bg-indigo-500',
                glow: 'shadow-indigo-950/20'
              };

          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative overflow-hidden bg-slate-950/95 backdrop-blur-xl border ${config.border} rounded-xl shadow-2xl ${config.glow} animate-in slide-in-from-right-5 fade-in duration-300`}
            >
              {/* Status rail */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] ${config.rail}`}
              />

              <div className="p-3.5 pl-4">
                <div className="flex gap-3 items-start">

                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      className={`w-4 h-4 ${config.iconColor}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">

                    <div className="flex gap-2 items-center justify-between">
                      <h5 className="font-semibold text-white text-xs truncate">
                        {toast.title}
                      </h5>

                      <button
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                        className="cursor-pointer dark:text-slate-400 flex-shrink-0 hover:bg-slate-800 hover:text-slate-200 p-1 rounded-md text-slate-500 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="leading-relaxed mt-1 pr-1 text-[11px] text-slate-400">
                      {toast.message}
                    </p>

                    {/* Timestamp */}
                    <div className="flex gap-1 items-center mt-2">
                      <Clock3 className="dark:text-slate-400 h-3 text-slate-600 w-3" />

                      <span className="dark:text-slate-400 font-mono text-[9px] text-slate-600">
                        {toast.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="bg-white dark:bg-slate-900 h-[2px]">
                <div
                  className={`h-full ${config.rail} opacity-60 animate-[toast-progress_4s_linear_forwards]`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}