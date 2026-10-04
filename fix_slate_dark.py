import re

files = [
    'frontend/src/components/pages/ClassroomAttendancePage.jsx',
    'frontend/src/components/pages/HostelAttendancePage.jsx',
    'frontend/src/components/pages/HomePage.jsx',
    'frontend/src/components/layout/Navbar.jsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # text-slate-800 -> text-slate-800 dark:text-slate-200
    content = re.sub(r'\btext-slate-800(?!\s*dark:text-slate-200)(?!\s*dark:text-white)\b', 'text-slate-800 dark:text-slate-200', content)

    # text-slate-700 -> text-slate-700 dark:text-slate-300
    content = re.sub(r'\btext-slate-700(?!\s*dark:text-slate-300)(?!\s*dark:text-slate-200)\b', 'text-slate-700 dark:text-slate-300', content)

    # text-slate-600 -> text-slate-600 dark:text-slate-400
    content = re.sub(r'\btext-slate-600(?!\s*dark:text-slate-400)(?!\s*dark:text-slate-300)\b', 'text-slate-600 dark:text-slate-400', content)

    # text-slate-500 -> text-slate-500 dark:text-slate-400 (if no dark variant)
    content = re.sub(r'\btext-slate-500(?!\s*dark:text-slate-400)(?!\s*dark:text-slate-300)\b', 'text-slate-500 dark:text-slate-400', content)

    # placeholder-slate-400 -> placeholder-slate-400 dark:placeholder-slate-500
    content = re.sub(r'\bplaceholder-slate-400(?!\s*dark:placeholder-slate-500)\b', 'placeholder-slate-400 dark:placeholder-slate-500', content)

    # bg-slate-100 -> bg-slate-100 dark:bg-slate-800
    content = re.sub(r'\bbg-slate-100(?!\s*dark:bg-slate-800)(?!\s*dark:bg-slate-900)\b', 'bg-slate-100 dark:bg-slate-800', content)

    # bg-slate-200 -> bg-slate-200 dark:bg-slate-700
    content = re.sub(r'\bbg-slate-200(?!\s*dark:bg-slate-700)(?!\s*dark:bg-slate-800)\b', 'bg-slate-200 dark:bg-slate-700', content)

    # border-slate-200 -> border-slate-200 dark:border-slate-800
    content = re.sub(r'\bborder-slate-200(?!\s*dark:border-slate-800)(?!\s*dark:border-slate-700)\b', 'border-slate-200 dark:border-slate-800', content)

    with open(file, 'w') as f:
        f.write(content)

print("Slate classes fixed")
