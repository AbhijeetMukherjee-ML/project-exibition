import re

files = [
    'frontend/src/components/pages/StudentsPage.jsx',
    'frontend/src/components/pages/DisciplinaryPage.jsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Deduplicate classes
    content = re.sub(r'text-slate-500 dark:text-slate-500 dark:text-slate-400', 'text-slate-500 dark:text-slate-400', content)
    content = re.sub(r'text-slate-900 dark:text-slate-900 dark:text-white', 'text-slate-900 dark:text-white', content)
    content = re.sub(r'text-slate-900 dark:text-slate-900 dark:text-slate-200', 'text-slate-900 dark:text-slate-200', content)
    content = re.sub(r'bg-slate-50 dark:bg-slate-50 dark:bg-[#0a111d]', 'bg-slate-50 dark:bg-[#0a111d]', content)
    content = re.sub(r'bg-white dark:bg-white dark:bg-[#0b1320]', 'bg-white dark:bg-[#0b1320]', content)
    content = re.sub(r'text-slate-800 dark:text-slate-800 dark:text-slate-300', 'text-slate-800 dark:text-slate-300', content)

    with open(file, 'w') as f:
        f.write(content)

print("Deduplicated classes")
