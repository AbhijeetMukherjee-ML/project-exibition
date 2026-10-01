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
    <div className="mt-3 border-t border-slate-200 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5" />
          Map Classes → Students
        </span>
        <span className="text-[9px] font-mono text-slate-500">
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
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                {mappedStudent ? (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-semibold text-slate-700 truncate" title={label}>
                  {label}
                </span>
              </div>
              <select
                value={mappedId}
                onChange={e => setClassMapping(label, e.target.value || null)}
                className={`flex-1 min-w-0 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer focus:outline-none focus:ring-1 ${focusRing}`}
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

      <p className="mt-2 text-[10px] text-slate-500">
        Pick the student each class represents. Leave a class (e.g. “Background”) unmapped to ignore it. Saved automatically.
      </p>
    </div>
  );
}
