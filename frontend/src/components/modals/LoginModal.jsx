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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl"
      >

        {/* ================= TOP BRAND STRIP ================= */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

        {/* ================= HEADER ================= */}
        <div className="px-6 pt-6 pb-5">

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-3.5">

              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white dark:text-slate-900" />
                </div>

                <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Secure Portal Access
                  </h2>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Secure
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Hostel Intelligence & Management System
                </p>
              </div>

            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* ================= ROLE SELECTOR ================= */}
        <div className="px-6">

          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`relative flex items-center justify-center gap-2.5 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Console

              {selectedRole === 'admin' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => switchRole('student')}
              className={`relative flex items-center justify-center gap-2.5 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal

              {selectedRole === 'student' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

          </div>

        </div>

        {/* ================= FORM AREA ================= */}
        <div className="px-6 pt-5 pb-6">

          {selectedRole === 'admin' ? (

            /* ===================================================
               ADMIN LOGIN
            =================================================== */
            <form
              onSubmit={handleAdminSubmit}
              className="space-y-4"
            >

              {/* Access Information */}
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 p-4">

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      Administrator Authorization
                    </p>

                    <p className="text-[10px] leading-relaxed text-blue-700 dark:text-blue-400 mt-1">
                      Authorized personnel can access surveillance,
                      biometric verification, resident records, movement
                      logs and disciplinary controls.
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-blue-700 dark:text-blue-400 bg-white/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-2 py-1 rounded-md">
                    <Fingerprint className="w-3 h-3" />
                    AI Verification
                  </span>

                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-blue-700 dark:text-blue-400 bg-white/70 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-2 py-1 rounded-md">
                    <Shield className="w-3 h-3" />
                    Restricted Access
                  </span>

                </div>

              </div>

              {/* Email */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Administrator ID
                </label>

                <div className="relative">

                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@hostel.edu"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Security Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    {showAdminPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Enter Administrator Console
                    <ArrowRight className="w-4 h-4" />
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
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
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
              className="space-y-4"
            >

              {/* Student Access Information */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/30 p-4">

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Resident Student Access
                    </p>

                    <p className="text-[10px] leading-relaxed text-emerald-700 dark:text-emerald-400 mt-1">
                      View your hostel movements, attendance, curfew
                      records, disciplinary notices and outstanding fines.
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2 mt-3 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Registered resident profiles only
                </div>

              </div>

              {/* Student Selection */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Resident Profile
                </label>

                <div className="relative">

                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
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
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">

                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {selectedStudent.name}
                    </p>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {selectedStudent.department} • {selectedStudent.year}
                    </p>
                  </div>

                  <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedStudent.id}
                  </span>

                </div>
              )}

              {/* PIN */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student Security PIN
                </label>

                <div className="relative">

                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type={showStudentPin ? 'text' : 'password'}
                    value={studentPin}
                    onChange={(e) => setStudentPin(e.target.value)}
                    required
                    maxLength={8}
                    placeholder="Enter PIN"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowStudentPin(!showStudentPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    {showStudentPin ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Student Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Open Student Dashboard
                    <ArrowRight className="w-4 h-4" />
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
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                ⚡ Launch Demo Student Session
              </button>

            </form>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
            <Lock className="w-3 h-3" />
            Protected institutional access
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            System Online
          </div>

        </div>

      </div>
    </div>
  );
}