import React, { useEffect, useState } from 'react';
import {
  ScanFace,
  Building2,
  AlertTriangle,
  Users,
  Shield,
  Home,
  LogOut,
  Bell,
  Sun,
  Moon,
  Clock3,
  Circle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TABS = [
  {
    id: 'classroom',
    label: 'Classroom',
    icon: ScanFace,
    desc: 'AI attendance'
  },
  {
    id: 'hostel',
    label: 'Hostel Curfew',
    icon: Building2,
    desc: 'Gate tracking'
  },
  {
    id: 'disciplinary',
    label: 'Disciplinary',
    icon: AlertTriangle,
    desc: 'Incidents'
  },
  {
    id: 'students',
    label: 'Students',
    icon: Users,
    desc: 'Registry'
  }
];

export default function Navbar({ activeTab, setActiveTab }) {
  const {
    theme,
    toggleTheme,
    goToHome,
    fines,
    logs,
    adminUser,
    userRole,
    students,
    currentStudentId
  } = useApp();

  const [now, setNow] = useState(new Date());
  const [showBell, setShowBell] = useState(false);

  const currentUser = userRole === 'student' 
    ? students.find(s => s.id === currentStudentId) 
    : adminUser;


  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pendingFines = fines.filter(f => f.status !== 'Served / Paid').length;
  const curfewAlerts = logs.filter(l => l.curfewAlert).length;
  const totalAlerts = pendingFines + curfewAlerts;

  // Check curfew time (10 PM+)
  const hour = now.getHours();
  const isCurfewTime = hour >= 22 || hour < 6;

  return (
    <header className="backdrop-blur-xl bg-white border-b border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top bar */}
        <div className="flex gap-4 h-16 items-center justify-between">

          {/* Brand */}
          <div className="flex gap-3 items-center">
            <button
              onClick={goToHome}
              className="bg-slate-100 cursor-pointer dark:bg-slate-700 dark:text-white flex h-9 hover:bg-slate-200 hover:text-slate-900 items-center justify-center rounded-lg text-slate-500 transition w-9"
              title="Home"
            >
              <Home className="h-4 w-4" />
            </button>

            <div className="flex gap-2.5 items-center">
              <div className="bg-gradient-to-br flex from-emerald-500 h-9 items-center justify-center relative rounded-xl shadow-emerald-600/20 shadow-sm to-green-600 w-9">
                <Shield className="dark:text-white h-4 text-slate-900 w-4" />
                <span className="-bottom-0.5 -right-0.5 absolute bg-emerald-400 border-2 border-white h-2.5 rounded-full w-2.5" />
              </div>

              <div className="hidden sm:block">
                <p className="dark:text-white font-extrabold text-slate-900 text-sm tracking-tight">Sentinel AI</p>
                <div className="flex gap-1.5 items-center mt-0.5">
                  <Clock3 className="dark:text-slate-400 h-2.5 text-slate-500 w-2.5" />
                  <span className="dark:text-slate-400 font-mono text-[10px] text-slate-500">
                    {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {isCurfewTime && (
                    <span className="font-bold font-mono text-[9px] text-amber-500">• CURFEW</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex gap-2 items-center">

            {/* System status pill */}
            <span className="bg-emerald-50 border border-emerald-200 font-bold gap-1.5 hidden items-center md:inline-flex px-2.5 py-1 rounded-full text-[10px] text-emerald-700">
              <span className="animate-pulse bg-emerald-500 h-1.5 rounded-full w-1.5" />
              SYSTEM LIVE
            </span>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="bg-white border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 flex h-9 hover:bg-slate-50 dark:hover:bg-slate-800 items-center justify-center rounded-lg transition w-9"
            >
              {theme === 'dark'
                ? <Sun className="h-3.5 text-amber-500 w-3.5" />
                : <Moon className="dark:text-slate-400 h-3.5 text-slate-500 w-3.5" />
              }
            </button>

            {/* Alerts bell */}
            <div className="relative">
              <button
                onClick={() => setShowBell(!showBell)}
                className="bg-white border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 flex h-9 hover:bg-slate-50 dark:hover:bg-slate-800 items-center justify-center relative rounded-lg transition w-9"
              >
                <Bell className="dark:text-slate-400 h-3.5 text-slate-500 w-3.5" />
                {totalAlerts > 0 && (
                  <span className="-right-1.5 -top-1.5 absolute bg-rose-500 border-2 border-white flex font-bold h-4 items-center justify-center min-w-[16px] px-1 rounded-full text-[8px] text-white">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {showBell && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowBell(false)} />
                  <div className="absolute bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden right-0 rounded-xl shadow-xl top-12 w-72 z-50">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="dark:text-white font-bold text-slate-900 text-xs">Alerts</p>
                      <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500">{totalAlerts} items need attention</p>
                    </div>
                    <div className="p-3 space-y-2">
                      {curfewAlerts > 0 && (
                        <div
                          className="bg-amber-50 border border-amber-200 cursor-pointer flex gap-3 hover:bg-amber-100/70 items-center px-3 py-2 rounded-lg"
                          onClick={() => { setActiveTab('hostel'); setShowBell(false); }}
                        >
                          <AlertTriangle className="h-4 shrink-0 text-amber-500 w-4" />
                          <div>
                            <p className="font-semibold text-amber-700 text-xs">{curfewAlerts} Curfew Violation{curfewAlerts !== 1 ? 's' : ''}</p>
                            <p className="dark:text-slate-400 text-[10px] text-slate-500">Click to review</p>
                          </div>
                        </div>
                      )}
                      {pendingFines > 0 && (
                        <div
                          className="bg-rose-50 border border-rose-200 cursor-pointer flex gap-3 hover:bg-rose-100/70 items-center px-3 py-2 rounded-lg"
                          onClick={() => { setActiveTab('disciplinary'); setShowBell(false); }}
                        >
                          <AlertTriangle className="h-4 shrink-0 text-rose-500 w-4" />
                          <div>
                            <p className="font-semibold text-rose-700 text-xs">{pendingFines} Open Incident{pendingFines !== 1 ? 's' : ''}</p>
                            <p className="dark:text-slate-400 text-[10px] text-slate-500">Click to review</p>
                          </div>
                        </div>
                      )}
                      {totalAlerts === 0 && (
                        <p className="dark:text-slate-400 py-4 text-center text-slate-500 text-xs">All clear</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="border-l border-slate-200 dark:border-slate-800 flex gap-2 items-center ml-1 pl-2">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name || 'User'}
                className="border border-slate-200 dark:border-slate-800 h-9 object-cover rounded-lg w-9"
              />
              <div className="hidden lg:block">
                <p className="dark:text-slate-200 font-semibold max-w-[100px] text-[11px] text-slate-800 truncate">{currentUser?.name}</p>
                <p className="dark:text-slate-400 font-mono text-[9px] text-slate-500">{userRole === "student" ? "STUDENT" : "ADMIN"}</p>
              </div>
              <button
                onClick={goToHome}
                title="Sign Out"
                className="cursor-pointer dark:text-slate-400 flex h-8 hover:bg-rose-50 hover:text-rose-500 items-center justify-center rounded-lg text-slate-500 transition w-8"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-slate-100 border-t flex gap-1 items-center overflow-x-auto pb-3 pt-2">
          {userRole !== "student" && TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${isActive ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800' }`}
              >
                <Icon className="h-3.5 shrink-0 w-3.5" />
                {tab.label}
                {tab.id === 'disciplinary' && pendingFines > 0 && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-white dark:bg-slate-900/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    {pendingFines}
                  </span>
                )}
                {tab.id === 'hostel' && curfewAlerts > 0 && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-white dark:bg-slate-900/20 text-white' : 'bg-amber-100 text-amber-600'}`}>
                    {curfewAlerts}
                  </span>
                )}
              </button>
            );
          })}

          {/* Curfew mode indicator */}
          {isCurfewTime && (
            <div className="bg-amber-50 border border-amber-200 flex gap-1.5 items-center ml-auto px-3 py-1.5 rounded-lg">
              <span className="animate-pulse bg-amber-500 h-1.5 rounded-full w-1.5" />
              <span className="font-bold font-mono text-[10px] text-amber-600">CURFEW MODE</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}