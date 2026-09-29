import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AddStudentModal from '../modals/AddStudentModal';
import StudentDetailModal from '../modals/StudentDetailModal';

export default function DatabasePage() {
  const { students, deleteStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBlock = selectedBlock === 'ALL' || student.block.includes(selectedBlock);
    const matchesStatus = selectedStatus === 'ALL' || student.status === selectedStatus;

    return matchesSearch && matchesBlock && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Database Directory</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
              {students.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hostel resident enrollment records, room allocations, and guardian contact details
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, room, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Block Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Block:</span>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Blocks</option>
              <option value="Block A" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Block A</option>
              <option value="Block B" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Block B</option>
              <option value="Block C" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Block C</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Statuses</option>
              <option value="Active" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Active</option>
              <option value="Under Watch" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Under Watch</option>
              <option value="Suspended" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Suspended</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {filteredStudents.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No student records match the search filter</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedBlock('ALL'); setSelectedStatus('ALL'); }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0e1626] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Room & Block</th>
                  <th className="py-3 px-4">Branch & Year</th>
                  <th className="py-3 px-4">Biometrics</th>
                  <th className="py-3 px-4">Guardian Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{student.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {student.room} <span className="text-slate-400 dark:text-slate-500 font-normal">({student.block.split(' ')[0]} {student.block.split(' ')[1]})</span>
                    </td>
                    <td className="py-3 px-4">{student.department} • <span className="text-slate-500 dark:text-slate-400">{student.year}</span></td>
                    <td className="py-3 px-4">
                      {student.faceEnrolled ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          {student.faceConfidence}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{student.guardianPhone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                            : student.status === 'Suspended'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudentForView(student)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Record"
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
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{student.name}</h4>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{student.id}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                      student.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                        : student.status === 'Suspended'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block">Room</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{student.room}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block">Block</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{student.block.split(' ')[0]} {student.block.split(' ')[1]}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase block">Guardian Phone</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{student.guardianPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStudentForView(student)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => deleteStudent(student.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && <AddStudentModal onClose={() => setIsAddModalOpen(false)} />}
      {selectedStudentForView && (
        <StudentDetailModal
          student={selectedStudentForView}
          onClose={() => setSelectedStudentForView(null)}
        />
      )}
    </div>
  );
}
