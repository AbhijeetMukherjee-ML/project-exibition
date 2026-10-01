import React, { useState } from 'react';
import {
  Shield,
  Camera,
  ScanFace,
  Activity,
  AlertTriangle,
  Users,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  Radio,
  Siren,
  Moon,
  Sun,
  GraduationCap,
  ChevronRight,
  Cpu,
  Network,
  Fingerprint,
  FileWarning,
  QrCode
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import LoginModal from '../modals/LoginModal';

export default function HomePage() {
  const {
    loginAsAdmin,
    loginAsStudent,
    goToClassroom,
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
  const activeStudents = students.length;

  const modules = [
    {
      icon: Camera,
      title: 'Live CCTV Surveillance',
      tag: 'VIDEO ANALYTICS',
      description:
        'Monitor connected hostel cameras and security zones with continuous video surveillance and event detection.',
      points: [
        'Multi-camera monitoring',
        'Live surveillance feeds',
        'AI event detection'
      ]
    },
    {
      icon: ScanFace,
      title: 'AI Face Recognition',
      tag: 'BIOMETRIC AI',
      description:
        'Identify registered residents from camera feeds and associate detected faces with their institutional identity.',
      points: [
        'Face detection & matching',
        'Confidence scoring',
        'Resident identification'
      ]
    },
    {
      icon: Activity,
      title: 'Movement Intelligence',
      tag: 'EVENT ENGINE',
      description:
        'Automatically create structured entry and exit events from surveillance activity across monitored gates.',
      points: [
        'IN / OUT classification',
        'Timestamped events',
        'Gate-level tracking'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Security Alerts',
      tag: 'THREAT MONITORING',
      description:
        'Detect abnormal or policy-violating activity and surface high-priority events for administrators.',
      points: [
        'Curfew violations',
        'Unknown-person events',
        'Priority alerting'
      ]
    },
    {
      icon: Database,
      title: 'Central Event Database',
      tag: 'AUDIT TRAIL',
      description:
        'Maintain a searchable record of surveillance events, identities, timestamps, locations and actions.',
      points: [
        'Complete event history',
        'Search & filtering',
        'Exportable records'
      ]
    },
    {
      icon: Shield,
      title: 'Security Administration',
      tag: 'CONTROL CENTER',
      description:
        'Give authorized administrators a centralized interface to investigate events and manage resident security records.',
      points: [
        'Resident registry',
        'Incident investigation',
        'Administrative controls'
      ]
    }
  ];

  const workflow = [
    {
      number: '01',
      icon: Camera,
      title: 'Camera Detects',
      text: 'A connected CCTV camera continuously observes the monitored security zone.'
    },
    {
      number: '02',
      icon: ScanFace,
      title: 'AI Identifies',
      text: 'Computer vision detects a person and attempts to match them with registered residents.'
    },
    {
      number: '03',
      icon: Activity,
      title: 'Event Created',
      text: 'The system creates a timestamped movement event containing identity, gate and direction.'
    },
    {
      number: '04',
      icon: Siren,
      title: 'Security Action',
      text: 'Policy violations are surfaced as alerts for administrative review and action.'
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
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight">
                  Sentinel
                </span>

                <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-400">
                  AI SECURITY
                </span>
              </div>

              <p className="hidden sm:block text-[10px] text-slate-500">
                Intelligent Hostel Surveillance System
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-[11px] font-semibold text-slate-400">
            <a href="#surveillance" className="hover:text-blue-400 transition">
              Surveillance
            </a>
            <a href="#architecture" className="hover:text-blue-400 transition">
              Architecture
            </a>
            <a href="#access" className="hover:text-blue-400 transition">
              Access
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            <button
              onClick={() => openLogin('admin')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Security Console
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800/80">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_30px_8px_rgba(59,130,246,0.25)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono font-bold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SURVEILLANCE SYSTEM ONLINE
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02]">
              Intelligent
              <span className="text-blue-500"> CCTV Surveillance </span>
              for Smarter Hostels.
            </h1>

            <p className="mt-6 max-w-2xl text-sm sm:text-base leading-7 text-slate-400">
              A centralized security platform combining CCTV monitoring,
              computer vision, facial recognition, movement intelligence and
              automated incident detection into one operational console.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">

              <button
                onClick={() => openLogin('admin')}
                className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/10 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Open Security Console
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openLogin('student')}
                className="px-5 py-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Resident Portal
              </button>

              <button
                onClick={goToClassroom}
                className="px-5 py-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                Attendance
              </button>
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div className="mt-16 border border-slate-800 rounded-xl bg-[#0a111d]/90 overflow-hidden">

            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold">
                  SYSTEM STATUS
                </span>
              </div>

              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                OPERATIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-slate-800">

              <StatusBox
                icon={Camera}
                label="CAMERAS"
                value="04"
                sub="CONNECTED"
              />

              <StatusBox
                icon={ScanFace}
                label="AI ENGINE"
                value="ONLINE"
                sub="FACE DETECTION"
              />

              <StatusBox
                icon={Users}
                label="RESIDENTS"
                value={activeStudents}
                sub="REGISTERED"
              />

              <StatusBox
                icon={AlertTriangle}
                label="ALERTS"
                value={activeAlerts}
                sub="REQUIRES REVIEW"
                danger
              />

              <StatusBox
                icon={FileWarning}
                label="PENDING"
                value={pendingFines}
                sub="DISCIPLINARY"
              />

            </div>
          </div>
        </div>
      </section>

      {/* SURVEILLANCE */}
      <section
        id="surveillance"
        className="py-20 border-b border-slate-800/80 bg-[#080e18]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <SectionHeading
            eyebrow="CORE CAPABILITIES"
            title="A complete surveillance intelligence layer"
            description="Every camera event becomes structured security information that administrators can investigate and act upon."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">

            {modules.map((module, index) => {
              const Icon = module.icon;

              return (
                <div
                  key={index}
                  className="group border border-slate-800 bg-[#0b1320] hover:border-blue-500/40 transition rounded-xl p-5"
                >

                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>

                    <span className="text-[8px] font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">
                      {module.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-bold">
                    {module.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">

                    {module.points.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-slate-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {point}
                      </div>
                    ))}

                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section
        id="architecture"
        className="py-20 border-b border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <SectionHeading
            eyebrow="EVENT PIPELINE"
            title="From camera feed to security action"
            description="The surveillance pipeline converts raw video into actionable, auditable security events."
          />

          <div className="grid md:grid-cols-4 gap-4 mt-12">

            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="relative">

                  <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-5 h-full">

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black font-mono text-blue-500/50">
                        {item.number}
                      </span>

                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-sm font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.text}
                    </p>

                  </div>

                  {index < workflow.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 z-10" />
                  )}

                </div>
              );
            })}

          </div>

          {/* Architecture strip */}
          <div className="mt-8 border border-slate-800 rounded-xl bg-[#080e18] p-5">

            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono">

              <ArchitectureNode icon={Camera} text="CCTV CAMERA" />

              <ArrowRight className="w-4 h-4 text-slate-700" />

              <ArchitectureNode icon={Cpu} text="VISION ENGINE" />

              <ArrowRight className="w-4 h-4 text-slate-700" />

              <ArchitectureNode icon={Fingerprint} text="FACE MATCH" />

              <ArrowRight className="w-4 h-4 text-slate-700" />

              <ArchitectureNode icon={Database} text="EVENT DB" />

              <ArrowRight className="w-4 h-4 text-slate-700" />

              <ArchitectureNode icon={Shield} text="ADMIN CONSOLE" />

            </div>

          </div>
        </div>
      </section>

      {/* ACCESS */}
      <section id="access" className="py-20 bg-[#080e18]">

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <SectionHeading
            eyebrow="SECURE ACCESS"
            title="Choose your operational interface"
            description="Access the surveillance console or resident-facing services using authorized credentials."
          />

          <div className="grid md:grid-cols-2 gap-5 mt-12">

            <AccessCard
              icon={Shield}
              title="Security Operations Console"
              label="ADMIN / WARDEN"
              description="Monitor cameras, investigate events, review resident movement and manage security incidents."
              button="Open Security Console"
              color="blue"
              onClick={() => openLogin('admin')}
              demo={() => loginAsAdmin()}
            />

            <AccessCard
              icon={Users}
              title="Resident Portal"
              label="STUDENT"
              description="View personal movement records, compliance information and active disciplinary records."
              button="Open Resident Portal"
              color="emerald"
              onClick={() => openLogin('student')}
              demo={() => loginAsStudent(students[0]?.id || 'STU-2026-001')}
            />

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-7 bg-[#050a12]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-slate-300">
              Intelligent Hostel Surveillance System
            </span>
          </div>

          <span className="text-[10px] text-slate-600 font-mono">
            CCTV • COMPUTER VISION • ACCESS INTELLIGENCE
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

function StatusBox({ icon: Icon, label, value, sub, danger }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
        <Icon className={`w-3.5 h-3.5 ${danger ? 'text-rose-400' : 'text-blue-400'}`} />
        {label}
      </div>

      <div className={`mt-2 text-lg font-bold font-mono ${
        danger ? 'text-rose-400' : 'text-slate-100'
      }`}>
        {value}
      </div>

      <div className="text-[8px] text-slate-600 font-mono mt-1">
        {sub}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400">
        {eyebrow}
      </div>

      <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ArchitectureNode({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-800 bg-slate-900/70 text-slate-400">
      <Icon className="w-3.5 h-3.5 text-blue-400" />
      {text}
    </div>
  );
}

function AccessCard({
  icon: Icon,
  title,
  label,
  description,
  button,
  color,
  onClick,
  demo
}) {
  const blue = color === 'blue';

  return (
    <div className="border border-slate-800 bg-[#0b1320] rounded-xl p-6">

      <div className="flex items-center justify-between">

        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
          blue
            ? 'bg-blue-500/10 text-blue-400'
            : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>

        <span className="text-[9px] font-mono px-2 py-1 border border-slate-800 rounded text-slate-500">
          {label}
        </span>

      </div>

      <h3 className="mt-5 text-base font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs text-slate-500 leading-6">
        {description}
      </p>

      <button
        onClick={onClick}
        className={`mt-6 w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
          blue
            ? 'bg-blue-600 hover:bg-blue-500'
            : 'bg-emerald-600 hover:bg-emerald-500'
        }`}
      >
        <Lock className="w-3.5 h-3.5" />
        {button}
      </button>

      <button
        onClick={demo}
        className="mt-2 w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
      >
        Launch Demo Environment
      </button>

    </div>
  );
}