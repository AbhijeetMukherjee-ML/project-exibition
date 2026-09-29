import React, { useState } from 'react';
import { 
  History, 
  Scale, 
  QrCode, 
  CheckCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Home, 
  ShieldCheck, 
  Phone,
  GraduationCap
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
    l => l.studentId === currentStudent.id || l.studentName === currentStudent.name
  );

  const studentFines = fines.filter(
    f => f.studentId === currentStudent.id || f.studentName === currentStudent.name
  );

  const pendingFines = studentFines.filter(f => f.status !== "Served / Paid");
  const servedFines = studentFines.filter(f => f.status === "Served / Paid");
  const pendingAmount = pendingFines.reduce((acc, f) => acc + f.amount, 0);
  const curfewAlertCount = studentLogs.filter(l => l.curfewAlert).length;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 animate-in fade-in duration-200">
      
      {/* ================= LEFT SIDE: STUDENT PROFILE BOX ================= */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
        
        {/* Main Profile Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          
          {/* Avatar & Name */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate leading-tight">{currentStudent.name}</h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">{currentStudent.id}</p>
              <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 font-medium">
                {currentStudent.status} Resident
              </span>
            </div>
          </div>

          {/* Academic & Room Details */}
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Hostel Room</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {currentStudent.room} • {currentStudent.block}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Department & Year</span>
              <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {currentStudent.department} ({currentStudent.year})
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Biometric Enrollment</span>
              <p className="font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Face Match {currentStudent.faceConfidence}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Guardian Contact</span>
              <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {currentStudent.guardianPhone} ({currentStudent.guardianRelation})
              </p>
            </div>
          </div>

          {/* Demo Student Switcher */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
              Demo Student Switcher
            </span>
            <select
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {s.name} ({s.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI Stat Card on Left */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
            Account Summary
          </span>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Gate Movements:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{studentLogs.length}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Curfew Alerts:</span>
            <span className={`font-mono font-bold ${curfewAlertCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {curfewAlertCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800">
            <span>Unpaid Fines:</span>
            <span className={`font-mono font-bold ${pendingAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ₹{pendingAmount.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* ================= CENTER & RIGHT: LOGS & FINES LONG BAR SECTION ================= */}
      <div className="flex-1 min-w-0 space-y-4 w-full">
        
        {/* Long Bar Navigation Header */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>My Inbound & Outbound Movement Logs ({studentLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fines')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'fines'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>My Disciplinary Actions & Fines ({studentFines.length})</span>
            {pendingFines.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-100 dark:bg-white text-rose-700 dark:text-rose-600 font-bold ml-1">
                ₹{pendingAmount} Due
              </span>
            )}
          </button>
        </div>

        {/* 1. MOVEMENT LOGS (LONG BAR VIEW) */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Access Movement History</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Recorded logs from biometric turnstiles and gate cameras</p>
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {studentLogs.length} Records Found
              </span>
            </div>

            {studentLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
                No entry/exit movement logs recorded yet for your account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Event ID</th>
                      <th className="py-3 px-4">Direction</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Gate Location</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {studentLogs.map((log) => {
                      const isIn = log.direction === 'IN';
                      return (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{log.id}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${
                                isIn
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isIn ? <ArrowDownLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <ArrowUpRight className="w-3 h-3 text-slate-500 dark:text-slate-400" />}
                              {log.direction}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-900 dark:text-white whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">{log.gate}</td>
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.method}</td>
                          <td className="py-3.5 px-4">
                            {log.curfewAlert ? (
                              <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Curfew Violation
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Authorized</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 max-w-xs truncate">{log.remarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 2. FINES & ACTIONS (LONG BAR VIEW) */}
        {activeTab === 'fines' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Disciplinary Infractions & Fine Clearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pay outstanding fines via UPI QR Code to clear penalties</p>
              </div>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-2.5 py-1 rounded">
                Pending: ₹{pendingAmount.toLocaleString()}
              </span>
            </div>

            {studentFines.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">No Disciplinary Penalties</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">You have zero unpaid fines or disciplinary notices on record.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentFines.map((fine) => {
                  const isServed = fine.status === "Served / Paid";
                  return (
                    <div
                      key={fine.id}
                      className={`p-4 rounded-xl bg-white dark:bg-slate-900 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                        isServed ? 'border-slate-200 dark:border-slate-800' : 'border-rose-300 dark:border-rose-900/60'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                            {fine.id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {fine.infraction}
                          </h4>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                              isServed
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                            }`}
                          >
                            {isServed ? 'SERVED / PAID' : 'UNSERVED / DUE'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-800 dark:text-slate-300">Action:</strong> {fine.disciplinaryAction} • <span className="text-slate-400 dark:text-slate-500">Date: {fine.issuedDate}</span>
                        </p>

                        {isServed && fine.servedDate && (
                          <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                            ✓ Paid & Settled on {fine.servedDate} ({fine.paymentMethod || 'UPI QR'})
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block">Fine Amount</span>
                          <span className="text-base font-bold font-mono text-slate-900 dark:text-white">₹{fine.amount.toLocaleString()}</span>
                        </div>

                        {!isServed ? (
                          <button
                            onClick={() => setSelectedFineForPayment(fine)}
                            className="py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>Pay via UPI QR</span>
                          </button>
                        ) : (
                          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            ✓ Cleared
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Payment QR Modal */}
      {selectedFineForPayment && (
        <PaymentQRModal
          fine={selectedFineForPayment}
          onClose={() => setSelectedFineForPayment(null)}
        />
      )}
    </div>
  );
}
