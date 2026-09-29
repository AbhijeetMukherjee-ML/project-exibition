import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Home, 
  Phone, 
  History, 
  Scale, 
  CheckCircle, 
  XCircle,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StudentDetailModal({ student, onClose }) {
  const { logs, fines, toggleFineStatus } = useApp();

  const studentLogs = logs.filter(l => l.studentId === student.id || l.studentName === student.name);
  const studentFines = fines.filter(f => f.studentId === student.id || f.studentName === student.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{student.name}</h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    student.status === 'Active'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">{student.id} • {student.department}</p>
              <p className="text-xs text-slate-400">{student.year} • Enrolled {student.joinedDate}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Room Allotment
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{student.room} ({student.bed || 'Bed 1'})</p>
            <p className="text-slate-500 dark:text-slate-400">{student.block}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Biometric Status
            </span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {student.faceEnrolled ? `Face Enrolled (${student.faceConfidence})` : 'Pending'}
            </p>
            <p className="text-slate-500 dark:text-slate-400">Blood Group: {student.bloodGroup}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 md:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Emergency & Guardian Info
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {student.guardianName} ({student.guardianRelation}) — <span className="font-mono text-blue-600 dark:text-blue-400">{student.guardianPhone}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400">{student.address || 'Address on record'}</p>
          </div>
        </div>

        {/* Disciplinary History */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-rose-500" />
            Disciplinary Records & Fines ({studentFines.length})
          </span>

          {studentFines.length === 0 ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Clean record. No disciplinary violations logged against this student.</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {studentFines.map(fine => {
                const isServed = fine.status === "Served / Paid";
                return (
                  <div key={fine.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">{fine.infraction}</span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">₹{fine.amount}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{fine.disciplinaryAction}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                          isServed
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        {isServed ? 'SERVED' : 'DUE'}
                      </span>
                      <button
                        onClick={() => toggleFineStatus(fine.id)}
                        className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-semibold cursor-pointer"
                      >
                        {isServed ? 'Revert' : 'Mark Served'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
