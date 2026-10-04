import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Camera,
  Search,
  Plus,
  Bell,
  Check,
  XCircle,
  FileWarning,
  IndianRupee,
  CheckCircle2,
  Eye,
  UserRound,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddFineModal from '../modals/AddFineModal';
import GuardianNoticeModal from '../modals/GuardianNoticeModal';

export default function DisciplinaryPage() {
  const { fines, toggleFineStatus, triggerSimulatedScan, logs } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  const filtered = fines.filter(f => {
    const q = search.toLowerCase();
    const matchSearch =
      f.studentName.toLowerCase().includes(q) ||
      f.studentId.toLowerCase().includes(q) ||
      f.infraction.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && f.status !== 'Served / Paid') ||
      (statusFilter === 'RESOLVED' && f.status === 'Served / Paid');
    const matchSev =
      severityFilter === 'ALL' || f.severity === severityFilter;
    return matchSearch && matchStatus && matchSev;
  });

  const openCount = fines.filter(f => f.status !== 'Served / Paid').length;
  const resolvedCount = fines.filter(f => f.status === 'Served / Paid').length;
  const totalAmount = fines.reduce((a, f) => a + f.amount, 0);
  const collectedAmount = fines.filter(f => f.status === 'Served / Paid').reduce((a, f) => a + f.amount, 0);
  const curfewViolations = logs.filter(l => l.curfewAlert).length;

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
        <div>
          <div className="flex gap-2.5 items-center mb-1">
            <div className="bg-rose-500/10 border border-rose-500/20 flex h-9 items-center justify-center rounded-xl w-9">
              <ShieldAlert className="h-5 text-rose-400 w-5" />
            </div>
            <h2 className="dark:text-white font-bold text-slate-900 text-xl">Disciplinary Incidents</h2>
            {openCount > 0 && (
              <span className="bg-rose-500/10 border border-rose-500/20 font-bold font-mono px-2 py-0.5 rounded text-[9px] text-rose-400">
                {openCount} OPEN
              </span>
            )}
          </div>
          <p className="dark:text-slate-400 text-slate-500 text-xs">
            AI-detected indisciplinary incidents from camera feeds, curfew violations and manual reports.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={triggerSimulatedScan}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 cursor-pointer flex font-semibold gap-1.5 hover:bg-slate-800 items-center px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 text-xs transition"
          >
            <Zap className="dark:text-amber-400 h-3.5 text-amber-600 w-3.5" />
            Simulate Detection
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-rose-600 cursor-pointer dark:text-white flex font-semibold gap-1.5 hover:bg-rose-500 items-center px-4 py-1.5 rounded-lg shadow-sm text-slate-900 text-xs transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Incident
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileWarning} label="Total Incidents" value={fines.length} />
        <StatCard icon={AlertTriangle} label="Open Incidents" value={openCount} accent="rose" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolvedCount} accent="emerald" />
        <StatCard icon={IndianRupee} label="Fines Collected" value={`₹${collectedAmount.toLocaleString()}`} sub={`of ₹${totalAmount.toLocaleString()}`} />
      </div>

      {/* AI Detection Summary */}
      {curfewViolations > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 flex gap-3 items-start p-4 rounded-xl">
          <Camera className="dark:text-amber-400 h-5 mt-0.5 shrink-0 text-amber-600 w-5" />
          <div className="flex-1 min-w-0">
            <p className="dark:text-amber-300 font-bold text-amber-600 text-sm">AI Detected {curfewViolations} Curfew Violation{curfewViolations !== 1 ? 's' : ''}</p>
            <p className="dark:text-amber-600 mt-0.5 text-amber-700/80 text-xs">
              Camera detected students entering the hostel after curfew. Consider logging formal disciplinary action.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-amber-500/20 cursor-pointer dark:text-amber-300 font-semibold hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-amber-600 text-xs transition whitespace-nowrap"
          >
            Log Action
          </button>
        </div>
      )}

      {/* FILTER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 p-3 rounded-xl sm:flex-row">
        <div className="flex-1 relative">
          <Search className="-translate-y-1/2 absolute dark:text-slate-400 h-3.5 left-3 text-slate-600 top-1/2 w-3.5" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, incident or ID…"
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 dark:placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:border-rose-500/40 outline-none pl-9 placeholder:text-slate-400 pr-3 py-2 rounded-lg text-slate-900 dark:text-white text-xs transition w-full"
          />
        </div>

        <SelectFilter
          label="STATUS"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[['ALL', 'All'], ['OPEN', 'Open'], ['RESOLVED', 'Resolved']]}
        />
        <SelectFilter
          label="SEVERITY"
          value={severityFilter}
          onChange={setSeverityFilter}
          options={[['ALL', 'All'], ['Critical', 'Critical'], ['High', 'High'], ['Medium', 'Medium'], ['Low', 'Low']]}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
          <div className="flex gap-2 items-center">
            <ShieldAlert className="h-3.5 text-rose-400 w-3.5" />
            <span className="font-bold text-slate-900 dark:text-white text-xs">INCIDENT REGISTER</span>
          </div>
          <span className="dark:text-slate-400 font-mono text-[9px] text-slate-600">{filtered.length} CASES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="text-left w-full">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {['CASE', 'STUDENT', 'INCIDENT', 'AMOUNT', 'STATUS', 'EVIDENCE', 'ACTIONS'].map(h => (
                  <th key={h} className="dark:text-slate-400 font-mono font-semibold px-4 py-3 text-[8px] text-slate-600 tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-slate-800 divide-y">
              {filtered.map(fine => {
                const isServed = fine.status === 'Served / Paid';
                return (
                  <tr key={fine.id} className="hover:bg-rose-500/[0.02] transition">

                    {/* CASE */}
                    <td className="px-4 py-3">
                      <div className="font-mono text-[10px] text-rose-400">{fine.id}</div>
                      <div className="dark:text-slate-400 font-mono mt-1 text-[8px] text-slate-600">INCIDENT</div>
                    </td>

                    {/* STUDENT */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2.5 items-center">
                        <img src={fine.avatar} alt={fine.studentName} className="border border-slate-300 dark:border-slate-700 h-7 object-cover rounded-md w-7" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-xs">{fine.studentName}</div>
                          <div className="dark:text-slate-400 flex font-mono gap-1 items-center mt-0.5 text-[9px] text-slate-600">
                            <UserRound className="h-2.5 w-2.5" />
                            {fine.studentId} · R{fine.room}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* INCIDENT */}
                    <td className="max-w-[220px] px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <SeverityBadge severity={fine.severity} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">{fine.infraction}</span>
                      </div>
                      <p className="dark:text-slate-400 mt-1 text-[9px] text-slate-600 truncate">{fine.disciplinaryAction}</p>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-4 py-3">
                      <div className="font-bold font-mono text-slate-900 dark:text-white text-xs">₹{fine.amount.toLocaleString()}</div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {isServed ? (
                        <span className="bg-emerald-500/5 border border-emerald-500/20 font-bold gap-1.5 inline-flex items-center px-2 py-1 rounded-md text-[9px] text-emerald-400">
                          <Check className="h-3 w-3" />
                          RESOLVED
                        </span>
                      ) : (
                        <span className="bg-rose-500/5 border border-rose-500/20 font-bold gap-1.5 inline-flex items-center px-2 py-1 rounded-md text-[9px] text-rose-400">
                          <XCircle className="h-3 w-3" />
                          OPEN
                        </span>
                      )}
                    </td>

                    {/* EVIDENCE */}
                    <td className="max-w-[200px] px-4 py-3">
                      <div className="flex gap-2 items-start">
                        <Camera className="h-3.5 mt-0.5 shrink-0 text-blue-400 w-3.5" />
                        <div>
                          <p className="text-[10px] text-slate-400 truncate">{fine.evidence}</p>
                          <p className="dark:text-slate-400 font-mono mt-1 text-[8px] text-slate-600">BY {fine.issuedBy}</p>
                        </div>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 items-center">
                        <button
                          onClick={() => toggleFineStatus(fine.id)}
                          className={`px-2.5 py-1.5 rounded-md text-[9px] font-semibold cursor-pointer transition ${isServed ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-emerald-600 text-slate-900 dark:text-white hover:bg-emerald-500'}`}
                        >
                          {isServed ? 'Reopen' : 'Resolve'}
                        </button>
                        <button
                          onClick={() => setSelectedFine(fine)}
                          title="Send Guardian Notice"
                          className="bg-slate-800 cursor-pointer dark:text-white hover:bg-slate-700 hover:text-slate-900 p-1.5 rounded-md text-slate-500 transition"
                        >
                          <Bell className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <CheckCircle2 className="h-7 mx-auto text-emerald-500 w-7" />
            <p className="dark:text-slate-400 mt-3 text-slate-500 text-xs">No incidents match the current filters.</p>
          </div>
        )}
      </div>

      {isAddOpen && <AddFineModal onClose={() => setIsAddOpen(false)} />}
      {selectedFine && <GuardianNoticeModal fine={selectedFine} onClose={() => setSelectedFine(null)} />}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = 'slate', sub }) {
  const colors = {
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
    slate: 'text-slate-900 dark:text-white'
  };
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
      <div className="dark:text-slate-400 flex font-mono gap-2 items-center mb-2 text-[9px] text-slate-500">
        <Icon className={`w-3.5 h-3.5 ${accent === 'rose' ? 'text-rose-400' : accent === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`} />
        {label}
      </div>
      <div className={`text-xl font-bold font-mono ${colors[accent]}`}>{value}</div>
      {sub && <div className="dark:text-slate-400 font-mono mt-1 text-[9px] text-slate-600">{sub}</div>}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const styles = {
    Critical: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    High: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    Medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    Low: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };
  return (
    <span className={`px-1.5 py-0.5 rounded border text-[8px] font-mono font-bold shrink-0 ${styles[severity] || 'bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'}`}>
      {severity?.toUpperCase()}
    </span>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 flex gap-2 items-center px-3 rounded-lg">
      <span className="dark:text-slate-400 font-mono text-[8px] text-slate-600">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent cursor-pointer outline-none py-2 text-[10px] text-slate-800 dark:text-slate-200">
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-white dark:bg-slate-950">{l}</option>
        ))}
      </select>
    </div>
  );
}
