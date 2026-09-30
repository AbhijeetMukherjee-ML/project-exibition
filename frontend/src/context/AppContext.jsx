import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_LOGS, INITIAL_FINES, CAMERAS, DEFAULT_TM_MODEL_URL, DEFAULT_TM_MAPPINGS } from '../data/initialData';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation State: 'database', 'camera', 'logs', 'fines'
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('aegis_active_tab');
    return (saved && saved !== 'home') ? saved : 'database';
  });

  // Students Database — merge in any new seed students (by ID) that aren't
  // already saved, so newly-added residents appear without wiping localStorage.
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('aegis_students');
    if (!saved) return INITIAL_STUDENTS;
    const parsed = JSON.parse(saved);
    const savedIds = new Set(parsed.map(s => s.id));
    const missing = INITIAL_STUDENTS.filter(s => !savedIds.has(s.id));
    return missing.length ? [...parsed, ...missing] : parsed;
  });

  // Entry/Exit Logs
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('aegis_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Fines & Disciplinary Actions
  const [fines, setFines] = useState(() => {
    const saved = localStorage.getItem('aegis_fines');
    return saved ? JSON.parse(saved) : INITIAL_FINES;
  });

  // Cameras State
  const [cameras] = useState(CAMERAS);
  const [activeCameraId, setActiveCameraId] = useState('CAM-01');
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(true);
  const [nightVision, setNightVision] = useState(false);

  // Live Detected Entity in Camera
  const [currentDetection, setCurrentDetection] = useState({
    student: INITIAL_STUDENTS[0],
    confidence: '99.4%',
    timestamp: new Date().toLocaleTimeString(),
    box: { top: 22, left: 32, width: 36, height: 48 },
    status: 'AUTHORIZED'
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Admin session
  const [adminUser] = useState({
    name: "Dr. Arvind Varma",
    role: "Chief Hostel Administrator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    badge: "Super Admin",
    hostelUnit: "Central Hostel Complex (Blocks A, B, C)"
  });

  // View Mode: 'home' | 'portal'
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('aegis_current_view') || 'home';
  });

  // Current Active Portal: 'admin' | 'student'
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('aegis_user_role') || 'admin';
  });

  // Current Logged-in Student ID for Student Portal
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    return localStorage.getItem('aegis_current_student_id') || 'STU-2026-001';
  });

  // Theme Mode: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aegis_theme') || 'dark';
  });

  // ============ FACIAL RECOGNITION (Google Teachable Machine) ============
  // Hosted TM model base URL, e.g. https://teachablemachine.withgoogle.com/models/XXXX/
  const [tmModelURL, setTmModelURL] = useState(() => {
    return localStorage.getItem('aegis_tm_model_url') || DEFAULT_TM_MODEL_URL;
  });

  // Maps a Teachable Machine class label -> student ID (since classes may be
  // named generically like "Class 1"). Persisted so setup survives reloads.
  const [classMappings, setClassMappings] = useState(() => {
    const saved = localStorage.getItem('aegis_tm_mappings');
    const base = saved ? JSON.parse(saved) : {};
    // Seed default mappings for known classes; any saved overrides win.
    return { ...DEFAULT_TM_MAPPINGS, ...base };
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

  useEffect(() => {
    localStorage.setItem('aegis_tm_model_url', tmModelURL);
  }, [tmModelURL]);

  useEffect(() => {
    localStorage.setItem('aegis_tm_mappings', JSON.stringify(classMappings));
  }, [classMappings]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const loginAsAdmin = () => {
    setUserRole('admin');
    setCurrentView('portal');
  };

  const loginAsStudent = (studentId) => {
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

  useEffect(() => {
    localStorage.setItem('aegis_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aegis_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('aegis_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('aegis_current_student_id', currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('aegis_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('aegis_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('aegis_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('aegis_fines', JSON.stringify(fines));
  }, [fines]);

  // Toast helper
  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, title, message, type, time: new Date().toLocaleTimeString() };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Student Actions
  const addStudent = (studentData) => {
    const newId = `STU-2026-${String(students.length + 1).padStart(3, '0')}`;
    const newStudent = {
      id: newId,
      avatar: studentData.avatar || `https://images.unsplash.com/photo-${1535713875002 + students.length}?auto=format&fit=crop&w=256&q=80`,
      faceEnrolled: true,
      faceConfidence: "98.5%",
      status: "Active",
      joinedDate: new Date().toISOString().split('T')[0],
      ...studentData
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast("Student Registered", `${newStudent.name} (${newStudent.id}) has been added to the database.`, "success");
    return newStudent;
  };

  const updateStudent = (id, updatedFields) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    showToast("Record Updated", `Student ID ${id} information has been refreshed.`, "info");
  };

  const deleteStudent = (id) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast("Student Removed", `${student?.name || id} removed from registry.`, "warning");
  };

  // Fine Actions
  const addFine = (fineData) => {
    const newId = `FINE-2026-${100 + fines.length + 1}`;
    const student = students.find(s => s.id === fineData.studentId);
    
    const newFine = {
      id: newId,
      studentName: student ? student.name : fineData.studentName,
      avatar: student ? student.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      room: student ? student.room : fineData.room,
      block: student ? student.block : fineData.block || "Block A",
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: "Unserved / Pending",
      servedDate: null,
      paymentMethod: null,
      issuedBy: adminUser.name,
      guardianNotified: true,
      ...fineData
    };

    setFines(prev => [newFine, ...prev]);
    showToast("Disciplinary Notice Issued", `Penalty ₹${newFine.amount} logged for ${newFine.studentName}.`, "warning");
    return newFine;
  };

  // Toggle Fine Status (Served / Paid vs Pending)
  const toggleFineStatus = (fineId) => {
    setFines(prev => prev.map(fine => {
      if (fine.id === fineId) {
        const isNowServed = fine.status !== "Served / Paid";
        if (isNowServed) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
          showToast("Disciplinary Action Served", `${fine.studentName}'s fine of ₹${fine.amount} has been marked as SERVED & CLEARED.`, "success");
          return {
            ...fine,
            status: "Served / Paid",
            servedDate: new Date().toLocaleString(),
            paymentMethod: "Admin Manual Clearance / Receipt Verified"
          };
        } else {
          showToast("Status Reset", `${fine.studentName}'s fine returned to PENDING / UNSERVED status.`, "info");
          return {
            ...fine,
            status: "Unserved / Pending",
            servedDate: null,
            paymentMethod: null
          };
        }
      }
      return fine;
    }));
  };

  const notifyGuardian = (fineId) => {
    setFines(prev => prev.map(f => f.id === fineId ? { ...f, guardianNotified: true } : f));
    const targetFine = fines.find(f => f.id === fineId);
    showToast("Guardian Alert Dispatched", `Official SMS & Email alert sent to guardian of ${targetFine?.studentName}.`, "info");
  };

  // Log Actions
  const addLog = (logData) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...logData
    };
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // ============ ATTENDANCE (marked by live facial recognition) ============
  // Mark a student present when the Teachable Machine model recognizes them.
  // Returns true when this is a NEW presence for today (so the caller can
  // celebrate / log), false when the student was already marked present.
  const markStudentPresent = (studentId, confidence = null, options = {}) => {
    const { manual = false } = options;
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    const today = new Date().toISOString().split('T')[0];
    const alreadyPresentToday = student.present && student.presentDate === today;

    setStudents(prev => prev.map(s => s.id === studentId
      ? {
          ...s,
          present: true,
          presentDate: today,
          presentAt: new Date().toLocaleString(),
          lastRecognitionConfidence: manual ? (confidence || "Manual") : confidence,
          // Track every distinct day the student was marked present.
          attendanceDates: (s.attendanceDates || []).includes(today)
            ? s.attendanceDates
            : [...(s.attendanceDates || []), today]
        }
      : s
    ));

    // Only create a log + toast the first time we see them today.
    if (!alreadyPresentToday) {
      const currentHour = new Date().getHours();
      const isCurfew = currentHour >= 22;
      const newLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: student.id,
        studentName: student.name,
        avatar: student.avatar,
        room: student.room,
        direction: "IN",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        gate: manual ? "Manual Admin Entry" : "Attendance Point - Face AI",
        method: manual ? "Manual Override (Admin)" : "AI Facial Recognition (Teachable Machine)",
        status: isCurfew ? "Curfew Violation" : "Present - Attendance Marked",
        curfewAlert: isCurfew,
        remarks: manual
          ? "Attendance marked manually by administrator"
          : (isCurfew ? "Recognized past curfew threshold" : "Attendance auto-marked on face recognition"),
        confidence: confidence || (manual ? "Manual" : "N/A")
      };
      setLogs(prev => [newLog, ...prev]);

      // Also update live camera detection card so the CCTV view reflects it.
      setCurrentDetection({
        student,
        confidence: confidence || (manual ? "Manual" : "N/A"),
        timestamp: new Date().toLocaleTimeString(),
        box: { top: 22, left: 32, width: 36, height: 48 },
        status: isCurfew ? 'CURFEW_ALERT' : 'AUTHORIZED'
      });

      if (!manual) confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 } });
      showToast(
        `✅ Present: ${student.name}`,
        manual
          ? `Manually marked present by admin (${student.id}).`
          : `Face recognized (${confidence || 'match'}) — attendance marked for ${student.id}.`,
        "success"
      );
    }

    return !alreadyPresentToday;
  };

  // Manual override — mark a specific student absent again.
  const markStudentAbsent = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const today = new Date().toISOString().split('T')[0];
    setStudents(prev => prev.map(s => s.id === studentId
      ? {
          ...s,
          present: false,
          presentDate: null,
          presentAt: null,
          lastRecognitionConfidence: null,
          // Undo today's entry from the history so the count stays accurate.
          attendanceDates: (s.attendanceDates || []).filter(d => d !== today)
        }
      : s
    ));
    showToast("Marked Absent", `${student.name} (${student.id}) set back to absent by admin.`, "info");
  };

  // Reset everyone to absent (handy between demo runs).
  const resetAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    setStudents(prev => prev.map(s => ({
      ...s,
      present: false,
      presentDate: null,
      presentAt: null,
      lastRecognitionConfidence: null,
      // Clear only today's mark; past attendance history is preserved.
      attendanceDates: (s.attendanceDates || []).filter(d => d !== today)
    })));
    showToast("Attendance Reset", "Today's attendance cleared. Past history preserved.", "info");
  };

  // Simulate a live scan event (useful for exhibition demos)
  const triggerSimulatedScan = () => {
    if (students.length === 0) return;
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const directions = ['IN', 'OUT'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const currentHour = new Date().getHours();
    
    // Simulate curfew violation if entry happens after 10 PM (22:00) or random flag
    const isCurfew = randomDirection === 'IN' && (currentHour >= 22 || Math.random() > 0.65);
    
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: randomStudent.id,
      studentName: randomStudent.name,
      avatar: randomStudent.avatar,
      room: randomStudent.room,
      direction: randomDirection,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      gate: "Main Gate - Cam 01 Live",
      method: "AI Facial Recognition Scan",
      status: isCurfew ? "Curfew Violation" : "Authorized Normal",
      curfewAlert: isCurfew,
      remarks: isCurfew ? "Late arrival detected past hostel curfew deadline" : "Normal movement verified",
      confidence: `${(97 + Math.random() * 2.9).toFixed(1)}%`
    };

    setLogs(prev => [newLog, ...prev]);

    // Update active camera detection
    setCurrentDetection({
      student: randomStudent,
      confidence: newLog.confidence,
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
        "⚠️ Curfew Alert Detected!",
        `${randomStudent.name} (${randomStudent.room}) entered past curfew threshold!`,
        "danger"
      );
    } else {
      showToast(
        `AI Match: ${randomStudent.name}`,
        `Access ${randomDirection} granted at Main Gate (${newLog.confidence} confidence)`,
        "success"
      );
    }
  };

  // Student Online Payment via UPI QR Code
  const payFineByStudent = (fineId, paymentData = {}) => {
    const txnId = paymentData.txnId || `UPI-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentMethod = paymentData.method || "UPI QR Code Instant Payment";
    
    setFines(prev => prev.map(fine => {
      if (fine.id === fineId) {
        return {
          ...fine,
          status: "Served / Paid",
          servedDate: new Date().toLocaleString(),
          paymentMethod: `${paymentMethod} (Txn: ${txnId})`
        };
      }
      return fine;
    }));

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 }
    });

    const targetFine = fines.find(f => f.id === fineId);
    showToast(
      "Payment Successful! 🎉", 
      `₹${targetFine?.amount} fine marked as PAID. Record updated in Admin Dashboard.`, 
      "success"
    );

    return txnId;
  };

  const activeCamera = cameras.find(c => c.id === activeCameraId) || cameras[0];
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        theme,
        toggleTheme,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        payFineByStudent,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        logs,
        addLog,
        markStudentPresent,
        markStudentAbsent,
        resetAttendance,
        tmModelURL,
        setTmModelURL,
        classMappings,
        setClassMapping,
        fines,
        addFine,
        toggleFineStatus,
        notifyGuardian,
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
        currentView,
        setCurrentView,
        loginAsAdmin,
        loginAsStudent,
        goToHome,
        goToClassroom,
        toasts,
        showToast,
        removeToast,
        adminUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
