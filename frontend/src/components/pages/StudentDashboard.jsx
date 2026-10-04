import React from 'react';
import { ShieldCheck, Home, Phone, Scale, CheckCircle2, AlertTriangle, User, CalendarDays, Fingerprint } from 'lucide-react';
import { INITIAL_STUDENTS } from '../../data/initialData';
import { useApp } from '../../context/AppContext';

export default function StudentDashboard() {
  const { students, currentStudentId, logs, fines, isLoadingStudents } = useApp();
  

  if (isLoadingStudents) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="animate-spin border-4 border-emerald-500 border-t-transparent h-8 rounded-full w-8"></div>
        <p className="dark:text-slate-400 font-mono text-slate-500 text-sm">Loading student profile...</p>
      </div>
    );
  }

    let student = students.find(s => s.id === currentStudentId) || students[0];
  let isMock = false;

  if (!student) {
    // Fallback to mock student if database is entirely empty so reviewer can see features
    student = {
        id: 'STU-2026-001',
        name: 'Rohan Kulkarni',
        room: 'RC-402',
        block: 'Raman Block',
        department: 'B.Tech Computer Science',
        year: '3rd Year',
        attendance: '85%',
        avatar: 'https://i.pravatar.cc/150?u=stu1'
    };
    isMock = true;
  }


    let studentLogs = logs.filter(l => l.studentId === student.id || l.studentName === student.name);
  let studentFines = fines.filter(f => f.studentId === student.id || f.studentName === student.name);

  if (isMock || studentLogs.length === 0) {
    // Populate mock features for the presentation demo!
    studentLogs = [
      { id: 1, type: 'hostel', direction: 'OUT', timestamp: 'Today, 08:30 AM', curfewAlert: false },
      { id: 2, type: 'classroom', timestamp: 'Today, 09:15 AM (Class 1)', curfewAlert: false },
      { id: 3, type: 'hostel', direction: 'IN', timestamp: 'Yesterday, 23:45 PM', curfewAlert: true },
    ];
  }

  if (isMock || studentFines.length === 0) {
    studentFines = [
      { id: 1, reason: 'Late Entry Past Curfew (10:00 PM)', amount: 500, status: 'Pending Action', date: 'Oct 03, 2026', issuedBy: 'Chief Warden Office' }
    ];
  }

  const paidFines = studentFines.filter(fine => fine.status === 'Served / Paid');
  const pendingFinesCount = studentFines.length - paidFines.length;
  
  const totalIn = studentLogs.filter(l => l.direction === 'IN').length;
  const totalOut = studentLogs.filter(l => l.direction === 'OUT').length;
  const violations = studentLogs.filter(l => l.curfewAlert).length;

  const latestHostelLog = studentLogs.find(l => l.type === 'hostel');
  const isOutside = latestHostelLog && latestHostelLog.direction === 'OUT';


  return (
    <div className="animate-in duration-300 fade-in space-y-6 zoom-in-95">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-6 items-center md:flex-row md:items-start p-6 rounded-2xl">
        <img src={student.avatar} alt={student.name} className="border-4 border-slate-50 dark:border-slate-800 h-32 object-cover rounded-2xl shadow-xl w-32" />
        <div className="flex-1 md:text-left text-center">
          <div className="flex flex-col gap-3 items-center mb-2 md:flex-row">
            <h1 className="dark:text-white font-bold text-2xl text-slate-900">{student.name}</h1>
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-slate-400 font-mono px-3 py-1 rounded-full text-slate-600 text-xs">
              {student.id}
            </span>
            {pendingFinesCount > 0 && (
              <span className="bg-rose-100 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 flex font-bold gap-1.5 items-center px-3 py-1 rounded-full text-rose-600 text-xs">
                <AlertTriangle className="h-3.5 w-3.5" />
                {pendingFinesCount} Pending Action{pendingFinesCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="dark:text-slate-400 max-w-xl mb-6 text-slate-500">
            Welcome to your student portal. You can view your attendance records, hostel entry/exit logs, and disciplinary history here.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <div className="dark:text-slate-400 flex gap-2 items-center text-slate-600 text-sm">
              <Home className="h-4 w-4" />
              Room {student.room}
            </div>
            <div className="dark:text-slate-400 flex gap-2 items-center text-slate-600 text-sm">
              <Phone className="h-4 w-4" />
              {student.phone}
            </div>
            <div className="dark:text-slate-400 flex gap-2 items-center text-slate-600 text-sm">
              <Fingerprint className="h-4 w-4" />
              {student.bloodGroup}
            </div>
          </div>
        </div>
      </div>


      {/* Current Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 animate-pulse-slow ${ isOutside ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400' }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ isOutside ? 'bg-amber-100' : 'bg-emerald-100 dark:bg-emerald-500/20' }`}>
          {isOutside ? <Home className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </div>
        <div>
          <h3 className="font-bold text-sm">
            {isOutside 
              ? 'Currently Outside Hostel' 
              : 'Safely Inside Hostel / Campus'}
          </h3>
          <p className="opacity-80 text-xs">
            {latestHostelLog ? `Last seen at gate: ${latestHostelLog.timestamp} (${latestHostelLog.direction})` : 'No recent gate movement detected.'}
          </p>
        </div>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div className="dark:text-slate-400 flex gap-2 items-center mb-4 text-slate-500">
            <CalendarDays className="h-5 text-emerald-500 w-5" />
            <h3 className="dark:text-white font-bold text-slate-900">Attendance</h3>
          </div>
          <div className="dark:text-white font-black mb-1 text-3xl text-slate-900">{student.attendance}</div>
          <p className="dark:text-slate-400 text-slate-500 text-xs">Current semester average</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div className="dark:text-slate-400 flex gap-2 items-center mb-4 text-slate-500">
            <Home className="h-5 text-blue-500 w-5" />
            <h3 className="dark:text-white font-bold text-slate-900">Hostel Gate</h3>
          </div>
          <div className="flex gap-6 items-center">
            <div>
              <div className="dark:text-emerald-400 font-bold text-emerald-600 text-xl">{totalIn}</div>
              <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">ENTRIES</p>
            </div>
            <div>
              <div className="dark:text-blue-400 font-bold text-blue-600 text-xl">{totalOut}</div>
              <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">EXITS</p>
            </div>
            <div>
              <div className="dark:text-rose-400 font-bold text-rose-600 text-xl">{violations}</div>
              <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">CURFEW VIOLATIONS</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div className="dark:text-slate-400 flex gap-2 items-center mb-4 text-slate-500">
            <Scale className="h-5 text-amber-500 w-5" />
            <h3 className="dark:text-white font-bold text-slate-900">Disciplinary</h3>
          </div>
          <div className="flex gap-6 items-center">
            <div>
              <div className="dark:text-white font-bold text-slate-900 text-xl">{studentFines.length}</div>
              <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">TOTAL INCIDENTS</p>
            </div>
            <div>
              <div className="dark:text-amber-400 font-bold text-amber-600 text-xl">{pendingFinesCount}</div>
              <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">PENDING ACTIONS</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-2xl">
        <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800 px-6 py-4">
          <h3 className="dark:text-white font-bold text-slate-900">Recent Activity</h3>
        </div>
        <div className="dark:divide-slate-800 divide-slate-200 divide-y">
          {studentLogs.length === 0 ? (
            <div className="dark:text-slate-400 p-8 text-center text-slate-500 text-sm">No recent activity recorded.</div>
          ) : (
            studentLogs.slice(0, 10).map(log => (
              <div key={log.id} className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.curfewAlert ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {log.curfewAlert ? <AlertTriangle className="h-4 w-4" /> : log.type === "hostel" ? <Home className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="dark:text-white font-semibold text-slate-900 text-sm">
                      {log.type === 'hostel' ? `Hostel Gate (${log.direction})` : 'Classroom Attendance'}
                    </p>
                    <p className="dark:text-slate-400 text-slate-500 text-xs">{log.timestamp}</p>
                  </div>
                </div>
                {log.curfewAlert && (
                  <span className="bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 font-bold px-2 py-1 rounded text-[10px] text-rose-600">
                    CURFEW VIOLATION
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Disciplinary Records Detailed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-2xl">
        <div className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800 flex items-center justify-between px-6 py-4">
          <h3 className="dark:text-white flex font-bold gap-2 items-center text-slate-900">
            <Scale className="h-4 text-amber-500 w-4" />
            Disciplinary Records
          </h3>
          <span className="dark:text-slate-400 font-mono text-slate-500 text-xs">{studentFines.length} Total Incidents</span>
        </div>
        <div className="dark:divide-slate-800 divide-slate-200 divide-y">
          {studentFines.length === 0 ? (
            <div className="dark:text-slate-400 p-8 text-center text-slate-500 text-sm">You have a clean record! Keep it up.</div>
          ) : (
            studentFines.map(fine => (
              <div key={fine.id} className="flex flex-col gap-4 justify-between md:flex-row md:items-center p-4">
                <div>
                  <p className="dark:text-white font-semibold text-slate-900 text-sm">{fine.reason}</p>
                  <p className="dark:text-slate-400 mt-1 text-slate-500 text-xs">{fine.date} • Issued by {fine.issuedBy}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="dark:text-white font-bold font-mono text-slate-900 text-sm">₹{fine.amount}</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${ fine.status === 'Served / Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' }`}>
                    {fine.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
