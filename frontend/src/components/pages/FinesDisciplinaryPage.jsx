import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  XCircle,
  Plus,
  Bell,
  Check,
  Camera,
  FileWarning,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  UserRound
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import AddFineModal from '../modals/AddFineModal';
import GuardianNoticeModal from '../modals/GuardianNoticeModal';

export default function FinesDisciplinaryPage() {
  const {
    fines,
    toggleFineStatus
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [isAddFineOpen, setIsAddFineOpen] = useState(false);
  const [selectedFineForGuardianNotice, setSelectedFineForGuardianNotice] =
    useState(null);

  const filteredFines = fines.filter(fine => {

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      fine.studentName.toLowerCase().includes(search) ||
      fine.studentId.toLowerCase().includes(search) ||
      fine.infraction.toLowerCase().includes(search) ||
      fine.room.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNSERVED' &&
        fine.status !== 'Served / Paid') ||
      (statusFilter === 'SERVED' &&
        fine.status === 'Served / Paid');

    const matchesSeverity =
      severityFilter === 'ALL' ||
      fine.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const totalFines = fines.length;
  const servedFines = fines.filter(
    f => f.status === 'Served / Paid'
  ).length;

  const unservedFines = fines.filter(
    f => f.status !== 'Served / Paid'
  ).length;

  const totalAmount = fines.reduce(
    (acc, f) => acc + f.amount,
    0
  );

  const collectedAmount = fines
    .filter(f => f.status === 'Served / Paid')
    .reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-bold text-white">
                Security Incidents & Enforcement
              </h2>

              <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono text-rose-400">
                {unservedFines} OPEN
              </span>

            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              Review CCTV-linked incidents, disciplinary actions and fine settlements
            </p>

          </div>

        </div>

        <button
          onClick={() => setIsAddFineOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Security Incident
        </button>

      </div>

      {/* SYSTEM STATUS */}
      <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-3 flex flex-wrap items-center gap-6">

        <Status icon={Camera} label="EVIDENCE ENGINE" value="CONNECTED" />

        <Status icon={Eye} label="CCTV EVENTS" value="MONITORED" />

        <Status icon={FileWarning} label="OPEN CASES" value={unservedFines} />

        <Status icon={CheckCircle2} label="RESOLVED" value={servedFines} />

      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <Metric
          icon={FileWarning}
          label="TOTAL INCIDENTS"
          value={totalFines}
        />

        <Metric
          icon={AlertTriangle}
          label="OPEN INCIDENTS"
          value={unservedFines}
          danger
        />

        <Metric
          icon={CheckCircle2}
          label="RESOLVED"
          value={servedFines}
          positive
        />

        <Metric
          icon={IndianRupee}
          label="RECOVERED"
          value={`₹${collectedAmount.toLocaleString()}`}
          sub={`of ₹${totalAmount.toLocaleString()}`}
        />

      </div>

      {/* FILTER */}
      <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-3 flex flex-col lg:flex-row gap-3">

        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />

          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search resident, incident, room or ID..."
            className="w-full pl-9 pr-3 py-2 bg-[#070d17] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-rose-500/40"
          />

        </div>

        <Filter
          label="STATUS"
          value={statusFilter}
          setValue={setStatusFilter}
          options={[
            ['ALL', 'All'],
            ['UNSERVED', 'Open'],
            ['SERVED', 'Resolved']
          ]}
        />

        <Filter
          label="SEVERITY"
          value={severityFilter}
          setValue={setSeverityFilter}
          options={[
            ['ALL', 'All'],
            ['Critical', 'Critical'],
            ['High', 'High'],
            ['Medium', 'Medium'],
            ['Low', 'Low']
          ]}
        />

      </div>

      {/* INCIDENT TABLE */}
      <div className="border border-slate-800 bg-[#0a111d] rounded-xl overflow-hidden">

        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />

            <span className="text-xs font-semibold text-slate-300">
              INCIDENT REGISTER
            </span>

          </div>

          <span className="text-[9px] font-mono text-slate-600">
            {filteredFines.length} CASES
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[#070d17] border-b border-slate-800">

              <tr>

                <Th>CASE</Th>
                <Th>RESIDENT</Th>
                <Th>INCIDENT</Th>
                <Th>AMOUNT</Th>
                <Th>STATUS</Th>
                <Th>EVIDENCE</Th>
                <Th>ACTION</Th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-800">

              {filteredFines.map(fine => {

                const isServed =
                  fine.status === 'Served / Paid';

                return (
                  <tr
                    key={fine.id}
                    className="hover:bg-rose-500/[0.02] transition"
                  >

                    {/* CASE */}
                    <td className="px-4 py-3">

                      <div className="font-mono text-[10px] text-rose-400">
                        {fine.id}
                      </div>

                      <div className="text-[8px] text-slate-600 font-mono mt-1">
                        SECURITY CASE
                      </div>

                    </td>

                    {/* RESIDENT */}
                    <td className="px-4 py-3">

                      <div className="flex items-center gap-2.5">

                        <img
                          src={fine.avatar}
                          alt={fine.studentName}
                          className="w-7 h-7 rounded-md object-cover border border-slate-700"
                        />

                        <div>

                          <div className="text-xs font-semibold text-slate-200">
                            {fine.studentName}
                          </div>

                          <div className="flex items-center gap-1 text-[9px] text-slate-600 font-mono mt-0.5">
                            <UserRound className="w-2.5 h-2.5" />
                            {fine.studentId} · R{fine.room}
                          </div>

                        </div>

                      </div>

                    </td>

                    {/* INCIDENT */}
                    <td className="px-4 py-3 max-w-[260px]">

                      <div className="flex items-center gap-2">

                        <SeverityBadge severity={fine.severity} />

                        <span className="text-xs font-semibold text-slate-300 truncate">
                          {fine.infraction}
                        </span>

                      </div>

                      <p className="text-[10px] text-slate-600 mt-1 truncate">
                        {fine.disciplinaryAction}
                      </p>

                    </td>

                    {/* AMOUNT */}
                    <td className="px-4 py-3">

                      <div className="font-mono font-bold text-xs text-slate-200">
                        ₹{fine.amount.toLocaleString()}
                      </div>

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">

                      {isServed ? (

                        <div>

                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            <Check className="w-3 h-3" />
                            RESOLVED
                          </span>

                          {fine.paymentMethod && (
                            <div className="text-[8px] text-slate-600 font-mono mt-1">
                              {fine.paymentMethod}
                            </div>
                          )}

                        </div>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[9px] font-bold">
                          <XCircle className="w-3 h-3" />
                          OPEN
                        </span>

                      )}

                    </td>

                    {/* EVIDENCE */}
                    <td className="px-4 py-3 max-w-[220px]">

                      <div className="flex items-start gap-2">

                        <Camera className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />

                        <div>

                          <p className="text-[10px] text-slate-400 truncate">
                            {fine.evidence}
                          </p>

                          <p className="text-[8px] text-slate-600 font-mono mt-1">
                            ISSUED BY {fine.issuedBy}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3">

                      <div className="flex items-center gap-1.5">

                        <button
                          onClick={() => toggleFineStatus(fine.id)}
                          className={`px-2.5 py-1.5 rounded-md text-[9px] font-semibold cursor-pointer ${
                            isServed
                              ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {isServed
                            ? 'Reopen'
                            : 'Resolve Case'}
                        </button>

                        <button
                          onClick={() =>
                            setSelectedFineForGuardianNotice(fine)
                          }
                          title="Send Guardian Notice"
                          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
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

        {filteredFines.length === 0 && (
          <div className="py-16 text-center">

            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />

            <p className="text-xs text-slate-500 mt-3">
              No security incidents match the current filters.
            </p>

          </div>
        )}

      </div>

      {/* MODALS */}

      {isAddFineOpen && (
        <AddFineModal
          onClose={() => setIsAddFineOpen(false)}
        />
      )}

      {selectedFineForGuardianNotice && (
        <GuardianNoticeModal
          fine={selectedFineForGuardianNotice}
          onClose={() => setSelectedFineForGuardianNotice(null)}
        />
      )}

    </div>
  );
}

function Metric({ icon: Icon, label, value, sub, danger, positive }) {

  return (
    <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-4">

      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
        <Icon
          className={`w-3.5 h-3.5 ${
            danger
              ? 'text-rose-400'
              : positive
              ? 'text-emerald-400'
              : 'text-blue-400'
          }`}
        />

        {label}
      </div>

      <div
        className={`mt-2 text-lg font-bold font-mono ${
          danger
            ? 'text-rose-400'
            : positive
            ? 'text-emerald-400'
            : 'text-white'
        }`}
      >
        {value}
      </div>

      {sub && (
        <div className="text-[9px] text-slate-600 font-mono mt-1">
          {sub}
        </div>
      )}

    </div>
  );
}

function Status({ icon: Icon, label, value }) {

  return (
    <div className="flex items-center gap-2">

      <Icon className="w-3.5 h-3.5 text-blue-400" />

      <div>
        <div className="text-[8px] text-slate-600 font-mono">
          {label}
        </div>

        <div className="text-[9px] text-emerald-400 font-mono">
          {value}
        </div>
      </div>

    </div>
  );
}

function SeverityBadge({ severity }) {

  const styles = {
    Critical:
      'bg-rose-500/10 border-rose-500/20 text-rose-400',
    High:
      'bg-amber-500/10 border-amber-500/20 text-amber-400',
    Medium:
      'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    Low:
      'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };

  return (
    <span
      className={`px-1.5 py-0.5 rounded border text-[8px] font-mono font-bold ${
        styles[severity] ||
        'bg-slate-800 border-slate-700 text-slate-400'
      }`}
    >
      {severity?.toUpperCase()}
    </span>
  );
}

function Filter({ label, value, setValue, options }) {

  return (
    <div className="flex items-center gap-2 bg-[#070d17] border border-slate-800 rounded-lg px-3">

      <span className="text-[8px] font-mono text-slate-600">
        {label}
      </span>

      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        className="bg-transparent text-[10px] text-slate-300 py-2 outline-none cursor-pointer"
      >
        {options.map(([value, label]) => (
          <option
            key={value}
            value={value}
            className="bg-[#0a111d]"
          >
            {label}
          </option>
        ))}
      </select>

    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-[8px] font-mono font-semibold tracking-wider text-slate-600 whitespace-nowrap">
      {children}
    </th>
  );
}