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
    adminUser
  } = useApp();

  const [now, setNow] = useState(new Date());
  const [showBell, setShowBell] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#070d18]/95 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top bar */}
        <div className="h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToHome}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-4 h-4 text-white" />
                <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070d18]" />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white">Sentinel AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock3 className="w-2.5 h-2.5 text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-500">
                    {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {isCurfewTime && (
                    <span className="text-[9px] font-bold text-amber-400 font-mono">• CURFEW</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
            >
              {theme === 'dark'
                ? <Sun className="w-3.5 h-3.5 text-amber-400" />
                : <Moon className="w-3.5 h-3.5 text-slate-300" />
              }
            </button>

            {/* Alerts bell */}
            <div className="relative">
              <button
                onClick={() => setShowBell(!showBell)}
                className="relative w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-rose-600 text-white text-[8px] font-bold border-2 border-[#070d18]">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {showBell && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowBell(false)} />
                  <div className="absolute right-0 top-10 z-50 w-72 bg-[#0b1320] border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">Alerts</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{totalAlerts} items need attention</p>
                    </div>
                    <div className="p-3 space-y-2">
                      {curfewAlerts > 0 && (
                        <div
                          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 cursor-pointer hover:bg-amber-500/10"
                          onClick={() => { setActiveTab('hostel'); setShowBell(false); }}
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-300">{curfewAlerts} Curfew Violation{curfewAlerts !== 1 ? 's' : ''}</p>
                            <p className="text-[10px] text-slate-500">Click to review</p>
                          </div>
                        </div>
                      )}
                      {pendingFines > 0 && (
                        <div
                          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-rose-500/5 border border-rose-500/20 cursor-pointer hover:bg-rose-500/10"
                          onClick={() => { setActiveTab('disciplinary'); setShowBell(false); }}
                        >
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-rose-300">{pendingFines} Open Incident{pendingFines !== 1 ? 's' : ''}</p>
                            <p className="text-[10px] text-slate-500">Click to review</p>
                          </div>
                        </div>
                      )}
                      {totalAlerts === 0 && (
                        <p className="text-xs text-slate-500 text-center py-4">All clear</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-800">
              <img
                src={adminUser?.avatar}
                alt={adminUser?.name || 'Admin'}
                className="w-8 h-8 rounded-lg object-cover border border-slate-700"
              />
              <div className="hidden lg:block">
                <p className="text-[11px] font-semibold text-slate-200 truncate max-w-[100px]">{adminUser?.name}</p>
                <p className="text-[9px] text-slate-500">Admin</p>
              </div>
              <button
                onClick={goToHome}
                title="Sign Out"
                className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 pb-3 border-t border-slate-800/60 pt-2 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap
                  transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
                {tab.id === 'disciplinary' && pendingFines > 0 && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-700' : 'bg-rose-500/20 text-rose-400'}`}>
                    {pendingFines}
                  </span>
                )}
                {tab.id === 'hostel' && curfewAlerts > 0 && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-blue-700' : 'bg-amber-500/20 text-amber-400'}`}>
                    {curfewAlerts}
                  </span>
                )}
              </button>
            );
          })}

          {/* Curfew mode indicator */}
          {isCurfewTime && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-400 font-mono">CURFEW MODE</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}