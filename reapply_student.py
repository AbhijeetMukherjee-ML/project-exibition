import re

# 1. Update App.jsx
with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

if 'StudentDashboard' not in content:
    content = content.replace("import StudentsPage from './components/pages/StudentsPage';", "import StudentsPage from './components/pages/StudentsPage';\nimport StudentDashboard from './components/pages/StudentDashboard';")
    content = content.replace("const { currentView, activeTab, setActiveTab } = useApp();", "const { currentView, activeTab, setActiveTab, userRole } = useApp();")
    content = content.replace("  const renderPage = () => {\n    switch (activeTab) {", "  const renderPage = () => {\n    if (userRole === 'student') return <StudentDashboard />;\n    switch (activeTab) {")
    with open('frontend/src/App.jsx', 'w') as f:
        f.write(content)


# 2. Update Navbar.jsx
with open('frontend/src/components/layout/Navbar.jsx', 'r') as f:
    content = f.read()

if 'currentUser' not in content:
    content = content.replace('adminUser\n  } = useApp();', 'adminUser,\n    userRole,\n    students,\n    currentStudentId\n  } = useApp();')

    currentUserCode = """
  const currentUser = userRole === 'student' 
    ? students.find(s => s.id === currentStudentId) 
    : adminUser;
"""
    content = re.sub(r'(const \[showBell, setShowBell\] = useState\(false\);)', r'\1\n' + currentUserCode, content)

    content = content.replace('src={adminUser?.avatar}', 'src={currentUser?.avatar}')
    content = content.replace("alt={adminUser?.name || 'Admin'}", "alt={currentUser?.name || 'User'}")
    content = content.replace('{adminUser?.name}', '{currentUser?.name}')

    content = re.sub(r'<p className="text-\[9px\] text-slate-500.*?">Admin</p>', 
                     r'<p className="text-[9px] text-slate-500 font-mono">{userRole === "student" ? "STUDENT" : "ADMIN"}</p>', content)

    content = content.replace('{TABS.map(tab => {', '{userRole !== "student" && TABS.map(tab => {')

    with open('frontend/src/components/layout/Navbar.jsx', 'w') as f:
        f.write(content)


# 3. Update AppContext.jsx for loading state and fallback
with open('frontend/src/context/AppContext.jsx', 'r') as f:
    content = f.read()

if 'isLoadingStudents' not in content:
    content = content.replace('const [loadingDB, setLoadingDB] = useState(false);', 'const [loadingDB, setLoadingDB] = useState(false);\n  const [isLoadingStudents, setIsLoadingStudents] = useState(true);')
    content = content.replace('setIsLoadingStudents(true);', '') # Prevent dupes
    content = content.replace('setLoadingDB(true);', 'setLoadingDB(true);\n      setIsLoadingStudents(true);')
    
    # Wait, refreshDataFromDB is async in the original. Let's look at original refreshDataFromDB
    # It might not have studentsRes.
    
print("Partially reapplied")
