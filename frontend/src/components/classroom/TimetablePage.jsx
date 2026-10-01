import React from 'react';
import { CalendarClock, Plus, Trash2, Clock, Timer } from 'lucide-react';
import { useClassroom, cutoffLabel } from '../../context/ClassroomContext';

export default function TimetablePage() {
  const { periods, addPeriod, updatePeriod, deletePeriod } = useClassroom();

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center flex-shrink-0">
              <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Class Timetable
                </h2>

                <span className="text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {periods.length} Periods
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Configure class timings and grace periods. Students recognized after the cutoff
                are marked <strong className="text-amber-600 dark:text-amber-400">Late</strong>,
                while no-shows become <strong className="text-rose-600 dark:text-rose-400">Absent</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => addPeriod()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </button>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_1.1fr_45px] gap-3 px-4 py-3 bg-slate-50 dark:bg-[#0e1626] border-b border-slate-200 dark:border-slate-800">
          {[
            'Subject',
            'Teacher',
            'Room',
            'Start',
            'End',
            'Grace',
            'On-time Cutoff',
            ''
          ].map((heading, index) => (
            <div
              key={index}
              className="text-[9px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400"
            >
              {heading}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          {periods.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <CalendarClock className="w-5 h-5 text-slate-400" />
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No periods configured
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Add a period to start building the timetable.
              </p>
            </div>
          ) : (
            periods.map((p, index) => (
              <div
                key={p.id}
                className="group p-4 lg:px-4 lg:py-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >

                {/* Mobile / Tablet Layout */}
                <div className="lg:hidden space-y-3">

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Period {index + 1}
                      </span>
                    </div>

                    <button
                      onClick={() => deletePeriod(p.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Delete period"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                        Subject
                      </label>
                      <input
                        value={p.subject}
                        onChange={(e) =>
                          updatePeriod(p.id, { subject: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                        Teacher
                      </label>
                      <input
                        value={p.teacher}
                        onChange={(e) =>
                          updatePeriod(p.id, { teacher: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                        Room
                      </label>
                      <input
                        value={p.room || ''}
                        onChange={(e) =>
                          updatePeriod(p.id, { room: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                        Grace Period
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={p.graceMinutes}
                        onChange={(e) =>
                          updatePeriod(p.id, {
                            graceMinutes: Number(e.target.value)
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={p.startTime}
                        onChange={(e) =>
                          updatePeriod(p.id, { startTime: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={p.endTime}
                        onChange={(e) =>
                          updatePeriod(p.id, { endTime: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>

                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" />
                      On-time Cutoff
                    </span>

                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                      {cutoffLabel(p)}
                    </span>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr_0.8fr_1.1fr_45px] gap-3 items-center">

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <input
                      value={p.subject}
                      onChange={(e) =>
                        updatePeriod(p.id, { subject: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <input
                    value={p.teacher}
                    onChange={(e) =>
                      updatePeriod(p.id, { teacher: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <input
                    value={p.room || ''}
                    onChange={(e) =>
                      updatePeriod(p.id, { room: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <input
                    type="time"
                    value={p.startTime}
                    onChange={(e) =>
                      updatePeriod(p.id, { startTime: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />

                  <input
                    type="time"
                    value={p.endTime}
                    onChange={(e) =>
                      updatePeriod(p.id, { endTime: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />

                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={p.graceMinutes}
                    onChange={(e) =>
                      updatePeriod(p.id, {
                        graceMinutes: Number(e.target.value)
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />

                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 whitespace-nowrap">
                      {cutoffLabel(p)}
                    </span>
                  </div>

                  <button
                    onClick={() => deletePeriod(p.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors justify-self-end"
                    title="Delete period"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}