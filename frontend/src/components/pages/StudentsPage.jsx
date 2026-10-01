import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  UserCheck,
  Eye,
  UserX,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddStudentModal from '../modals/AddStudentModal';
import StudentDetailModal from '../modals/StudentDetailModal';

export default function StudentsPage() {
  const {
    students,
    deleteStudent,
    markStudentPresent,
    markStudentAbsent
  } = useApp();

  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const blocks = ['ALL', ...new Set(students.map(s => s.block).filter(Boolean))];

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      String(s.room).includes(q);
    const matchBlock = blockFilter === 'ALL' || s.block === blockFilter;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PRESENT' && s.present) ||
      (statusFilter === 'ABSENT' && !s.present);
    return matchSearch && matchBlock && matchStatus;
  });

  const presentCount = students.filter(s => s.present).length;

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-slate-700/50 border border-slate-700 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-white">Student Registry</h2>
            <span className="px-2 py-0.5 rounded border bg-slate-800 border-slate-700 text-slate-400 text-[9px] font-mono">
              {students.length} REGISTERED
            </span>
          </div>
          <p className="text-xs text-slate-500">
            All enrolled students. The AI uses this registry to identify faces and mark attendance.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Student
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Registered" value={students.length} icon={Users} />
        <StatCard label="Present Today" value={presentCount} icon={UserCheck} accent="emerald" />
        <StatCard label="Absent" value={students.length - presentCount} icon={UserX} />
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-[#0b1320] border border-slate-800 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or room…"
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/40 transition"
          />
        </div>

        <SelectFilter
          label="BLOCK"
          value={blockFilter}
          onChange={setBlockFilter}
          options={blocks.map(b => [b, b === 'ALL' ? 'All Blocks' : b])}
        />
        <SelectFilter
          label="STATUS"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[['ALL', 'All'], ['PRESENT', 'Present'], ['ABSENT', 'Absent']]}
        />
      </div>

      {/* TABLE */}
      <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">STUDENTS</span>
          </div>
          <span className="text-[9px] font-mono text-slate-600">{filtered.length} SHOWN</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                {['STUDENT', 'ID', 'ROOM / BLOCK', 'DEPARTMENT', 'ATTENDANCE', 'AI STATUS', 'ACTIONS'].map(h => (
                  <th key={h} className="px-4 py-3 text-[8px] font-mono font-semibold tracking-wider text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-blue-500/[0.025] transition">

                  {/* STUDENT */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{s.name}</p>
                        <p className="text-[9px] text-slate-600 mt-0.5">Year {s.year || '—'}</p>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] text-blue-400">{s.id}</span>
                  </td>

                  {/* ROOM / BLOCK */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-600" />
                      <span className="text-xs text-slate-300">R{s.room}</span>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-0.5">{s.block}</p>
                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400">{s.department || '—'}</span>
                  </td>

                  {/* ATTENDANCE */}
                  <td className="px-4 py-3">
                    {s.present ? (
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          PRESENT
                        </span>
                        {s.presentAt && (
                          <p className="text-[8px] text-slate-600 font-mono mt-0.5">{s.presentAt}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-600">ABSENT</span>
                    )}
                  </td>

                  {/* AI STATUS */}
                  <td className="px-4 py-3">
                    {s.faceEnrolled ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-blue-400">
                        <ShieldCheck className="w-3 h-3" />
                        ENROLLED
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-600">NOT ENROLLED</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => s.present ? markStudentAbsent(s.id) : markStudentPresent(s.id, null, { manual: true })}
                        className={`px-2.5 py-1.5 rounded-md text-[9px] font-semibold cursor-pointer transition ${s.present ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-emerald-700 text-white hover:bg-emerald-600'}`}
                      >
                        {s.present ? 'Mark Absent' : 'Mark Present'}
                      </button>

                      <button
                        onClick={() => deleteStudent(s.id)}
                        className="p-1.5 rounded-md bg-slate-800 hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 cursor-pointer transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-7 h-7 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 mt-3">No students match the current filters.</p>
          </div>
        )}
      </div>

      {isAddOpen && <AddStudentModal onClose={() => setIsAddOpen(false)} />}
      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = 'slate' }) {
  return (
    <div className="p-4 bg-[#0b1320] border border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${accent === 'emerald' ? 'text-emerald-500' : 'text-slate-500'}`} />
      </div>
      <p className={`text-2xl font-bold font-mono ${accent === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg px-3">
      <span className="text-[8px] font-mono text-slate-600">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-[10px] text-slate-300 py-2 outline-none cursor-pointer">
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-[#0a111d]">{l}</option>
        ))}
      </select>
    </div>
  );
}
