import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Download, 
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LogsPage() {
  const { logs, triggerSimulatedScan, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [curfewFilter, setCurfewFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.gate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDirection = directionFilter === 'ALL' || log.direction === directionFilter;
    const matchesCurfew = 
      curfewFilter === 'ALL' ||
      (curfewFilter === 'VIOLATIONS' && log.curfewAlert) ||
      (curfewFilter === 'NORMAL' && !log.curfewAlert);

    return matchesSearch && matchesDirection && matchesCurfew;
  });

  const totalIn = logs.filter(l => l.direction === 'IN').length;
  const totalOut = logs.filter(l => l.direction === 'OUT').length;
  const curfewBreaches = logs.filter(l => l.curfewAlert).length;

  const exportToCSV = () => {
    const headers = ["Event ID", "Student ID", "Student Name", "Room", "Direction", "Timestamp", "Gate", "Verification Method", "Status", "Curfew Breach", "Remarks"];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.studentId}"`,
      `"${l.studentName}"`,
      `"${l.room}"`,
      `"${l.direction}"`,
      `"${l.timestamp}"`,
      `"${l.gate}"`,
      `"${l.method}"`,
      `"${l.status}"`,
      `"${l.curfewAlert ? 'YES' : 'NO'}"`,
      `"${l.remarks}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hostel_Access_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Export Completed", `${filteredLogs.length} logs exported to CSV.`, "success");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hostel Inbound & Outbound Movement Logs</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
              {logs.length} Total Events
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time access tracking across campus gates and hostel turnstiles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerSimulatedScan}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Log</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Scans</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">{logs.length}</p>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Entries (IN)</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{totalIn}</p>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exits (OUT)</span>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono mt-0.5">{totalOut}</p>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Curfew Breaches</span>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">{curfewBreaches}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, ID, room, or gate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Direction:</span>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Directions</option>
              <option value="IN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">IN (Inbound)</option>
              <option value="OUT" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">OUT (Outbound)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Status:</span>
            <select
              value={curfewFilter}
              onChange={(e) => setCurfewFilter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Statuses</option>
              <option value="VIOLATIONS" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400">Curfew Violations</option>
              <option value="NORMAL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Authorized Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Gate Location</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.map((log) => {
                const isIn = log.direction === 'IN';
                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{log.id}</td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={log.avatar}
                          alt={log.studentName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">{log.studentName}</p>
                          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {log.studentId} • Room {log.room}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
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

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {log.gate}
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {log.method}
                    </td>

                    <td className="py-3 px-4">
                      {log.curfewAlert ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Curfew Breach
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Authorized
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 max-w-xs truncate text-[11px]">
                      {log.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
