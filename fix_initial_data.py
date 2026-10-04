import re
with open('frontend/src/data/initialData.js', 'r') as f:
    content = f.read()

replacement = """export const INITIAL_STUDENTS = [
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
];"""

content = content.replace("export const INITIAL_STUDENTS = [];", replacement)

with open('frontend/src/data/initialData.js', 'w') as f:
    f.write(content)
print("INITIAL_STUDENTS populated")
