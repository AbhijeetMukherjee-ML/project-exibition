import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from './AppContext';
import {
  CLASSROOM_STUDENTS,
  DEFAULT_PERIODS,
  DEFAULT_CLASSROOM_TM_MODEL_URL,
  DEFAULT_CLASSROOM_MAPPINGS
} from '../data/classroomData';

const ClassroomContext = createContext();

// --- time helpers ---
export const todayStr = () => new Date().toISOString().split('T')[0];
const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + m;
};
const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
// Cutoff = start + grace. Recognized at/before cutoff => present, after => late.
export const cutoffMinutes = (period) => toMinutes(period.startTime) + (period.graceMinutes || 0);
export const cutoffLabel = (period) => {
  const total = cutoffMinutes(period);
  const h = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const m = String(total % 60).padStart(2, '0');
  return `${h}:${m}`;
};

export const ClassroomProvider = ({ children }) => {
  // Reuse the host app's toast system (this provider is nested inside AppProvider).
  const { showToast } = useApp();

  const [students] = useState(CLASSROOM_STUDENTS);

  const [periods, setPeriods] = useState(() => {
    const saved = localStorage.getItem('classroom_periods');
    return saved ? JSON.parse(saved) : DEFAULT_PERIODS;
  });

  const [activePeriodId, setActivePeriodId] = useState(() => {
    const saved = localStorage.getItem('classroom_active_period');
    return saved || DEFAULT_PERIODS[0].id;
  });

  // Attendance records: [{ id, date, periodId, studentId, status, markedAt, confidence, method }]
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('classroom_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [tmModelURL, setTmModelURL] = useState(() => {
    return localStorage.getItem('classroom_tm_model_url') || DEFAULT_CLASSROOM_TM_MODEL_URL;
  });

  const [classMappings, setClassMappings] = useState(() => {
    const saved = localStorage.getItem('classroom_tm_mappings');
    const base = saved ? JSON.parse(saved) : {};
    return { ...DEFAULT_CLASSROOM_MAPPINGS, ...base };
  });

  const setClassMapping = (className, studentId) => {
    setClassMappings(prev => {
      const next = { ...prev };
      if (studentId) next[className] = studentId; else delete next[className];
      return next;
    });
  };

  // persistence
  useEffect(() => { localStorage.setItem('classroom_periods', JSON.stringify(periods)); }, [periods]);
  useEffect(() => { localStorage.setItem('classroom_active_period', activePeriodId); }, [activePeriodId]);
  useEffect(() => { localStorage.setItem('classroom_records', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('classroom_tm_model_url', tmModelURL); }, [tmModelURL]);
  useEffect(() => { localStorage.setItem('classroom_tm_mappings', JSON.stringify(classMappings)); }, [classMappings]);

  const activePeriod = periods.find(p => p.id === activePeriodId) || periods[0];

  const recordFor = (studentId, periodId = activePeriodId, date = todayStr()) =>
    records.find(r => r.studentId === studentId && r.periodId === periodId && r.date === date);

  // Live/displayed status for a student in a period today: the stored record,
  // or a derived one — 'absent' once the cutoff has passed, else 'pending'.
  const getStatus = (studentId, periodId = activePeriodId) => {
    const rec = recordFor(studentId, periodId);
    if (rec) return rec.status;
    const period = periods.find(p => p.id === periodId);
    if (period && nowMinutes() > cutoffMinutes(period)) return 'absent';
    return 'pending';
  };

  const upsertRecord = (studentId, periodId, fields) => {
    const date = todayStr();
    setRecords(prev => {
      const idx = prev.findIndex(r => r.studentId === studentId && r.periodId === periodId && r.date === date);
      const base = idx >= 0 ? prev[idx] : { id: `ATT-${Date.now()}-${studentId}`, date, periodId, studentId };
      const updated = { ...base, ...fields };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  // Recognized via face model → present (on time) or late (after cutoff).
  const recognizeStudent = (studentId, confidence = null, periodId = activePeriodId) => {
    const student = students.find(s => s.id === studentId);
    const period = periods.find(p => p.id === periodId);
    if (!student || !period) return false;

    const existing = recordFor(studentId, periodId);
    // Don't overwrite an already present/late record on repeated detections.
    if (existing && (existing.status === 'present' || existing.status === 'late')) return false;

    const status = nowMinutes() <= cutoffMinutes(period) ? 'present' : 'late';
    upsertRecord(studentId, periodId, {
      status,
      markedAt: new Date().toLocaleTimeString(),
      confidence: confidence || 'N/A',
      method: 'AI Facial Recognition (Teachable Machine)'
    });

    if (status === 'present') {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      showToast(`✅ Present: ${student.name}`, `${student.name} recognized on time for ${period.subject}.`, 'success');
    } else {
      showToast(`⏰ Late: ${student.name}`, `${student.name} recognized after the ${cutoffLabel(period)} cutoff for ${period.subject}.`, 'warning');
    }
    return true;
  };

  // Manual admin override.
  const setStatusManual = (studentId, status, periodId = activePeriodId) => {
    const student = students.find(s => s.id === studentId);
    const period = periods.find(p => p.id === periodId);
    if (!student || !period) return;
    upsertRecord(studentId, periodId, {
      status,
      markedAt: new Date().toLocaleTimeString(),
      confidence: 'Manual',
      method: 'Manual Override (Teacher)'
    });
    showToast('Attendance Updated', `${student.name} marked ${status.toUpperCase()} for ${period.subject} by teacher.`, 'info');
  };

  // Close the period: everyone without a present/late record becomes absent.
  const finalizePeriod = (periodId = activePeriodId, { silent = false } = {}) => {
    const period = periods.find(p => p.id === periodId);
    if (!period) return 0;
    let marked = 0;
    students.forEach((s) => {
      const rec = recordFor(s.id, periodId);
      if (!rec) {
        upsertRecord(s.id, periodId, {
          status: 'absent',
          markedAt: new Date().toLocaleTimeString(),
          confidence: '—',
          method: 'Auto — no-show by cutoff'
        });
        marked += 1;
      }
    });
    if (!silent && marked > 0) {
      showToast('Period Closed', `${marked} student(s) auto-marked ABSENT for ${period.subject}.`, 'warning');
    }
    return marked;
  };

  const resetPeriod = (periodId = activePeriodId) => {
    const date = todayStr();
    setRecords(prev => prev.filter(r => !(r.periodId === periodId && r.date === date)));
    const period = periods.find(p => p.id === periodId);
    showToast('Period Reset', `Today's attendance cleared for ${period?.subject || 'period'}.`, 'info');
  };

  // Timetable management
  const addPeriod = (data) => {
    const newPeriod = {
      id: `P-${Date.now()}`,
      subject: 'New Subject',
      teacher: '',
      room: '',
      startTime: '13:00',
      endTime: '13:50',
      graceMinutes: 10,
      ...data
    };
    setPeriods(prev => [...prev, newPeriod]);
    showToast('Period Added', `${newPeriod.subject} added to the timetable.`, 'success');
  };
  const updatePeriod = (id, fields) => {
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p));
  };
  const deletePeriod = (id) => {
    setPeriods(prev => {
      const next = prev.filter(p => p.id !== id);
      if (activePeriodId === id && next.length) setActivePeriodId(next[0].id);
      return next;
    });
    setRecords(prev => prev.filter(r => r.periodId !== id));
  };

  // Counts for the active period today
  const activeCounts = students.reduce((acc, s) => {
    const st = getStatus(s.id);
    if (st === 'present') acc.present += 1;
    else if (st === 'late') acc.late += 1;
    else if (st === 'absent') acc.absent += 1;
    else acc.pending += 1;
    return acc;
  }, { present: 0, late: 0, absent: 0, pending: 0 });

  // CSV export of all attendance records
  const exportCSV = () => {
    const esc = (v) => {
      const str = v === null || v === undefined ? '' : String(v);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const headers = ['Date', 'Period', 'Subject', 'Teacher', 'Student ID', 'Roll No', 'Name', 'Status', 'Marked At', 'Confidence', 'Method'];
    const sorted = [...records].sort((a, b) =>
      (b.date + b.periodId).localeCompare(a.date + a.periodId)
    );
    const rows = sorted.map((r) => {
      const period = periods.find(p => p.id === r.periodId);
      const student = students.find(s => s.id === r.studentId);
      return [
        r.date,
        period ? `${period.startTime}-${period.endTime}` : r.periodId,
        period?.subject || '',
        period?.teacher || '',
        r.studentId,
        student?.rollNo || '',
        student?.name || '',
        (r.status || '').toUpperCase(),
        r.markedAt || '',
        r.confidence || '',
        r.method || ''
      ].map(esc).join(',');
    });
    const summary = `Classroom Attendance Report,Generated ${new Date().toLocaleString()},Total Records: ${records.length}`;
    const csv = [summary, '', headers.join(','), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classroom-attendance-${todayStr()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report Exported', `Attendance CSV (${records.length} records) downloaded.`, 'success');
  };

  return (
    <ClassroomContext.Provider
      value={{
        students,
        periods,
        activePeriod,
        activePeriodId,
        setActivePeriodId,
        records,
        recordFor,
        getStatus,
        recognizeStudent,
        setStatusManual,
        finalizePeriod,
        resetPeriod,
        addPeriod,
        updatePeriod,
        deletePeriod,
        activeCounts,
        exportCSV,
        tmModelURL,
        setTmModelURL,
        classMappings,
        setClassMapping
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const ctx = useContext(ClassroomContext);
  if (!ctx) throw new Error('useClassroom must be used within a ClassroomProvider');
  return ctx;
};
