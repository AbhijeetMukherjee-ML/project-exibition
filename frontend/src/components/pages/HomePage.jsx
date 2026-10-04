import React, { useState } from 'react';
import {
  Shield,
  Camera,
  ScanFace,
  AlertTriangle,
  Users,
  Lock,
  ArrowRight,
  GraduationCap,
  Building2,
  Moon,
  Sun,
  CheckCircle2,
  Activity,
  Clock3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LoginModal from '../modals/LoginModal';

export default function HomePage() {
  const {
    loginAsAdmin,
    loginAsStudent,
    students,
    logs,
    fines,
    theme,
    toggleTheme
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialRole, setLoginModalInitialRole] = useState('admin');

  const openLogin = (role = 'admin') => {
    setLoginModalInitialRole(role);
    setIsLoginModalOpen(true);
  };

  const activeAlerts = logs.filter(l => l.curfewAlert).length;
  const pendingFines = fines.filter(f => f.status !== 'Served / Paid').length;
  const presentCount = students.filter(s => s.present).length;

  const features = [
    {
      icon: ScanFace,
      color: 'blue',
      tag: 'CLASSROOM',
      title: 'Classroom Attendance',
      desc: 'AI camera automatically identifies students from live feed and marks attendance when class is in session.',
      points: ['Live face recognition', 'Auto attendance marking', 'Real-time present count']
    },
    {
      icon: Building2,
      color: 'violet',
      tag: 'HOSTEL',
      title: 'Hostel Curfew Check',
      desc: 'After curfew time, the hostel gate camera tracks who enters and logs hostel attendance automatically.',
      points: ['After-hours monitoring', 'Gate entry / exit logging', 'Curfew violation alerts']
    },
    {
      icon: AlertTriangle,
      color: 'rose',
      tag: 'DISCIPLINE',
      title: 'Indiscipline Detection',
      desc: 'AI detects abnormal or policy-violating behaviour from camera feeds and flags incidents for admin review.',
      points: ['Behaviour analysis', 'Instant admin alerts', 'Evidence logging']
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans min-h-screen text-slate-900 dark:text-white">

      {/* NAVBAR */}
      <header className="bg-white/90 dark:bg-[#070d18]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex gap-3 items-center">
            <div className="bg-blue-600 flex h-9 items-center justify-center relative rounded-lg w-9">
              <Shield className="dark:text-white h-5 text-slate-900 w-5" />
              <span className="-right-1 -top-1 absolute bg-emerald-400 border-2 border-[#070d18] h-2.5 rounded-full w-2.5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight">Sentinel AI</span>
              <p className="dark:text-slate-400 hidden mt-0.5 sm:block text-[10px] text-slate-500">
                Campus Intelligence System
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={toggleTheme}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition"
            >
              {theme === 'dark'
                ? <Sun className="h-4 text-amber-400 w-4" />
                : <Moon className="dark:text-slate-300 h-4 text-slate-700 w-4" />
              }
            </button>

            <button
              onClick={() => openLogin('admin')}
              className="bg-blue-600 cursor-pointer flex font-semibold gap-2 hover:bg-blue-500 items-center px-3.5 py-2 rounded-lg text-xs transition"
            >
              <Lock className="h-3.5 w-3.5" />
              Enter Console
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-slate-50 dark:bg-[#080e18] border-b border-slate-200 dark:border-slate-800/80 overflow-hidden relative">

        <div className="absolute inset-0 pointer-events-none">
          <div className="-translate-x-1/2 absolute bg-blue-600/10 blur-[120px] h-[400px] left-1/2 top-0 w-[700px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative sm:px-6 sm:py-28">
          <div className="max-w-3xl">

            <div className="bg-emerald-500/5 border border-emerald-500/20 font-bold font-mono gap-2 inline-flex items-center mb-7 px-3 py-1.5 rounded-md text-[10px] text-emerald-400">
              <span className="animate-pulse bg-emerald-400 h-1.5 rounded-full w-1.5" />
              AI CAMERAS ONLINE
            </div>

            <h1 className="font-black leading-[1.05] sm:text-6xl text-4xl tracking-tight">
              AI-Powered
              <span className="text-blue-500"> Attendance </span>
              & Campus Safety.
            </h1>

            <p className="leading-7 max-w-xl mt-6 sm:text-base text-slate-400 text-sm">
              Live camera feeds automatically mark classroom attendance, track hostel curfew check-in,
              and detect any indisciplinary activity — all powered by AI.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => openLogin('admin')}
                className="bg-blue-600 cursor-pointer flex font-semibold gap-2 hover:bg-blue-500 items-center px-5 py-3 rounded-lg shadow-blue-600/10 shadow-lg text-sm transition"
              >
                <Shield className="h-4 w-4" />
                Admin Console
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => openLogin('student')}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 cursor-pointer flex font-semibold gap-2 hover:bg-slate-800 items-center px-5 py-3 rounded-lg text-slate-200 text-sm transition"
              >
                <Users className="h-4 w-4" />
                Student View
              </button>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-14 overflow-hidden rounded-xl">
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
              <div className="flex gap-2 items-center">
                <Activity className="h-4 text-blue-400 w-4" />
                <span className="font-semibold text-xs">SYSTEM STATUS</span>
              </div>
              <span className="flex font-mono gap-1.5 items-center text-[9px] text-emerald-400">
                <span className="animate-pulse bg-emerald-400 h-1.5 rounded-full w-1.5" />
                OPERATIONAL
              </span>
            </div>
            <div className="divide-slate-800 divide-x divide-y grid grid-cols-2 md:divide-y-0 md:grid-cols-4">
              <StatBox icon={Camera} label="CAMERAS" value="04" sub="CONNECTED" />
              <StatBox icon={ScanFace} label="AI ENGINE" value="ONLINE" sub="FACE DETECTION" />
              <StatBox icon={Users} label="STUDENTS" value={students.length} sub="REGISTERED" />
              <StatBox icon={AlertTriangle} label="ALERTS" value={activeAlerts + pendingFines} sub="REQUIRES ACTION" danger={activeAlerts + pendingFines > 0} />
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE FEATURES */}
      <section className="bg-slate-50 dark:bg-[#080e18] border-b border-slate-200 dark:border-slate-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="mb-12">
            <p className="font-bold font-mono mb-3 text-[10px] text-blue-400 tracking-[0.2em]">
              CORE FEATURES
            </p>
            <h2 className="font-black sm:text-3xl text-2xl tracking-tight">
              Three things. Done automatically.
            </h2>
            <p className="dark:text-slate-400 max-w-xl mt-3 text-slate-500 text-sm">
              Point a camera at a classroom or hostel gate — the AI handles the rest.
            </p>
          </div>

          <div className="gap-5 grid md:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              const colorMap = {
                blue: {
                  bg: 'bg-blue-500/10 border-blue-500/20',
                  icon: 'text-blue-400',
                  tag: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
                  hover: 'hover:border-blue-500/40'
                },
                violet: {
                  bg: 'bg-violet-500/10 border-violet-500/20',
                  icon: 'text-violet-400',
                  tag: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
                  hover: 'hover:border-violet-500/40'
                },
                rose: {
                  bg: 'bg-rose-500/10 border-rose-500/20',
                  icon: 'text-rose-400',
                  tag: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
                  hover: 'hover:border-rose-500/40'
                }
              };
              const c = colorMap[f.color];

              return (
                <div key={i} className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${c.hover} transition rounded-xl p-6`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} border flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <span className={`text-[8px] font-mono font-bold px-2 py-1 rounded border ${c.tag}`}>
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="font-bold mb-2 text-base">{f.title}</h3>
                  <p className="dark:text-slate-400 leading-6 text-slate-500 text-xs">{f.desc}</p>

                  <div className="border-slate-200 dark:border-slate-800 border-t mt-5 pt-4 space-y-2">
                    {f.points.map((pt, j) => (
                      <div key={j} className="flex gap-2 items-center text-[11px] text-slate-400">
                        <CheckCircle2 className="h-3.5 shrink-0 text-emerald-500 w-3.5" />
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACCESS */}
      <section className="bg-slate-50 dark:bg-[#080e18] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="mb-12 text-center">
            <p className="font-bold font-mono mb-3 text-[10px] text-blue-400 tracking-[0.2em]">ACCESS</p>
            <h2 className="font-black sm:text-3xl text-2xl tracking-tight">Choose your interface</h2>
          </div>

          <div className="gap-5 grid md:grid-cols-2">
            {/* Admin */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
              <div className="flex gap-3 items-center mb-5">
                <div className="bg-blue-500/10 border border-blue-500/20 flex h-11 items-center justify-center rounded-xl w-11">
                  <Shield className="h-5 text-blue-400 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Admin Console</p>
                  <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">WARDEN / ADMIN</p>
                </div>
              </div>
              <p className="dark:text-slate-400 leading-6 mb-6 text-slate-500 text-xs">
                Monitor live camera feeds, review AI-detected attendance, check hostel curfew records and manage disciplinary incidents.
              </p>
              <button
                onClick={() => openLogin('admin')}
                className="bg-blue-600 cursor-pointer flex font-semibold gap-2 hover:bg-blue-500 items-center justify-center py-2.5 rounded-lg text-xs transition w-full"
              >
                <Lock className="h-3.5 w-3.5" />
                Open Admin Console
              </button>
              <button
                onClick={loginAsAdmin}
                className="bg-white dark:bg-slate-900 cursor-pointer dark:text-slate-400 hover:bg-slate-800 hover:text-slate-300 mt-2 py-2 rounded-lg text-[10px] text-slate-500 transition w-full"
              >
                Launch Demo
              </button>
            </div>

            {/* Student */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
              <div className="flex gap-3 items-center mb-5">
                <div className="bg-emerald-500/10 border border-emerald-500/20 flex h-11 items-center justify-center rounded-xl w-11">
                  <GraduationCap className="h-5 text-emerald-400 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Student Portal</p>
                  <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">STUDENT</p>
                </div>
              </div>
              <p className="dark:text-slate-400 leading-6 mb-6 text-slate-500 text-xs">
                View your personal attendance record, hostel entry history, and any disciplinary notices issued.
              </p>
              <button
                onClick={() => openLogin('student')}
                className="bg-emerald-600 cursor-pointer flex font-semibold gap-2 hover:bg-emerald-500 items-center justify-center py-2.5 rounded-lg text-xs transition w-full"
              >
                <Lock className="h-3.5 w-3.5" />
                Open Student Portal
              </button>
              <button
                onClick={() => loginAsStudent(students[0]?.id || 'STU-2026-001')}
                className="bg-white dark:bg-slate-900 cursor-pointer dark:text-slate-400 hover:bg-slate-800 hover:text-slate-300 mt-2 py-2 rounded-lg text-[10px] text-slate-500 transition w-full"
              >
                Launch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-t py-6">
        <div className="flex flex-col gap-3 items-center justify-between max-w-7xl mx-auto px-4 sm:flex-row sm:px-6">
          <div className="flex gap-2 items-center">
            <Shield className="h-4 text-blue-500 w-4" />
            <span className="font-semibold text-slate-300 text-xs">Sentinel AI</span>
          </div>
          <span className="dark:text-slate-400 font-mono text-[10px] text-slate-600">
            CLASSROOM ATTENDANCE • HOSTEL CURFEW • DISCIPLINARY AI
          </span>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialRole={loginModalInitialRole}
      />
    </div>
  );
}

function StatBox({ icon: Icon, label, value, sub, danger }) {
  return (
    <div className="p-4">
      <div className="dark:text-slate-400 flex font-mono gap-2 items-center text-[9px] text-slate-500">
        <Icon className={`w-3.5 h-3.5 ${danger ? 'text-rose-400' : 'text-blue-400'}`} />
        {label}
      </div>
      <div className={`mt-2 text-lg font-bold font-mono ${danger ? 'text-rose-400' : 'text-slate-100'}`}>
        {value}
      </div>
      <div className="dark:text-slate-400 font-mono mt-1 text-[8px] text-slate-600">{sub}</div>
    </div>
  );
}