import re

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write("""import React from 'react';
import {
  Shield,
  ScanFace,
  Moon,
  Sun,
  CheckCircle2,
  Clock3,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LoginForm from '../common/LoginForm';

export default function HomePage() {
  const { theme, toggleTheme } = useApp();

  const features = [
    {
      icon: ScanFace,
      color: 'blue',
      tag: 'CLASSROOM',
      title: 'Classroom Attendance',
      desc: 'AI camera automatically identifies students from live feed and marks attendance when class is in session.',
      points: ['Face recognition with 99.4% accuracy', 'Live dashboard updates in seconds', 'Eliminates manual roll calls']
    },
    {
      icon: Clock3,
      color: 'violet',
      tag: 'HOSTEL',
      title: 'Curfew & Gate Monitoring',
      desc: 'Seamlessly tracks students entering or leaving the hostel perimeter to ensure campus safety protocols.',
      points: ['Real-time IN/OUT logging', 'Automatic curfew alerts', 'Authorized outpass matching']
    },
    {
      icon: Activity,
      color: 'rose',
      tag: 'DISCIPLINE',
      title: 'Disciplinary Action',
      desc: 'Instantly issue fines and track behavioral infractions linked directly to a students permanent record.',
      points: ['Automated fine ledger', 'Guardian notification system', 'Historical incident tracking']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Theme Toggle Button - Floating at top right */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* LEFT SIDE: Information */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09101c] shadow-[20px_0_40px_-20px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)] z-10 relative">
        
        <div>
          <div className="flex items-center gap-4 mb-16">
            <div className="relative w-12 h-12 rounded-xl bg-blue-600 shadow-xl shadow-blue-500/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
              <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#09101c]" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight">Sentinel AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest mt-1">
                Campus Intelligence System
              </p>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] mb-6">
            Secure your campus with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">intelligent automation.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mb-12">
            Point a camera at a classroom or hostel gate — the AI handles the rest. Monitor attendance, enforce curfew, and manage disciplinary actions seamlessly.
          </p>

          <div className="space-y-6 max-w-lg">
            {features.map((f, i) => {
              const Icon = f.icon;
              const colorMap = {
                blue: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
                violet: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10',
                rose: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10'
              };
              const c = colorMap[f.color];

              return (
                <div key={i} className="flex gap-5 items-start">
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${c}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                      {f.desc}
                    </p>
                    <div className="space-y-1.5">
                      {f.points.map((pt, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {pt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>© 2026 Sentinel AI. All rights reserved.</span>
          <span>SYSTEM V1.4.0</span>
        </div>

      </div>

      {/* RIGHT SIDE: Login */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center bg-slate-50 dark:bg-[#060b14]">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-8 duration-700">
          <LoginForm />
        </div>
      </div>

    </div>
  );
}
""")

print("Rewrote HomePage.jsx")
