import React, { useEffect, useState } from 'react';
import {
  Building2,
  Bell,
  Clock3,
  Zap,
  AlertTriangle,
  Sun,
  Moon,
  Home,
  LogOut,
  ChevronDown,
  ShieldCheck,
  GraduationCap,
  Circle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const {
    userRole,
    setUserRole,
    theme,
    toggleTheme,
    adminUser,
    currentStudent,
    triggerSimulatedScan,
    logs,
    fines,
    setActiveTab,
    goToHome
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pendingFinesCount = fines.filter(
    (f) => f.status !== 'Served / Paid'
  ).length;

  const recentCurfewBreaches = logs
    .filter((l) => l.curfewAlert)
    .slice(0, 3);

  const isAdmin = userRole === 'admin';
  const activeUser = isAdmin ? adminUser : currentStudent;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[68px] flex items-center justify-between gap-4">

          {/* ───────────────── LEFT ───────────────── */}
          <div className="flex items-center gap-3 min-w-0">

            {/* Home */}
            <button
              onClick={goToHome}
              title="Return to Home"
              className="group flex items-center justify-center w-9 h-9 rounded-xl
              bg-slate-100 hover:bg-blue-50
              dark:bg-slate-900 dark:hover:bg-blue-950/40
              border border-slate-200 dark:border-slate-800
              text-slate-500 hover:text-blue-600
              dark:text-slate-400 dark:hover:text-blue-400
              transition-all duration-200 cursor-pointer"
            >
              <Home className="w-4 h-4 group-hover:scale-105 transition-transform" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                <Building2 className="w-5 h-5" />
                <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
              </div>

              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {isAdmin
                      ? 'Hostel Management System'
                      : 'Student Access Portal'}
                  </h1>

                  <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    <Circle className="w-1.5 h-1.5 fill-current" />
                    Live
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <Clock3 className="w-3 h-3" />
                  <span className="font-mono">
                    {currentTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── RIGHT ───────────────── */}
          <div className="flex items-center gap-2">

            {/* Role Switcher */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

              <button
                onClick={() => setUserRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all duration-200 cursor-pointer ${
                  isAdmin
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>

              <button
                onClick={() => setUserRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all duration-200 cursor-pointer ${
                  !isAdmin
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>
            </div>

            {/* Simulate Scan */}
            <button
              onClick={triggerSimulatedScan}
              title="Simulate gate access event"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl
              bg-amber-50 hover:bg-amber-100
              dark:bg-amber-950/30 dark:hover:bg-amber-950/50
              border border-amber-200 dark:border-amber-900/50
              text-amber-700 dark:text-amber-400
              text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Scan</span>
            </button>

            {/* Mobile Scan */}
            <button
              onClick={triggerSimulatedScan}
              title="Simulate gate access"
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl
              bg-amber-50 dark:bg-amber-950/30
              border border-amber-200 dark:border-amber-900/50
              text-amber-600 dark:text-amber-400 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="flex items-center justify-center w-9 h-9 rounded-xl
              bg-slate-100 hover:bg-slate-200
              dark:bg-slate-900 dark:hover:bg-slate-800
              border border-slate-200 dark:border-slate-800
              text-slate-600 dark:text-slate-300
              transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Notifications */}
            {isAdmin && (
              <div className="relative">

                <button
                  onClick={() =>
                    setShowNotifications(!showNotifications)
                  }
                  title="Notifications"
                  className={`relative flex items-center justify-center w-9 h-9 rounded-xl
                  border transition-all cursor-pointer ${
                    showNotifications
                      ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Bell className="w-4 h-4" />

                  {pendingFinesCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-bold border-2 border-white dark:border-slate-950">
                      {pendingFinesCount > 99
                        ? '99+'
                        : pendingFinesCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />

                    <div className="absolute right-0 top-11 z-50 w-[340px] sm:w-[390px]
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    rounded-2xl shadow-2xl overflow-hidden">

                      {/* Dropdown Header */}
                      <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              Notifications
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Recent hostel system alerts
                            </p>
                          </div>

                          <span className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[9px] font-bold border border-rose-200 dark:border-rose-900/50">
                            {pendingFinesCount} UNPAID
                          </span>
                        </div>
                      </div>

                      {/* Alerts */}
                      <div className="max-h-[280px] overflow-y-auto">

                        {recentCurfewBreaches.length > 0 ? (
                          recentCurfewBreaches.map((breach) => (
                            <div
                              key={breach.id}
                              className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <div className="flex gap-3">

                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                  <AlertTriangle className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                      {breach.studentName}
                                    </p>

                                    <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">
                                      {breach.timestamp.split(' ')[1]}
                                    </span>
                                  </div>

                                  <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                                    {breach.remarks}
                                  </p>

                                  <p className="text-[9px] text-slate-400 mt-1">
                                    Room {breach.room} • {breach.gate}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-5 py-8 text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                              <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>

                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
                              All clear
                            </p>

                            <p className="text-[10px] text-slate-400 mt-0.5">
                              No active curfew violations.
                            </p>
                          </div>
                        )}

                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setActiveTab('fines');
                            setShowNotifications(false);
                          }}
                          className="w-full py-2 rounded-lg bg-slate-100 hover:bg-blue-50
                          dark:bg-slate-800 dark:hover:bg-blue-950/40
                          text-blue-600 dark:text-blue-400
                          text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          View Disciplinary Records →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-slate-800">

              <img
                src={activeUser?.avatar}
                alt={activeUser?.name || 'Profile'}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />

              <div className="hidden lg:block max-w-[130px]">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {activeUser?.name}
                </p>

                <p className="text-[9px] text-slate-400 truncate">
                  {isAdmin ? 'Chief Administrator' : currentStudent?.id}
                </p>
              </div>

              <button
                onClick={goToHome}
                title="Sign Out"
                className="flex items-center justify-center w-8 h-8 rounded-xl
                text-slate-400 hover:text-rose-600
                hover:bg-rose-50
                dark:hover:bg-rose-950/30 dark:hover:text-rose-400
                transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}