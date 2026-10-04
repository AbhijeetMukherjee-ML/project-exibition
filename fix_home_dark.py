import re
with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Replace hardcoded dark with responsive classes
content = content.replace('bg-[#060b14] text-slate-100', 'bg-slate-50 dark:bg-[#060b14] text-slate-900 dark:text-slate-100')
content = content.replace('bg-[#0a111d]/90', 'bg-white dark:bg-[#0a111d]/90')
content = content.replace('border-slate-800', 'border-slate-200 dark:border-slate-800')
content = content.replace('bg-[#0b1320]', 'bg-white dark:bg-[#0b1320]')
content = content.replace('bg-[#050a12]', 'bg-white dark:bg-[#050a12]')

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)
print("Home page responsive")
