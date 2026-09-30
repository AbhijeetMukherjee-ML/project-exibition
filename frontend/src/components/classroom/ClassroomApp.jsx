import React, { useState } from 'react';
import { GraduationCap, ScanFace, CalendarClock, Home, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassroomProvider } from '../../context/ClassroomContext';
import LiveAttendancePage from './LiveAttendancePage';
import TimetablePage from './TimetablePage';
import ToastContainer from '../common/ToastContainer';

function ClassroomShell() {
  const { goToHome, theme, toggleTheme } = useApp();
  const [tab, setTab] = useState('attendance');

  const tabs = [
    { id: 'attendance', label: 'Live Attendance', icon: ScanFace },
    { id: 'timetable', label: 'Timetable', icon: CalendarClock }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Smart Classroom Attendance
                <span className="hidden sm:inline text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                  Face AI
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                Automatic face-recognition attendance with late & absent detection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme} title="Toggle theme" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button onClick={goToHome} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <Home className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-max">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'attendance' ? <LiveAttendancePage /> : <TimetablePage />}
      </main>

      <ToastContainer />
    </div>
  );
}

export default function ClassroomApp() {
  return (
    <ClassroomProvider>
      <ClassroomShell />
    </ClassroomProvider>
  );
}
