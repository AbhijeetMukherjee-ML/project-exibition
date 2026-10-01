import React, { useState } from 'react';
import {
  Activity,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Zap,
  Camera,
  ShieldAlert,
  Clock3,
  Users,
  Radio,
  Eye,
  XCircle
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

export default function LogsPage() {
  const { logs, triggerSimulatedScan, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [curfewFilter, setCurfewFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      log.studentName.toLowerCase().includes(search) ||
      log.studentId.toLowerCase().includes(search) ||
      log.room.toLowerCase().includes(search) ||
      log.gate.toLowerCase().includes(search);

    const matchesDirection =
      directionFilter === 'ALL' ||
      log.direction === directionFilter;

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
    const headers = [
      'Event ID',
      'Student ID',
      'Student Name',
      'Room',
      'Direction',
      'Timestamp',
      'Gate',
      'Verification Method',
      'Status',
      'Curfew Breach',
      'Remarks'
    ];

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

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Surveillance_Events_${new Date().toISOString().split('T')[0]}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      'Export Completed',
      `${filteredLogs.length} surveillance events exported.`,
      'success'
    );
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Surveillance Event Monitor
                </h2>

                <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-400">
                  {logs.length} EVENTS
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-1">
                Centralized CCTV movement detection and resident access events
              </p>
            </div>

          </div>
        </div>

        <div className="flex gap-2">

          <button
            onClick={triggerSimulatedScan}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Detection
          </button>

          <button
            onClick={exportToCSV}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Events
          </button>

        </div>
      </div>

      {/* LIVE STATUS */}
      <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-3 flex flex-wrap items-center gap-5">

        <LiveStatus icon={Radio} label="EVENT ENGINE" value="ONLINE" />

        <LiveStatus icon={Camera} label="CAMERA NETWORK" value="4 / 4 ACTIVE" />

        <LiveStatus icon={Eye} label="AI DETECTION" value="RUNNING" />

        <div className="ml-auto flex items-center gap-2 text-[9px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE MONITORING
        </div>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <Metric
          icon={Activity}
          label="TOTAL EVENTS"
          value={logs.length}
        />

        <Metric
          icon={ArrowDownLeft}
          label="INBOUND"
          value={totalIn}
          positive
        />

        <Metric
          icon={ArrowUpRight}
          label="OUTBOUND"
          value={totalOut}
        />

        <Metric
          icon={ShieldAlert}
          label="SECURITY ALERTS"
          value={curfewBreaches}
          danger
        />

      </div>

      {/* FILTERS */}
      <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-3 flex flex-col lg:flex-row gap-3">

        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />

          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search identity, student ID, room or camera gate..."
            className="w-full pl-9 pr-3 py-2 bg-[#070d17] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/50"
          />

        </div>

        <Filter
          label="DIRECTION"
          value={directionFilter}
          setValue={setDirectionFilter}
          options={[
            ['ALL', 'All'],
            ['IN', 'Inbound'],
            ['OUT', 'Outbound']
          ]}
        />

        <Filter
          label="EVENT STATUS"
          value={curfewFilter}
          setValue={setCurfewFilter}
          options={[
            ['ALL', 'All Events'],
            ['VIOLATIONS', 'Alerts'],
            ['NORMAL', 'Authorized']
          ]}
        />

      </div>

      {/* TABLE */}
      <div className="border border-slate-800 bg-[#0a111d] rounded-xl overflow-hidden">

        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">
              DETECTION EVENTS
            </span>
          </div>

          <span className="text-[9px] font-mono text-slate-600">
            SHOWING {filteredLogs.length} / {logs.length}
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[#070d17] border-b border-slate-800">
              <tr>
                <Th>EVENT</Th>
                <Th>IDENTITY</Th>
                <Th>DIRECTION</Th>
                <Th>TIMESTAMP</Th>
                <Th>CAMERA / GATE</Th>
                <Th>VERIFICATION</Th>
                <Th>STATUS</Th>
                <Th>REMARKS</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">

              {filteredLogs.map(log => {

                const isIn = log.direction === 'IN';

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-500/[0.025] transition"
                  >

                    <td className="px-4 py-3">
                      <div className="font-mono text-[10px] text-blue-400">
                        {log.id}
                      </div>

                      <div className="text-[9px] text-slate-600 mt-1">
                        ACCESS EVENT
                      </div>
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex items-center gap-2.5">

                        <img
                          src={log.avatar}
                          alt={log.studentName}
                          className="w-7 h-7 rounded-md object-cover border border-slate-700"
                        />

                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            {log.studentName}
                          </div>

                          <div className="text-[9px] font-mono text-slate-600 mt-0.5">
                            {log.studentId} · R{log.room}
                          </div>
                        </div>

                      </div>

                    </td>

                    <td className="px-4 py-3">

                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-mono font-bold ${
                        isIn
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                          : 'border-slate-700 bg-slate-800/40 text-slate-400'
                      }`}>

                        {isIn
                          ? <ArrowDownLeft className="w-3 h-3" />
                          : <ArrowUpRight className="w-3 h-3" />
                        }

                        {log.direction}
                      </span>

                    </td>

                    <td className="px-4 py-3">

                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                        <Clock3 className="w-3 h-3 text-slate-600" />
                        {log.timestamp}
                      </div>

                    </td>

                    <td className="px-4 py-3">

                      <div className="flex items-center gap-2">

                        <div className="w-7 h-7 rounded-md bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                          <Camera className="w-3.5 h-3.5 text-blue-400" />
                        </div>

                        <div>
                          <div className="text-xs text-slate-300">
                            {log.gate}
                          </div>

                          <div className="text-[9px] text-slate-600 font-mono">
                            CCTV CHANNEL
                          </div>
                        </div>

                      </div>

                    </td>

                    <td className="px-4 py-3">

                      <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        {log.method}
                      </span>

                    </td>

                    <td className="px-4 py-3">

                      {log.curfewAlert ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-400 text-[9px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          SECURITY ALERT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[9px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          AUTHORIZED
                        </span>
                      )}

                    </td>

                    <td className="px-4 py-3 max-w-[180px]">

                      <span className="text-[10px] text-slate-500 truncate block">
                        {log.remarks}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {filteredLogs.length === 0 && (
          <div className="py-16 text-center">
            <XCircle className="w-6 h-6 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 mt-3">
              No surveillance events match the current filters.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

function Metric({ icon: Icon, label, value, positive, danger }) {
  return (
    <div className="border border-slate-800 bg-[#0a111d] rounded-xl p-4">

      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
        <Icon className={`w-3.5 h-3.5 ${
          danger
            ? 'text-rose-400'
            : positive
            ? 'text-emerald-400'
            : 'text-blue-400'
        }`} />
        {label}
      </div>

      <div className={`mt-2 text-xl font-bold font-mono ${
        danger
          ? 'text-rose-400'
          : positive
          ? 'text-emerald-400'
          : 'text-white'
      }`}>
        {value}
      </div>

    </div>
  );
}

function LiveStatus({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">

      <Icon className="w-3.5 h-3.5 text-blue-400" />

      <div>
        <div className="text-[8px] font-mono text-slate-600">
          {label}
        </div>

        <div className="text-[9px] font-mono text-emerald-400">
          {value}
        </div>
      </div>

    </div>
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