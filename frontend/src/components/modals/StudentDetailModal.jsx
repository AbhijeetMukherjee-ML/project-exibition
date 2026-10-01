import React from 'react';
import {
  X,
  ShieldCheck,
  Home,
  Phone,
  Scale,
  CheckCircle2,
  AlertTriangle,
  User,
  CalendarDays,
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StudentDetailModal({ student, onClose }) {
  const { logs, fines, toggleFineStatus } = useApp();

  const studentLogs = logs.filter(
    (l) => l.studentId === student.id || l.studentName === student.name
  );

  const studentFines = fines.filter(
    (f) => f.studentId === student.id || f.studentName === student.name
  );

  const paidFines = studentFines.filter(
    (fine) => fine.status === 'Served / Paid'
  );

  const pendingFines = studentFines.filter(
    (fine) => fine.status !== 'Served / Paid'
  );

  const totalFineAmount = studentFines.reduce(
    (total, fine) => total + Number(fine.amount || 0),
    0
  );

  const pendingAmount = pendingFines.reduce(
    (total, fine) => total + Number(fine.amount || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">

      <div
        className="
          relative w-full max-w-4xl
          max-h-[92vh] overflow-y-auto
          bg-white dark:bg-slate-950
          border border-slate-200 dark:border-slate-800
          rounded-3xl shadow-2xl
        "
      >

        {/* =========================================================
            TOP HEADER
        ========================================================= */}
        <div className="relative overflow-hidden">

          {/* Header background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-500/5 dark:from-blue-500/10" />

          <div className="relative p-5 sm:p-7">

            {/* Close */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4 sm:top-6 sm:right-6
                w-9 h-9
                rounded-xl
                flex items-center justify-center
                text-slate-400
                hover:text-slate-700 dark:hover:text-white
                bg-slate-100/80 dark:bg-slate-900/80
                hover:bg-slate-200 dark:hover:bg-slate-800
                border border-slate-200 dark:border-slate-800
                transition-all
                cursor-pointer
              "
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pr-10">

              <div className="relative shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="
                    w-20 h-20
                    rounded-2xl
                    object-cover
                    border-2 border-white dark:border-slate-800
                    shadow-lg
                  "
                />

                <div
                  className={`
                    absolute -bottom-1.5 -right-1.5
                    w-6 h-6 rounded-full
                    border-4 border-white dark:border-slate-950
                    ${student.status === 'Active'
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                    }
                  `}
                />
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {student.name}
                  </h2>

                  <span
                    className={`
                      inline-flex items-center gap-1.5
                      px-2.5 py-1
                      rounded-full
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      border
                      ${student.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      }
                    `}
                  >
                    <span
                      className={`
                        w-1.5 h-1.5 rounded-full
                        ${student.status === 'Active'
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                        }
                      `}
                    />
                    {student.status}
                  </span>
                </div>

                <p className="mt-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                  {student.id}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{student.department}</span>

                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">
                    •
                  </span>

                  <span>{student.year}</span>

                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">
                    •
                  </span>

                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Joined {student.joinedDate}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =========================================================
            QUICK STATS
        ========================================================= */}
        <div className="px-5 sm:px-7 pb-5">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">

            <StatCard
              label="Room"
              value={student.room || '—'}
              sub={student.block}
              icon={Home}
              iconClass="text-blue-600 dark:text-blue-400"
            />

            <StatCard
              label="Face ID"
              value={student.faceEnrolled ? 'Enrolled' : 'Pending'}
              sub={
                student.faceEnrolled
                  ? `${student.faceConfidence || 'Verified'} confidence`
                  : 'Enrollment required'
              }
              icon={Fingerprint}
              iconClass={
                student.faceEnrolled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            />

            <StatCard
              label="Violations"
              value={studentFines.length}
              sub={`${paidFines.length} resolved`}
              icon={Scale}
              iconClass={
                studentFines.length
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            />

            <StatCard
              label="Pending Fine"
              value={`₹${pendingAmount.toLocaleString()}`}
              sub={`₹${totalFineAmount.toLocaleString()} total`}
              icon={AlertTriangle}
              iconClass={
                pendingAmount
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            />

          </div>
        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <div className="px-5 sm:px-7 pb-6 space-y-5">

          {/* =======================================================
              INFORMATION GRID
          ======================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Room Information */}
            <InfoCard
              icon={Home}
              iconClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
              title="Residence Information"
              subtitle="Current hostel allocation"
            >
              <div className="grid grid-cols-2 gap-3">

                <DetailItem
                  label="Hostel Block"
                  value={student.block || 'Not assigned'}
                />

                <DetailItem
                  label="Room"
                  value={student.room || 'Not assigned'}
                />

                <DetailItem
                  label="Bed"
                  value={student.bed || 'Bed 1'}
                />

                <DetailItem
                  label="Blood Group"
                  value={student.bloodGroup || 'Not provided'}
                />

              </div>
            </InfoCard>

            {/* Biometric */}
            <InfoCard
              icon={ShieldCheck}
              iconClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
              title="Identity Verification"
              subtitle="Biometric & security status"
            >

              <div
                className={`
                  flex items-center justify-between
                  p-3
                  rounded-xl
                  border
                  ${student.faceEnrolled
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                  }
                `}
              >

                <div className="flex items-center gap-2.5">

                  <div
                    className={`
                      w-9 h-9 rounded-lg
                      flex items-center justify-center
                      ${student.faceEnrolled
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                      }
                    `}
                  >
                    <Fingerprint className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Face Recognition
                    </p>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {student.faceEnrolled
                        ? `Confidence: ${student.faceConfidence || 'Verified'}`
                        : 'No biometric profile enrolled'}
                    </p>
                  </div>

                </div>

                <span
                  className={`
                    text-[9px] font-bold uppercase px-2 py-1 rounded-md
                    ${student.faceEnrolled
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400'
                    }
                  `}
                >
                  {student.faceEnrolled ? 'Verified' : 'Pending'}
                </span>

              </div>

            </InfoCard>

            {/* Guardian */}
            <InfoCard
              icon={Phone}
              iconClass="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
              title="Guardian & Emergency Contact"
              subtitle="Registered emergency contact"
              className="lg:col-span-2"
            >

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <DetailItem
                  label="Guardian"
                  value={student.guardianName || 'Not provided'}
                />

                <DetailItem
                  label="Relationship"
                  value={student.guardianRelation || 'Guardian'}
                />

                <DetailItem
                  label="Contact Number"
                  value={student.guardianPhone || 'Not provided'}
                  mono
                />

              </div>

              {student.address && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Address
                  </p>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {student.address}
                  </p>
                </div>
              )}

            </InfoCard>

          </div>

          {/* =======================================================
              DISCIPLINARY RECORDS
          ======================================================= */}
          <section>

            <div className="flex items-center justify-between mb-3">

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Disciplinary Records
                    </h3>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {studentFines.length} record{studentFines.length !== 1 ? 's' : ''} • ₹{totalFineAmount.toLocaleString()} total
                    </p>
                  </div>
                </div>
              </div>

              {pendingFines.length > 0 && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                  {pendingFines.length} Pending
                </span>
              )}

            </div>

            {studentFines.length === 0 ? (

              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/20 p-5 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Clean disciplinary record
                  </p>

                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                    No violations or fines have been recorded for this student.
                  </p>
                </div>

              </div>

            ) : (

              <div className="space-y-2.5">

                {studentFines.map((fine) => {

                  const isServed = fine.status === 'Served / Paid';

                  return (
                    <div
                      key={fine.id}
                      className="
                        group
                        p-4
                        rounded-2xl
                        bg-slate-50 dark:bg-slate-900
                        border border-slate-200 dark:border-slate-800
                        hover:border-slate-300 dark:hover:border-slate-700
                        transition-all
                      "
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                        {/* Fine information */}
                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={`
                                w-2 h-2 rounded-full
                                ${isServed ? 'bg-emerald-500' : 'bg-rose-500'}
                              `}
                            />

                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {fine.infraction}
                            </h4>

                            <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                              ₹{Number(fine.amount).toLocaleString()}
                            </span>

                          </div>

                          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {fine.disciplinaryAction}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-400">

                            <span className="font-mono">
                              {fine.id}
                            </span>

                            {fine.dueDate && (
                              <>
                                <span>•</span>
                                <span>
                                  Due {fine.dueDate}
                                </span>
                              </>
                            )}

                            {fine.evidence && (
                              <>
                                <span>•</span>
                                <span>
                                  Evidence logged
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">

                          <span
                            className={`
                              inline-flex items-center gap-1.5
                              px-2.5 py-1.5
                              rounded-lg
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-wide
                              border
                              ${isServed
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                              }
                            `}
                          >
                            {isServed
                              ? <CheckCircle2 className="w-3 h-3" />
                              : <AlertTriangle className="w-3 h-3" />
                            }

                            {isServed ? 'Paid' : 'Due'}
                          </span>

                          <button
                            onClick={() => toggleFineStatus(fine.id)}
                            className="
                              px-3 py-1.5
                              rounded-lg
                              bg-slate-900 dark:bg-slate-800
                              hover:bg-slate-700 dark:hover:bg-slate-700
                              text-white
                              text-[10px]
                              font-semibold
                              transition-colors
                              cursor-pointer
                            "
                          >
                            {isServed ? 'Revert' : 'Mark Paid'}
                          </button>

                          <ChevronRight className="hidden sm:block w-4 h-4 text-slate-300 dark:text-slate-700" />

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </section>

          {/* =======================================================
              ACTIVITY SUMMARY
          ======================================================= */}
          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <HistoryIcon />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hostel Activity
                </h3>

                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Recorded gate activity
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Total Records
                </p>

                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {studentLogs.length}
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  Entry / exit events
                </p>

              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Account Status
                </p>

                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {student.status || 'Active'}
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  Hostel residence
                </p>

              </div>

            </div>

          </section>

        </div>

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <div className="sticky bottom-0 px-5 sm:px-7 py-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-end">

          <button
            onClick={onClose}
            className="
              px-5 py-2.5
              rounded-xl
              bg-slate-900 dark:bg-slate-800
              hover:bg-slate-700 dark:hover:bg-slate-700
              text-white
              text-xs
              font-semibold
              transition-colors
              cursor-pointer
            "
          >
            Close Profile
          </button>

        </div>

      </div>
    </div>
  );
}


/* ===============================================================
   REUSABLE UI COMPONENTS
   =============================================================== */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass
}) {
  return (
    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">

      <div className="flex items-center justify-between gap-2">

        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
          {label}
        </p>

        <Icon className={`w-3.5 h-3.5 ${iconClass}`} />

      </div>

      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400 truncate">
        {sub}
      </p>

    </div>
  );
}


function InfoCard({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  children,
  className = ''
}) {
  return (
    <div
      className={`
        p-4
        rounded-2xl
        bg-slate-50/70 dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        ${className}
      `}
    >

      <div className="flex items-center gap-2.5 mb-4">

        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {title}
          </h4>

          <p className="text-[9px] text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

      </div>

      {children}

    </div>
  );
}


function DetailItem({
  label,
  value,
  mono = false
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
        {label}
      </p>

      <p
        className={`
          mt-1
          text-xs
          font-semibold
          text-slate-800 dark:text-slate-200
          ${mono ? 'font-mono' : ''}
        `}
      >
        {value}
      </p>
    </div>
  );
}


function HistoryIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}