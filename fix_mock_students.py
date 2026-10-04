import re

with open('frontend/src/data/initialData.js', 'r') as f:
    content = f.read()

mock_students = """
export const INITIAL_STUDENTS = [
  {
    id: "STU-2026-001",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    block: "Block 1",
    room: "RA-304",
    phone: "+91 98765 43210",
    bloodGroup: "O+",
    attendance: "94%"
  },
  {
    id: "STU-2026-005",
    name: "Rohan Kulkarni",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    block: "Block 4",
    room: "RC-402",
    phone: "+91 91234 56789",
    bloodGroup: "B+",
    attendance: "88%"
  },
  {
    id: "STU-2026-007",
    name: "Kabir Singh Malhotra",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80",
    block: "Block 1",
    room: "RA-410",
    phone: "+91 99887 76655",
    bloodGroup: "A+",
    attendance: "75%"
  }
];
"""

content = re.sub(r'export const INITIAL_STUDENTS = \[\];', mock_students, content)

with open('frontend/src/data/initialData.js', 'w') as f:
    f.write(content)

print("Mock students added")
