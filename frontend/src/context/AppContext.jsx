import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

import {
  INITIAL_LOGS,
  INITIAL_STUDENTS,
  INITIAL_FINES,
  CAMERAS,
  DEFAULT_TM_MODEL_URL,
  DEFAULT_TM_MAPPINGS
} from '../data/initialData';

import {
  apiGetStudents,
  apiCreateStudent,
  apiUpdateStudent,
  apiDeleteStudent,
  apiGetAttendance,
  apiMarkAttendance,
  apiResetAttendance
} from '../services/api';

const AppContext = createContext();

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  ACTIVE_TAB: 'aegis_active_tab',
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

export const getToday = () => {
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
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    const validTabs = ['classroom', 'hostel', 'disciplinary', 'students'];
    return saved && validTabs.includes(saved) ? saved : 'classroom';
  });

  // Always start on the landing page — never restore a saved portal session on boot.
  const [currentView, setCurrentView] = useState('home');

  const [userRole, setUserRole] = useState(() => {
    return getStoredString(STORAGE_KEYS.USER_ROLE, 'admin');
  });

  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return getStoredString(STORAGE_KEYS.CURRENT_STUDENT_ID, 'STU-2026-001');
  });

  /* Active Class / Period slot for Classroom (class1, class2, class3, class4) */
  const [activeClassSlot, setActiveClassSlot] = useState('class1');

  /* =======================================================
     THEME
  ======================================================= */

  const [theme, setTheme] = useState(() => {
    return getStoredString(STORAGE_KEYS.THEME, 'light');
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  /* =======================================================
     TOAST SYSTEM
  ======================================================= */

  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();

    const newToast = {
      id,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString()
    };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4500);
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  /* =======================================================
     STUDENTS & ATTENDANCE FROM DATABASE
  ======================================================= */

  const [dbStudents, setDbStudents] = useState([]);
  const [dailyAttendanceMap, setDailyAttendanceMap] = useState({});
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  // Fetch students and today's attendance from backend
  const refreshDataFromDB = useCallback(async () => {
    try {
      setIsLoadingStudents(true);
      const [studentsRes, attendanceRes] = await Promise.all([
        apiGetStudents().catch(err => {
          console.warn('Could not load students from DB:', err.message);
          return INITIAL_STUDENTS;
        }),
        apiGetAttendance({ date: getToday() }).catch(err => {
          console.warn('Could not load attendance from DB:', err.message);
          return [];
        })
      ]);

            let finalStudents = Array.isArray(studentsRes) ? studentsRes : [];
      if (finalStudents.length === 0) {
        console.warn('Database is empty! Falling back to INITIAL_STUDENTS for demo purposes.');
        finalStudents = INITIAL_STUDENTS;
      }
      setDbStudents(finalStudents);

      const attMap = {};
      if (Array.isArray(attendanceRes)) {
        attendanceRes.forEach(record => {
          if (record && record.studentId) {
            attMap[record.studentId] = record;
          }
        });
      }
      setDailyAttendanceMap(attMap);
    } catch (err) {
      console.error('Failed to load data from DB:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    refreshDataFromDB();
  }, [refreshDataFromDB]);

  // Combine DB students with daily attendance record
  const students = dbStudents.map(s => {
    const sid = s.studentId || s.id;
    const att = dailyAttendanceMap[sid] || {};

    const class1 = att.class1Attendance || 'absent';
    const class2 = att.class2Attendance || 'absent';
    const class3 = att.class3Attendance || 'absent';
    const class4 = att.class4Attendance || 'absent';
    const hostel = att.hostelAttendance || 'absent';

    const isPresent =
      class1 === 'present' ||
      class2 === 'present' ||
      class3 === 'present' ||
      class4 === 'present' ||
      hostel === 'present';

    const latestMarkedAt =
      att.details?.[activeClassSlot]?.markedAt ||
      att.details?.hostel?.markedAt ||
      att.details?.class1?.markedAt ||
      null;

    return {
      ...s,
      id: sid,
      studentId: sid,
      class1Attendance: class1,
      class2Attendance: class2,
      class3Attendance: class3,
      class4Attendance: class4,
      hostelAttendance: hostel,
      present: isPresent,
      presentAt: latestMarkedAt,
      attendanceDetails: att.details || {}
    };
  });

  /* =======================================================
     LOGS
  ======================================================= */

  const [logs, setLogs] = useState(() => {
    return getStoredValue(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  });

  const addLog = logData => {
    const newLog = {
      id: generateLogId(),
      timestamp: getTimestamp(),
      ...logData
    };

    setLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  /* =======================================================
     FINES
  ======================================================= */

  const [fines, setFines] = useState(() => {
    return getStoredValue(STORAGE_KEYS.FINES, INITIAL_FINES);
  });

  /* =======================================================
     CAMERA SYSTEM
  ======================================================= */

  const [cameras] = useState(CAMERAS);
  const [activeCameraId, setActiveCameraId] = useState('CAM-01');
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(true);
  const [nightVision, setNightVision] = useState(false);

  const [currentDetection, setCurrentDetection] = useState({
    student: { name: 'Aarav Sharma', id: 'STU-2026-001', room: 'A-304', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80' },
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
    return getStoredString(STORAGE_KEYS.TM_MODEL_URL, DEFAULT_TM_MODEL_URL);
  });

  const [classMappings, setClassMappings] = useState(() => {
    const saved = getStoredValue(STORAGE_KEYS.TM_MAPPINGS, {});
    return {
      ...DEFAULT_TM_MAPPINGS,
      ...saved
    };
  });

  const setClassMapping = (className, studentId) => {
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
     STUDENT ACTIONS (PERSISTED TO DB)
  ======================================================= */

  const addStudent = async studentData => {
    try {
      const created = await apiCreateStudent(studentData);
      setDbStudents(prev => [created, ...prev]);
      showToast(
        'Student Registered',
        `${created.name} (${created.studentId}) saved to database.`,
        'success'
      );
      return created;
    } catch (err) {
      showToast('Registration Error', err.message || 'Failed to add student to DB', 'error');
      throw err;
    }
  };

  const updateStudent = async (id, updatedFields) => {
    try {
      const updated = await apiUpdateStudent(id, updatedFields);
      setDbStudents(prev =>
        prev.map(s => (s.studentId === id || s._id === id ? { ...s, ...updated } : s))
      );
      showToast('Record Updated', `Student ${id} updated in database.`, 'info');
      return updated;
    } catch (err) {
      showToast('Update Error', err.message || 'Failed to update student in DB', 'error');
    }
  };

  const deleteStudent = async id => {
    try {
      await apiDeleteStudent(id);
      setDbStudents(prev => prev.filter(s => s.studentId !== id && s._id !== id));
      showToast('Student Removed', `Student ${id} removed from database.`, 'warning');
    } catch (err) {
      showToast('Delete Error', err.message || 'Failed to remove student from DB', 'error');
    }
  };

  /* =======================================================
     ATTENDANCE ACTIONS (PER-DAY TO DB)
     Updates class1, class2, class3, class4, or hostel attendance.
  ======================================================= */

  const markStudentPresent = async (studentId, confidence = null, options = {}) => {
    const {
      slot = activeClassSlot || 'class1',
      manual = false,
      date = getToday(),
      status: requestedStatus = 'present'
    } = options;

    const student = students.find(item => item.id === studentId || item.studentId === studentId);
    if (!student) return false;

    // After-hours hostel entries are curfew violations (counted as late).
    const currentHour = new Date().getHours();
    const isCurfew = slot === 'hostel' && (currentHour >= 22 || currentHour < 6);
    const effectiveStatus = requestedStatus === 'late' || isCurfew ? 'late' : 'present';
    const isLate = effectiveStatus === 'late';

    try {
      const updatedRecord = await apiMarkAttendance({
        studentId,
        name: student.name,
        date,
        slot,
        status: effectiveStatus,
        confidence: confidence || (manual ? 'Manual' : 'AI Match'),
        method: manual ? 'Manual Override (Admin)' : 'AI Facial Recognition'
      });

      // Update local state map immediately
      setDailyAttendanceMap(prev => ({
        ...prev,
        [studentId]: updatedRecord
      }));

      const newLog = {
        id: generateLogId(),
        studentId: student.id,
        studentName: student.name,
        avatar: student.avatar,
        room: student.room,
        direction: 'IN',
        timestamp: getTimestamp(),
        gate: slot === 'hostel' ? 'Hostel Entry Gate' : `Classroom (${slot.toUpperCase()})`,
        method: manual ? 'Manual Admin Entry' : 'AI Facial Recognition',
        status: isCurfew
          ? 'Curfew Violation'
          : isLate
          ? `Late (${slot.toUpperCase()})`
          : `Present (${slot.toUpperCase()})`,
        curfewAlert: isCurfew,
        remarks: manual
          ? `Marked ${effectiveStatus} manually in ${slot}`
          : isCurfew
          ? 'Curfew breach detected'
          : isLate
          ? `Recognized late for ${slot} attendance`
          : `Recognized for ${slot} attendance`,
        confidence: confidence || (manual ? 'Manual' : '98.5%')
      };

      setLogs(prev => [newLog, ...prev]);

      setCurrentDetection({
        student,
        confidence: confidence || (manual ? 'Manual' : '98.5%'),
        timestamp: new Date().toLocaleTimeString(),
        box: { top: 22, left: 32, width: 36, height: 48 },
        status: isCurfew ? 'CURFEW_ALERT' : 'AUTHORIZED'
      });

      if (!manual && !isLate) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      showToast(
        isLate ? `⏰ Late: ${student.name}` : `✅ Present: ${student.name}`,
        `${student.name} marked ${effectiveStatus} for ${slot.toUpperCase()} in database.`,
        isLate ? 'warning' : 'success'
      );

      return true;
    } catch (err) {
      console.error('Failed to mark attendance in DB:', err);
      showToast('Attendance Sync Error', err.message || 'Could not update DB', 'error');
      return false;
    }
  };

  const markStudentAbsent = async (studentId, options = {}) => {
    const { slot = activeClassSlot || 'class1', date = getToday() } = options;

    const student = students.find(item => item.id === studentId || item.studentId === studentId);
    if (!student) return;

    try {
      const updatedRecord = await apiMarkAttendance({
        studentId,
        name: student.name,
        date,
        slot,
        status: 'absent',
        method: 'Manual Override (Admin)'
      });

      setDailyAttendanceMap(prev => ({
        ...prev,
        [studentId]: updatedRecord
      }));

      showToast(
        'Marked Absent',
        `${student.name} marked absent for ${slot.toUpperCase()} in database.`,
        'info'
      );
    } catch (err) {
      console.error('Failed to mark absent in DB:', err);
      showToast('Error', err.message || 'Could not update DB', 'error');
    }
  };

  const resetAttendance = async (options = {}) => {
    const { date = getToday() } = options;
    try {
      await apiResetAttendance({ date });
      setDailyAttendanceMap({});
      showToast('Attendance Reset', `Today's attendance cleared from database.`, 'info');
    } catch (err) {
      console.error('Failed to reset attendance in DB:', err);
      showToast('Error', err.message || 'Could not reset attendance', 'error');
    }
  };

  /* =======================================================
     SIMULATED CAMERA SCAN
  ======================================================= */

  const triggerSimulatedScan = () => {
    if (students.length === 0) return;

    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const directions = ['IN', 'OUT'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const currentHour = new Date().getHours();
    const isCurfew = randomDirection === 'IN' && (currentHour >= 22 || Math.random() > 0.65);
    const confidence = `${(97 + Math.random() * 2.9).toFixed(1)}%`;

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
      status: isCurfew ? 'Curfew Violation' : 'Authorized Normal',
      curfewAlert: isCurfew,
      remarks: isCurfew
        ? 'Late arrival detected past hostel curfew deadline'
        : 'Normal movement verified',
      confidence
    };

    setLogs(prev => [newLog, ...prev]);

    // Also mark hostel attendance in DB if entering
    if (randomDirection === 'IN') {
      markStudentPresent(randomStudent.id, confidence, { slot: 'hostel' }).catch(() => {});
    }

    setCurrentDetection({
      student: randomStudent,
      confidence,
      timestamp: new Date().toLocaleTimeString(),
      box: {
        top: 20 + Math.random() * 10,
        left: 30 + Math.random() * 10,
        width: 32 + Math.random() * 8,
        height: 44 + Math.random() * 8
      },
      status: isCurfew ? 'CURFEW_ALERT' : 'AUTHORIZED'
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
     FINE ACTIONS
  ======================================================= */

  const addFine = fineData => {
    const newId = `FINE-2026-${100 + fines.length + 1}`;
    const student = students.find(item => item.id === fineData.studentId);

    const newFine = {
      id: newId,
      studentName: student?.name || fineData.studentName,
      avatar:
        student?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      room: student?.room || fineData.room,
      block: student?.block || fineData.block || 'Block A',
      issuedDate: getToday(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Unserved / Pending',
      servedDate: null,
      paymentMethod: null,
      issuedBy: DEFAULT_ADMIN.name,
      guardianNotified: true,
      ...fineData
    };

    setFines(prev => [newFine, ...prev]);
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
        if (fine.id !== fineId) return fine;
        const isNowServed = fine.status !== 'Served / Paid';
        if (isNowServed) {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          showToast(
            'Disciplinary Action Served',
            `${fine.studentName}'s fine of ₹${fine.amount} has been marked as SERVED & CLEARED.`,
            'success'
          );
          return {
            ...fine,
            status: 'Served / Paid',
            servedDate: new Date().toLocaleString(),
            paymentMethod: 'Admin Manual Clearance / Receipt Verified'
          };
        }
        showToast('Status Reset', `${fine.studentName}'s fine returned to PENDING.`, 'info');
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
      prev.map(fine => (fine.id === fineId ? { ...fine, guardianNotified: true } : fine))
    );
    const targetFine = fines.find(fine => fine.id === fineId);
    showToast(
      'Guardian Alert Dispatched',
      `Official SMS & Email alert sent to guardian of ${targetFine?.studentName}.`,
      'info'
    );
  };

  /* =======================================================
     LOCAL STORAGE SYNC
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FINES, JSON.stringify(fines));
  }, [fines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TM_MODEL_URL, tmModelURL);
  }, [tmModelURL]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TM_MAPPINGS, JSON.stringify(classMappings));
  }, [classMappings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  /* =======================================================
     DERIVED DATA & NAVIGATION HELPERS
  ======================================================= */

  const activeCamera = cameras.find(c => c.id === activeCameraId) || cameras[0];
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const loginAsAdmin = () => {
    setUserRole('admin');
    setCurrentView('portal');
  };

  const loginAsStudent = studentId => {
    if (studentId) setCurrentStudentId(studentId);
    setUserRole('student');
    setCurrentView('portal');
  };

  const goToHome = () => setCurrentView('home');
  const goToClassroom = () => {
    setActiveTab('classroom');
    setCurrentView('portal');
  };

  const contextValue = {
    activeTab,
    setActiveTab,
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    theme,
    toggleTheme,

    // Database students & attendance
    students,
    isLoadingStudents,
    refreshDataFromDB,
    addStudent,
    updateStudent,
    deleteStudent,

    // Class / Slot selection
    activeClassSlot,
    setActiveClassSlot,

    // Current Student
    currentStudentId,
    setCurrentStudentId,
    currentStudent,

    // Logs
    logs,
    addLog,

    // Attendance
    markStudentPresent,
    markStudentAbsent,
    resetAttendance,

    // Fines
    fines,
    addFine,
    toggleFineStatus,
    notifyGuardian,

    // Cameras
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

    // Facial Recognition
    tmModelURL,
    setTmModelURL,
    classMappings,
    setClassMapping,

    // Toasts
    toasts,
    showToast,
    removeToast,

    // Navigation Helpers
    loginAsAdmin,
    loginAsStudent,
    goToHome,
    goToClassroom,
    adminUser: DEFAULT_ADMIN
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

/* =========================================================
   CUSTOM HOOK
========================================================= */

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};