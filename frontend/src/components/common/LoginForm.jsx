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

export default function LoginForm({
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

  

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId
  );

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      loginAsAdmin();
      setLoading(false);
      

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
        className="flex flex-col gap-10 h-full justify-center lg:p-16 p-10 relative w-full"
      >

        

        {/* ================= HEADER ================= */}
        <div className="">

          <div className="flex items-start justify-between">

            <div className="flex gap-3.5 items-center">

              <div className="relative">
                <div className="bg-slate-100 dark:bg-white flex h-11 items-center justify-center rounded-xl shadow-lg w-11">
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
                    <span className="bg-emerald-500 h-2 rounded-full w-2" />
                    Secure
                  </span>
                </div>

                <p className="dark:text-slate-400 mt-1 text-slate-500 text-xs">
                  Hostel Intelligence & Management System
                </p>
              </div>

            </div>

            

          </div>

        </div>

        {/* ================= ROLE SELECTOR ================= */}
        <div className="">

          <div className="bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 gap-2 grid grid-cols-2 p-1.5 rounded-xl">

            <button
              type="button"
              onClick={() => switchRole('admin')}
              className={`relative flex items-center justify-center gap-3 py-5 rounded-xl text-base font-bold transition-all cursor-pointer ${ selectedRole === 'admin' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 dark:hover:text-slate-200' }`}
            >
              <ShieldCheck className="h-5 w-5" />
              Admin Console

              {selectedRole === 'admin' && (
                <span className="absolute bg-blue-500 h-2 right-1.5 rounded-full top-1.5 w-2" />
              )}
            </button>

            <button
              type="button"
              onClick={() => switchRole('student')}
              className={`relative flex items-center justify-center gap-3 py-5 rounded-xl text-base font-bold transition-all cursor-pointer ${ selectedRole === 'student' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 dark:hover:text-slate-200' }`}
            >
              <GraduationCap className="h-7 w-7" />
              Student Portal

              {selectedRole === 'student' && (
                <span className="absolute bg-emerald-500 h-2 right-1.5 rounded-full top-1.5 w-2" />
              )}
            </button>

          </div>

        </div>

        {/* ================= FORM AREA ================= */}
        <div className="pb-6 pt-5">

          {selectedRole === 'admin' ? (

            /* ===================================================
               ADMIN LOGIN
            =================================================== */
            <form
              onSubmit={handleAdminSubmit}
              className="space-y-8 w-full"
            >

              {/* Access Information */}
              <div className="bg-blue-50/70 border-2 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50 lg:p-8 p-6 rounded-2xl">

                <div className="flex gap-3">

                  <div className="bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 flex flex-shrink-0 h-14 items-center justify-center rounded-xl text-blue-600 w-14">
                    <Building2 className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="dark:text-blue-300 font-bold text-blue-900 text-xl">
                      Administrator Authorization
                    </p>

                    <p className="dark:text-blue-400 leading-relaxed mt-2 text-blue-700 text-sm">
                      Authorized personnel can access surveillance,
                      biometric verification, resident records, movement
                      logs and disciplinary controls.
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="bg-white border border-blue-200 dark:bg-slate-900/70 dark:border-blue-900 dark:text-blue-400 font-semibold gap-1 inline-flex items-center px-2 py-1 rounded-md text-[9px] text-blue-700">
                    <Fingerprint className="h-3 w-3" />
                    AI Verification
                  </span>

                  <span className="bg-white border border-blue-200 dark:bg-slate-900/70 dark:border-blue-900 dark:text-blue-400 font-semibold gap-1 inline-flex items-center px-2 py-1 rounded-md text-[9px] text-blue-700">
                    <Shield className="h-3 w-3" />
                    Restricted Access
                  </span>

                </div>

              </div>

              {/* Email */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-[11px] text-slate-500 tracking-wider uppercase">
                  Administrator ID
                </label>

                <div className="relative">

                  <UserRound className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-600 top-1/2 w-4" />

                  <input
                    type="text"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@hostel.edu"
                    className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pl-10 placeholder:text-slate-600 dark:placeholder:text-slate-400 pr-3 py-5 rounded-2xl text-base text-slate-900 transition-all w-full"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-[11px] text-slate-500 tracking-wider uppercase">
                  Security Password
                </label>

                <div className="relative">

                  <Lock className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-600 top-1/2 w-4" />

                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Enter security password"
                    className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pl-10 placeholder:text-slate-600 dark:placeholder:text-slate-400 pr-10 py-5 rounded-2xl text-base text-slate-900 transition-all w-full"
                  />

                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="-translate-y-1/2 absolute cursor-pointer dark:hover:text-slate-700 dark:hover:text-white dark:text-slate-400 hover:text-slate-700 right-3 text-slate-600 top-1/2"
                  >
                    {showAdminPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 cursor-pointer disabled:opacity-70 flex font-bold gap-2 hover:bg-blue-500 items-center justify-center px-6 py-5 rounded-2xl shadow-blue-600/20 shadow-lg text-base text-white transition-all w-full"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-t-white border-white/40 h-4 rounded-full w-4" />
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Enter Administrator Console
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Demo */}
              <button
                type="button"
                onClick={() => {
                  loginAsAdmin();
                  
                }}
                className="bg-slate-50 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 font-semibold hover:bg-slate-100 mt-4 py-4 rounded-2xl text-[10px] text-slate-500 text-sm transition-colors w-full"
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
              className="space-y-8 w-full"
            >

              {/* Student Access Information */}
              <div className="bg-emerald-50/70 border-2 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 lg:p-8 p-6 rounded-2xl">

                <div className="flex gap-3">

                  <div className="bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 flex flex-shrink-0 h-14 items-center justify-center rounded-xl text-emerald-600 w-14">
                    <GraduationCap className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="dark:text-emerald-300 font-bold text-emerald-900 text-xl">
                      Resident Student Access
                    </p>

                    <p className="dark:text-emerald-400 leading-relaxed mt-2 text-emerald-700 text-sm">
                      View your hostel movements, attendance, curfew
                      records, disciplinary notices and outstanding fines.
                    </p>
                  </div>

                </div>

                <div className="dark:text-emerald-400 flex font-semibold gap-2 items-center mt-4 text-emerald-700 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Registered resident profiles only
                </div>

              </div>

              {/* Student Selection */}
              <div className="space-y-1.5">

                <label className="dark:text-slate-400 font-bold text-[11px] text-slate-500 tracking-wider uppercase">
                  Resident Profile
                </label>

                <div className="relative">

                  <GraduationCap className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 pointer-events-none text-slate-600 top-1/2 w-4" />

                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="bg-slate-50 border border-slate-200 cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium pl-10 pr-3 py-5 rounded-2xl text-base text-slate-900 transition-all w-full"
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
                    <p className="dark:text-white font-bold text-slate-900 text-xs truncate">
                      {selectedStudent.name}
                    </p>

                    <p className="dark:text-slate-400 mt-0.5 text-slate-500 text-sm truncate">
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

                <label className="dark:text-slate-400 font-bold text-[11px] text-slate-500 tracking-wider uppercase">
                  Student Security PIN
                </label>

                <div className="relative">

                  <KeyRound className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-600 top-1/2 w-4" />

                  <input
                    type={showStudentPin ? 'text' : 'password'}
                    value={studentPin}
                    onChange={(e) => setStudentPin(e.target.value)}
                    required
                    maxLength={8}
                    placeholder="Enter PIN"
                    className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono pl-10 placeholder:text-slate-600 dark:placeholder:text-slate-400 pr-10 py-5 rounded-2xl text-base text-slate-900 transition-all w-full"
                  />

                  <button
                    type="button"
                    onClick={() => setShowStudentPin(!showStudentPin)}
                    className="-translate-y-1/2 absolute cursor-pointer dark:hover:text-slate-700 dark:hover:text-white dark:text-slate-400 hover:text-slate-700 right-3 text-slate-600 top-1/2"
                  >
                    {showStudentPin ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* Student Login */}
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 cursor-pointer disabled:opacity-70 flex font-bold gap-2 hover:bg-emerald-500 items-center justify-center px-6 py-5 rounded-2xl shadow-emerald-600/20 shadow-lg text-base text-white transition-all w-full"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-t-white border-white/40 h-4 rounded-full w-4" />
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Open Student Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Demo */}
              <button
                type="button"
                onClick={() => {
                  loginAsStudent(selectedStudentId);
                  
                }}
                className="bg-slate-50 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 font-semibold hover:bg-slate-100 mt-4 py-4 rounded-2xl text-[10px] text-slate-500 text-sm transition-colors w-full"
              >
                ⚡ Launch Demo Student Session
              </button>

            </form>
          )}

        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-slate-200 dark:border-slate-800 border-t flex items-center justify-between mt-auto pt-6 w-full">

          <div className="dark:text-slate-500 flex gap-1.5 items-center text-[9px] text-slate-600">
            <Lock className="h-3 w-3" />
            Protected institutional access
          </div>

          <div className="dark:text-slate-500 flex gap-1.5 items-center text-[9px] text-slate-600">
            <span className="bg-emerald-500 h-2 rounded-full w-2" />
            System Online
          </div>

        </div>

      </div>
  );
}