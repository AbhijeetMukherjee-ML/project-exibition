import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import confetti from 'canvas-confetti';
import { useApp } from './AppContext';

import {
  CLASSROOM_STUDENTS,
  DEFAULT_PERIODS,
  DEFAULT_CLASSROOM_TM_MODEL_URL,
  DEFAULT_CLASSROOM_MAPPINGS
} from '../data/classroomData';

const ClassroomContext = createContext();

/* ============================================================
   TIME HELPERS
============================================================ */

export const todayStr = () => {
  return new Date().toISOString().split('T')[0];
};

const toMinutes = (hhmm) => {
  const [hours, minutes] = String(hhmm).split(':').map(Number);
  return hours * 60 + minutes;
};

const nowMinutes = () => {
  const date = new Date();

  return date.getHours() * 60 + date.getMinutes();
};

/*
  Cutoff = start time + grace period.

  Recognized:
  - At or before cutoff → Present
  - After cutoff → Late
*/
export const cutoffMinutes = (period) => {
  return toMinutes(period.startTime) + (period.graceMinutes || 0);
};

export const cutoffLabel = (period) => {
  const total = cutoffMinutes(period);

  const hours = String(
    Math.floor(total / 60) % 24
  ).padStart(2, '0');

  const minutes = String(
    total % 60
  ).padStart(2, '0');

  return `${hours}:${minutes}`;
};

/* ============================================================
   PROVIDER
============================================================ */

export const ClassroomProvider = ({ children }) => {

  /*
    Reuse the main application's toast system.

    ClassroomProvider is nested inside AppProvider.
  */
  const { showToast } = useApp();

  /* ==========================================================
     STUDENTS
  ========================================================== */

  const [students] = useState(CLASSROOM_STUDENTS);

  /* ==========================================================
     TIMETABLE
  ========================================================== */

  const [periods, setPeriods] = useState(() => {
    const saved = localStorage.getItem('classroom_periods');

    return saved
      ? JSON.parse(saved)
      : DEFAULT_PERIODS;
  });

  const [activePeriodId, setActivePeriodId] = useState(() => {
    const saved = localStorage.getItem(
      'classroom_active_period'
    );

    return saved || DEFAULT_PERIODS[0].id;
  });

  /* ==========================================================
     ATTENDANCE RECORDS
  ==========================================================

     Record format:

     {
       id,
       date,
       periodId,
       studentId,
       status,
       markedAt,
       confidence,
       method
     }
  ========================================================== */

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('classroom_records');

    return saved
      ? JSON.parse(saved)
      : [];
  });

  /* ==========================================================
     TEACHABLE MACHINE MODEL
  ========================================================== */

  const [tmModelURL, setTmModelURL] = useState(() => {
    return (
      localStorage.getItem('classroom_tm_model_url') ||
      DEFAULT_CLASSROOM_TM_MODEL_URL
    );
  });

  /* ==========================================================
     CLASS MAPPINGS
  ========================================================== */

  const [classMappings, setClassMappings] = useState(() => {
    const saved = localStorage.getItem(
      'classroom_tm_mappings'
    );

    const base = saved
      ? JSON.parse(saved)
      : {};

    return {
      ...DEFAULT_CLASSROOM_MAPPINGS,
      ...base
    };
  });

  const setClassMapping = (className, studentId) => {
    setClassMappings((prev) => {
      const next = {
        ...prev
      };

      if (studentId) {
        next[className] = studentId;
      } else {
        delete next[className];
      }

      return next;
    });
  };

  /* ==========================================================
     LOCAL STORAGE — PERSISTENCE
  ========================================================== */

  useEffect(() => {
    localStorage.setItem(
      'classroom_periods',
      JSON.stringify(periods)
    );
  }, [periods]);

  useEffect(() => {
    localStorage.setItem(
      'classroom_active_period',
      activePeriodId
    );
  }, [activePeriodId]);

  useEffect(() => {
    localStorage.setItem(
      'classroom_records',
      JSON.stringify(records)
    );
  }, [records]);

  useEffect(() => {
    localStorage.setItem(
      'classroom_tm_model_url',
      tmModelURL
    );
  }, [tmModelURL]);

  useEffect(() => {
    localStorage.setItem(
      'classroom_tm_mappings',
      JSON.stringify(classMappings)
    );
  }, [classMappings]);

  /* ==========================================================
     ACTIVE PERIOD
  ========================================================== */

  const activePeriod =
    periods.find(
      (period) => period.id === activePeriodId
    ) || periods[0];

  /* ==========================================================
     ATTENDANCE LOOKUP
  ========================================================== */

  const recordFor = (
    studentId,
    periodId = activePeriodId,
    date = todayStr()
  ) => {
    return records.find(
      (record) =>
        record.studentId === studentId &&
        record.periodId === periodId &&
        record.date === date
    );
  };

  /* ==========================================================
     GET STUDENT STATUS
  ========================================================== */

  const getStatus = (
    studentId,
    periodId = activePeriodId
  ) => {
    const record = recordFor(
      studentId,
      periodId
    );

    if (record) {
      return record.status;
    }

    const period = periods.find(
      (p) => p.id === periodId
    );

    /*
      Once cutoff has passed, students without
      an attendance record are displayed as absent.
    */
    if (
      period &&
      nowMinutes() > cutoffMinutes(period)
    ) {
      return 'absent';
    }

    return 'pending';
  };

  /* ==========================================================
     UPSERT ATTENDANCE RECORD
  ========================================================== */

  const upsertRecord = (
    studentId,
    periodId,
    fields
  ) => {
    const date = todayStr();

    setRecords((prev) => {
      const index = prev.findIndex(
        (record) =>
          record.studentId === studentId &&
          record.periodId === periodId &&
          record.date === date
      );

      const base =
        index >= 0
          ? prev[index]
          : {
              id: `ATT-${Date.now()}-${studentId}`,
              date,
              periodId,
              studentId
            };

      const updated = {
        ...base,
        ...fields
      };

      /* Existing record → update it */
      if (index >= 0) {
        const copy = [...prev];

        copy[index] = updated;

        return copy;
      }

      /* New record → add it */
      return [
        updated,
        ...prev
      ];
    });
  };

  /* ==========================================================
     FACE RECOGNITION
  ========================================================== */

  const recognizeStudent = (
    studentId,
    confidence = null,
    periodId = activePeriodId
  ) => {
    const student = students.find(
      (s) => s.id === studentId
    );

    const period = periods.find(
      (p) => p.id === periodId
    );

    if (!student || !period) {
      return false;
    }

    const existing = recordFor(
      studentId,
      periodId
    );

    /*
      Don't overwrite an existing
      Present/Late attendance record.
    */
    if (
      existing &&
      (
        existing.status === 'present' ||
        existing.status === 'late'
      )
    ) {
      return false;
    }

    const status =
      nowMinutes() <= cutoffMinutes(period)
        ? 'present'
        : 'late';

    upsertRecord(
      studentId,
      periodId,
      {
        status,
        markedAt: new Date().toLocaleTimeString(),
        confidence: confidence || 'N/A',
        method:
          'AI Facial Recognition (Teachable Machine)'
      }
    );

    /* Present notification */
    if (status === 'present') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: {
          y: 0.6
        }
      });

      showToast(
        `✅ Present: ${student.name}`,
        `${student.name} recognized on time for ${period.subject}.`,
        'success'
      );
    }

    /* Late notification */
    else {
      showToast(
        `⏰ Late: ${student.name}`,
        `${student.name} recognized after the ${cutoffLabel(period)} cutoff for ${period.subject}.`,
        'warning'
      );
    }

    return true;
  };

  /* ==========================================================
     MANUAL ATTENDANCE OVERRIDE
  ========================================================== */

  const setStatusManual = (
    studentId,
    status,
    periodId = activePeriodId
  ) => {
    const student = students.find(
      (s) => s.id === studentId
    );

    const period = periods.find(
      (p) => p.id === periodId
    );

    if (!student || !period) {
      return;
    }

    upsertRecord(
      studentId,
      periodId,
      {
        status,
        markedAt: new Date().toLocaleTimeString(),
        confidence: 'Manual',
        method: 'Manual Override (Teacher)'
      }
    );

    showToast(
      'Attendance Updated',
      `${student.name} marked ${status.toUpperCase()} for ${period.subject} by teacher.`,
      'info'
    );
  };

  /* ==========================================================
     FINALIZE PERIOD
  ==========================================================

     Any student without Present/Late record
     becomes Absent.
  ========================================================== */

  const finalizePeriod = (
    periodId = activePeriodId,
    { silent = false } = {}
  ) => {
    const period = periods.find(
      (p) => p.id === periodId
    );

    if (!period) {
      return 0;
    }

    let marked = 0;

    students.forEach((student) => {
      const record = recordFor(
        student.id,
        periodId
      );

      if (!record) {
        upsertRecord(
          student.id,
          periodId,
          {
            status: 'absent',
            markedAt: new Date().toLocaleTimeString(),
            confidence: '—',
            method: 'Auto — no-show by cutoff'
          }
        );

        marked += 1;
      }
    });

    if (!silent && marked > 0) {
      showToast(
        'Period Closed',
        `${marked} student(s) auto-marked ABSENT for ${period.subject}.`,
        'warning'
      );
    }

    return marked;
  };

  /* ==========================================================
     RESET PERIOD
  ========================================================== */

  const resetPeriod = (
    periodId = activePeriodId
  ) => {
    const date = todayStr();

    setRecords((prev) =>
      prev.filter(
        (record) =>
          !(
            record.periodId === periodId &&
            record.date === date
          )
      )
    );

    const period = periods.find(
      (p) => p.id === periodId
    );

    showToast(
      'Period Reset',
      `Today's attendance cleared for ${period?.subject || 'period'}.`,
      'info'
    );
  };

  /* ==========================================================
     TIMETABLE MANAGEMENT
  ========================================================== */

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

    setPeriods((prev) => [
      ...prev,
      newPeriod
    ]);

    showToast(
      'Period Added',
      `${newPeriod.subject} added to the timetable.`,
      'success'
    );
  };

  const updatePeriod = (
    id,
    fields
  ) => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === id
          ? {
              ...period,
              ...fields
            }
          : period
      )
    );
  };

  const deletePeriod = (id) => {
    setPeriods((prev) => {
      const next = prev.filter(
        (period) => period.id !== id
      );

      if (
        activePeriodId === id &&
        next.length
      ) {
        setActivePeriodId(next[0].id);
      }

      return next;
    });

    setRecords((prev) =>
      prev.filter(
        (record) => record.periodId !== id
      )
    );
  };

  /* ==========================================================
     ACTIVE PERIOD COUNTS
  ========================================================== */

  const activeCounts = students.reduce(
    (counts, student) => {
      const status = getStatus(student.id);

      if (status === 'present') {
        counts.present += 1;
      } else if (status === 'late') {
        counts.late += 1;
      } else if (status === 'absent') {
        counts.absent += 1;
      } else {
        counts.pending += 1;
      }

      return counts;
    },
    {
      present: 0,
      late: 0,
      absent: 0,
      pending: 0
    }
  );

  /* ==========================================================
     CSV EXPORT
  ========================================================== */

  const exportCSV = () => {
    const esc = (value) => {
      const string =
        value === null ||
        value === undefined
          ? ''
          : String(value);

      return /[",\n]/.test(string)
        ? `"${string.replace(/"/g, '""')}"`
        : string;
    };

    const headers = [
      'Date',
      'Period',
      'Subject',
      'Teacher',
      'Student ID',
      'Roll No',
      'Name',
      'Status',
      'Marked At',
      'Confidence',
      'Method'
    ];

    const sorted = [...records].sort(
      (a, b) =>
        (b.date + b.periodId).localeCompare(
          a.date + a.periodId
        )
    );

    const rows = sorted.map((record) => {
      const period = periods.find(
        (p) => p.id === record.periodId
      );

      const student = students.find(
        (s) => s.id === record.studentId
      );

      return [
        record.date,

        period
          ? `${period.startTime}-${period.endTime}`
          : record.periodId,

        period?.subject || '',
        period?.teacher || '',

        record.studentId,

        student?.rollNo || '',
        student?.name || '',

        (record.status || '').toUpperCase(),

        record.markedAt || '',
        record.confidence || '',
        record.method || ''
      ]
        .map(esc)
        .join(',');
    });

    const summary =
      `Classroom Attendance Report,` +
      `Generated ${new Date().toLocaleString()},` +
      `Total Records: ${records.length}`;

    const csv = [
      summary,
      '',
      headers.join(','),
      ...rows
    ].join('\n');

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement('a');

    anchor.href = url;
    anchor.download =
      `classroom-attendance-${todayStr()}.csv`;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);

    showToast(
      'Report Exported',
      `Attendance CSV (${records.length} records) downloaded.`,
      'success'
    );
  };

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  return (
    <ClassroomContext.Provider
      value={{
        students,

        /* Timetable */
        periods,
        activePeriod,
        activePeriodId,
        setActivePeriodId,

        /* Attendance */
        records,
        recordFor,
        getStatus,
        recognizeStudent,
        setStatusManual,
        finalizePeriod,
        resetPeriod,

        /* Timetable management */
        addPeriod,
        updatePeriod,
        deletePeriod,

        /* Statistics */
        activeCounts,

        /* Export */
        exportCSV,

        /* Face recognition */
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

/* ============================================================
   HOOK
============================================================ */

export const useClassroom = () => {
  const context = useContext(
    ClassroomContext
  );

  if (!context) {
    throw new Error(
      'useClassroom must be used within a ClassroomProvider'
    );
  }

  return context;
};