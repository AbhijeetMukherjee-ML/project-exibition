import re
files = ['frontend/src/components/pages/StudentsPage.jsx', 'frontend/src/components/pages/DisciplinaryPage.jsx']

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    content = content.replace('bg-[#0b1320]', 'bg-white dark:bg-[#0b1320]')
    content = content.replace('bg-[#0a111d]', 'bg-white dark:bg-[#0a111d]')
    content = content.replace('border-slate-800', 'border-slate-200 dark:border-slate-800')
    content = content.replace('border-slate-800/80', 'border-slate-200 dark:border-slate-800/80')
    content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
    content = content.replace('text-slate-400 dark:text-slate-400', 'text-slate-500 dark:text-slate-400')
    content = content.replace('text-slate-300', 'text-slate-800 dark:text-slate-300')
    content = content.replace('text-slate-100', 'text-slate-900 dark:text-slate-100')
    content = content.replace('text-white', 'text-slate-900 dark:text-white')
    content = content.replace('bg-blue-600/10', 'bg-blue-500/10 dark:bg-blue-600/10')
    content = content.replace('bg-emerald-500/10', 'bg-emerald-500/10 dark:bg-emerald-500/10')
    
    with open(file, 'w') as f:
        f.write(content)
print("Fixed remaining pages")
