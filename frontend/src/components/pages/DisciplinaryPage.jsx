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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Disciplinary Incidents</h2>
            {openCount > 0 && (
              <span className="px-2 py-0.5 rounded border bg-rose-500/10 border-rose-500/20 text-rose-400 text-[9px] font-mono font-bold">
                {openCount} OPEN
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            AI-detected indisciplinary incidents from camera feeds, curfew violations and manual reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerSimulatedScan}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 cursor-pointer transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Simulate Detection
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Incident
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={FileWarning} label="Total Incidents" value={fines.length} />
        <StatCard icon={AlertTriangle} label="Open Incidents" value={openCount} accent="rose" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolvedCount} accent="emerald" />
        <StatCard icon={IndianRupee} label="Fines Collected" value={`₹${collectedAmount.toLocaleString()}`} sub={`of ₹${totalAmount.toLocaleString()}`} />
      </div>

      {/* AI Detection Summary */}
      {curfewViolations > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <Camera className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-300">AI Detected {curfewViolations} Curfew Violation{curfewViolations !== 1 ? 's' : ''}</p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              Camera detected students entering the hostel after curfew. Consider logging formal disciplinary action.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer transition whitespace-nowrap"
          >
            Log Action
          </button>
        </div>
      )}

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-[#0b1320] border border-slate-800 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, incident or ID…"
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-rose-500/40 transition"
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
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-bold text-slate-200">INCIDENT REGISTER</span>
          </div>
          <span className="text-[9px] font-mono text-slate-600">{filtered.length} CASES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                {['CASE', 'STUDENT', 'INCIDENT', 'AMOUNT', 'STATUS', 'EVIDENCE', 'ACTIONS'].map(h => (
                  <th key={h} className="px-4 py-3 text-[8px] font-mono font-semibold tracking-wider text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(fine => {
                const isServed = fine.status === 'Served / Paid';
                return (
                  <tr key={fine.id} className="hover:bg-rose-500/[0.02] transition">

                    {/* CASE */}
                    <td className="px-4 py-3">
                      <div className="font-mono text-[10px] text-rose-400">{fine.id}</div>
                      <div className="text-[8px] text-slate-600 font-mono mt-1">INCIDENT</div>
                    </td>

                    {/* STUDENT */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={fine.avatar} alt={fine.studentName} className="w-7 h-7 rounded-md object-cover border border-slate-700" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{fine.studentName}</div>
                          <div className="flex items-center gap-1 text-[9px] text-slate-600 font-mono mt-0.5">
                            <UserRound className="w-2.5 h-2.5" />
                            {fine.studentId} · R{fine.room}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* INCIDENT */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={fine.severity} />
                        <span className="text-xs font-semibold text-slate-300 truncate">{fine.infraction}</span>
                      </div>
                      <p className="text-[9px] text-slate-600 mt-1 truncate">{fine.disciplinaryAction}</p>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-xs text-slate-200">₹{fine.amount.toLocaleString()}</div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {isServed ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                          <Check className="w-3 h-3" />
                          RESOLVED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[9px] font-bold">
                          <XCircle className="w-3 h-3" />
                          OPEN
                        </span>
                      )}
                    </td>

                    {/* EVIDENCE */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="flex items-start gap-2">
                        <Camera className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 truncate">{fine.evidence}</p>
                          <p className="text-[8px] text-slate-600 font-mono mt-1">BY {fine.issuedBy}</p>
                        </div>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleFineStatus(fine.id)}
                          className={`px-2.5 py-1.5 rounded-md text-[9px] font-semibold cursor-pointer transition ${isServed ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                        >
                          {isServed ? 'Reopen' : 'Resolve'}
                        </button>
                        <button
                          onClick={() => setSelectedFine(fine)}
                          title="Send Guardian Notice"
                          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition"
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

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-500 mt-3">No incidents match the current filters.</p>
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
    slate: 'text-white'
  };
  return (
    <div className="p-4 bg-[#0b1320] border border-slate-800 rounded-xl">
      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mb-2">
        <Icon className={`w-3.5 h-3.5 ${accent === 'rose' ? 'text-rose-400' : accent === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`} />
        {label}
      </div>
      <div className={`text-xl font-bold font-mono ${colors[accent]}`}>{value}</div>
      {sub && <div className="text-[9px] text-slate-600 font-mono mt-1">{sub}</div>}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const styles = {
    Critical: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    High: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    Medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    Low: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };
  return (
    <span className={`px-1.5 py-0.5 rounded border text-[8px] font-mono font-bold shrink-0 ${styles[severity] || 'bg-slate-800 border-slate-700 text-slate-400'}`}>
      {severity?.toUpperCase()}
    </span>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg px-3">
      <span className="text-[8px] font-mono text-slate-600">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-[10px] text-slate-300 py-2 outline-none cursor-pointer">
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-[#0a111d]">{l}</option>
        ))}
      </select>
    </div>
  );
}
