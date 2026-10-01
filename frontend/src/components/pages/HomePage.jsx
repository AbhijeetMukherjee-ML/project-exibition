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
    <div className="min-h-screen bg-[#060b14] text-slate-100 font-sans">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#070d18]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070d18]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight">Sentinel AI</span>
              <p className="hidden sm:block text-[10px] text-slate-500 mt-0.5">
                Campus Intelligence System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-slate-300" />
              }
            </button>

            <button
              onClick={() => openLogin('admin')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Enter Console
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800/80">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono font-bold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI CAMERAS ONLINE
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
              AI-Powered
              <span className="text-blue-500"> Attendance </span>
              & Campus Safety.
            </h1>

            <p className="mt-6 max-w-xl text-sm sm:text-base leading-7 text-slate-400">
              Live camera feeds automatically mark classroom attendance, track hostel curfew check-in,
              and detect any indisciplinary activity — all powered by AI.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => openLogin('admin')}
                className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/10 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Admin Console
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openLogin('student')}
                className="px-5 py-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Student View
              </button>
            </div>
          </div>

          {/* STATUS */}
          <div className="mt-14 border border-slate-800 rounded-xl bg-[#0a111d]/90 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold">SYSTEM STATUS</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                OPERATIONAL
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800">
              <StatBox icon={Camera} label="CAMERAS" value="04" sub="CONNECTED" />
              <StatBox icon={ScanFace} label="AI ENGINE" value="ONLINE" sub="FACE DETECTION" />
              <StatBox icon={Users} label="STUDENTS" value={students.length} sub="REGISTERED" />
              <StatBox icon={AlertTriangle} label="ALERTS" value={activeAlerts + pendingFines} sub="REQUIRES ACTION" danger={activeAlerts + pendingFines > 0} />
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE FEATURES */}
      <section className="py-20 border-b border-slate-800/80 bg-[#080e18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="mb-12">
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400 mb-3">
              CORE FEATURES
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Three things. Done automatically.
            </h2>
            <p className="mt-3 text-sm text-slate-500 max-w-xl">
              Point a camera at a classroom or hostel gate — the AI handles the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
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
                <div key={i} className={`border border-slate-800 bg-[#0b1320] ${c.hover} transition rounded-xl p-6`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} border flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <span className={`text-[8px] font-mono font-bold px-2 py-1 rounded border ${c.tag}`}>
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-6">{f.desc}</p>

                  <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                    {f.points.map((pt, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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
      <section className="py-20 bg-[#080e18]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="mb-12 text-center">
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400 mb-3">ACCESS</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Choose your interface</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Admin */}
            <div className="border border-slate-800 bg-[#0b1320] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Admin Console</p>
                  <p className="text-[10px] text-slate-500 font-mono">WARDEN / ADMIN</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-6 mb-6">
                Monitor live camera feeds, review AI-detected attendance, check hostel curfew records and manage disciplinary incidents.
              </p>
              <button
                onClick={() => openLogin('admin')}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Lock className="w-3.5 h-3.5" />
                Open Admin Console
              </button>
              <button
                onClick={loginAsAdmin}
                className="mt-2 w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer transition"
              >
                Launch Demo
              </button>
            </div>

            {/* Student */}
            <div className="border border-slate-800 bg-[#0b1320] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Student Portal</p>
                  <p className="text-[10px] text-slate-500 font-mono">STUDENT</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-6 mb-6">
                View your personal attendance record, hostel entry history, and any disciplinary notices issued.
              </p>
              <button
                onClick={() => openLogin('student')}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Lock className="w-3.5 h-3.5" />
                Open Student Portal
              </button>
              <button
                onClick={() => loginAsStudent(students[0]?.id || 'STU-2026-001')}
                className="mt-2 w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer transition"
              >
                Launch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 bg-[#050a12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-slate-300">Sentinel AI</span>
          </div>
          <span className="text-[10px] text-slate-600 font-mono">
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
      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
        <Icon className={`w-3.5 h-3.5 ${danger ? 'text-rose-400' : 'text-blue-400'}`} />
        {label}
      </div>
      <div className={`mt-2 text-lg font-bold font-mono ${danger ? 'text-rose-400' : 'text-slate-100'}`}>
        {value}
      </div>
      <div className="text-[8px] text-slate-600 font-mono mt-1">{sub}</div>
    </div>
  );
}