// ===================== SMART CLASSROOM ATTENDANCE =====================
// A self-contained classroom attendance system. Its roster holds ONLY the
// two real enrolled people (trained in the Teachable Machine model).

export const CLASSROOM_STUDENTS = [
  {
    id: "CR-01",
    name: "Adarsh Tiwari",
    rollNo: "22CSE001",
    avatar: "https://ui-avatars.com/api/?name=Adarsh+Tiwari&background=2563eb&color=fff&size=256&bold=true",
    email: "adarsh.tiwari@college.edu",
    className: "CSE • 2nd Year • Section A"
  },
  {
    id: "CR-02",
    name: "Shubh",
    rollNo: "22CSE002",
    avatar: "https://ui-avatars.com/api/?name=Shubh&background=059669&color=fff&size=256&bold=true",
    email: "shubh@college.edu",
    className: "CSE • 2nd Year • Section A"
  }
];

// Class timetable. `graceMinutes` is the window after `startTime` within which
// a recognized student still counts as PRESENT; after it they are LATE, and if
// never seen by the cutoff they are automatically marked ABSENT.
export const DEFAULT_PERIODS = [
  { id: "P1", subject: "Data Structures & Algorithms", teacher: "Prof. Mehta", room: "Room 301", startTime: "09:00", endTime: "09:50", graceMinutes: 10 },
  { id: "P2", subject: "Operating Systems", teacher: "Prof. Rao", room: "Room 301", startTime: "10:00", endTime: "10:50", graceMinutes: 10 },
  { id: "P3", subject: "Database Management Systems", teacher: "Dr. Nair", room: "Lab 2", startTime: "11:10", endTime: "12:00", graceMinutes: 10 },
  { id: "P4", subject: "Computer Networks", teacher: "Prof. Iyer", room: "Room 305", startTime: "12:00", endTime: "12:50", graceMinutes: 10 }
];

// The trained Teachable Machine model + class-label → classroom-student mapping.
export const DEFAULT_CLASSROOM_TM_MODEL_URL = "https://teachablemachine.withgoogle.com/models/Vxw4jMg7l/";

export const DEFAULT_CLASSROOM_MAPPINGS = {
  "Adarsh Tiwari": "CR-01",
  "Shubh": "CR-02"
};
