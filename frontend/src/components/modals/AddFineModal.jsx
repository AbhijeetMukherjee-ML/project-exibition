import React, { useState } from 'react';
import {
  X,
  Scale,
  ShieldAlert,
  User,
  Home,
  AlertTriangle,
  Camera,
  IndianRupee,
  FileWarning,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AddFineModal({ onClose }) {
  const { students, addFine } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [infraction, setInfraction] = useState('Late Entry Past Curfew (10:00 PM)');
  const [severity, setSeverity] = useState('Medium');
  const [amount, setAmount] = useState(500);
  const [disciplinaryAction, setDisciplinaryAction] = useState(
    'Warning Notice + Fine ₹500'
  );
  const [evidence, setEvidence] = useState(
    'Gate 01 CCTV Face AI timestamp'
  );

  const infractionPresets = [
    {
      title: 'Late Entry Past Curfew (10:00 PM)',
      shortTitle: 'Late Curfew Entry',
      amount: 500,
      severity: 'Medium',
      action: 'Warning Notice + Fine ₹500'
    },
    {
      title: 'Severe Curfew Breach & Boundary Climbing',
      shortTitle: 'Severe Curfew Breach',
      amount: 3000,
      severity: 'Critical',
      action:
        'Suspension for 7 Days + Mandatory Guardian Meeting + Fine ₹3,000'
    },
    {
      title: 'Unpermitted Electrical Appliance (Heater/Cooker)',
      shortTitle: 'Electrical Appliance',
      amount: 1500,
      severity: 'High',
      action: 'Confiscation of appliance + Fine ₹1,500'
    },
    {
      title: 'Missing Mandatory Night Roll Call',
      shortTitle: 'Missed Night Roll Call',
      amount: 400,
      severity: 'Medium',
      action: 'Fine ₹400 + Community Service 2 Hours'
    },
    {
      title: 'Noise Violation During Quiet Hours (01:00 AM)',
      shortTitle: 'Noise Violation',
      amount: 300,
      severity: 'Low',
      action: 'Written apology to floor residents + Fine ₹300'
    },
    {
      title: 'Unauthorized Guest in Hostel Room',
      shortTitle: 'Unauthorized Guest',
      amount: 2000,
      severity: 'High',
      action: 'Fine ₹2,000 + Guardian Contacted'
    }
  ];

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId
  );

  const handlePresetSelect = (preset) => {
    setInfraction(preset.title);
    setAmount(preset.amount);
    setSeverity(preset.severity);
    setDisciplinaryAction(preset.action);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedStudent) return;

    addFine({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      avatar: selectedStudent.avatar,
      room: selectedStudent.room,
      block: selectedStudent.block,
      infraction,
      severity,
      amount: Number(amount),
      disciplinaryAction,
      evidence
    });

    onClose();
  };

  const severityStyles = {
    Low: {
      active:
        'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500'
    },
    Medium: {
      active:
        'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500'
    },
    High: {
      active:
        'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-400',
      dot: 'bg-orange-500'
    },
    Critical: {
      active:
        'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400',
      dot: 'bg-rose-500'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">

      <div className="relative w-full max-w-3xl max-h-[94vh] overflow-hidden rounded-2xl bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-slate-800 shadow-2xl">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0e1728]">
          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                  <Scale className="w-5 h-5 text-white" />
                </div>

                <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-800 border-2 border-white dark:border-[#0e1728] flex items-center justify-center">
                  <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Issue Disciplinary Notice
                  </h3>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Enforcement
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record violation, assign penalty and preserve supporting evidence.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================
            CONTENT
        ========================================================= */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(94vh-145px)]"
        >
          <div className="p-5 sm:p-6 space-y-6">

            {/* =====================================================
                STUDENT SELECTION
            ===================================================== */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                    Step 01
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select Resident
                  </h4>
                </div>

                <User className="w-4 h-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">

                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                >
                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                      className="bg-white dark:bg-slate-900"
                    >
                      {student.name} ({student.id}) — Room {student.room}
                    </option>
                  ))}
                </select>

                {selectedStudent && (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-w-[210px]">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {selectedStudent.name}
                      </p>

                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        {selectedStudent.room} • {selectedStudent.block}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* =====================================================
                PRESETS
            ===================================================== */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                    Step 02
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Select Violation
                  </h4>
                </div>

                <FileWarning className="w-4 h-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {infractionPresets.map((preset) => {
                  const active = infraction === preset.title;

                  return (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[11px] font-semibold leading-tight ${
                            active
                              ? 'text-rose-700 dark:text-rose-300'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {preset.shortTitle}
                        </span>

                        {active && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          {preset.severity}
                        </span>

                        <span className="text-[11px] font-bold font-mono text-slate-900 dark:text-white">
                          ₹{preset.amount.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* =====================================================
                PENALTY DETAILS
            ===================================================== */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                      Step 03
                    </p>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Penalty Configuration
                    </h4>
                  </div>

                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <div className="p-4 space-y-4">

                {/* Infraction */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Infraction Description
                  </label>

                  <input
                    type="text"
                    required
                    value={infraction}
                    onChange={(e) => setInfraction(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Severity */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Severity Level
                    </label>

                    <div className="grid grid-cols-4 gap-1.5">
                      {['Low', 'Medium', 'High', 'Critical'].map((level) => {
                        const style = severityStyles[level];
                        const active = severity === level;

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setSeverity(level)}
                            className={`py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              active
                                ? style.active
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${style.dot}`}
                            />
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Fine Amount
                    </label>

                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="number"
                        min="0"
                        step="50"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Prescribed Disciplinary Action
                  </label>

                  <textarea
                    rows={2}
                    required
                    value={disciplinaryAction}
                    onChange={(e) => setDisciplinaryAction(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white resize-none focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                EVIDENCE
            ===================================================== */}
            <section>
              <div className="flex items-center gap-2 mb-2.5">
                <Camera className="w-4 h-4 text-slate-400" />

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                    Step 04
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Evidence Reference
                  </h4>
                </div>
              </div>

              <div className="relative">
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="e.g. CAM-01 • 23:40 • AI detection event"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                Reference the CCTV channel, timestamp or biometric event supporting this notice.
              </p>
            </section>

          </div>

          {/* =======================================================
              FOOTER
          ======================================================= */}
          <div className="sticky bottom-0 px-5 sm:px-6 py-3.5 bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>
                This action will be recorded in the resident's disciplinary history.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                Issue Notice
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}