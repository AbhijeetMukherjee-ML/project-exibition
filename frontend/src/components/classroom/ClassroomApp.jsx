import React, { useState } from 'react';
import {
  GraduationCap,
  ScanFace,
  CalendarClock,
  Home,
  Sun,
  Moon,
  Activity,
  ShieldCheck,
  Circle
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import { ClassroomProvider } from '../../context/ClassroomContext';
import LiveAttendancePage from './LiveAttendancePage';
import TimetablePage from './TimetablePage';
import ToastContainer from '../common/ToastContainer';

function ClassroomShell() {
  const { goToHome, theme, toggleTheme } = useApp();
  const [tab, setTab] = useState('attendance');

  const tabs = [
    {
      id: 'attendance',
      label: 'Live Attendance',
      shortLabel: 'Attendance',
      description: 'Face recognition',
      icon: ScanFace
    },
    {
      id: 'timetable',
      label: 'Timetable',
      shortLabel: 'Schedule',
      description: 'Class schedule',
      icon: CalendarClock
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">

      {/* ═══════════════════════════════════════════════════════
          TOP NAVIGATION
      ═══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0b111d]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[68px] flex items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3.5 min-w-0">

              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>

                <span className="absolute -right-1 -bottom-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0b111d]">
                  <span className="w-1 h-1 rounded-full bg-white" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">

                  <h1 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate">
                    Smart Classroom
                  </h1>

                  <span className="hidden md:inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                    <ScanFace className="w-3 h-3" />
                    Face AI
                  </span>

                </div>

                <div className="hidden sm:flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-500">
                    Automated attendance & classroom intelligence
                  </span>
                </div>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">

              {/* System status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/15">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                </span>

                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  SYSTEM ONLINE
                </span>
              </div>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="
                  w-9 h-9 rounded-xl
                  flex items-center justify-center
                  bg-slate-100 hover:bg-slate-200
                  dark:bg-slate-800 dark:hover:bg-slate-700
                  border border-slate-200 dark:border-slate-700
                  text-slate-600 dark:text-slate-300
                  transition-all cursor-pointer
                "
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Home */}
              <button
                onClick={goToHome}
                className="
                  h-9 px-3 rounded-xl
                  flex items-center gap-1.5
                  bg-slate-100 hover:bg-slate-200
                  dark:bg-slate-800 dark:hover:bg-slate-700
                  border border-slate-200 dark:border-slate-700
                  text-slate-700 dark:text-slate-200
                  text-xs font-semibold
                  transition-all cursor-pointer
                "
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>

            </div>
          </div>
        </div>
      </header>


      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-indigo-500 dark:text-indigo-400">
                Classroom Operations
              </span>

              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

              <span className="text-[10px] font-mono text-slate-400">
                AI-ATTENDANCE
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Classroom Control Center
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Monitor attendance and manage academic schedules from one place.
            </p>
          </div>

          {/* Security indicator */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                Secure Processing
              </p>

              <p className="text-[9px] text-slate-400">
                Face data protected
              </p>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            TAB NAVIGATION
        ═══════════════════════════════════════════════════════ */}
        <div className="mb-5">

          <div className="
            inline-flex w-full sm:w-auto
            p-1
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            rounded-xl
            shadow-sm
          ">

            {tabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`
                    relative flex-1 sm:flex-none
                    min-w-[170px]
                    flex items-center gap-2.5
                    px-4 py-2.5
                    rounded-lg
                    text-left
                    transition-all duration-200
                    cursor-pointer
                    ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                    }
                  `}
                >

                  <div
                    className={`
                      w-7 h-7 rounded-lg
                      flex items-center justify-center
                      ${
                        active
                          ? 'bg-white/15'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {item.label}
                    </p>

                    <p
                      className={`
                        text-[9px] mt-0.5
                        ${
                          active
                            ? 'text-indigo-100'
                            : 'text-slate-400'
                        }
                      `}
                    >
                      {item.description}
                    </p>
                  </div>

                  {item.id === 'attendance' && (
                    <span
                      className={`
                        ml-auto w-1.5 h-1.5 rounded-full
                        ${
                          active
                            ? 'bg-emerald-300 animate-pulse'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }
                      `}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            PAGE CONTENT
        ═══════════════════════════════════════════════════════ */}
        <div className="relative">

          {tab === 'attendance' ? (
            <LiveAttendancePage />
          ) : (
            <TimetablePage />
          )}

        </div>

      </main>


      {/* Toasts */}
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