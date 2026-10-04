import re

with open('frontend/src/components/pages/StudentDashboard.jsx', 'r') as f:
    content = f.read()

# Replace the "if (!student)" logic
loading_logic = """
  if (isLoadingStudents) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-sm">Loading student profile...</p>
      </div>
    );
  }

  const student = students.find(s => s.id === currentStudentId) || students[0];

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold">Student Profile Not Found</h2>
        <p className="text-slate-500 max-w-md text-center">We couldn't find the student record associated with this account. Please contact the administrator.</p>
      </div>
    );
  }
"""

content = re.sub(r'  const student = students\.find\(.*?\).*?;\n\n  if \(\!student\) return <div className="p-10 text-center">Student not found</div>;', loading_logic, content, flags=re.DOTALL)

with open('frontend/src/components/pages/StudentDashboard.jsx', 'w') as f:
    f.write(content)

print("Dashboard logic injected")
