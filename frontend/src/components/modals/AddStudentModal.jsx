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
    'w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all';

  const labelClass =
    'text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5 block';

  return (
    <div className="animate-in backdrop-blur-md bg-black/70 duration-150 fade-in fixed flex inset-0 items-center justify-center p-4 z-50">

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-3xl overflow-hidden rounded-2xl shadow-2xl w-full">

        {/* ================= HEADER ================= */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-5">
          <div className="flex items-start justify-between">

            <div className="flex gap-3 items-center">
              <div className="bg-blue-600 dark:text-white flex h-11 items-center justify-center rounded-xl shadow-blue-600/20 shadow-lg text-slate-900 w-11">
                <UserPlus className="h-5 w-5" />
              </div>

              <div>
                <h2 className="dark:text-white font-bold text-lg text-slate-900">
                  Enroll New Student
                </h2>

                <p className="dark:text-slate-400 mt-0.5 text-slate-500 text-xs">
                  Register resident identity, accommodation and emergency details
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-800 dark:hover:text-white dark:text-slate-400 flex h-8 hover:bg-slate-100 hover:text-slate-700 items-center justify-center rounded-lg text-slate-500 transition-colors w-8"
            >
              <X className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-150px)] overflow-y-auto p-6 space-y-5"
        >

          {/* ================= STUDENT IDENTITY ================= */}
          <section className="border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">

            <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800 px-4 py-3">
              <div className="flex gap-2 items-center">
                <UserRound className="dark:text-blue-400 h-4 text-blue-600 w-4" />

                <div>
                  <h3 className="dark:text-white font-bold text-slate-900 text-xs">
                    Student Identity
                  </h3>

                  <p className="dark:text-slate-400 text-[10px] text-slate-500">
                    Basic resident information
                  </p>
                </div>
              </div>
            </div>

            <div className="gap-4 grid grid-cols-1 p-4 sm:grid-cols-2">

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
                  <Mail className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-500 top-1/2 w-4" />

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
                  <Phone className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-500 top-1/2 w-4" />

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
          <section className="border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">

            <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800 px-4 py-3">
              <div className="flex gap-2 items-center">
                <Home className="dark:text-emerald-400 h-4 text-emerald-600 w-4" />

                <div>
                  <h3 className="dark:text-white font-bold text-slate-900 text-xs">
                    Hostel Allocation
                  </h3>

                  <p className="dark:text-slate-400 text-[10px] text-slate-500">
                    Assign block, room and academic year
                  </p>
                </div>
              </div>
            </div>

            <div className="gap-4 grid grid-cols-1 p-4 sm:grid-cols-3">

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
                  <BedDouble className="-translate-y-1/2 absolute dark:text-slate-400 h-4 left-3 text-slate-500 top-1/2 w-4" />

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
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${ formData.year === year ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400' }`}
                    >
                      {year}
                    </button>
                  ))}

                </div>
              </div>

            </div>
          </section>


          {/* ================= BIOMETRIC STATUS ================= */}
          <section className="bg-blue-50/50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60 p-4 rounded-xl">

            <div className="flex gap-4 items-center justify-between">

              <div className="flex gap-3 items-center">

                <div className="bg-blue-100 dark:bg-blue-900/50 flex h-10 items-center justify-center rounded-lg w-10">
                  <ShieldCheck className="dark:text-blue-400 h-5 text-blue-600 w-5" />
                </div>

                <div>
                  <h3 className="dark:text-white font-bold text-slate-900 text-xs">
                    Biometric Enrollment
                  </h3>

                  <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500">
                    Facial recognition profile can be enrolled after registration.
                  </p>
                </div>

              </div>

              <span className="bg-amber-100 border border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400 font-bold font-mono px-2.5 py-1 rounded-md text-[10px] text-amber-700">
                PENDING
              </span>

            </div>

          </section>


          {/* ================= GUARDIAN ================= */}
          <section className="border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">

            <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800 px-4 py-3">
              <div className="flex gap-2 items-center">
                <Phone className="dark:text-amber-400 h-4 text-amber-600 w-4" />

                <div>
                  <h3 className="dark:text-white font-bold text-slate-900 text-xs">
                    Emergency / Guardian Contact
                  </h3>

                  <p className="dark:text-slate-400 text-[10px] text-slate-500">
                    Used for emergency communication and alerts
                  </p>
                </div>
              </div>
            </div>

            <div className="gap-4 grid grid-cols-1 p-4 sm:grid-cols-3">

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
        <div className="bg-slate-50 border-slate-200 dark:border-slate-800 border-t dark:bg-slate-950/50 flex items-center justify-between px-6 py-4">

          <p className="hidden sm:block text-[10px] text-slate-400">
            <span className="text-rose-500">*</span> Required fields
          </p>

          <div className="flex gap-2 items-center ml-auto">

            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 px-4 py-2.5 rounded-lg text-slate-700 text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 cursor-pointer flex font-bold gap-2 hover:bg-blue-500 items-center px-5 py-2.5 rounded-lg shadow-blue-600/20 shadow-sm text-white text-xs transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register & Enroll
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}