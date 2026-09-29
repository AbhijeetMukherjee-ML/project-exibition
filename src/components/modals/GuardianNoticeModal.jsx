import React from 'react';
import { X, Send, Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function GuardianNoticeModal({ fine, onClose }) {
  const { notifyGuardian } = useApp();

  const handleSend = () => {
    notifyGuardian(fine.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Official Guardian Notice Dispatch</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional SMS and Email Disciplinary Letter</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Document */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Office of the Chief Hostel Warden</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Hostel Residence & Campus Discipline</p>
            </div>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
              REF: {fine.id}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-800 dark:text-slate-300">
            <p><strong>To Guardian:</strong> {fine.studentName} ({fine.studentId})</p>
            <p><strong>Room / Block:</strong> {fine.room}, {fine.block}</p>
            <p><strong>Subject:</strong> Disciplinary Notice Regarding Hostel Rule Infraction</p>
          </div>

          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 space-y-1">
            <p className="font-semibold text-rose-900 dark:text-rose-300">Infraction: {fine.infraction}</p>
            <p className="text-[11px]">Action: {fine.disciplinaryAction}</p>
            <p className="text-[11px]">Fine: ₹{fine.amount.toLocaleString()} (Due: {fine.dueDate})</p>
            <p className="text-[10px] text-rose-600 dark:text-rose-400">Evidence: {fine.evidence}</p>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            This notice is automatically logged by the Hostel Surveillance & Discipline System. Please ensure settlement.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
