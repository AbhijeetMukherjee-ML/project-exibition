import re

files = [
    'frontend/src/components/pages/StudentsPage.jsx',
    'frontend/src/components/pages/DisciplinaryPage.jsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Search bar & inputs
    content = content.replace('bg-slate-950', 'bg-slate-50 dark:bg-slate-950')
    content = content.replace('bg-[#0a111d]', 'bg-slate-50 dark:bg-[#0a111d]')
    
    # borders
    content = content.replace('border-slate-700', 'border-slate-300 dark:border-slate-700')
    
    # text
    content = content.replace('text-slate-200', 'text-slate-900 dark:text-slate-200')
    content = content.replace('text-slate-300', 'text-slate-800 dark:text-slate-300')
    content = content.replace('text-white', 'text-slate-900 dark:text-white')
    
    # placeholder
    content = content.replace('placeholder:text-slate-600', 'placeholder:text-slate-400 dark:placeholder:text-slate-600')
    content = content.replace('placeholder-slate-400', 'placeholder-slate-500 dark:placeholder-slate-400')

    with open(file, 'w') as f:
        f.write(content)

print("Fixed hardcoded dark classes")
