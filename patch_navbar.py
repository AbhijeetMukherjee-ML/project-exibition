import re

with open('frontend/src/components/layout/Navbar.jsx', 'r') as f:
    content = f.read()

# Add userRole, students, currentStudentId to useApp
content = content.replace('adminUser\n  } = useApp();', 'adminUser,\n    userRole,\n    students,\n    currentStudentId\n  } = useApp();')

# Define currentUser
currentUserCode = """
  const currentUser = userRole === 'student' 
    ? students.find(s => s.id === currentStudentId) 
    : adminUser;
"""
# Insert after setShowBell
content = re.sub(r'(const \[showBell, setShowBell\] = useState\(false\);)', r'\1\n' + currentUserCode, content)

# Replace adminUser with currentUser in the rendering
content = content.replace('src={adminUser?.avatar}', 'src={currentUser?.avatar}')
content = content.replace("alt={adminUser?.name || 'Admin'}", "alt={currentUser?.name || 'User'}")
content = content.replace('{adminUser?.name}', '{currentUser?.name}')

# Hide the Admin Role text and bell for student
# Wait, let's look at what's rendered
# We'll just replace "Admin" with student's ID or "Student"
content = re.sub(r'<p className="text-\[9px\] text-slate-500.*?">Admin</p>', 
                 r'<p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">{userRole === "student" ? "STUDENT" : "ADMIN"}</p>', content)

# Hide TABS map
content = content.replace('{TABS.map(tab => {', '{userRole !== "student" && TABS.map(tab => {')

with open('frontend/src/components/layout/Navbar.jsx', 'w') as f:
    f.write(content)

print("Navbar patched")
