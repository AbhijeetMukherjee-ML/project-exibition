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

    # Add dark:bg-slate-900 wherever there is bg-white
    # But make sure we don't duplicate it.
    content = re.sub(r'\bbg-white(?! dark:bg-slate-900)\b', 'bg-white dark:bg-slate-900', content)
    
    # border-slate-200 -> dark:border-slate-800
    content = re.sub(r'\bborder-slate-200(?! dark:border-slate-800)\b', 'border-slate-200 dark:border-slate-800', content)

    # text-slate-900 -> dark:text-white
    content = re.sub(r'\btext-slate-900(?! dark:text-white)\b', 'text-slate-900 dark:text-white', content)
    
    # bg-slate-50 -> dark:bg-slate-800
    content = re.sub(r'\bbg-slate-50(?! dark:bg-slate-800)(?! dark:bg-slate-900)\b', 'bg-slate-50 dark:bg-slate-800', content)

    with open(file, 'w') as f:
        f.write(content)

print("Targeted dark classes added")
