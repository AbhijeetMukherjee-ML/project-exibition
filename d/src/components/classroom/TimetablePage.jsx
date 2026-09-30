import React from 'react';
import { CalendarClock, Plus, Trash2, Clock } from 'lucide-react';
import { useClassroom, cutoffLabel } from '../../context/ClassroomContext';

export default function TimetablePage() {
  const { periods, addPeriod, updatePeriod, deletePeriod } = useClassroom();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Class Timetable
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define each period's start time and grace window. A student recognized after the cutoff is marked <strong>Late</strong>; no-shows become <strong>Absent</strong>.
          </p>
        </div>
        <button onClick={() => addPeriod()} className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> Add Period
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Teacher</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Start</th>
                <th className="py-3 px-3">End</th>
                <th className="py-3 px-3">Grace (min)</th>
                <th className="py-3 px-3">On-time Cutoff</th>
                <th className="py-3 px-3 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {periods.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3">
                    <input value={p.subject} onChange={(e) => updatePeriod(p.id, { subject: e.target.value })}
                      className="w-44 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-3">
                    <input value={p.teacher} onChange={(e) => updatePeriod(p.id, { teacher: e.target.value })}
                      className="w-32 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-3">
                    <input value={p.room || ''} onChange={(e) => updatePeriod(p.id, { room: e.target.value })}
                      className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="time" value={p.startTime} onChange={(e) => updatePeriod(p.id, { startTime: e.target.value })}
                      className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="time" value={p.endTime} onChange={(e) => updatePeriod(p.id, { endTime: e.target.value })}
                      className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-3">
                    <input type="number" min="0" max="60" value={p.graceMinutes} onChange={(e) => updatePeriod(p.id, { graceMinutes: Number(e.target.value) })}
                      className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                      <Clock className="w-3 h-3" /> {cutoffLabel(p)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button onClick={() => deletePeriod(p.id)} className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer" title="Delete period">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
