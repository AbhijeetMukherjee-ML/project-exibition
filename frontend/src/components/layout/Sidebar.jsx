import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Cctv, 
  History, 
  Gavel, 
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, students, logs, fines } = useApp();

  const pendingFines = fines.filter(f => f.status !== "Served / Paid").length;
  const curfewViolationsToday = logs.filter(l => l.curfewAlert).length;

  const navItems = [
    {
      id: 'home',
      name: 'System Overview & Features',
      shortName: 'Home',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Architecture & Capabilities'
    },
    {
      id: 'database',
      name: 'Student Database Registry',
      shortName: 'Database',
      icon: Database,
      badge: `${students.length} Enrolled`,
      desc: 'Resident Records & Profiles'
    },
    {
      id: 'camera',
      name: 'Live CCTV Camera Feed',
      shortName: 'Camera Live',
      icon: Cctv,
      badge: 'LIVE AI',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      desc: 'Realtime Face Recognition'
    },
    {
      id: 'logs',
      name: 'Hostel Entry & Exit Logs',
      shortName: 'In / Out Logs',
      icon: History,
      badge: curfewViolationsToday > 0 ? `${curfewViolationsToday} Alerts` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      desc: 'Movement & Curfew Audits'
    },
    {
      id: 'fines',
      name: 'Fines & Disciplinary Actions',
      shortName: 'Disciplinary & Fines',
      icon: Gavel,
      badge: pendingFines > 0 ? `${pendingFines} Pending` : 'All Clear',
      badgeColor: pendingFines > 0 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      desc: 'Infraction & Served Status'
    },
  ];

  return (
    <aside className="w-full lg:w-64 xl:w-72 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* Navigation Label */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Admin Navigation Modules
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-500/10 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800/80 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-white font-bold' : 'text-slate-300'}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap font-semibold ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Summary Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-900/40 text-slate-300 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Surveillance Engine
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20">
              v4.8 Ready
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Multi-factor facial geometry and RFID cross-referencing active across 4 gate nodes.
          </div>
          <div className="pt-2 border-t border-indigo-900/30 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Latency: 18ms</span>
            <span className="text-emerald-400 font-medium">Uptime: 99.98%</span>
          </div>
        </div>
      </div>

      {/* Admin Disclaimer Footer */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          Admin Access Only
        </span>
        <span className="font-mono text-[10px] text-indigo-400/80">SECURE PORTAL</span>
      </div>
    </aside>
  );
}
