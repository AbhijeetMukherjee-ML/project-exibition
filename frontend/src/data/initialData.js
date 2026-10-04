// ============================================================
// AEGIS — INITIAL APPLICATION DATA
// ============================================================

// ============================================================
// STUDENTS (Pulled dynamically from MongoDB backend /api/students)
// ============================================================

export const INITIAL_STUDENTS = [
  {
    id: 'STU-2026-001',
    name: 'Rohan Kulkarni',
    room: 'RC-402',
    block: 'Raman Block',
    department: 'B.Tech Computer Science',
    year: '3rd Year',
    attendance: '85%',
    avatar: 'https://i.pravatar.cc/150?u=stu1'
  },
  {
    id: 'STU-2026-005',
    name: 'Aarav Sharma',
    room: 'RA-304',
    block: 'Aryabhata Wing',
    department: 'B.Tech Mechanical',
    year: '2nd Year',
    attendance: '92%',
    avatar: 'https://i.pravatar.cc/150?u=stu5'
  }
];


// ============================================================
// TEACHABLE MACHINE — FACE RECOGNITION
// ============================================================

export const DEFAULT_TM_MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/sQZC8dlTS/";

export const DEFAULT_TM_MAPPINGS = {
  "Adarsh Tiwari": "STU-2026-009",
  Shubh: "STU-2026-010",
};

// ============================================================
// ENTRY / EXIT LOGS
// ============================================================

export const INITIAL_LOGS = [
  {
    id: "LOG-9821",
    studentId: "STU-2026-001",
    studentName: "Aarav Sharma",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    room: "A-304",
    direction: "IN",
    timestamp: "2026-09-28 23:42:15",
    gate: "Main Gate - Gate 01",
    method: "Face AI Scan (Cam 01)",
    status: "Curfew Violation",
    curfewAlert: true,
    remarks: "Entered 1 hr 42 min past curfew limit (22:00 PM)",
    confidence: "99.4%",
  },

  {
    id: "LOG-9820",
    studentId: "STU-2026-004",
    studentName: "Ananya Deshmukh",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
    room: "B-215",
    direction: "IN",
    timestamp: "2026-09-28 21:55:04",
    gate: "Girls Hostel Gate - Cam 02",
    method: "Face AI Scan",
    status: "Authorized Normal",
    curfewAlert: false,
    remarks: "Returned before curfew",
    confidence: "99.1%",
  },

  {
    id: "LOG-9819",
    studentId: "STU-2026-003",
    studentName: "Vikramaditya Rao",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    room: "A-112",
    direction: "OUT",
    timestamp: "2026-09-28 20:10:30",
    gate: "Main Gate - Turnstile 2",
    method: "RFID Card + Face Match",
    status: "Authorized Outpass",
    curfewAlert: false,
    remarks: "Outpass approved by Warden Dr. M. Roy",
    confidence: "97.9%",
  },

  {
    id: "LOG-9818",
    studentId: "STU-2026-005",
    studentName: "Rohan Kulkarni",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    room: "C-402",
    direction: "IN",
    timestamp: "2026-09-28 23:15:20",
    gate: "Block C Side Entry - Cam 04",
    method: "Face AI Scan",
    status: "Curfew Violation",
    curfewAlert: true,
    remarks: "Entered 1 hr 15 min past curfew limit",
    confidence: "96.5%",
  },

  {
    id: "LOG-9817",
    studentId: "STU-2026-002",
    studentName: "Riya Patel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    room: "B-108",
    direction: "IN",
    timestamp: "2026-09-28 19:40:12",
    gate: "Main Gate - Gate 01",
    method: "Face AI Scan",
    status: "Authorized Normal",
    curfewAlert: false,
    remarks: "Library study session return",
    confidence: "98.7%",
  },

  {
    id: "LOG-9816",
    studentId: "STU-2026-008",
    studentName: "Sneha Nair",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
    room: "B-306",
    direction: "OUT",
    timestamp: "2026-09-28 17:30:00",
    gate: "Main Gate - Gate 01",
    method: "Face AI Scan",
    status: "Authorized Normal",
    curfewAlert: false,
    remarks: "Evening sports session",
    confidence: "98.2%",
  },

  {
    id: "LOG-9815",
    studentId: "STU-2026-007",
    studentName: "Kabir Singh Malhotra",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80",
    room: "A-410",
    direction: "IN",
    timestamp: "2026-09-28 01:25:00",
    gate: "Perimeter Gate 3",
    method: "CCTV AI Alert",
    status: "Critical Breach",
    curfewAlert: true,
    remarks: "Unauthorized entry over boundary wall",
    confidence: "99.0%",
  },
];

// ============================================================
// FINES & DISCIPLINARY ACTIONS
// ============================================================

export const INITIAL_FINES = [
  {
    id: "FINE-2026-101",
    studentId: "STU-2026-001",
    studentName: "Aarav Sharma",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    room: "A-304",
    block: "Block A",
    infraction: "Late Entry Past Curfew (10:00 PM)",
    severity: "Medium",
    amount: 500,
    issuedDate: "2026-09-28",
    dueDate: "2026-10-05",
    status: "Unserved / Pending",
    servedDate: null,
    paymentMethod: null,
    disciplinaryAction: "Warning Notice 1 + Fine ₹500",
    evidence: "Main Gate Cam 01 snapshot at 23:42 PM",
    issuedBy: "Chief Warden Office",
    guardianNotified: true,
  },

  {
    id: "FINE-2026-102",
    studentId: "STU-2026-005",
    studentName: "Rohan Kulkarni",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    room: "C-402",
    block: "Block C",
    infraction: "Unpermitted Electrical Appliance (Heater)",
    severity: "High",
    amount: 1500,
    issuedDate: "2026-09-25",
    dueDate: "2026-10-02",
    status: "Served / Paid",
    servedDate: "2026-09-27 14:30",
    paymentMethod: "UPI / Razorpay (Txn: UPI839103)",
    disciplinaryAction: "Confiscation of appliance + Fine ₹1,500",
    evidence: "Room Inspection report by Caretaker Mr. Verma",
    issuedBy: "Hostel Committee",
    guardianNotified: true,
  },

  {
    id: "FINE-2026-103",
    studentId: "STU-2026-007",
    studentName: "Kabir Singh Malhotra",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80",
    room: "A-410",
    block: "Block A",
    infraction: "Severe Curfew Breach & Boundary Climbing",
    severity: "Critical",
    amount: 3000,
    issuedDate: "2026-09-28",
    dueDate: "2026-10-01",
    status: "Unserved / Pending",
    servedDate: null,
    paymentMethod: null,
    disciplinaryAction:
      "Suspension for 7 Days + Mandatory Guardian Meeting + Fine ₹3,000",
    evidence: "Perimeter Cam 03 video clip & Security Log #9815",
    issuedBy: "Disciplinary Board & Proctor",
    guardianNotified: true,
  },

  {
    id: "FINE-2026-104",
    studentId: "STU-2026-003",
    studentName: "Vikramaditya Rao",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    room: "A-112",
    block: "Block A",
    infraction: "Noise Violation During Quiet Hours (01:00 AM)",
    severity: "Low",
    amount: 300,
    issuedDate: "2026-09-22",
    dueDate: "2026-09-29",
    status: "Served / Paid",
    servedDate: "2026-09-23 11:15",
    paymentMethod: "Cash Receipt #CR-8821",
    disciplinaryAction:
      "Written apology to floor residents + Fine ₹300",
    evidence: "Floor Resident complaints & Floor Warden verification",
    issuedBy: "Floor Warden",
    guardianNotified: false,
  },

  {
    id: "FINE-2026-105",
    studentId: "STU-2026-001",
    studentName: "Aarav Sharma",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    room: "A-304",
    block: "Block A",
    infraction: "Missing Mandatory Night Roll Call",
    severity: "Medium",
    amount: 400,
    issuedDate: "2026-09-18",
    dueDate: "2026-09-25",
    status: "Served / Paid",
    servedDate: "2026-09-20 16:00",
    paymentMethod: "NetBanking Txn #NB9941",
    disciplinaryAction: "Fine ₹400 + Community Service 2 Hours",
    evidence: "Floor Attendance Biometric Log",
    issuedBy: "Assistant Warden",
    guardianNotified: true,
  },
];

// ============================================================
// CAMERAS
// ============================================================

export const CAMERAS = [
  {
    id: "CAM-01",
    name: "Main Gate - Inbound Turnstile",
    location: "Campus Entrance A",
    resolution: "1080p @ 60fps",
    status: "ONLINE",
    aiEnabled: true,
    detectedPerson: "Aarav Sharma (STU-2026-001)",
    matchConfidence: "99.4%",
    type: "live",
  },

  {
    id: "CAM-02",
    name: "Main Gate - Outbound Lane",
    location: "Campus Exit A",
    resolution: "1080p @ 30fps",
    status: "ONLINE",
    aiEnabled: true,
    detectedPerson: "Riya Patel (STU-2026-002)",
    matchConfidence: "98.7%",
    type: "simulated",
  },

  {
    id: "CAM-03",
    name: "Hostel Wing B Entrance",
    location: "Kalpana Block Foyer",
    resolution: "4K @ 30fps",
    status: "ONLINE",
    aiEnabled: true,
    detectedPerson: "Ananya Deshmukh (STU-2026-004)",
    matchConfidence: "99.1%",
    type: "simulated",
  },

  {
    id: "CAM-04",
    name: "Hostel Mess & Dining Hall",
    location: "Central Dining Complex",
    resolution: "1080p @ 30fps",
    status: "ONLINE",
    aiEnabled: true,
    detectedPerson: "Vikramaditya Rao (STU-2026-003)",
    matchConfidence: "97.9%",
    type: "simulated",
  },
];