import React, { useState } from 'react';
import {
  History,
  Scale,
  QrCode,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Home,
  ShieldCheck,
  Phone,
  GraduationCap,
  UserCheck,
  UserX,
  Clock3,
  CalendarCheck,
  Activity,
  AlertTriangle,
  ChevronRight,
  CreditCard,
  Fingerprint,
  MapPin,
  UserRound,
  CircleDollarSign,
  LogIn,
  LogOut
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import PaymentQRModal from '../modals/PaymentQRModal';

export default function StudentDashboard() {
  const {
    currentStudent,
    currentStudentId,
    setCurrentStudentId,
    students,
    logs,
    fines
  } = useApp();

  const [activeTab, setActiveTab] = useState('logs');
  const [selectedFineForPayment, setSelectedFineForPayment] = useState(null);

  const studentLogs = logs.filter(
    l =>
      l.studentId === currentStudent.id ||
      l.studentName === currentStudent.name
  );

  const studentFines = fines.filter(
    f =>
      f.studentId === currentStudent.id ||
      f.studentName === currentStudent.name
  );

  const pendingFines = studentFines.filter(
    f => f.status !== 'Served / Paid'
  );

  const pendingAmount = pendingFines.reduce(
    (acc, f) => acc + f.amount,
    0
  );

  const curfewAlertCount = studentLogs.filter(
    l => l.curfewAlert
  ).length;

  const today = new Date().toISOString().split('T')[0];

  const isPresentToday =
    currentStudent.present &&
    currentStudent.presentDate === today;

  const attendanceDates = currentStudent.attendanceDates || [];
  const daysPresent = attendanceDates.length;

  const recentAttendance = [...attendanceDates]
    .sort()
    .reverse()
    .slice(0, 7);

  const attendanceRate = Math.min(
    100,
    Math.round((daysPresent / Math.max(daysPresent + 2, 1)) * 100)
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* =========================================================
          HERO / STUDENT HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative p-5 md:p-6">

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

            {/* Identity */}
            <div className="flex items-center gap-4">

              <div className="relative">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-lg"
                />

                <span
                  className={`absolute -right-1 -bottom-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
                    isPresentToday
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {currentStudent.name}
                  </h1>

                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold">
                    {currentStudent.id}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {currentStudent.department} • {currentStudent.year}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Home className="w-3 h-3" />
                    {currentStudent.room} • {currentStudent.block}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <ShieldCheck className="w-3 h-3" />
                    {currentStudent.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Today's status */}
            <div
              className={`min-w-[260px] p-4 rounded-xl border ${
                isPresentToday
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                    Today's Status
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    {isPresentToday ? (
                      <UserCheck className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <UserX className="w-5 h-5 text-slate-400" />
                    )}

                    <span
                      className={`text-lg font-bold ${
                        isPresentToday
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isPresentToday
                        ? 'Present'
                        : 'Not Marked'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isPresentToday
                      ? 'bg-emerald-100 dark:bg-emerald-900/60'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  {isPresentToday ? (
                    <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock3 className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isPresentToday
                    ? `Verified at ${currentStudent.presentAt || '--'} via facial recognition`
                    : 'Awaiting biometric verification at hostel gate'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          KPI GRID
      ========================================================= */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        <StatCard
          icon={CalendarCheck}
          label="Days Present"
          value={daysPresent}
          suffix="days"
          iconClass="text-emerald-500"
          bgClass="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          icon={Activity}
          label="Gate Movements"
          value={studentLogs.length}
          suffix="events"
          iconClass="text-blue-500"
          bgClass="bg-blue-50 dark:bg-blue-950/40"
        />

        <StatCard
          icon={AlertTriangle}
          label="Curfew Alerts"
          value={curfewAlertCount}
          suffix="alerts"
          iconClass={
            curfewAlertCount > 0
              ? 'text-amber-500'
              : 'text-emerald-500'
          }
          bgClass={
            curfewAlertCount > 0
              ? 'bg-amber-50 dark:bg-amber-950/40'
              : 'bg-emerald-50 dark:bg-emerald-950/40'
          }
        />

        <StatCard
          icon={CircleDollarSign}
          label="Outstanding"
          value={`₹${pendingAmount.toLocaleString()}`}
          suffix="due"
          iconClass={
            pendingAmount > 0
              ? 'text-rose-500'
              : 'text-emerald-500'
          }
          bgClass={
            pendingAmount > 0
              ? 'bg-rose-50 dark:bg-rose-950/40'
              : 'bg-emerald-50 dark:bg-emerald-950/40'
          }
        />

      </section>

      {/* =========================================================
          MAIN GRID
      ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-4">

        {/* =======================================================
            LEFT PROFILE SIDEBAR
        ======================================================= */}
        <aside className="space-y-4">

          {/* Profile Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Student Profile
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4">

              <InfoRow
                icon={Home}
                label="Hostel"
                value={`${currentStudent.room} • ${currentStudent.block}`}
              />

              <InfoRow
                icon={GraduationCap}
                label="Department"
                value={`${currentStudent.department} (${currentStudent.year})`}
              />

              <InfoRow
                icon={Fingerprint}
                label="Biometric"
                value={
                  currentStudent.faceEnrolled
                    ? `Face Match ${currentStudent.faceConfidence}`
                    : 'Not Enrolled'
                }
                valueClass={
                  currentStudent.faceEnrolled
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }
              />

              <InfoRow
                icon={Phone}
                label="Guardian"
                value={`${currentStudent.guardianPhone}`}
              />

              <InfoRow
                icon={UserRound}
                label="Relation"
                value={currentStudent.guardianRelation}
              />

            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Attendance
                  </h3>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {today}
                </span>
              </div>
            </div>

            <div className="p-4">

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {daysPresent}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Total days present
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {attendanceRate}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    attendance index
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map(date => (
                    <span
                      key={date}
                      className={`px-2 py-1 rounded-md text-[9px] font-mono border ${
                        date === today
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {date === today ? 'TODAY' : date}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400">
                    No attendance history
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Student Switcher */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">

            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
              Demo Student
            </label>

            <select
              value={currentStudentId}
              onChange={e => setCurrentStudentId(e.target.value)}
              className="w-full mt-2 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {students.map(student => (
                <option
                  key={student.id}
                  value={student.id}
                  className="bg-white dark:bg-slate-900"
                >
                  {student.name} ({student.id})
                </option>
              ))}
            </select>

          </div>

        </aside>

        {/* =======================================================
            RIGHT CONTENT
        ======================================================= */}
        <main className="min-w-0">

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              Movement History
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[9px]">
                {studentLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fines')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'fines'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              Fines & Actions
              <span className="px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[9px]">
                {studentFines.length}
              </span>

              {pendingAmount > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-rose-600 font-bold">
                  ₹{pendingAmount}
                </span>
              )}
            </button>

          </div>

          {/* =====================================================
              MOVEMENT HISTORY
          ===================================================== */}
          {activeTab === 'logs' && (
            <div className="mt-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

              <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Access Movement History
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Biometric gate entries and exits recorded for your account
                  </p>
                </div>

                <span className="w-fit text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  {studentLogs.length} RECORDS
                </span>

              </div>

              {studentLogs.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="No movement records"
                  description="Your gate entry and exit activity will appear here."
                />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">

                  {studentLogs.map(log => {
                    const isIn = log.direction === 'IN';

                    return (
                      <div
                        key={log.id}
                        className="p-4 md:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >

                        <div className="flex items-start gap-3">

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isIn
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500'
                                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-500'
                            }`}
                          >
                            {isIn ? (
                              <LogIn className="w-5 h-5" />
                            ) : (
                              <LogOut className="w-5 h-5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${
                                  isIn
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                }`}
                              >
                                {log.direction}
                              </span>

                              {log.curfewAlert ? (
                                <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                  CURFEW VIOLATION
                                </span>
                              ) : (
                                <span className="text-[9px] font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                                  AUTHORIZED
                                </span>
                              )}

                            </div>

                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">

                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {log.gate}
                              </span>

                              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Clock3 className="w-3 h-3" />
                                {log.timestamp}
                              </span>

                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                              <span>EVENT: {log.id}</span>
                              <span>METHOD: {log.method}</span>
                            </div>

                            {log.remarks && (
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                {log.remarks}
                              </p>
                            )}

                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 mt-2 hidden sm:block" />

                        </div>
                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          )}

          {/* =====================================================
              FINES
          ===================================================== */}
          {activeTab === 'fines' && (
            <div className="mt-4 space-y-4">

              {/* Fine Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <FineSummary
                  label="Total Cases"
                  value={studentFines.length}
                  icon={Scale}
                />

                <FineSummary
                  label="Pending Cases"
                  value={pendingFines.length}
                  icon={AlertTriangle}
                  danger={pendingFines.length > 0}
                />

                <FineSummary
                  label="Amount Due"
                  value={`₹${pendingAmount.toLocaleString()}`}
                  icon={CreditCard}
                  danger={pendingAmount > 0}
                />

              </div>

              {/* Fine List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Disciplinary Actions
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review penalties and clear outstanding dues through UPI.
                  </p>
                </div>

                {studentFines.length === 0 ? (
                  <EmptyState
                    icon={CheckCircle2}
                    title="No disciplinary penalties"
                    description="There are currently no fines or disciplinary notices associated with your account."
                    success
                  />
                ) : (
                  <div className="p-4 space-y-3">

                    {studentFines.map(fine => {

                      const isServed =
                        fine.status === 'Served / Paid';

                      return (
                        <div
                          key={fine.id}
                          className={`rounded-xl border p-4 transition-all ${
                            isServed
                              ? 'border-slate-200 dark:border-slate-800'
                              : 'border-rose-200 dark:border-rose-900/70 bg-rose-50/30 dark:bg-rose-950/10'
                          }`}
                        >

                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                            <div className="flex gap-3 min-w-0">

                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  isServed
                                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500'
                                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-500'
                                }`}
                              >
                                {isServed ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5" />
                                )}
                              </div>

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span className="text-[9px] font-mono font-bold text-slate-400">
                                    {fine.id}
                                  </span>

                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                      isServed
                                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                    }`}
                                  >
                                    {isServed
                                      ? 'PAID'
                                      : 'PAYMENT DUE'}
                                  </span>

                                </div>

                                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                  {fine.infraction}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    Action:
                                  </span>{' '}
                                  {fine.disciplinaryAction}
                                </p>

                                <p className="mt-1 text-[10px] font-mono text-slate-400">
                                  Issued: {fine.issuedDate}
                                </p>

                                {isServed && fine.servedDate && (
                                  <p className="mt-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                                    ✓ Settled on {fine.servedDate} • {fine.paymentMethod || 'UPI QR'}
                                  </p>
                                )}

                              </div>

                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-4">

                              <div className="text-left lg:text-right">
                                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                                  Amount
                                </p>

                                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                                  ₹{fine.amount.toLocaleString()}
                                </p>
                              </div>

                              {isServed ? (
                                <span className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                                  Cleared
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    setSelectedFineForPayment(fine)
                                  }
                                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                >
                                  <QrCode className="w-4 h-4" />
                                  Pay Now
                                </button>
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Payment Modal */}
      {selectedFineForPayment && (
        <PaymentQRModal
          fine={selectedFineForPayment}
          onClose={() => setSelectedFineForPayment(null)}
        />
      )}

    </div>
  );
}


/* ===============================================================
   REUSABLE COMPONENTS
================================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  iconClass,
  bgClass
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
            {label}
          </p>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </span>

            <span className="text-[10px] text-slate-400">
              {suffix}
            </span>
          </div>
        </div>

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${bgClass}`}
        >
          <Icon className={`w-4 h-4 ${iconClass}`} />
        </div>

      </div>
    </div>
  );
}


function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = 'text-slate-700 dark:text-slate-300'
}) {
  return (
    <div className="flex gap-3">

      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
          {label}
        </p>

        <p className={`text-xs font-semibold mt-0.5 truncate ${valueClass}`}>
          {value}
        </p>
      </div>

    </div>
  );
}


function FineSummary({
  label,
  value,
  icon: Icon,
  danger = false
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            {label}
          </p>

          <p
            className={`text-xl font-bold mt-1 ${
              danger
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {value}
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon
            className={`w-4 h-4 ${
              danger
                ? 'text-rose-500'
                : 'text-slate-400'
            }`}
          />
        </div>

      </div>
    </div>
  );
}


function EmptyState({
  icon: Icon,
  title,
  description,
  success = false
}) {
  return (
    <div className="p-12 text-center">

      <div
        className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${
          success
            ? 'bg-emerald-50 dark:bg-emerald-950/40'
            : 'bg-slate-100 dark:bg-slate-800'
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            success
              ? 'text-emerald-500'
              : 'text-slate-400'
          }`}
        />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 max-w-sm mx-auto text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}