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
  ShieldCheck,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddStudentModal from '../modals/AddStudentModal';
import StudentDetailModal from '../modals/StudentDetailModal';

export default function StudentsPage() {
  const {
    students,
    deleteStudent,
    markStudentPresent,
    markStudentAbsent,
    refreshDataFromDB,
    isLoadingStudents
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
      (s.name || '').toLowerCase().includes(q) ||
      (s.studentId || s.id || '').toLowerCase().includes(q) ||
      String(s.room || '').includes(q);
    const matchBlock = blockFilter === 'ALL' || s.block === blockFilter;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PRESENT' && s.present) ||
      (statusFilter === 'ABSENT' && !s.present);
    return matchSearch && matchBlock && matchStatus;
  });

  const presentCount = students.filter(s => s.present).length;

  const toggleSlotAttendance = (studentId, slot, currentStatus) => {
    if (currentStatus === 'present') {
      markStudentAbsent(studentId, { slot });
    } else {
      markStudentPresent(studentId, null, { slot, manual: true });
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
        <div>
          <div className="flex gap-2.5 items-center mb-1">
            <div className="bg-slate-700/50 border border-slate-300 dark:border-slate-700 flex h-9 items-center justify-center rounded-xl w-9">
              <Users className="h-5 text-slate-800 dark:text-slate-200 w-5" />
            </div>
            <h2 className="dark:text-white font-bold text-slate-900 text-xl">Student Registry & Attendance DB</h2>
            <span className="bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono px-2 py-0.5 rounded text-[9px] text-slate-400">
              {students.length} IN MONGODB
            </span>
          </div>
          <p className="dark:text-slate-400 text-slate-500 text-xs">
            Day-wise attendance records stored in database across Class 1-4 and Hostel roll call. Click any cell to toggle.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={refreshDataFromDB}
            disabled={isLoadingStudents}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 cursor-pointer disabled:opacity-50 flex font-semibold gap-1.5 hover:bg-slate-800 items-center px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 text-xs transition"
            title="Refresh from MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? 'animate-spin' : ''}`} />
            Sync DB
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 cursor-pointer dark:text-white flex font-semibold gap-1.5 hover:bg-blue-500 items-center px-4 py-1.5 rounded-lg shadow-sm text-slate-900 text-xs transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Student
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="gap-3 grid grid-cols-3">
        <StatCard label="Registered Students" value={students.length} icon={Users} />
        <StatCard label="Present Today (Any)" value={presentCount} icon={UserCheck} accent="emerald" />
        <StatCard label="Absent Today" value={students.length - presentCount} icon={UserX} />
      </div>

      {/* FILTER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 p-3 rounded-xl sm:flex-row">
        <div className="flex-1 relative">
          <Search className="-translate-y-1/2 absolute dark:text-slate-400 h-3.5 left-3 text-slate-600 top-1/2 w-3.5" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or room…"
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 dark:placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:border-blue-500/40 outline-none pl-9 placeholder:text-slate-400 pr-3 py-2 rounded-lg text-slate-900 dark:text-white text-xs transition w-full"
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
          options={[['ALL', 'All'], ['PRESENT', 'Present Today'], ['ABSENT', 'Absent Today']]}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
          <div className="flex gap-2 items-center">
            <Users className="dark:text-slate-400 h-3.5 text-slate-500 w-3.5" />
            <span className="font-bold text-slate-900 dark:text-white text-xs">STUDENT ATTENDANCE DATABASE</span>
          </div>
          <span className="dark:text-slate-400 font-mono text-[9px] text-slate-600">{filtered.length} SHOWN</span>
        </div>

        <div className="overflow-x-auto">
          <table className="text-left w-full">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="dark:text-slate-400 font-mono font-semibold px-4 py-3 text-[8px] text-slate-600 tracking-wider whitespace-nowrap">STUDENT</th>
                <th className="dark:text-slate-400 font-mono font-semibold px-3 py-3 text-[8px] text-slate-600 tracking-wider whitespace-nowrap">ID</th>
                <th className="dark:text-slate-400 font-mono font-semibold px-3 py-3 text-[8px] text-slate-600 tracking-wider whitespace-nowrap">ROOM / BLOCK</th>
                <th className="font-mono font-semibold px-3 py-3 text-[8px] text-center text-slate-400 tracking-wider whitespace-nowrap">CLASS 1</th>
                <th className="font-mono font-semibold px-3 py-3 text-[8px] text-center text-slate-400 tracking-wider whitespace-nowrap">CLASS 2</th>
                <th className="font-mono font-semibold px-3 py-3 text-[8px] text-center text-slate-400 tracking-wider whitespace-nowrap">CLASS 3</th>
                <th className="font-mono font-semibold px-3 py-3 text-[8px] text-center text-slate-400 tracking-wider whitespace-nowrap">CLASS 4</th>
                <th className="font-mono font-semibold px-3 py-3 text-[8px] text-center text-indigo-400 tracking-wider whitespace-nowrap">HOSTEL ATTENDANCE</th>
                <th className="dark:text-slate-400 font-mono font-semibold px-4 py-3 text-[8px] text-right text-slate-600 tracking-wider whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-slate-800 divide-y">
              {filtered.map(s => {
                const sid = s.studentId || s.id;
                return (
                  <tr key={sid} className="hover:bg-blue-500/[0.025] transition">
                    {/* STUDENT */}
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <img
                          src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=2563eb&color=fff&size=256&bold=true`}
                          alt={s.name}
                          className="border border-slate-300 dark:border-slate-700 h-9 object-cover rounded-xl w-9"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">{s.name}</p>
                          <p className="dark:text-slate-400 mt-0.5 text-[9px] text-slate-600">{s.department || `Year ${s.year || '—'}`}</p>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="px-3 py-3">
                      <span className="font-mono text-[10px] text-blue-400">{sid}</span>
                    </td>

                    {/* ROOM / BLOCK */}
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5 items-center">
                        <Building2 className="dark:text-slate-400 h-3 text-slate-600 w-3" />
                        <span className="text-slate-800 dark:text-slate-200 text-xs">R{s.room}</span>
                      </div>
                      <p className="dark:text-slate-400 mt-0.5 text-[9px] text-slate-600">{s.block}</p>
                    </td>

                    {/* CLASS 1 */}
                    <td className="px-3 py-3 text-center">
                      <AttendanceSlotButton
                        status={s.class1Attendance}
                        onClick={() => toggleSlotAttendance(sid, 'class1', s.class1Attendance)}
                      />
                    </td>

                    {/* CLASS 2 */}
                    <td className="px-3 py-3 text-center">
                      <AttendanceSlotButton
                        status={s.class2Attendance}
                        onClick={() => toggleSlotAttendance(sid, 'class2', s.class2Attendance)}
                      />
                    </td>

                    {/* CLASS 3 */}
                    <td className="px-3 py-3 text-center">
                      <AttendanceSlotButton
                        status={s.class3Attendance}
                        onClick={() => toggleSlotAttendance(sid, 'class3', s.class3Attendance)}
                      />
                    </td>

                    {/* CLASS 4 */}
                    <td className="px-3 py-3 text-center">
                      <AttendanceSlotButton
                        status={s.class4Attendance}
                        onClick={() => toggleSlotAttendance(sid, 'class4', s.class4Attendance)}
                      />
                    </td>

                    {/* HOSTEL ATTENDANCE */}
                    <td className="px-3 py-3 text-center">
                      <AttendanceSlotButton
                        status={s.hostelAttendance}
                        onClick={() => toggleSlotAttendance(sid, 'hostel', s.hostelAttendance)}
                        isHostel
                      />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1.5 items-center justify-end">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="bg-slate-800 cursor-pointer dark:text-white hover:bg-slate-700 hover:text-slate-900 p-1.5 rounded-md text-slate-500 transition"
                          title="View Profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteStudent(sid)}
                          className="bg-slate-800 cursor-pointer dark:text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 p-1.5 rounded-md text-slate-600 transition"
                          title="Delete from DB"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users className="dark:text-slate-200 h-7 mx-auto text-slate-700 w-7" />
            <p className="dark:text-slate-400 mt-3 text-slate-500 text-xs">No students found.</p>
          </div>
        )}
      </div>

      {isAddOpen && <AddStudentModal onClose={() => setIsAddOpen(false)} />}
      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
    </div>
  );
}

function AttendanceSlotButton({ status, onClick, isHostel = false }) {
  const isPresent = status === 'present';
  return (
    <button
      onClick={onClick}
      title={`Click to mark ${isPresent ? 'absent' : 'present'} in DB`}
      className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition cursor-pointer border ${ isPresent ? (isHostel ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25') : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:border-slate-700' }`}
    >
      {isPresent ? (
        <>
          <Check className="h-3 w-3" />
          <span>PRESENT</span>
        </>
      ) : (
        <>
          <X className="h-3 opacity-50 w-3" />
          <span>ABSENT</span>
        </>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, accent = 'slate' }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="dark:text-slate-400 font-bold text-[10px] text-slate-500 tracking-wider uppercase">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${accent === 'emerald' ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
      </div>
      <p className={`text-2xl font-bold font-mono ${accent === 'emerald' ? 'text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{value}</p>
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 flex gap-2 items-center px-3 rounded-lg">
      <span className="dark:text-slate-400 font-mono text-[8px] text-slate-600">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent cursor-pointer outline-none py-2 text-[10px] text-slate-800 dark:text-slate-200">
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-white dark:bg-slate-950">{l}</option>
        ))}
      </select>
    </div>
  );
}
