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
    <div className="animate-in backdrop-blur-md bg-slate-950/80 duration-200 fade-in fixed flex inset-0 items-center justify-center p-3 sm:p-5 z-50">

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[94vh] max-w-3xl overflow-hidden relative rounded-2xl shadow-2xl w-full">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800/80 px-5 py-4 sm:px-6">
          <div className="flex gap-4 items-start justify-between">

            <div className="flex gap-3 items-center">
              <div className="relative">
                <div className="bg-rose-600 flex h-10 items-center justify-center rounded-xl shadow-lg shadow-rose-600/20 w-10">
                  <Scale className="dark:text-white h-5 text-slate-900 w-5" />
                </div>

                <span className="-bottom-1 -right-1 absolute bg-white border-2 border-white dark:bg-slate-800 dark:border-[#0e1728] flex h-4 items-center justify-center rounded-full w-4">
                  <ShieldAlert className="h-2.5 text-rose-400 w-2.5" />
                </span>
              </div>

              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="dark:text-white font-bold sm:text-lg text-base text-slate-900">
                    Issue Disciplinary Notice
                  </h3>

                  <span className="bg-rose-50 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-400 font-bold gap-1 hidden items-center px-2 py-0.5 rounded-full sm:inline-flex text-[9px] text-rose-600 tracking-wider uppercase">
                    <span className="bg-rose-500 h-1.5 rounded-full w-1.5" />
                    Enforcement
                  </span>
                </div>

                <p className="dark:text-slate-400 mt-0.5 sm:text-xs text-[11px] text-slate-500">
                  Record violation, assign penalty and preserve supporting evidence.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-800 dark:hover:text-white dark:text-white hover:bg-slate-200 hover:text-slate-900 p-2 rounded-lg text-slate-500 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* =========================================================
            CONTENT
        ========================================================= */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(94vh-145px)] overflow-y-auto"
        >
          <div className="p-5 sm:p-6 space-y-6">

            {/* =====================================================
                STUDENT SELECTION
            ===================================================== */}
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className="dark:text-slate-500 font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                    Step 01
                  </p>
                  <h4 className="dark:text-white font-bold text-slate-900 text-sm">
                    Select Resident
                  </h4>
                </div>

                <User className="dark:text-slate-400 h-4 text-slate-500 w-4" />
              </div>

              <div className="gap-3 grid grid-cols-1 md:grid-cols-[1fr_auto]">

                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 px-3.5 py-2.5 rounded-xl text-slate-900 text-xs w-full"
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
                  <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-800 flex gap-2.5 items-center min-w-[210px] px-3 py-2 rounded-xl">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="border border-slate-200 dark:border-slate-700 h-8 object-cover rounded-lg w-8"
                    />

                    <div className="min-w-0">
                      <p className="dark:text-white font-bold text-slate-900 text-xs truncate">
                        {selectedStudent.name}
                      </p>

                      <p className="dark:text-slate-400 flex font-mono gap-1 items-center text-[10px] text-slate-500">
                        <Home className="h-3 w-3" />
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
                  <p className="dark:text-slate-500 font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                    Step 02
                  </p>
                  <h4 className="dark:text-white font-bold text-slate-900 text-sm">
                    Select Violation
                  </h4>
                </div>

                <FileWarning className="dark:text-slate-400 h-4 text-slate-500 w-4" />
              </div>

              <div className="gap-2 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2">
                {infractionPresets.map((preset) => {
                  const active = infraction === preset.title;

                  return (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${ active ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-slate-200 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-700' }`}
                    >
                      <div className="flex gap-2 items-start justify-between">
                        <span
                          className={`text-[11px] font-semibold leading-tight ${ active ? 'text-rose-700' : 'text-slate-700 dark:text-slate-300' }`}
                        >
                          {preset.shortTitle}
                        </span>

                        {active && (
                          <CheckCircle2 className="flex-shrink-0 h-3.5 text-rose-500 w-3.5" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-[10px] text-slate-400">
                          {preset.severity}
                        </span>

                        <span className="dark:text-white font-bold font-mono text-[11px] text-slate-900">
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
            <section className="border border-slate-200 dark:border-slate-800 overflow-hidden rounded-2xl">

              <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-950/70 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="dark:text-slate-500 font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                      Step 03
                    </p>
                    <h4 className="dark:text-white font-bold text-slate-900 text-sm">
                      Penalty Configuration
                    </h4>
                  </div>

                  <AlertTriangle className="h-4 text-amber-500 w-4" />
                </div>
              </div>

              <div className="p-4 space-y-4">

                {/* Infraction */}
                <div>
                  <label className="block dark:text-slate-300 font-semibold mb-1.5 text-[11px] text-slate-700">
                    Infraction Description
                  </label>

                  <input
                    type="text"
                    required
                    value={infraction}
                    onChange={(e) => setInfraction(e.target.value)}
                    className="bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:border-rose-500 focus:outline-none px-3 py-2.5 rounded-lg text-slate-900 text-xs w-full"
                  />
                </div>

                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">

                  {/* Severity */}
                  <div>
                    <label className="block dark:text-slate-300 font-semibold mb-1.5 text-[11px] text-slate-700">
                      Severity Level
                    </label>

                    <div className="gap-1.5 grid grid-cols-4">
                      {['Low', 'Medium', 'High', 'Critical'].map((level) => {
                        const style = severityStyles[level];
                        const active = severity === level;

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setSeverity(level)}
                            className={`py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${ active ? style.active : 'bg-slate-50 dark:bg-slate-950 border-slate-200 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:border-slate-700' }`}
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
                    <label className="block dark:text-slate-300 font-semibold mb-1.5 text-[11px] text-slate-700">
                      Fine Amount
                    </label>

                    <div className="relative">
                      <IndianRupee className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-500 top-1/2 w-4" />

                      <input
                        type="number"
                        min="0"
                        step="50"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:border-rose-500 focus:outline-none font-bold font-mono pl-9 pr-3 py-2.5 rounded-lg text-slate-900 text-sm w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div>
                  <label className="block dark:text-slate-300 font-semibold mb-1.5 text-[11px] text-slate-700">
                    Prescribed Disciplinary Action
                  </label>

                  <textarea
                    rows={2}
                    required
                    value={disciplinaryAction}
                    onChange={(e) => setDisciplinaryAction(e.target.value)}
                    className="bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-700 dark:text-white focus:border-rose-500 focus:outline-none px-3 py-2.5 resize-none rounded-lg text-slate-900 text-xs w-full"
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                EVIDENCE
            ===================================================== */}
            <section>
              <div className="flex gap-2 items-center mb-2.5">
                <Camera className="dark:text-slate-400 h-4 text-slate-500 w-4" />

                <div>
                  <p className="dark:text-slate-500 font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                    Step 04
                  </p>
                  <h4 className="dark:text-white font-bold text-slate-900 text-sm">
                    Evidence Reference
                  </h4>
                </div>
              </div>

              <div className="relative">
                <Camera className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-500 top-1/2 w-4" />

                <input
                  type="text"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="e.g. CAM-01 • 23:40 • AI detection event"
                  className="bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:border-rose-500 focus:outline-none pl-9 pr-3 py-2.5 rounded-lg text-slate-900 text-xs w-full"
                />
              </div>

              <p className="dark:text-slate-500 mt-1.5 text-[10px] text-slate-400">
                Reference the CCTV channel, timestamp or biometric event supporting this notice.
              </p>
            </section>

          </div>

          {/* =======================================================
              FOOTER
          ======================================================= */}
          <div className="backdrop-blur-md bg-white border-slate-200 dark:border-slate-800 border-t bottom-0 dark:bg-slate-900/95 flex flex-col gap-3 items-center justify-between px-5 py-3.5 sm:flex-row sm:px-6 sticky">

            <div className="dark:text-slate-500 flex gap-2 items-center text-[10px] text-slate-400">
              <ShieldAlert className="h-3.5 text-rose-500 w-3.5" />
              <span>
                This action will be recorded in the resident's disciplinary history.
              </span>
            </div>

            <div className="flex gap-2 items-center sm:w-auto w-full">

              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 cursor-pointer dark:hover:bg-slate-700 dark:text-slate-300 flex-1 font-semibold hover:bg-slate-200 dark:bg-slate-700 px-4 py-2.5 rounded-lg sm:flex-none text-slate-700 text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-rose-600 cursor-pointer flex flex-1 font-bold gap-2 hover:bg-rose-500 items-center justify-center px-5 py-2.5 rounded-lg shadow-lg shadow-rose-600/20 sm:flex-none text-white text-xs transition-all"
              >
                <Scale className="h-4 w-4" />
                Issue Notice
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}