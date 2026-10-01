import React from 'react';
import {
  X,
  Send,
  Mail,
  Phone,
  ShieldAlert,
  FileText,
  Calendar,
  User,
  MapPin,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function GuardianNoticeModal({ fine, onClose }) {
  const { notifyGuardian } = useApp();

  const handleSend = () => {
    notifyGuardian(fine.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">

      <div className="w-full max-w-2xl max-h-[92vh] overflow-hidden bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Mail className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Guardian Notice
                  </h3>

                  <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    Draft
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review and dispatch official disciplinary communication
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-145px)]">

          {/* Institution Banner */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            <div className="px-4 py-3 bg-slate-900 dark:bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  Office of the Chief Hostel Warden
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Hostel Residence & Campus Discipline
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                  Reference
                </p>
                <p className="text-[11px] font-mono font-bold text-blue-400">
                  {fine.id}
                </p>
              </div>
            </div>

            {/* Recipient */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 space-y-3">

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                <User className="w-3.5 h-3.5" />
                Recipient Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Student
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {fine.studentName}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {fine.studentId}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Residence
                  </p>

                  <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Room {fine.room}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {fine.block}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Channels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                Notification Channels
              </span>

              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready to dispatch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                      Email
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Institutional notice
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                      SMS
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Guardian alert
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Subject */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Subject
            </p>

            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Disciplinary Notice Regarding Hostel Rule Infraction
            </p>
          </div>

          {/* Violation */}
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 overflow-hidden">

            <div className="px-4 py-3 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />

              <span className="text-[10px] uppercase tracking-wider font-bold text-rose-700 dark:text-rose-300">
                Disciplinary Action
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 space-y-3">

              <div>
                <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                  Reported Infraction
                </p>

                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {fine.infraction}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                      Prescribed Action
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
                    {fine.disciplinaryAction}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[9px] uppercase tracking-wider font-bold text-rose-500">
                      Fine Amount
                    </span>
                  </div>

                  <p className="text-lg font-bold font-mono text-rose-700 dark:text-rose-400 mt-1">
                    ₹{fine.amount.toLocaleString()}
                  </p>
                </div>

              </div>

              {/* Date / Evidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">

                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5" />

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Due Date
                    </p>
                    <p className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {fine.dueDate || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mt-0.5" />

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Evidence Reference
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {fine.evidence || 'No evidence reference'}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* System Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">

            <ShieldCheckIcon />

            <div>
              <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300">
                Automated Institutional Record
              </p>

              <p className="text-[10px] leading-relaxed text-blue-700 dark:text-blue-400 mt-0.5">
                This communication will be logged against the disciplinary
                record after dispatch. The guardian will receive the notice
                through the configured institutional communication channels.
              </p>
            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-mono">{fine.id}</span>
            <span className="mx-1.5">•</span>
            Official disciplinary communication
          </div>

          <div className="flex items-center gap-2.5">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Notice
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

/* Small local icon wrapper so the main JSX stays clean */
function ShieldCheckIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
      <ShieldCheck className="w-4 h-4" />
    </div>
  );
}