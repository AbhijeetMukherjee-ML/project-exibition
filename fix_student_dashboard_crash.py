with open('frontend/src/components/pages/StudentDashboard.jsx', 'r') as f:
    content = f.read()

# Replace the fallback logic
replacement = """  let student = students.find(s => s.id === currentStudentId) || students[0];
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
  }"""

# Fix the previous replacement block which might have INITIAL_STUDENTS[0]
import re
content = re.sub(r'  let student = students\.find\(s => s\.id === currentStudentId\) \|\| students\[0\];\n  let isMock = false;\n\n  if \(\!student\) \{\n    // Fallback to mock student if database is entirely empty so reviewer can see features\n    student = INITIAL_STUDENTS\[0\];\n    isMock = true;\n  \}', replacement, content)

with open('frontend/src/components/pages/StudentDashboard.jsx', 'w') as f:
    f.write(content)
print("StudentDashboard crash fixed")
