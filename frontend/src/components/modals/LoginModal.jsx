import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Lock,
  KeyRound,
  ArrowRight,
  Building2,
  GraduationCap,
  Fingerprint,
  Shield,
  CheckCircle2,
  Eye,
  EyeOff,
  UserRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginModal({
  isOpen,
  onClose,
  initialRole = 'admin'
}) {
  const {
    students,
    loginAsAdmin,
    loginAsStudent,
    showToast
  } = useApp();

  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [adminEmail, setAdminEmail] = useState('admin@hostel.edu');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id || 'STU-2026-001'
  );

  const [studentPin, setStudentPin] = useState('1234');

  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showStudentPin, setShowStudentPin] = useState(false);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId
  );

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      loginAsAdmin();
      setLoading(false);
      onClose();

      showToast(
        'Access Granted',
        'Logged in as Chief Hostel Administrator',
        'success'
      );
    }, 500);
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      loginAsStudent(selectedStudentId);
      setLoading(false);
      onClose();

      showToast(
        'Student Authenticated',
        `Welcome back, ${selectedStudent?.name || 'Student'}`,
        'success'
      );
    }, 500);
  };

  const switchRole = (role) => {
    if (loading) return;
    setSelectedRole(role);
  };

  return (
    <div
      className="animate-in backdrop-blur-md bg-slate-950/75 duration-200 fade-in fixed flex inset-0 items-center justify-center p-4 z-50"
      onClick={onClose}
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-950 duration-200 fade-in flex flex-col max-w-[1400px] md:flex-row min-h-[750px] overflow-hidden relative rounded-2xl shadow-2xl w-full z-10 zoom-in-95"
      >
        {/* ================= LEFT INFO PANEL (60%) ================= */}
        <div className="bg-slate-50 border-r border-slate-200 dark:border-slate-800 dark:bg-slate-900 flex-col hidden justify-between md:flex md:w-[60%] p-16 w-full">
          <div>
            <div className="flex gap-3 items-center mb-8">
              <div className="bg-blue-600 flex h-16 items-center justify-center rounded-2xl shadow-blue-600/20 shadow-lg w-16">
                <ShieldCheck className="dark:text-white h-8 text-slate-900 w-8" />
              </div>
              <div>
                <h1 className="dark:text-white font-black text-3xl text-slate-900 tracking-tight">Sentinel AI</h1>
                <p className="dark:text-slate-400 font-mono mt-1 text-slate-500 text-sm tracking-wider">SECURE ACCESS GATEWAY</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-950 p-8 rounded-xl shadow-sm">
                <div className="flex gap-3 items-center mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 flex h-12 items-center justify-center rounded-xl text-blue-600 w-12">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="dark:text-white font-bold text-slate-900 text-xl">Administrator Access</h3>
                </div>
                <p className="dark:text-slate-400 leading-relaxed ml-16 mt-2 text-base text-slate-500">
                  Full command over the Smart Hostel ecosystem. View live AI camera feeds, manage student registries, monitor real-time classroom attendance, issue disciplinary notices, and override curfew violations. Intended only for Wardens, Proctors, and System Admins.
                </p>
              </div>

              <div className="bg-white border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-950 p-8 rounded-xl shadow-sm">
                <div className="flex gap-3 items-center mb-2">
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 flex h-12 items-center justify-center rounded-xl text-emerald-600 w-12">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="dark:text-white font-bold text-slate-900 text-xl">Student Access</h3>
                </div>
                <p className="dark:text-slate-400 leading-relaxed ml-16 mt-2 text-base text-slate-500">
                  Personalized dashboard for residents. Check your daily classroom attendance percentages, review your hostel entry/exit logs recorded by the AI gates, and track any outstanding disciplinary fines or curfew alerts issued against your profile.
                </p>
              </div>
            </div>
          </div>
          
          <div className="dark:text-slate-400 flex font-mono gap-3 items-center mt-12 text-slate-500 text-sm">
            <Lock className="h-3 w-3" />
            End-to-End Encrypted Verification
          </div>
        </div>

        {/* ================= RIGHT LOGIN FORM (40%) ================= */}
        <div className="flex flex-col md:w-[40%] relative w-full">


        {/* ================= TOP BRAND STRIP ================= */}
        <div className="bg-gradient-to-r from-blue-600 h-1 to-emerald-500 via-indigo-500" />

        {/* ================= HEADER ================= */}
        <div className="pb-5 pt-6 px-6">

          <div className="flex items-start justify-between">

            <div className="flex gap-3.5 items-center">

              <div className="relative">
                <div className="bg-white dark:bg-white flex h-11 items-center justify-center rounded-xl shadow-lg w-11">
                  <ShieldCheck className="dark:text-white h-5 text-slate-900 w-5" />
                </div>

                <span className="-bottom-1 -right-1 absolute bg-emerald-500 border-2 border-white dark:border-slate-950 h-4 rounded-full w-4" />
              </div>

              <div>
                <div className="flex gap-2 items-center">
                  <h2 className="dark:text-white font-bold text-lg text-slate-900">
                    Secure Portal Access
                  </h2>

                  <span className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400 font-bold gap-1 hidden items-center px-2 py-0.5 rounded-full sm:inline-flex text-[9px] text-emerald-600 tracking-wider uppercase">
                    <span className="bg-emerald-500 h-1.5 rounded-full w-1.5" />
                    Secure
                  </span>
                </div>

                <p className="dark:text-slate-400 mt-1 text-slate-500 text-sm">
                  Hostel Intelligence & Management System
                </p>
              </div>

            </div>

            <button
              onClick={onClose}
              className="cursor-pointer dark:hover:bg-slate-800 dark:hover:text-white flex h-12 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 items-center justify-center rounded-xl text-slate-500 transition-colors w-12"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        </div>

        {/* ================= ROLE SELECTOR ================= */}
        <div className="px-6">

          <div className="bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 gap-2 grid grid-cols-2 p-1.5 rounded-xl">

            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`relative flex items-center justify-center gap-2.5 py-3 rounded-lg text-base font-bold transition-all cursor-pointer ${ selectedRole === 'admin' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200' }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Console

              {selectedRole === 'admin' && (
                <span className="absolute bg-blue-500 h-1.5 right-1.5 rounded-full top-1.5 w-1.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => switchRole('student')}
              className={`relative flex items-center justify-center gap-2.5 py-3 rounded-lg text-base font-bold transition-all cursor-pointer ${ selectedRole === 'student' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200' }`}
            >
              <GraduationCap className="h-6 w-6" />
              Student Portal

              {selectedRole === 'student' && (
                <span className="absolute bg-emerald-500 h-1.5 right-1.5 rounded-full top-1.5 w-1.5" />
              )}
            </button>

          </div>

        </div>

        {/* ================= FORM AREA ================= */}
        <div className="pb-6 pt-5 px-6">

          {selectedRole === 'admin' ? (

            /* ===================================================
               ADMIN LOGIN
            =================================================== */
            <form
              onSubmit={handleAdminSubmit}
              className="space-y-6"
            >

              {/* Access Information */}
              <div className="bg-blue-50/70 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50 p-4 rounded-xl">

                <div className="flex gap-3">

                  <div className="bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 flex flex-shrink-0 h-9 items-center justify-center rounded-lg text-blue-600 w-9">
                    <Building2 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="dark:text-blue-300 font-bold text-base text-blue-900">
                      Administrator Authorization
                    </p>

                    <p className="dark:text-blue-400 leading-relaxed mt-1 text-blue-700 text-sm">
                      Authorized personnel can access surveillance,
                      biometric verification, resident records, movement
                      logs and disciplinary controls.
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="bg-white border border-blue-200 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-400 font-semibold gap-1 inline-flex items-center px-2 py-1 rounded-md text-[9px] text-blue-700">
                    <Fingerprint className="h-3 w-3" />
                    AI Verification
                  </span>

                  <span className="bg-white border border-blue-200 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-400 font-semibold gap-1 inline-flex items-center px-2 py-1 rounded-md text-[9px] text-blue-700">
                    <Shield className="h-3 w-3" />
                    Restricted Access
                  </span>

                </div>

              </div>

              {/* Email */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-slate-500 text-sm tracking-wider uppercase">
                  Administrator ID
                </label>

                <div className="relative">

                  <UserRound className="-translate-y-1/2 absolute dark:text-slate-400 h-5 left-4 text-slate-500 top-1/2 w-5" />

                  <input
                    type="text"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@hostel.edu"
                    className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pl-12 placeholder:text-slate-400 pr-4 py-4 rounded-2xl text-slate-900 text-xs transition-all w-full"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-slate-500 text-sm tracking-wider uppercase">
                  Security Password
                </label>

                <div className="relative">

                  <Lock className="-translate-y-1/2 absolute dark:text-slate-400 h-5 left-4 text-slate-500 top-1/2 w-5" />

                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Enter security password"
                    className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pl-12 placeholder:text-slate-400 pr-12 py-4 rounded-2xl text-slate-900 text-xs transition-all w-full"
                  />

                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="-translate-y-1/2 absolute cursor-pointer dark:hover:text-white hover:text-slate-700 dark:hover:text-slate-300 right-4 text-slate-500 top-1/2"
                  >
                    {showAdminPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 cursor-pointer disabled:opacity-70 flex font-bold gap-2 hover:bg-blue-500 items-center justify-center px-4 py-3 rounded-xl shadow-blue-600/20 shadow-lg text-base text-white transition-all w-full"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-t-white border-white/40 h-4 rounded-full w-4" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Enter Administrator Console
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Demo */}
              <button
                type="button"
                onClick={() => {
                  loginAsAdmin();
                  onClose();
                }}
                className="bg-slate-50 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 py-4 rounded-2xl text-slate-500 text-sm transition-colors w-full"
              >
                ⚡ Launch Demo Administrator Session
              </button>

            </form>

          ) : (

            /* ===================================================
               STUDENT LOGIN
            =================================================== */
            <form
              onSubmit={handleStudentSubmit}
              className="space-y-6"
            >

              {/* Student Access Information */}
              <div className="bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 p-4 rounded-xl">

                <div className="flex gap-3">

                  <div className="bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 flex flex-shrink-0 h-9 items-center justify-center rounded-lg text-emerald-600 w-9">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="dark:text-emerald-300 font-bold text-base text-emerald-900">
                      Resident Student Access
                    </p>

                    <p className="dark:text-emerald-400 leading-relaxed mt-1 text-emerald-700 text-sm">
                      View your hostel movements, attendance, curfew
                      records, disciplinary notices and outstanding fines.
                    </p>
                  </div>

                </div>

                <div className="dark:text-emerald-400 flex font-semibold gap-2 items-center mt-3 text-[9px] text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Registered resident profiles only
                </div>

              </div>

              {/* Student Selection */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-slate-500 text-sm tracking-wider uppercase">
                  Resident Profile
                </label>

                <div className="relative">

                  <GraduationCap className="-translate-y-1/2 absolute dark:text-slate-400 h-5 left-4 pointer-events-none text-slate-500 top-1/2 w-5" />

                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-slate-50 border border-slate-200 cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium pl-12 pr-4 py-4 rounded-2xl text-base text-slate-900 transition-all w-full"
                  >
                    {students.map((student) => (
                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.id} — {student.name} ({student.room})
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {/* Selected Student Preview */}
              {selectedStudent && (
                <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 flex gap-3 items-center p-3 rounded-xl">

                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="border border-slate-200 dark:border-slate-700 h-10 object-cover rounded-lg w-10"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="dark:text-white font-bold text-base text-slate-900 truncate">
                      {selectedStudent.name}
                    </p>

                    <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500 truncate">
                      {selectedStudent.department} • {selectedStudent.year}
                    </p>
                  </div>

                  <span className="dark:text-emerald-400 font-bold font-mono text-[9px] text-emerald-600">
                    {selectedStudent.id}
                  </span>

                </div>
              )}

              {/* PIN */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-slate-500 text-sm tracking-wider uppercase">
                  Student Security PIN
                </label>

                <div className="relative">

                  <KeyRound className="-translate-y-1/2 absolute dark:text-slate-400 h-5 left-4 text-slate-500 top-1/2 w-5" />

                  <input
                    type={showStudentPin ? 'text' : 'password'}
                    value={studentPin}
                    onChange={(e) => setStudentPin(e.target.value)}
                    required
                    maxLength={8}
                    placeholder="Enter PIN"
                    className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono pl-12 placeholder:text-slate-400 pr-12 py-4 rounded-2xl text-base text-slate-900 transition-all w-full"
                  />

                  <button
                    type="button"
                    onClick={() => setShowStudentPin(!showStudentPin)}
                    className="-translate-y-1/2 absolute cursor-pointer dark:hover:text-white hover:text-slate-700 dark:hover:text-slate-300 right-4 text-slate-500 top-1/2"
                  >
                    {showStudentPin ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Student Login */}
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 cursor-pointer disabled:opacity-70 flex font-bold gap-2 hover:bg-emerald-500 items-center justify-center px-4 py-3 rounded-xl shadow-emerald-600/20 shadow-lg text-base text-white transition-all w-full"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-t-white border-white/40 h-4 rounded-full w-4" />
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Open Student Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Demo */}
              <button
                type="button"
                onClick={() => {
                  loginAsStudent(selectedStudentId);
                  onClose();
                }}
                className="bg-slate-50 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 py-4 rounded-2xl text-slate-500 text-sm transition-colors w-full"
              >
                ⚡ Launch Demo Student Session
              </button>

            </form>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="bg-slate-50 border-slate-200 dark:border-slate-800 border-t dark:bg-slate-900/60 flex items-center justify-between px-6 py-3.5">

          <div className="dark:text-slate-400 flex gap-1.5 items-center text-[9px] text-slate-400">
            <Lock className="h-3 w-3" />
            Protected institutional access
          </div>

          <div className="dark:text-slate-400 flex gap-1.5 items-center text-[9px] text-slate-400">
            <span className="bg-emerald-500 h-1.5 rounded-full w-1.5" />
            System Online
          </div>

        </div>

        </div>
      </div>
    </div>
  );
}