import React, { useMemo, useState } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  UserX,
  CalendarCheck,
  Users,
  ShieldCheck,
  LayoutGrid,
  List,
  Building2,
  Eye
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import AddStudentModal from '../modals/AddStudentModal';
import StudentDetailModal from '../modals/StudentDetailModal';

export default function DatabasePage() {
  const {
    students,
    deleteStudent,
    markStudentPresent,
    markStudentAbsent
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);

  const togglePresence = (student) => {
    if (student.present) {
      markStudentAbsent(student.id);
    } else {
      markStudentPresent(student.id, null, { manual: true });
    }
  };

  /* -----------------------------
     Statistics
  ----------------------------- */

  const totalStudents = students.length;

  const presentStudents = students.filter(
    student => student.present
  ).length;

  const absentStudents = totalStudents - presentStudents;

  const activeStudents = students.filter(
    student => student.status === 'Active'
  ).length;

  const watchStudents = students.filter(
    student => student.status === 'Under Watch'
  ).length;

  const enrolledFaces = students.filter(
    student => student.faceEnrolled
  ).length;

  /* -----------------------------
     Filtering
  ----------------------------- */

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return students.filter(student => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.room.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query) ||
        student.block.toLowerCase().includes(query);

      const matchesBlock =
        selectedBlock === 'ALL' ||
        student.block.includes(selectedBlock);

      const matchesStatus =
        selectedStatus === 'ALL' ||
        student.status === selectedStatus;

      return matchesSearch && matchesBlock && matchesStatus;
    });
  }, [
    students,
    searchQuery,
    selectedBlock,
    selectedStatus
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBlock('ALL');
    setSelectedStatus('ALL');
  };

  /* -----------------------------
     Helpers
  ----------------------------- */

  const getStatusClasses = (status) => {
    if (status === 'Active') {
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
    }

    if (status === 'Suspended') {
      return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60';
    }

    return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60';
  };

  return (
    <div className="space-y-5">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2.5">

            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center">
              <Database className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Student Database
                </h2>

                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                  {totalStudents} RECORDS
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Resident enrollment, accommodation, biometric and guardian records
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Student
        </button>

      </div>


      {/* =========================================================
          KPI CARDS
      ========================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

        {/* Total */}

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Residents
            </span>

            <Users className="w-4 h-4 text-slate-400" />
          </div>

          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">
            {totalStudents}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Registered students
          </p>
        </div>


        {/* Present */}

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Present
            </span>

            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {presentStudents}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Currently marked present
          </p>
        </div>


        {/* Absent */}

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm">

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Absent
            </span>

            <UserX className="w-4 h-4 text-rose-500" />
          </div>

          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">
            {absentStudents}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Not marked present
          </p>
        </div>


        {/* Biometric */}

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/40 shadow-sm">

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Biometrics
            </span>

            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>

          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">
            {enrolledFaces}
            <span className="text-xs text-slate-400 font-normal">
              {' '} / {totalStudents}
            </span>
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Face profiles enrolled
          </p>
        </div>


        {/* Watch */}

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-sm">

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Under Watch
            </span>

            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>

          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">
            {watchStudents}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Active monitoring status
          </p>
        </div>

      </div>


      {/* =========================================================
          SEARCH / FILTER BAR
      ========================================================= */}

      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">

          {/* Search */}

          <div className="relative w-full xl:w-96">

            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search student, ID, room, block or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />

          </div>


          <div className="flex flex-wrap items-center gap-2">

            {/* Block */}

            <div className="flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-950 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800">

              <Building2 className="w-3.5 h-3.5 text-slate-400" />

              <span className="text-slate-400">
                Block
              </span>

              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Blocks</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
              </select>

            </div>


            {/* Status */}

            <div className="flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-950 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800">

              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />

              <span className="text-slate-400">
                Status
              </span>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Watch">Under Watch</option>
                <option value="Suspended">Suspended</option>
              </select>

            </div>


            {/* View Mode */}

            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">

              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>


        {/* Filter summary */}

        {(searchQuery || selectedBlock !== 'ALL' || selectedStatus !== 'ALL') && (

          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">

            <span className="text-[10px] text-slate-400 font-mono">
              Showing {filteredStudents.length} of {students.length} records
            </span>

            <button
              onClick={clearFilters}
              className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>

          </div>

        )}

      </div>


      {/* =========================================================
          EMPTY STATE
      ========================================================= */}

      {filteredStudents.length === 0 ? (

        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">

          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>

          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-3">
            No student records found
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Try changing the search query or filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>

        </div>

      ) : viewMode === 'table' ? (

        /* =========================================================
           TABLE VIEW
        ========================================================= */

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Resident Directory
              </p>

              <p className="text-[10px] text-slate-400 mt-0.5">
                {filteredStudents.length} matching records
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              DATABASE LIVE
            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 dark:bg-[#0e1626] text-slate-500 dark:text-slate-400 uppercase text-[9px] tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">

                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Accommodation</th>
                  <th className="py-3 px-4">Academic</th>
                  <th className="py-3 px-4">Biometric</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Guardian</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >

                    {/* Student */}

                    <td className="py-3 px-4">

                      <div className="flex items-center gap-2.5">

                        <div className="relative">

                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />

                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              student.present
                                ? 'bg-emerald-500'
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {student.name}
                          </p>

                          <p className="text-[10px] font-mono text-slate-400">
                            {student.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Accommodation */}

                    <td className="py-3 px-4">

                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Room {student.room}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {student.block}
                      </p>

                    </td>


                    {/* Academic */}

                    <td className="py-3 px-4">

                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {student.department}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {student.year}
                      </p>

                    </td>


                    {/* Biometrics */}

                    <td className="py-3 px-4">

                      {student.faceEnrolled ? (

                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold">

                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                          {student.faceConfidence || 'Verified'}

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                          Pending
                        </span>

                      )}

                    </td>


                    {/* Attendance */}

                    <td className="py-3 px-4">

                      <div className="flex items-center gap-1.5">

                        <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />

                        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                          {(student.attendanceDates || []).length}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          days
                        </span>

                      </div>

                    </td>


                    {/* Guardian */}

                    <td className="py-3 px-4">

                      <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400">
                        {student.guardianPhone}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="py-3 px-4">

                      <span
                        className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2 py-1 rounded-md border ${getStatusClasses(student.status)}`}
                      >

                        <span className="w-1.5 h-1.5 rounded-full bg-current" />

                        {student.status.toUpperCase()}

                      </span>

                    </td>


                    {/* Actions */}

                    <td className="py-3 px-4">

                      <div className="flex items-center justify-end gap-1.5">

                        <button
                          onClick={() => togglePresence(student)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                            student.present
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-rose-600 dark:hover:text-rose-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                          }`}
                        >

                          {student.present
                            ? <UserX className="w-3 h-3" />
                            : <UserCheck className="w-3 h-3" />
                          }

                          {student.present ? 'Absent' : 'Present'}

                        </button>


                        <button
                          onClick={() => setSelectedStudentForView(student)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                          title="View student details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>


                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete record"
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

        </div>

      ) : (

        /* =========================================================
           CARD VIEW
        ========================================================= */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">

          {filteredStudents.map((student) => (

            <div
              key={student.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-900/50 transition-all overflow-hidden"
            >

              {/* Card Header */}

              <div className="p-4">

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="relative">

                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />

                      <span
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                          student.present
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />

                    </div>

                    <div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </h4>

                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {student.id}
                      </p>

                    </div>

                  </div>


                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-1 rounded-md border ${getStatusClasses(student.status)}`}
                  >
                    {student.status.toUpperCase()}
                  </span>

                </div>


                {/* Details */}

                <div className="grid grid-cols-2 gap-2 mt-4">

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

                    <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                      Room
                    </span>

                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {student.room}
                    </span>

                    <span className="block text-[9px] text-slate-400">
                      {student.block}
                    </span>

                  </div>


                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

                    <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                      Attendance
                    </span>

                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {(student.attendanceDates || []).length}
                    </span>

                    <span className="text-[9px] text-slate-400 ml-1">
                      days
                    </span>

                  </div>


                  <div className="col-span-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

                    <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                      Academic
                    </span>

                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {student.department}
                    </span>

                    <span className="text-[10px] text-slate-400 ml-1">
                      • {student.year}
                    </span>

                  </div>

                </div>


                {/* Verification */}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">

                  <div className="flex items-center gap-1.5">

                    {student.faceEnrolled ? (

                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />

                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Face Verified
                        </span>
                      </>

                    ) : (

                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />

                        <span className="text-[10px] text-slate-400">
                          Face Not Enrolled
                        </span>
                      </>

                    )}

                  </div>


                  <span className="text-[10px] font-mono text-slate-400">
                    {student.guardianPhone}
                  </span>

                </div>

              </div>


              {/* Card Actions */}

              <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">

                <button
                  onClick={() => togglePresence(student)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    student.present
                      ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-rose-600'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                  }`}
                >

                  {student.present
                    ? <UserX className="w-3.5 h-3.5" />
                    : <UserCheck className="w-3.5 h-3.5" />
                  }

                  {student.present ? 'Mark Absent' : 'Mark Present'}

                </button>


                <button
                  onClick={() => setSelectedStudentForView(student)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                  title="View profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>


                <button
                  onClick={() => deleteStudent(student.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* =========================================================
          MODALS
      ========================================================= */}

      {isAddModalOpen && (
        <AddStudentModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {selectedStudentForView && (
        <StudentDetailModal
          student={selectedStudentForView}
          onClose={() => setSelectedStudentForView(null)}
        />
      )}

    </div>
  );
}