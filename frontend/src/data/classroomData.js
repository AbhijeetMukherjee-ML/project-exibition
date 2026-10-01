// ============================================================
// SMART CLASSROOM ATTENDANCE — DATA CONFIGURATION
// ============================================================

// ------------------------------------------------------------
// CLASSROOM STUDENTS
// ------------------------------------------------------------
// Only students enrolled and trained in the Teachable Machine
// facial-recognition model should be listed here.

export const CLASSROOM_STUDENTS = [
  {
    id: "CR-01",
    name: "Adarsh Tiwari",
    rollNo: "22CSE001",
    avatar:
      "https://ui-avatars.com/api/?name=Adarsh+Tiwari&background=2563eb&color=fff&size=256&bold=true",
    email: "adarsh.tiwari@college.edu",
    className: "CSE • 2nd Year • Section A",
  },

  {
    id: "CR-02",
    name: "Shubh",
    rollNo: "22CSE002",
    avatar:
      "https://ui-avatars.com/api/?name=Shubh&background=059669&color=fff&size=256&bold=true",
    email: "shubh@college.edu",
    className: "CSE • 2nd Year • Section A",
  },
];


// ------------------------------------------------------------
// CLASS TIMETABLE
// ------------------------------------------------------------
// graceMinutes:
// Time allowed after the start time for a student to still be
// considered PRESENT.
//
// Example:
// startTime = 09:00
// graceMinutes = 10
//
// 09:00 - 09:10 → PRESENT
// After 09:10    → LATE
// Not recognized → ABSENT after the period is finalized

export const DEFAULT_PERIODS = [
  {
    id: "P1",
    subject: "Data Structures & Algorithms",
    teacher: "Prof. Mehta",
    room: "Room 301",
    startTime: "09:00",
    endTime: "09:50",
    graceMinutes: 10,
  },

  {
    id: "P2",
    subject: "Operating Systems",
    teacher: "Prof. Rao",
    room: "Room 301",
    startTime: "10:00",
    endTime: "10:50",
    graceMinutes: 10,
  },

  {
    id: "P3",
    subject: "Database Management Systems",
    teacher: "Dr. Nair",
    room: "Lab 2",
    startTime: "11:10",
    endTime: "12:00",
    graceMinutes: 10,
  },

  {
    id: "P4",
    subject: "Computer Networks",
    teacher: "Prof. Iyer",
    room: "Room 305",
    startTime: "12:00",
    endTime: "12:50",
    graceMinutes: 10,
  },
];


// ------------------------------------------------------------
// TEACHABLE MACHINE MODEL
// ------------------------------------------------------------

export const DEFAULT_CLASSROOM_TM_MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/Vxw4jMg7l/";


// ------------------------------------------------------------
// TEACHABLE MACHINE CLASS MAPPINGS
// ------------------------------------------------------------
// Maps the class label returned by the AI model to the
// corresponding classroom student ID.

export const DEFAULT_CLASSROOM_MAPPINGS = {
  "Adarsh Tiwari": "CR-01",
  "Shubh": "CR-02",
};