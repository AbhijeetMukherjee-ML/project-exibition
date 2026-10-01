import React from 'react';
import {
  LayoutDashboard,
  Database,
  Cctv,
  History,
  Gavel,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  Activity,
  Users,
  AlertTriangle,
  Circle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, students, logs, fines } = useApp();

  const pendingFines = fines.filter(
    (f) => f.status !== 'Served / Paid'
  ).length;

  const curfewViolationsToday = logs.filter(
    (l) => l.curfewAlert
  ).length;

  const navItems = [
    {
      id: 'home',
      label: 'Overview',
      description: 'System dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'database',
      label: 'Student Registry',
      description: 'Resident profiles',
      icon: Database,
      badge: students.length,
      badgeLabel: 'students',
    },
    {
      id: 'camera',
      label: 'Live Surveillance',
      description: 'AI camera monitoring',
      icon: Cctv,
      live: true,
    },
    {
      id: 'logs',
      label: 'Entry & Exit Logs',
      description: 'Movement & curfew',
      icon: History,
      badge: curfewViolationsToday,
      badgeLabel: 'alerts',
      alert: curfewViolationsToday > 0,
    },
    {
      id: 'fines',
      label: 'Discipline & Fines',
      description: 'Violations & payments',
      icon: Gavel,
      badge: pendingFines,
      badgeLabel: 'pending',
      alert: pendingFines > 0,
    },
  ];

  return (
    <aside className="w-full lg:w-[260px] xl:w-[280px] bg-slate-950 border-r border-slate-800/80 flex-shrink-0 flex flex-col">

      {/* ───────────────── BRAND / SYSTEM HEADER ───────────────── */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              Hostel Security
            </p>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-400 font-medium">
                SYSTEM OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── NAVIGATION ───────────────── */}
      <div className="px-3 flex-1 overflow-y-auto">

        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Control Center
          </p>

          <Activity className="w-3.5 h-3.5 text-slate-600" />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  group relative w-full flex items-center gap-3
                  px-3 py-2.5 rounded-xl text-left
                  transition-all duration-200 cursor-pointer
                  border
                  ${
                    isActive
                      ? 'bg-indigo-500/10 border-indigo-500/25 shadow-lg shadow-indigo-950/20'
                      : 'bg-transparent border-transparent hover:bg-slate-900 hover:border-slate-800'
                  }
                `}
              >

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-indigo-500" />
                )}

                {/* Icon */}
                <div
                  className={`
                    w-9 h-9 rounded-lg flex items-center justify-center
                    flex-shrink-0 transition-all duration-200
                    ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900 text-slate-500 group-hover:bg-slate-800 group-hover:text-indigo-400'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`
                        text-xs font-semibold truncate
                        ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-300 group-hover:text-white'
                        }
                      `}
                    >
                      {item.label}
                    </p>

                    {item.live && (
                      <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-400 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>

                {/* Badge */}
                {typeof item.badge === 'number' && (
                  <span
                    className={`
                      min-w-[24px] h-5 px-1.5 rounded-md
                      flex items-center justify-center
                      text-[9px] font-bold font-mono
                      border
                      ${
                        item.alert
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Arrow */}
                <ChevronRight
                  className={`
                    w-3.5 h-3.5 flex-shrink-0 transition-all
                    ${
                      isActive
                        ? 'text-indigo-400 translate-x-0'
                        : 'text-slate-700 group-hover:text-slate-500 -translate-x-1 group-hover:translate-x-0'
                    }
                  `}
                />
              </button>
            );
          })}
        </nav>

        {/* ───────────────── QUICK STATUS ───────────────── */}
        <div className="mt-6 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 px-2 mb-2">
            System Status
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">

            {/* AI Engine */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-200">
                      AI Surveillance
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Recognition Engine
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                  <Circle className="w-1.5 h-1.5 fill-current" />
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-2">
                  <p className="text-[9px] text-slate-500">
                    Latency
                  </p>
                  <p className="text-[11px] font-mono font-semibold text-slate-300 mt-0.5">
                    18ms
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-2">
                  <p className="text-[9px] text-slate-500">
                    Uptime
                  </p>
                  <p className="text-[11px] font-mono font-semibold text-emerald-400 mt-0.5">
                    99.98%
                  </p>
                </div>
              </div>
            </div>

            {/* Nodes */}
            <div className="px-3 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cctv className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-400">
                  Surveillance Nodes
                </span>
              </div>

              <span className="text-[10px] font-mono font-semibold text-slate-300">
                4 / 4
              </span>
            </div>

            {/* Students */}
            <div className="px-3 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-400">
                  Registered Residents
                </span>
              </div>

              <span className="text-[10px] font-mono font-semibold text-slate-300">
                {students.length}
              </span>
            </div>
          </div>
        </div>

        {/* ───────────────── ALERT SUMMARY ───────────────── */}
        {(pendingFines > 0 || curfewViolationsToday > 0) && (
          <div className="mt-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-amber-300">
                  Attention Required
                </p>

                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">
                  {pendingFines > 0 &&
                    `${pendingFines} unpaid fine${pendingFines !== 1 ? 's' : ''}`}
                  {pendingFines > 0 && curfewViolationsToday > 0 && ' • '}
                  {curfewViolationsToday > 0 &&
                    `${curfewViolationsToday} curfew alert${curfewViolationsToday !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <div className="p-3 mt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <Info className="w-3 h-3 text-slate-600" />
            <span className="text-[9px] text-slate-500">
              Administrative Access
            </span>
          </div>

          <span className="text-[8px] font-mono text-indigo-400/70 tracking-wider">
            SECURE
          </span>
        </div>
      </div>
    </aside>
  );
}