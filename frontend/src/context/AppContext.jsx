import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

import {
  INITIAL_STUDENTS,
  INITIAL_LOGS,
  INITIAL_FINES,
  CAMERAS,
  DEFAULT_TM_MODEL_URL,
  DEFAULT_TM_MAPPINGS
} from '../data/initialData';

const AppContext = createContext();

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  ACTIVE_TAB: 'aegis_active_tab',
  STUDENTS: 'aegis_students',
  LOGS: 'aegis_logs',
  FINES: 'aegis_fines',
  CURRENT_VIEW: 'aegis_current_view',
  USER_ROLE: 'aegis_user_role',
  CURRENT_STUDENT_ID: 'aegis_current_student_id',
  THEME: 'aegis_theme',
  TM_MODEL_URL: 'aegis_tm_model_url',
  TM_MAPPINGS: 'aegis_tm_mappings'
};

/* =========================================================
   DEFAULT ADMIN
========================================================= */

const DEFAULT_ADMIN = {
  name: 'Dr. Arvind Varma',
  role: 'Chief Hostel Administrator',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  badge: 'Super Admin',
  hostelUnit: 'Central Hostel Complex (Blocks A, B, C)'
};

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

const getTimestamp = () => {
  return new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);
};

const generateLogId = () => {
  return `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
};

const getStoredValue = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const getStoredString = (key, fallback) => {
  return localStorage.getItem(key) || fallback;
};

/* =========================================================
   APP PROVIDER
========================================================= */

export const AppProvider = ({ children }) => {
  /* =======================================================
     NAVIGATION
  ======================================================= */

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem(
      STORAGE_KEYS.ACTIVE_TAB
    );

    return saved && saved !== 'home'
      ? saved
      : 'database';
  });

  const [currentView, setCurrentView] = useState(() => {
    return getStoredString(
      STORAGE_KEYS.CURRENT_VIEW,
      'home'
    );
  });

  const [userRole, setUserRole] = useState(() => {
    return getStoredString(
      STORAGE_KEYS.USER_ROLE,
      'admin'
    );
  });

  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return getStoredString(
      STORAGE_KEYS.CURRENT_STUDENT_ID,
      'STU-2026-001'
    );
  });

  /* =======================================================
     THEME
  ======================================================= */

  const [theme, setTheme] = useState(() => {
    return getStoredString(
      STORAGE_KEYS.THEME,
      'dark'
    );
  });

  const toggleTheme = () => {
    setTheme(prev =>
      prev === 'dark' ? 'light' : 'dark'
    );
  };

  /* =======================================================
     STUDENTS
  ======================================================= */

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem(
      STORAGE_KEYS.STUDENTS
    );

    if (!saved) {
      return INITIAL_STUDENTS;
    }

    try {
      const parsed = JSON.parse(saved);

      const savedIds = new Set(
        parsed.map(student => student.id)
      );

      const missingStudents = INITIAL_STUDENTS.filter(
        student => !savedIds.has(student.id)
      );

      return missingStudents.length > 0
        ? [...parsed, ...missingStudents]
        : parsed;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  /* =======================================================
     LOGS
  ======================================================= */

  const [logs, setLogs] = useState(() => {
    return getStoredValue(
      STORAGE_KEYS.LOGS,
      INITIAL_LOGS
    );
  });

  /* =======================================================
     FINES
  ======================================================= */

  const [fines, setFines] = useState(() => {
    return getStoredValue(
      STORAGE_KEYS.FINES,
      INITIAL_FINES
    );
  });

  /* =======================================================
     CAMERA SYSTEM
  ======================================================= */

  const [cameras] = useState(CAMERAS);

  const [activeCameraId, setActiveCameraId] =
    useState('CAM-01');

  const [aiOverlayEnabled, setAiOverlayEnabled] =
    useState(true);

  const [nightVision, setNightVision] =
    useState(false);

  const [currentDetection, setCurrentDetection] =
    useState({
      student: INITIAL_STUDENTS[0],
      confidence: '99.4%',
      timestamp: new Date().toLocaleTimeString(),
      box: {
        top: 22,
        left: 32,
        width: 36,
        height: 48
      },
      status: 'AUTHORIZED'
    });

  /* =======================================================
     FACIAL RECOGNITION
  ======================================================= */

  const [tmModelURL, setTmModelURL] = useState(() => {
    return getStoredString(
      STORAGE_KEYS.TM_MODEL_URL,
      DEFAULT_TM_MODEL_URL
    );
  });

  const [classMappings, setClassMappings] = useState(() => {
    const saved = getStoredValue(
      STORAGE_KEYS.TM_MAPPINGS,
      {}
    );

    return {
      ...DEFAULT_TM_MAPPINGS,
      ...saved
    };
  });

  const setClassMapping = (
    className,
    studentId
  ) => {
    setClassMappings(prev => {
      const next = { ...prev };

      if (studentId) {
        next[className] = studentId;
      } else {
        delete next[className];
      }

      return next;
    });
  };

  /* =======================================================
     TOAST SYSTEM
  ======================================================= */

  const [toasts, setToasts] = useState([]);

  const showToast = (
    title,
    message,
    type = 'info'
  ) => {
    const id = Date.now() + Math.random();

    const newToast = {
      id,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString()
    };

    setToasts(prev => [
      newToast,
      ...prev.slice(0, 4)
    ]);

    setTimeout(() => {
      setToasts(prev =>
        prev.filter(toast => toast.id !== id)
      );
    }, 4500);
  };

  const removeToast = id => {
    setToasts(prev =>
      prev.filter(toast => toast.id !== id)
    );
  };

  /* =======================================================
     NAVIGATION ACTIONS
  ======================================================= */

  const loginAsAdmin = () => {
    setUserRole('admin');
    setCurrentView('portal');
  };

  const loginAsStudent = studentId => {
    if (studentId) {
      setCurrentStudentId(studentId);
    }

    setUserRole('student');
    setCurrentView('portal');
  };

  const goToHome = () => {
    setCurrentView('home');
  };

  const goToClassroom = () => {
    setCurrentView('classroom');
  };

  /* =======================================================
     STUDENT ACTIONS
  ======================================================= */

  const addStudent = studentData => {
    const newId = `STU-2026-${String(
      students.length + 1
    ).padStart(3, '0')}`;

    const newStudent = {
      id: newId,

      avatar:
        studentData.avatar ||
        `https://images.unsplash.com/photo-${
          1535713875002 + students.length
        }?auto=format&fit=crop&w=256&q=80`,

      faceEnrolled: true,
      faceConfidence: '98.5%',
      status: 'Active',
      joinedDate: getToday(),

      ...studentData
    };

    setStudents(prev => [
      newStudent,
      ...prev
    ]);

    showToast(
      'Student Registered',
      `${newStudent.name} (${newStudent.id}) has been added to the database.`,
      'success'
    );

    return newStudent;
  };

  const updateStudent = (
    id,
    updatedFields
  ) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? {
              ...student,
              ...updatedFields
            }
          : student
      )
    );

    showToast(
      'Record Updated',
      `Student ID ${id} information has been refreshed.`,
      'info'
    );
  };

  const deleteStudent = id => {
    const student = students.find(
      item => item.id === id
    );

    setStudents(prev =>
      prev.filter(
        item => item.id !== id
      )
    );

    showToast(
      'Student Removed',
      `${student?.name || id} removed from registry.`,
      'warning'
    );
  };

  /* =======================================================
     FINE ACTIONS
  ======================================================= */

  const addFine = fineData => {
    const newId =
      `FINE-2026-${100 + fines.length + 1}`;

    const student = students.find(
      item => item.id === fineData.studentId
    );

    const newFine = {
      id: newId,

      studentName:
        student?.name ||
        fineData.studentName,

      avatar:
        student?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',

      room:
        student?.room ||
        fineData.room,

      block:
        student?.block ||
        fineData.block ||
        'Block A',

      issuedDate: getToday(),

      dueDate: new Date(
        Date.now() + 7 * 86400000
      )
        .toISOString()
        .split('T')[0],

      status: 'Unserved / Pending',
      servedDate: null,
      paymentMethod: null,
      issuedBy: DEFAULT_ADMIN.name,
      guardianNotified: true,

      ...fineData
    };

    setFines(prev => [
      newFine,
      ...prev
    ]);

    showToast(
      'Disciplinary Notice Issued',
      `Penalty ₹${newFine.amount} logged for ${newFine.studentName}.`,
      'warning'
    );

    return newFine;
  };

  const toggleFineStatus = fineId => {
    setFines(prev =>
      prev.map(fine => {
        if (fine.id !== fineId) {
          return fine;
        }

        const isNowServed =
          fine.status !== 'Served / Paid';

        if (isNowServed) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: {
              y: 0.6
            }
          });

          showToast(
            'Disciplinary Action Served',
            `${fine.studentName}'s fine of ₹${fine.amount} has been marked as SERVED & CLEARED.`,
            'success'
          );

          return {
            ...fine,
            status: 'Served / Paid',
            servedDate:
              new Date().toLocaleString(),
            paymentMethod:
              'Admin Manual Clearance / Receipt Verified'
          };
        }

        showToast(
          'Status Reset',
          `${fine.studentName}'s fine returned to PENDING / UNSERVED status.`,
          'info'
        );

        return {
          ...fine,
          status: 'Unserved / Pending',
          servedDate: null,
          paymentMethod: null
        };
      })
    );
  };

  const notifyGuardian = fineId => {
    setFines(prev =>
      prev.map(fine =>
        fine.id === fineId
          ? {
              ...fine,
              guardianNotified: true
            }
          : fine
      )
    );

    const targetFine = fines.find(
      fine => fine.id === fineId
    );

    showToast(
      'Guardian Alert Dispatched',
      `Official SMS & Email alert sent to guardian of ${targetFine?.studentName}.`,
      'info'
    );
  };

  /* =======================================================
     LOG ACTIONS
  ======================================================= */

  const addLog = logData => {
    const newLog = {
      id: generateLogId(),
      timestamp: getTimestamp(),
      ...logData
    };

    setLogs(prev => [
      newLog,
      ...prev
    ]);

    return newLog;
  };

  /* =======================================================
     ATTENDANCE
  ======================================================= */

  const markStudentPresent = (
    studentId,
    confidence = null,
    options = {}
  ) => {
    const { manual = false } = options;

    const student = students.find(
      item => item.id === studentId
    );

    if (!student) {
      return false;
    }

    const today = getToday();

    const alreadyPresentToday =
      student.present &&
      student.presentDate === today;

    setStudents(prev =>
      prev.map(item =>
        item.id === studentId
          ? {
              ...item,
              present: true,
              presentDate: today,
              presentAt:
                new Date().toLocaleString(),

              lastRecognitionConfidence:
                manual
                  ? confidence || 'Manual'
                  : confidence,

              attendanceDates:
                (item.attendanceDates || []).includes(
                  today
                )
                  ? item.attendanceDates
                  : [
                      ...(item.attendanceDates || []),
                      today
                    ]
            }
          : item
      )
    );

    if (!alreadyPresentToday) {
      const currentHour =
        new Date().getHours();

      const isCurfew =
        currentHour >= 22;

      const newLog = {
        id: generateLogId(),

        studentId: student.id,
        studentName: student.name,
        avatar: student.avatar,
        room: student.room,

        direction: 'IN',
        timestamp: getTimestamp(),

        gate: manual
          ? 'Manual Admin Entry'
          : 'Attendance Point - Face AI',

        method: manual
          ? 'Manual Override (Admin)'
          : 'AI Facial Recognition (Teachable Machine)',

        status: isCurfew
          ? 'Curfew Violation'
          : 'Present - Attendance Marked',

        curfewAlert: isCurfew,

        remarks: manual
          ? 'Attendance marked manually by administrator'
          : isCurfew
            ? 'Recognized past curfew threshold'
            : 'Attendance auto-marked on face recognition',

        confidence:
          confidence ||
          (manual ? 'Manual' : 'N/A')
      };

      setLogs(prev => [
        newLog,
        ...prev
      ]);

      setCurrentDetection({
        student,

        confidence:
          confidence ||
          (manual ? 'Manual' : 'N/A'),

        timestamp:
          new Date().toLocaleTimeString(),

        box: {
          top: 22,
          left: 32,
          width: 36,
          height: 48
        },

        status: isCurfew
          ? 'CURFEW_ALERT'
          : 'AUTHORIZED'
      });

      if (!manual) {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: {
            y: 0.6
          }
        });
      }

      showToast(
        `✅ Present: ${student.name}`,

        manual
          ? `Manually marked present by admin (${student.id}).`
          : `Face recognized (${confidence || 'match'}) — attendance marked for ${student.id}.`,

        'success'
      );
    }

    return !alreadyPresentToday;
  };

  const markStudentAbsent = studentId => {
    const student = students.find(
      item => item.id === studentId
    );

    if (!student) {
      return;
    }

    const today = getToday();

    setStudents(prev =>
      prev.map(item =>
        item.id === studentId
          ? {
              ...item,

              present: false,
              presentDate: null,
              presentAt: null,
              lastRecognitionConfidence: null,

              attendanceDates:
                (item.attendanceDates || []).filter(
                  date => date !== today
                )
            }
          : item
      )
    );

    showToast(
      'Marked Absent',
      `${student.name} (${student.id}) set back to absent by admin.`,
      'info'
    );
  };

  const resetAttendance = () => {
    const today = getToday();

    setStudents(prev =>
      prev.map(student => ({
        ...student,

        present: false,
        presentDate: null,
        presentAt: null,
        lastRecognitionConfidence: null,

        attendanceDates:
          (student.attendanceDates || []).filter(
            date => date !== today
          )
      }))
    );

    showToast(
      'Attendance Reset',
      "Today's attendance cleared. Past history preserved.",
      'info'
    );
  };

  /* =======================================================
     SIMULATED CAMERA SCAN
  ======================================================= */

  const triggerSimulatedScan = () => {
    if (students.length === 0) {
      return;
    }

    const randomStudent =
      students[
        Math.floor(
          Math.random() * students.length
        )
      ];

    const directions = [
      'IN',
      'OUT'
    ];

    const randomDirection =
      directions[
        Math.floor(
          Math.random() *
          directions.length
        )
      ];

    const currentHour =
      new Date().getHours();

    const isCurfew =
      randomDirection === 'IN' &&
      (
        currentHour >= 22 ||
        Math.random() > 0.65
      );

    const confidence =
      `${(
        97 +
        Math.random() * 2.9
      ).toFixed(1)}%`;

    const newLog = {
      id: generateLogId(),

      studentId: randomStudent.id,
      studentName: randomStudent.name,
      avatar: randomStudent.avatar,
      room: randomStudent.room,

      direction: randomDirection,
      timestamp: getTimestamp(),

      gate: 'Main Gate - Cam 01 Live',
      method: 'AI Facial Recognition Scan',

      status: isCurfew
        ? 'Curfew Violation'
        : 'Authorized Normal',

      curfewAlert: isCurfew,

      remarks: isCurfew
        ? 'Late arrival detected past hostel curfew deadline'
        : 'Normal movement verified',

      confidence
    };

    setLogs(prev => [
      newLog,
      ...prev
    ]);

    setCurrentDetection({
      student: randomStudent,
      confidence,

      timestamp:
        new Date().toLocaleTimeString(),

      box: {
        top: 20 + Math.random() * 10,
        left: 30 + Math.random() * 10,
        width: 32 + Math.random() * 8,
        height: 44 + Math.random() * 8
      },

      status: isCurfew
        ? 'CURFEW_ALERT'
        : 'AUTHORIZED'
    });

    if (isCurfew) {
      showToast(
        '⚠️ Curfew Alert Detected!',
        `${randomStudent.name} (${randomStudent.room}) entered past curfew threshold!`,
        'danger'
      );
    } else {
      showToast(
        `AI Match: ${randomStudent.name}`,
        `Access ${randomDirection} granted at Main Gate (${confidence} confidence)`,
        'success'
      );
    }
  };

  /* =======================================================
     STUDENT FINE PAYMENT
  ======================================================= */

  const payFineByStudent = (
    fineId,
    paymentData = {}
  ) => {
    const txnId =
      paymentData.txnId ||
      `UPI-${Math.floor(
        100000 +
        Math.random() * 900000
      )}`;

    const paymentMethod =
      paymentData.method ||
      'UPI QR Code Instant Payment';

    setFines(prev =>
      prev.map(fine =>
        fine.id === fineId
          ? {
              ...fine,
              status: 'Served / Paid',
              servedDate:
                new Date().toLocaleString(),
              paymentMethod:
                `${paymentMethod} (Txn: ${txnId})`
            }
          : fine
      )
    );

    confetti({
      particleCount: 75,
      spread: 80,
      origin: {
        y: 0.6
      }
    });

    const targetFine = fines.find(
      fine => fine.id === fineId
    );

    showToast(
      'Payment Successful! 🎉',
      `₹${targetFine?.amount} fine marked as PAID. Record updated in Admin Dashboard.`,
      'success'
    );

    return txnId;
  };

  /* =======================================================
     LOCAL STORAGE SYNC
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ACTIVE_TAB,
      activeTab
    );
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_VIEW,
      currentView
    );
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.USER_ROLE,
      userRole
    );
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_STUDENT_ID,
      currentStudentId
    );
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.STUDENTS,
      JSON.stringify(students)
    );
  }, [students]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.LOGS,
      JSON.stringify(logs)
    );
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.FINES,
      JSON.stringify(fines)
    );
  }, [fines]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.TM_MODEL_URL,
      tmModelURL
    );
  }, [tmModelURL]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.TM_MAPPINGS,
      JSON.stringify(classMappings)
    );
  }, [classMappings]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.THEME,
      theme
    );

    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    );

    document.documentElement.classList.toggle(
      'light',
      theme === 'light'
    );
  }, [theme]);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const activeCamera =
    cameras.find(
      camera => camera.id === activeCameraId
    ) || cameras[0];

  const currentStudent =
    students.find(
      student => student.id === currentStudentId
    ) || students[0];

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const contextValue = {
    /* Navigation */
    activeTab,
    setActiveTab,
    currentView,
    setCurrentView,
    userRole,
    setUserRole,

    /* Theme */
    theme,
    toggleTheme,

    /* Students */
    students,
    addStudent,
    updateStudent,
    deleteStudent,

    /* Current Student */
    currentStudentId,
    setCurrentStudentId,
    currentStudent,

    /* Logs */
    logs,
    addLog,

    /* Attendance */
    markStudentPresent,
    markStudentAbsent,
    resetAttendance,

    /* Fines */
    fines,
    addFine,
    toggleFineStatus,
    notifyGuardian,
    payFineByStudent,

    /* Cameras */
    cameras,
    activeCameraId,
    setActiveCameraId,
    activeCamera,
    aiOverlayEnabled,
    setAiOverlayEnabled,
    nightVision,
    setNightVision,
    currentDetection,
    triggerSimulatedScan,

    /* Facial Recognition */
    tmModelURL,
    setTmModelURL,
    classMappings,
    setClassMapping,

    /* Toasts */
    toasts,
    showToast,
    removeToast,

    /* Navigation Helpers */
    loginAsAdmin,
    loginAsStudent,
    goToHome,
    goToClassroom,

    /* Admin */
    adminUser: DEFAULT_ADMIN
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/* =========================================================
   CUSTOM HOOK
========================================================= */

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};