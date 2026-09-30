import React, { useState } from 'react';
import { 
  Building2, 
  Video, 
  History, 
  Scale, 
  QrCode, 
  ShieldCheck, 
  Users, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Eye, 
  AlertTriangle, 
  ChevronRight,
  Sun,
  Moon,
  Smartphone,
  Sparkles,
  Database,
  GraduationCap
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

  const pendingFines = fines.filter(f => f.status !== "Served / Paid").length;
  const curfewAlerts = logs.filter(l => l.curfewAlert).length;

  const coreFeatures = [
    {
      icon: Video,
      title: "Real-Time CCTV & Facial AI Detection",
      badge: "Vision AI",
      color: "blue",
      description: "Connects to campus CCTV turnstile feeds and live webcams. Employs deep facial recognition with high-speed bounding boxes, real-time confidence scores, and night-vision enhancement.",
      bullets: [
        "Sub-second biometric facial matching (99.4% accuracy)",
        "Support for live device webcams & multi-channel CCTV",
        "Visual HUD bounding box with night vision mode"
      ]
    },
    {
      icon: History,
      title: "Hostel Entry & Exit Automation",
      badge: "Curfew Engine",
      color: "amber",
      description: "Logs every student's ingress and egress with precision timestamps. Features an intelligent curfew rule engine that automatically detects and flags returns past 10:00 PM.",
      bullets: [
        "Automatic IN / OUT direction detection",
        "Instant curfew breach tagging and alerts",
        "Searchable logs with one-click CSV export"
      ]
    },
    {
      icon: Scale,
      title: "Fine & Disciplinary Action Ledger",
      badge: "Enforcement",
      color: "rose",
      description: "Administrative console to issue structured disciplinary notices, levy fines for late arrivals, and instantly generate SMS/Email notices to send to parents or guardians.",
      bullets: [
        "Curfew, security & unauthorized absence fines",
        "Automated Guardian SMS/Email notification templates",
        "Instant Served / Unserved fine status toggle"
      ]
    },
    {
      icon: QrCode,
      title: "UPI QR Code Fine Settlement",
      badge: "Instant Sync",
      color: "emerald",
      description: "Students can settle disciplinary fines directly on their dashboard via dynamic UPI QR codes. Payment instantly updates the central admin records without manual paperwork.",
      bullets: [
        "Dynamic UPI QR code generation (Google Pay, PhonePe, Paytm)",
        "Instant payment simulation with downloadable receipt",
        "Auto-syncs 'Paid / Served' status to the Admin ledger"
      ]
    },
    {
      icon: Smartphone,
      title: "Dedicated Student Self-Service Portal",
      badge: "Resident View",
      color: "indigo",
      description: "A secure, student-facing view allowing residents to inspect their own movement history, verify curfew compliance, and view their disciplinary record independently.",
      bullets: [
        "Personalized movement timestamps and entry gates",
        "Clear status breakdown of active and settled citations",
        "No administrative queue needed for fine verification"
      ]
    },
    {
      icon: Database,
      title: "Centralized Student & Hostel Registry",
      badge: "Directory",
      color: "teal",
      description: "Comprehensive student directory with room allocations (Block & Floor), contact data, emergency guardian numbers, and live on-campus presence indicators.",
      bullets: [
        "Complete resident profile and biometric status",
        "Quick search by name, roll number, room, or branch",
        "Add, edit, or remove resident records dynamically"
      ]
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Gate Face Capture",
      desc: "Student approaches the turnstile camera; biometric model matches facial embeddings in <500ms."
    },
    {
      step: "02",
      title: "Curfew Verification",
      desc: "System verifies timestamp against hostel rules (10:00 PM curfew) and logs movement record."
    },
    {
      step: "03",
      title: "Automated Notice",
      desc: "If curfew is breached, a fine notice is logged and an automated SMS alert is ready for guardians."
    },
    {
      step: "04",
      title: "UPI QR Settlement",
      desc: "Student opens their portal, scans the UPI QR code to pay, and the status clears in real-time."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* ================= PUBLIC NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Hostel Surveillance & Access
                <span className="hidden sm:inline text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                  AI v2.6
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Institutional Campus Security & Resident Management Platform
              </p>
            </div>
          </div>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300 mr-2">
              <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                How It Works
              </a>
              <a href="#portals" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Portal Access
              </a>
            </nav>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Login / Access Button */}
            <button
              onClick={() => openLogin('admin')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login / Access</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/50 dark:from-slate-900/60 dark:via-[#0b0f19] dark:to-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* System Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Next-Gen Smart Campus Security & Curfew Automation</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Institutional Hostel Surveillance, AI Biometrics & Automated Access
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A comprehensive system integrating real-time facial recognition at turnstiles, 
              automated ingress/egress logs, late-night curfew enforcement, and instant UPI QR fine settlements.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => openLogin('admin')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Management Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openLogin('student')}
                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Student Resident Portal</span>
              </button>

              <button
                onClick={goToClassroom}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Classroom Attendance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Operational Metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Video className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">CCTV Feeds</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">4 Channels</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Turnstiles & Main Gate</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">AI Accuracy</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">99.4% Match</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sub-second Latency</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Curfew Rule</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">10:00 PM</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Automated Tagging</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">UPI Clearance</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">Instant Sync</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Zero Bureaucracy</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES EXPLANATION SECTION ================= */}
      <section id="features" className="py-16 sm:py-20 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">
              Comprehensive Feature Suite
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for Precision, Safety & Seamless Hostel Operations
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Explore how each integrated module eliminates security blindspots and automates administrative workloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-50/80 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
                    {feat.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[11px] leading-tight">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= WORKFLOW SECTION ================= */}
      <section id="workflow" className="py-16 sm:py-20 bg-slate-50 dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
              System Architecture & Flow
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Automated Surveillance & UPI Settlement Works
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              From the moment a resident steps before the turnstile to instant disciplinary clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                    {step.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= PORTAL ACCESS & LOGIN SECTION ================= */}
      <section id="portals" className="py-16 sm:py-20 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
              Direct Portal Access
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Choose Your Access Level to Proceed
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sign in with your institutional credentials or launch in interactive demo mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Admin Console Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    WARDEN / ADMIN
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Management Console</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Full oversight of student registry, live CCTV feeds, turnstile movement ledgers, and automated disciplinary management.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Live 4-Channel CCTV feed with AI overlay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Real-time Ingress & Egress movement tracker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>Fine issuance & Guardian notification system</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openLogin('admin')}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Console</span>
                </button>
                <button
                  onClick={() => loginAsAdmin()}
                  className="w-full py-2 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ⚡ Direct Admin Demo Launch
                </button>
              </div>
            </div>

            {/* Student Resident Portal Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    RESIDENT / STUDENT
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Student Resident Portal</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Personalized dashboard for hostel residents to view their entry/exit logs, track curfew status, and pay fines via UPI QR.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Personalized gate entry & exit log history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Curfew compliance and penalty ledger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Instant UPI QR code fine payment & clearance</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openLogin('student')}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Student</span>
                </button>
                <button
                  onClick={() => loginAsStudent(students[0]?.id || 'STU-2026-001')}
                  className="w-full py-2 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ⚡ Direct Student Demo Launch
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto py-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Hostel Surveillance & Automated Access Management System
            </span>
          </div>
          <p className="text-[11px]">
            Institutional Project Exhibition Edition • Powered by React & Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        initialRole={loginModalInitialRole}
      />

    </div>
  );
}
