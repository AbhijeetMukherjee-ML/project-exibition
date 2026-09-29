import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bell, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Sun, 
  Moon,
  Home,
  LogOut 
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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingFinesCount = fines.filter(f => f.status !== "Served / Paid").length;
  const recentCurfewBreaches = logs.filter(l => l.curfewAlert).slice(0, 3);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          
          {/* Left: Home Button & System Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToHome}
              title="Return to Home Page"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold tracking-wide text-xs text-slate-900 dark:text-slate-200">
                  {userRole === 'admin' ? 'Hostel Management System' : 'Student Access Portal'}
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>

          {/* Right: Theme Toggle, Role Switcher & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            
            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
              <span className="text-[11px] font-semibold hidden md:inline">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium">
              <button
                onClick={() => setUserRole('admin')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  userRole === 'admin'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setUserRole('student')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  userRole === 'student'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Student
              </button>
            </div>

            {/* Simulation Scan Trigger */}
            <button
              onClick={triggerSimulatedScan}
              title="Simulate gate access event"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Simulate Scan</span>
              <span className="sm:hidden">Simulate</span>
            </button>

            {/* Notifications Menu (Admin Only) */}
            {userRole === 'admin' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {pendingFinesCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] text-[9px] font-bold text-white bg-rose-600 rounded-full px-1 shadow-sm">
                      {pendingFinesCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Alerts & Notices</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {pendingFinesCount} Unpaid Fines
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2 max-h-72 overflow-y-auto pr-1 text-xs">
                      {recentCurfewBreaches.length > 0 ? (
                        recentCurfewBreaches.map((breach) => (
                          <div key={breach.id} className="py-2.5 flex items-start gap-2.5">
                            <span className="w-2 h-2 mt-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{breach.studentName}</p>
                                <span className="text-[10px] text-slate-400 font-mono">{breach.timestamp.split(' ')[1]}</span>
                              </div>
                              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{breach.remarks}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Room {breach.room} • {breach.gate}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 py-3 text-center">No active curfew violations.</p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setActiveTab('fines');
                          setShowNotifications(false);
                        }}
                        className="w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium py-1"
                      >
                        View Disciplinary Table &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={userRole === 'admin' ? adminUser.avatar : currentStudent.avatar}
                alt="Profile"
                className="w-7 h-7 rounded-md object-cover border border-slate-300 dark:border-slate-700"
              />
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {userRole === 'admin' ? adminUser.name : currentStudent.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {userRole === 'admin' ? 'Administrator' : currentStudent.id}
                </p>
              </div>

              <button
                onClick={goToHome}
                title="Sign Out to Home Page"
                className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
