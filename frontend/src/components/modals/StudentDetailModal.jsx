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
    <div className="animate-in backdrop-blur-md bg-slate-950/75 duration-200 fade-in fixed flex inset-0 items-center justify-center p-4 z-50">

      <div
        className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-950 max-h-[92vh] max-w-4xl overflow-y-auto relative rounded-3xl shadow-2xl w-full"
      >

        {/* =========================================================
            TOP HEADER
        ========================================================= */}
        <div className="overflow-hidden relative">

          {/* Header background */}
          <div className="absolute bg-gradient-to-br dark:from-blue-500/10 from-blue-600/10 inset-0 to-indigo-500/5 via-transparent" />

          <div className="p-5 relative sm:p-7">

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute bg-slate-100 border border-slate-200 dark:border-slate-800 cursor-pointer dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:hover:text-white dark:text-slate-400 flex h-9 hover:bg-slate-200 hover:text-slate-700 items-center justify-center right-4 rounded-xl sm:right-6 sm:top-6 text-slate-500 top-4 transition-all w-9"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile */}
            <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-center">

              <div className="relative shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="border-2 border-white dark:border-slate-800 h-20 object-cover rounded-2xl shadow-lg w-20"
                />

                <div
                  className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500' }`}
                />
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap gap-2 items-center">
                  <h2 className="dark:text-white font-bold sm:text-2xl text-slate-900 text-xl">
                    {student.name}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500' }`}
                    />
                    {student.status}
                  </span>
                </div>

                <p className="dark:text-slate-400 font-mono mt-1 text-slate-500 text-xs">
                  {student.id}
                </p>

                <div className="dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1 items-center mt-2 text-slate-500 text-xs">
                  <span>{student.department}</span>

                  <span className="dark:text-slate-700 hidden sm:inline text-slate-700">
                    •
                  </span>

                  <span>{student.year}</span>

                  <span className="dark:text-slate-700 hidden sm:inline text-slate-700">
                    •
                  </span>

                  <span className="flex gap-1 items-center">
                    <CalendarDays className="h-3.5 w-3.5" />
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
        <div className="pb-5 px-5 sm:px-7">

          <div className="gap-2.5 grid grid-cols-2 lg:grid-cols-4">

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
        <div className="pb-6 px-5 sm:px-7 space-y-5">

          {/* =======================================================
              INFORMATION GRID
          ======================================================= */}
          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">

            {/* Room Information */}
            <InfoCard
              icon={Home}
              iconClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
              title="Residence Information"
              subtitle="Current hostel allocation"
            >
              <div className="gap-3 grid grid-cols-2">

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
                className={`flex items-center justify-between p-3 rounded-xl border ${student.faceEnrolled ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50' }`}
              >

                <div className="flex gap-2.5 items-center">

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${student.faceEnrolled ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' }`}
                  >
                    <Fingerprint className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="dark:text-slate-200 font-bold text-slate-800 text-xs">
                      Face Recognition
                    </p>

                    <p className="dark:text-slate-400 text-[10px] text-slate-500">
                      {student.faceEnrolled
                        ? `Confidence: ${student.faceConfidence || 'Verified'}`
                        : 'No biometric profile enrolled'}
                    </p>
                  </div>

                </div>

                <span
                  className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${student.faceEnrolled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400' }`}
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

              <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">

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
                <div className="border-slate-100 border-t dark:border-slate-800 mt-3 pt-3">
                  <p className="font-semibold mb-1 text-[10px] text-slate-400 tracking-wider uppercase">
                    Address
                  </p>

                  <p className="dark:text-slate-300 text-slate-700 text-xs">
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
                <div className="flex gap-2 items-center">
                  <div className="bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 flex h-8 items-center justify-center rounded-lg text-rose-600 w-8">
                    <Scale className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="dark:text-white font-bold text-slate-900 text-sm">
                      Disciplinary Records
                    </h3>

                    <p className="dark:text-slate-400 text-[10px] text-slate-500">
                      {studentFines.length} record{studentFines.length !== 1 ? 's' : ''} • ₹{totalFineAmount.toLocaleString()} total
                    </p>
                  </div>
                </div>
              </div>

              {pendingFines.length > 0 && (
                <span className="bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-400 font-bold px-2.5 py-1 rounded-full text-[10px] text-amber-700">
                  {pendingFines.length} Pending
                </span>
              )}

            </div>

            {studentFines.length === 0 ? (

              <div className="bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 flex gap-3 items-center p-5 rounded-2xl">

                <div className="bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 flex h-10 items-center justify-center rounded-xl text-emerald-600 w-10">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="dark:text-emerald-300 font-bold text-emerald-800 text-sm">
                    Clean disciplinary record
                  </p>

                  <p className="dark:text-emerald-400/80 mt-0.5 text-emerald-700/80 text-xs">
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
                      className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:hover:border-slate-700 group hover:border-slate-300 dark:border-slate-700 p-4 rounded-2xl transition-all"
                    >

                      <div className="flex flex-col gap-3 justify-between sm:flex-row sm:items-center">

                        {/* Fine information */}
                        <div className="min-w-0">

                          <div className="flex flex-wrap gap-2 items-center">

                            <span
                              className={`w-2 h-2 rounded-full ${isServed ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            />

                            <h4 className="dark:text-white font-bold sm:text-sm text-slate-900 text-xs">
                              {fine.infraction}
                            </h4>

                            <span className="dark:text-rose-400 font-bold font-mono text-rose-600 text-xs">
                              ₹{Number(fine.amount).toLocaleString()}
                            </span>

                          </div>

                          <p className="dark:text-slate-400 mt-1.5 text-[11px] text-slate-500">
                            {fine.disciplinaryAction}
                          </p>

                          <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mt-2 text-[10px] text-slate-400">

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
                        <div className="flex gap-2 items-center shrink-0">

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border ${isServed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' }`}
                          >
                            {isServed
                              ? <CheckCircle2 className="h-3 w-3" />
                              : <AlertTriangle className="h-3 w-3" />
                            }

                            {isServed ? 'Paid' : 'Due'}
                          </span>

                          <button
                            onClick={() => toggleFineStatus(fine.id)}
                            className="bg-white cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold hover:bg-slate-700 px-3 py-1.5 rounded-lg text-[10px] text-white transition-colors"
                          >
                            {isServed ? 'Revert' : 'Mark Paid'}
                          </button>

                          <ChevronRight className="dark:text-slate-700 h-4 hidden sm:block text-slate-700 w-4" />

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

            <div className="flex gap-2 items-center mb-3">

              <div className="bg-slate-100 dark:bg-slate-900 dark:text-slate-400 flex h-8 items-center justify-center rounded-lg text-slate-600 w-8">
                <HistoryIcon />
              </div>

              <div>
                <h3 className="dark:text-white font-bold text-slate-900 text-sm">
                  Hostel Activity
                </h3>

                <p className="dark:text-slate-400 text-[10px] text-slate-500">
                  Recorded gate activity
                </p>
              </div>

            </div>

            <div className="gap-3 grid grid-cols-2">

              <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-4 rounded-2xl">

                <p className="font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                  Total Records
                </p>

                <p className="dark:text-white font-bold mt-1 text-slate-900 text-xl">
                  {studentLogs.length}
                </p>

                <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500">
                  Entry / exit events
                </p>

              </div>

              <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-4 rounded-2xl">

                <p className="font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                  Account Status
                </p>

                <p className="dark:text-emerald-400 font-bold mt-1 text-emerald-600 text-xl">
                  {student.status || 'Active'}
                </p>

                <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500">
                  Hostel residence
                </p>

              </div>

            </div>

          </section>

        </div>

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <div className="backdrop-blur bg-white border-slate-200 dark:border-slate-800 border-t bottom-0 dark:bg-slate-950/95 flex justify-end px-5 py-4 sm:px-7 sticky">

          <button
            onClick={onClose}
            className="bg-white cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold hover:bg-slate-700 px-5 py-2.5 rounded-xl text-white text-xs transition-colors"
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
    <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 p-3 rounded-2xl">

      <div className="flex gap-2 items-center justify-between">

        <p className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
          {label}
        </p>

        <Icon className={`w-3.5 h-3.5 ${iconClass}`} />

      </div>

      <p className="dark:text-white font-bold mt-1 text-slate-900 text-sm truncate">
        {value}
      </p>

      <p className="dark:text-slate-400 mt-0.5 text-[9px] text-slate-500 truncate">
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
      className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${className}`}
    >

      <div className="flex gap-2.5 items-center mb-4">

        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h4 className="dark:text-white font-bold text-slate-900 text-xs">
            {title}
          </h4>

          <p className="dark:text-slate-400 text-[9px] text-slate-500">
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
      <p className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}


function HistoryIcon() {
  return (
    <svg
      className="h-4 w-4"
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