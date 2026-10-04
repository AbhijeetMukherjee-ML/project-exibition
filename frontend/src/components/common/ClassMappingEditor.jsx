import React from 'react';
import { Link2, UserCheck, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * Maps Teachable Machine class labels to registered DB students.
 *
 * Recognition only marks a student present when the matched TM class is linked
 * to that student here. Labels are auto-linked on model load when their name
 * equals a student's name/id; everything else is assigned manually below.
 *
 * @param {string[]} labels   TM class labels from the loaded model.
 * @param {string}   accent   Tailwind color token for focus ring ('blue' | 'violet').
 */
export default function ClassMappingEditor({ labels = [], accent = 'blue' }) {
  const { students, classMappings, setClassMapping } = useApp();

  if (!labels.length) return null;

  const focusRing =
    accent === 'violet'
      ? 'focus:border-emerald-500 focus:ring-emerald-500/20'
      : 'focus:border-emerald-500 focus:ring-emerald-500/20';

  return (
    <div className="border-slate-200 dark:border-slate-800 border-t mt-3 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="flex font-bold gap-1.5 items-center text-[10px] text-slate-400 tracking-wider uppercase">
          <Link2 className="h-3.5 w-3.5" />
          Map Classes → Students
        </span>
        <span className="dark:text-slate-400 font-mono text-[9px] text-slate-500">
          {labels.filter(l => classMappings[l]).length}/{labels.length} mapped
        </span>
      </div>

      <div className="space-y-2">
        {labels.map(label => {
          const mappedId = classMappings[label] || '';
          const mappedStudent = students.find(
            s => s.id === mappedId || s.studentId === mappedId
          );
          return (
            <div key={label} className="flex gap-2 items-center">
              <div className="flex flex-1 gap-1.5 items-center min-w-0">
                {mappedStudent ? (
                  <UserCheck className="h-3.5 shrink-0 text-emerald-400 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 shrink-0 text-amber-400 w-3.5" />
                )}
                <span className="dark:text-slate-300 font-semibold text-slate-700 text-xs truncate" title={label}>
                  {label}
                </span>
              </div>
              <select
                value={mappedId}
                onChange={e => setClassMapping(label, e.target.value || null)}
                className={`flex-1 min-w-0 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 ${focusRing}`}
              >
                <option value="">— not mapped (ignore) —</option>
                {students.map(s => (
                  <option key={s.id || s.studentId} value={s.id || s.studentId}>
                    {s.name} ({s.studentId || s.id})
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <p className="dark:text-slate-400 mt-2 text-[10px] text-slate-500">
        Pick the student each class represents. Leave a class (e.g. “Background”) unmapped to ignore it. Saved automatically.
      </p>
    </div>
  );
}
