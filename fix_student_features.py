import re
with open('frontend/src/components/pages/StudentDashboard.jsx', 'r') as f:
    content = f.read()

features_replacement = """  let studentLogs = logs.filter(l => l.studentId === student.id || l.studentName === student.name);
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
"""

content = content.replace("const studentLogs = logs.filter(l => l.studentId === student.id || l.studentName === student.name);\n  const studentFines = fines.filter(f => f.studentId === student.id || f.studentName === student.name);", features_replacement)

with open('frontend/src/components/pages/StudentDashboard.jsx', 'w') as f:
    f.write(content)
print("Features mocked")
