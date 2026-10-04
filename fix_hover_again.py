import os
import re

files = [
    'frontend/src/components/layout/Navbar.jsx',
    'frontend/src/components/pages/ClassroomAttendancePage.jsx',
    'frontend/src/components/pages/HostelAttendancePage.jsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    content = content.replace('hover:bg-slate-50 dark:bg-slate-800', 'hover:bg-slate-50 dark:hover:bg-slate-800')

    with open(file, 'w') as f:
        f.write(content)

print("Hover fixed")
