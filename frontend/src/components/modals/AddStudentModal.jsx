import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  Home,
  GraduationCap,
  Phone,
  Mail,
  UserRound,
  BedDouble
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AddStudentModal({ onClose }) {
  const { addStudent } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    block: 'Block A (Aryabhata)',
    room: '',
    bed: 'Bed 1',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Father',
    bloodGroup: 'O+',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.room.trim()) {
      alert('Please enter at least Student Name and Room Number.');
      return;
    }

    addStudent(formData);
    onClose();
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all';

  const labelClass =
    'text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">

      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start justify-between">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <UserPlus className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enroll New Student
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Register resident identity, accommodation and emergency details
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-150px)] overflow-y-auto p-6 space-y-5"
        >

          {/* ================= STUDENT IDENTITY ================= */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Student Identity
                  </h3>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Basic resident information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className={labelClass}>
                  Full Name <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Student Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="email"
                    placeholder="student@hostel.edu"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Blood Group
                </label>

                <select
                  value={formData.bloodGroup}
                  onChange={(e) => updateField('bloodGroup', e.target.value)}
                  className={inputClass}
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Department / Branch
                </label>

                <select
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className={inputClass}
                >
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics & Communication</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Biotechnology</option>
                  <option>Data Science & AI</option>
                </select>
              </div>

            </div>
          </section>


          {/* ================= HOSTEL ALLOCATION ================= */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Hostel Allocation
                  </h3>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Assign block, room and academic year
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div>
                <label className={labelClass}>
                  Hostel Block
                </label>

                <select
                  value={formData.block}
                  onChange={(e) => updateField('block', e.target.value)}
                  className={inputClass}
                >
                  <option>Block A (Aryabhata)</option>
                  <option>Block B (Kalpana)</option>
                  <option>Block C (Bhabha)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Room Number <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. A-204"
                  value={formData.room}
                  onChange={(e) => updateField('room', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Bed
                </label>

                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <select
                    value={formData.bed}
                    onChange={(e) => updateField('bed', e.target.value)}
                    className={`${inputClass} pl-9`}
                  >
                    <option>Bed 1</option>
                    <option>Bed 2</option>
                    <option>Bed 3</option>
                    <option>Bed 4</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className={labelClass}>
                  Year of Study
                </label>

                <div className="flex gap-2">

                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => updateField('year', year)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        formData.year === year
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {year}
                    </button>
                  ))}

                </div>
              </div>

            </div>
          </section>


          {/* ================= BIOMETRIC STATUS ================= */}
          <section className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-4">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Biometric Enrollment
                  </h3>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Facial recognition profile can be enrolled after registration.
                  </p>
                </div>

              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                PENDING
              </span>

            </div>

          </section>


          {/* ================= GUARDIAN ================= */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />

                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Emergency / Guardian Contact
                  </h3>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Used for emergency communication and alerts
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div>
                <label className={labelClass}>
                  Guardian Name
                </label>

                <input
                  type="text"
                  placeholder="Guardian Name"
                  value={formData.guardianName}
                  onChange={(e) => updateField('guardianName', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Guardian Phone
                </label>

                <input
                  type="tel"
                  placeholder="+91 98000 11111"
                  value={formData.guardianPhone}
                  onChange={(e) => updateField('guardianPhone', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Relationship
                </label>

                <select
                  value={formData.guardianRelation}
                  onChange={(e) => updateField('guardianRelation', e.target.value)}
                  className={inputClass}
                >
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Legal Guardian</option>
                  <option>Sibling</option>
                  <option>Other</option>
                </select>
              </div>

            </div>
          </section>

        </form>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">

          <p className="hidden sm:block text-[10px] text-slate-400">
            <span className="text-rose-500">*</span> Required fields
          </p>

          <div className="flex items-center gap-2 ml-auto">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register & Enroll
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}