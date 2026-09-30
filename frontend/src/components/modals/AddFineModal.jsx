import React, { useState } from 'react';
import { X, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AddFineModal({ onClose }) {
  const { students, addFine } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [infraction, setInfraction] = useState('Late Entry Past Curfew (10:00 PM)');
  const [severity, setSeverity] = useState('Medium');
  const [amount, setAmount] = useState(500);
  const [disciplinaryAction, setDisciplinaryAction] = useState('Warning Notice + Fine ₹500');
  const [evidence, setEvidence] = useState('Gate 01 CCTV Face AI timestamp');

  const infractionPresets = [
    { title: 'Late Entry Past Curfew (10:00 PM)', amount: 500, severity: 'Medium', action: 'Warning Notice + Fine ₹500' },
    { title: 'Severe Curfew Breach & Boundary Climbing', amount: 3000, severity: 'Critical', action: 'Suspension for 7 Days + Mandatory Guardian Meeting + Fine ₹3,000' },
    { title: 'Unpermitted Electrical Appliance (Heater/Cooker)', amount: 1500, severity: 'High', action: 'Confiscation of appliance + Fine ₹1,500' },
    { title: 'Missing Mandatory Night Roll Call', amount: 400, severity: 'Medium', action: 'Fine ₹400 + Community Service 2 Hours' },
    { title: 'Noise Violation During Quiet Hours (01:00 AM)', amount: 300, severity: 'Low', action: 'Written apology to floor residents + Fine ₹300' },
    { title: 'Unauthorized Guest in Hostel Room', amount: 2000, severity: 'High', action: 'Fine ₹2,000 + Guardian Contacted' }
  ];

  const handlePresetSelect = (preset) => {
    setInfraction(preset.title);
    setAmount(preset.amount);
    setSeverity(preset.severity);
    setDisciplinaryAction(preset.action);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    addFine({
      studentId: student.id,
      studentName: student.name,
      avatar: student.avatar,
      room: student.room,
      block: student.block,
      infraction,
      severity,
      amount: Number(amount),
      disciplinaryAction,
      evidence
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Issue Disciplinary Notice & Fine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Log student infraction, penalty amount, and mandatory action</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Violation Presets
          </label>
          <div className="flex flex-wrap gap-1.5">
            {infractionPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  infraction === preset.title
                    ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                }`}
              >
                {preset.title.split('(')[0]} (₹{preset.amount})
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Target Student Resident *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {s.name} ({s.id}) — Room {s.room} ({s.block})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Infraction Category</label>
              <input
                type="text"
                required
                value={infraction}
                onChange={(e) => setInfraction(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Fine Amount (₹) *</label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Evidence / CCTV Reference</label>
              <input
                type="text"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="e.g. Cam 01 footage at 23:40"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">Prescribed Action</label>
            <textarea
              rows="2"
              required
              value={disciplinaryAction}
              onChange={(e) => setDisciplinaryAction(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Issue Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
