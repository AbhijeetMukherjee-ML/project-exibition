import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Building,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginModal({ isOpen, onClose, initialRole = 'admin' }) {
  const { students, loginAsAdmin, loginAsStudent, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [adminEmail, setAdminEmail] = useState('admin@hostel.edu');
  const [adminPassword, setAdminPassword] = useState('admin123');
  
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'STU-2026-001');
  const [studentPin, setStudentPin] = useState('1234');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAsAdmin();
      setLoading(false);
      onClose();
      showToast("Access Granted", "Logged in as Chief Hostel Administrator", "success");
    }, 400);
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const stu = students.find(s => s.id === selectedStudentId);
    setTimeout(() => {
      loginAsStudent(selectedStudentId);
      setLoading(false);
      onClose();
      showToast("Student Authenticated", `Welcome back, ${stu ? stu.name : 'Student'}`, "success");
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800/50">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Portal Authentication</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select your authorization credentials</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {selectedRole === 'admin' ? (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/40 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Hostel Administration Access</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400/90 mt-0.5">
                    Provides control over CCTV streams, AI matching, Ingress/Egress logs, fine issuance & student database.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@hostel.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Enter Admin Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsAdmin();
                    onClose();
                  }}
                  className="w-full py-2 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ⚡ Quick Demo Login (Skip Credentials)
                </button>
              </div>
            </form>
          ) : (
            /* STUDENT LOGIN FORM */
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Hostel Resident Access</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5">
                    Check your gate entry/exit timestamps, curfew records, and settle any pending fines via UPI QR.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Select Registered Student Profile
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} — {s.name} ({s.room}, {s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Student PIN / Security Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={studentPin}
                    onChange={(e) => setStudentPin(e.target.value)}
                    required
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Open Student Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsStudent(selectedStudentId);
                    onClose();
                  }}
                  className="w-full py-2 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  ⚡ Quick Demo Login (Skip PIN)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
