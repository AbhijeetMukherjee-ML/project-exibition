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
    <div className="animate-in backdrop-blur-md bg-slate-950/75 duration-200 fade-in fixed flex inset-0 items-center justify-center p-4 z-50">

      <div className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-950 max-h-[92vh] max-w-2xl overflow-hidden rounded-2xl shadow-2xl w-full">

        {/* ================= HEADER ================= */}
        <div className="bg-white border-b border-slate-200 dark:border-slate-800 dark:bg-slate-950 px-6 py-5">
          <div className="flex gap-4 items-start justify-between">

            <div className="flex gap-3.5 items-center">
              <div className="bg-blue-600 dark:text-white flex h-11 items-center justify-center rounded-xl shadow-blue-600/20 shadow-lg text-slate-900 w-11">
                <Mail className="h-5 w-5" />
              </div>

              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="dark:text-white font-bold text-base text-slate-900">
                    Guardian Notice
                  </h3>

                  <span className="bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full text-[9px] text-blue-600 tracking-wider uppercase">
                    Draft
                  </span>
                </div>

                <p className="dark:text-slate-400 mt-0.5 text-slate-500 text-xs">
                  Review and dispatch official disciplinary communication
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-800 dark:hover:text-white dark:text-slate-400 flex h-8 hover:bg-slate-100 hover:text-slate-700 items-center justify-center rounded-lg text-slate-500 transition-colors w-8"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="max-h-[calc(92vh-145px)] overflow-y-auto p-6 space-y-5">

          {/* Institution Banner */}
          <div className="border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">

            <div className="bg-white dark:bg-slate-900 dark:text-white flex items-center justify-between px-4 py-3 text-slate-900">
              <div>
                <p className="font-bold text-xs tracking-wider uppercase">
                  Office of the Chief Hostel Warden
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Hostel Residence & Campus Discipline
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-slate-400 tracking-wider uppercase">
                  Reference
                </p>
                <p className="font-bold font-mono text-[11px] text-blue-400">
                  {fine.id}
                </p>
              </div>
            </div>

            {/* Recipient */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 space-y-3">

              <div className="dark:text-slate-500 flex font-bold gap-2 items-center text-[10px] text-slate-400 tracking-wider uppercase">
                <User className="h-3.5 w-3.5" />
                Recipient Details
              </div>

              <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
                  <p className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
                    Student
                  </p>
                  <p className="dark:text-white font-bold mt-1 text-slate-900 text-xs">
                    {fine.studentName}
                  </p>
                  <p className="dark:text-slate-400 font-mono mt-0.5 text-[10px] text-slate-500">
                    {fine.studentId}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
                  <p className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
                    Residence
                  </p>

                  <p className="dark:text-white flex font-semibold gap-1.5 items-center mt-1 text-slate-900 text-xs">
                    <MapPin className="dark:text-slate-400 h-3 text-slate-500 w-3" />
                    Room {fine.room}
                  </p>

                  <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500">
                    {fine.block}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Channels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="dark:text-slate-500 font-bold text-[10px] text-slate-400 tracking-wider uppercase">
                Notification Channels
              </span>

              <span className="dark:text-emerald-400 flex font-semibold gap-1 items-center text-[10px] text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready to dispatch
              </span>
            </div>

            <div className="gap-3 grid grid-cols-2">

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                <div className="flex gap-2 items-center">
                  <div className="bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 flex h-8 items-center justify-center rounded-lg text-blue-600 w-8">
                    <Mail className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="dark:text-slate-200 font-bold text-[10px] text-slate-800">
                      Email
                    </p>
                    <p className="dark:text-slate-400 text-[9px] text-slate-500">
                      Institutional notice
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                <div className="flex gap-2 items-center">
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 flex h-8 items-center justify-center rounded-lg text-emerald-600 w-8">
                    <Phone className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="dark:text-slate-200 font-bold text-[10px] text-slate-800">
                      SMS
                    </p>
                    <p className="dark:text-slate-400 text-[9px] text-slate-500">
                      Guardian alert
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Subject */}
          <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 p-3.5 rounded-xl">
            <p className="font-bold mb-1 text-[9px] text-slate-400 tracking-wider uppercase">
              Subject
            </p>

            <p className="dark:text-white font-semibold text-slate-900 text-xs">
              Disciplinary Notice Regarding Hostel Rule Infraction
            </p>
          </div>

          {/* Violation */}
          <div className="border border-rose-200 dark:border-rose-900/50 overflow-hidden rounded-xl">

            <div className="bg-rose-50 border-b border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 flex gap-2 items-center px-4 py-3">
              <ShieldAlert className="dark:text-rose-400 h-4 text-rose-600 w-4" />

              <span className="dark:text-rose-300 font-bold text-[10px] text-rose-700 tracking-wider uppercase">
                Disciplinary Action
              </span>
            </div>

            <div className="bg-white dark:bg-slate-950 p-4 space-y-3">

              <div>
                <p className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
                  Reported Infraction
                </p>

                <p className="dark:text-white font-bold mt-1 text-slate-900 text-sm">
                  {fine.infraction}
                </p>
              </div>

              <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                  <div className="flex gap-2 items-center">
                    <FileText className="dark:text-slate-400 h-3.5 text-slate-500 w-3.5" />
                    <span className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
                      Prescribed Action
                    </span>
                  </div>

                  <p className="dark:text-slate-200 font-semibold mt-1.5 text-[11px] text-slate-800">
                    {fine.disciplinaryAction}
                  </p>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">
                  <div className="flex gap-2 items-center">
                    <IndianRupee className="h-3.5 text-rose-500 w-3.5" />
                    <span className="font-bold text-[9px] text-rose-500 tracking-wider uppercase">
                      Fine Amount
                    </span>
                  </div>

                  <p className="dark:text-rose-400 font-bold font-mono mt-1 text-lg text-rose-700">
                    ₹{fine.amount.toLocaleString()}
                  </p>
                </div>

              </div>

              {/* Date / Evidence */}
              <div className="gap-3 grid grid-cols-1 pt-1 sm:grid-cols-2">

                <div className="flex gap-2 items-start">
                  <Calendar className="dark:text-slate-400 h-3.5 mt-0.5 text-slate-500 w-3.5" />

                  <div>
                    <p className="font-bold text-[9px] text-slate-400 uppercase">
                      Due Date
                    </p>
                    <p className="dark:text-slate-300 font-mono font-semibold text-[11px] text-slate-700">
                      {fine.dueDate || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <ShieldAlert className="dark:text-slate-400 h-3.5 mt-0.5 text-slate-500 w-3.5" />

                  <div>
                    <p className="font-bold text-[9px] text-slate-400 uppercase">
                      Evidence Reference
                    </p>
                    <p className="dark:text-slate-300 text-[11px] text-slate-700">
                      {fine.evidence || 'No evidence reference'}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* System Notice */}
          <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50 flex gap-3 items-start p-3.5 rounded-xl">

            <ShieldCheckIcon />

            <div>
              <p className="dark:text-blue-300 font-bold text-[10px] text-blue-800">
                Automated Institutional Record
              </p>

              <p className="dark:text-blue-400 leading-relaxed mt-0.5 text-[10px] text-blue-700">
                This communication will be logged against the disciplinary
                record after dispatch. The guardian will receive the notice
                through the configured institutional communication channels.
              </p>
            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}
        <div className="bg-slate-50 border-slate-200 dark:border-slate-800 border-t dark:bg-slate-800 flex flex-col gap-3 justify-between px-6 py-4 sm:flex-row sm:items-center">

          <div className="dark:text-slate-400 text-[10px] text-slate-500">
            <span className="font-mono">{fine.id}</span>
            <span className="mx-1.5">•</span>
            Official disciplinary communication
          </div>

          <div className="flex gap-2.5 items-center">

            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 font-semibold hover:bg-slate-100 px-4 py-2 rounded-lg text-slate-700 text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="bg-blue-600 cursor-pointer flex font-bold gap-2 hover:bg-blue-500 items-center justify-center px-5 py-2 rounded-lg shadow-blue-600/20 shadow-lg text-white text-xs transition-all"
            >
              <Send className="h-3.5 w-3.5" />
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
    <div className="bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 flex flex-shrink-0 h-8 items-center justify-center rounded-lg text-blue-600 w-8">
      <ShieldCheck className="h-4 w-4" />
    </div>
  );
}