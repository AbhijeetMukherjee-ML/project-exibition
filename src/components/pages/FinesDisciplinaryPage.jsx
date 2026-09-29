import React, { useState } from 'react';
import { 
  Scale, 
  Search, 
  XCircle, 
  Plus, 
  Bell, 
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddFineModal from '../modals/AddFineModal';
import GuardianNoticeModal from '../modals/GuardianNoticeModal';

export default function FinesDisciplinaryPage() {
  const { fines, toggleFineStatus, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [isAddFineOpen, setIsAddFineOpen] = useState(false);
  const [selectedFineForGuardianNotice, setSelectedFineForGuardianNotice] = useState(null);

  const filteredFines = fines.filter(fine => {
    const matchesSearch = 
      fine.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.infraction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'UNSERVED' && fine.status !== "Served / Paid") ||
      (statusFilter === 'SERVED' && fine.status === "Served / Paid");

    const matchesSeverity = severityFilter === 'ALL' || fine.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const totalFines = fines.length;
  const servedFines = fines.filter(f => f.status === "Served / Paid").length;
  const unservedFines = fines.filter(f => f.status !== "Served / Paid").length;
  const totalAmount = fines.reduce((acc, f) => acc + f.amount, 0);
  const collectedAmount = fines.filter(f => f.status === "Served / Paid").reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Disciplinary Records & Fine Clearance</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
              {unservedFines} Unresolved
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track student rule infractions, penalty collections, and verify served status
          </p>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddFineOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Disciplinary Notice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Notices</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">{totalFines}</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Unserved / Pending</span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">{unservedFines} Students</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Served / Settled</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{servedFines} Cleared</p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fine Recovery</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
            ₹{collectedAmount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ ₹{totalAmount.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, ID, room, or infraction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Records</option>
              <option value="UNSERVED" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-300">Unserved / Pending</option>
              <option value="SERVED" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-300">Served / Paid</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Severities</option>
              <option value="Critical" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400">Critical</option>
              <option value="High" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400">High</option>
              <option value="Medium" className="bg-white dark:bg-slate-900 text-yellow-600 dark:text-yellow-400">Medium</option>
              <option value="Low" className="bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disciplinary Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Notice ID</th>
                <th className="py-3 px-4">Student Resident</th>
                <th className="py-3 px-4">Infraction & Penalty Action</th>
                <th className="py-3 px-4">Fine (₹)</th>
                <th className="py-3 px-4">Served Status</th>
                <th className="py-3 px-4">Evidence / Issuer</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredFines.map((fine) => {
                const isServed = fine.status === "Served / Paid";
                return (
                  <tr key={fine.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{fine.id}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={fine.avatar}
                          alt={fine.studentName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">{fine.studentName}</p>
                          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {fine.studentId} • Room {fine.room}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                            fine.severity === 'Critical'
                              ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              : fine.severity === 'High'
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {fine.severity}
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{fine.infraction}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{fine.disciplinaryAction}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        ₹{fine.amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {isServed ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            SERVED / PAID
                          </span>
                          {fine.paymentMethod && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                              {fine.paymentMethod}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          UNSERVED / PENDING
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs">
                      <p className="truncate text-slate-700 dark:text-slate-300">{fine.evidence}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">By: {fine.issuedBy}</p>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleFineStatus(fine.id)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            isServed
                              ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                          }`}
                        >
                          {isServed ? 'Revert' : 'Mark Served'}
                        </button>

                        <button
                          onClick={() => setSelectedFineForGuardianNotice(fine)}
                          title="Official Notice"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isAddFineOpen && <AddFineModal onClose={() => setIsAddFineOpen(false)} />}
      {selectedFineForGuardianNotice && (
        <GuardianNoticeModal
          fine={selectedFineForGuardianNotice}
          onClose={() => setSelectedFineForGuardianNotice(null)}
        />
      )}
    </div>
  );
}
