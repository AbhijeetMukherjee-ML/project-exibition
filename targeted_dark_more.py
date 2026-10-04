import re

files = [
    'frontend/src/components/pages/StudentsPage.jsx',
    'frontend/src/components/pages/DisciplinaryPage.jsx',
    'frontend/src/components/common/ClassMappingEditor.jsx',
    'frontend/src/components/modals/StudentDetailModal.jsx',
    'frontend/src/components/modals/AddStudentModal.jsx',
    'frontend/src/components/modals/AddFineModal.jsx',
    'frontend/src/components/modals/GuardianNoticeModal.jsx'
]

import os
for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r') as f:
        content = f.read()

    content = re.sub(r'\bbg-white(?! dark:bg-slate-900)(?! dark:bg-slate-950)\b', 'bg-white dark:bg-slate-900', content)
    
    content = re.sub(r'\btext-slate-900(?! dark:text-white)\b', 'text-slate-900 dark:text-white', content)
    
    content = re.sub(r'\bbg-slate-50(?! dark:bg-slate-800)(?! dark:bg-slate-900)\b', 'bg-slate-50 dark:bg-slate-800', content)

    content = re.sub(r'\btext-slate-800(?!\s*dark:text-slate-200)(?!\s*dark:text-white)\b', 'text-slate-800 dark:text-slate-200', content)
    content = re.sub(r'\btext-slate-700(?!\s*dark:text-slate-300)(?!\s*dark:text-slate-200)\b', 'text-slate-700 dark:text-slate-300', content)
    content = re.sub(r'\btext-slate-600(?!\s*dark:text-slate-400)(?!\s*dark:text-slate-300)\b', 'text-slate-600 dark:text-slate-400', content)
    content = re.sub(r'\btext-slate-500(?!\s*dark:text-slate-400)(?!\s*dark:text-slate-300)\b', 'text-slate-500 dark:text-slate-400', content)
    content = re.sub(r'\bplaceholder-slate-400(?!\s*dark:placeholder-slate-500)\b', 'placeholder-slate-400 dark:placeholder-slate-500', content)
    content = re.sub(r'\bbg-slate-100(?!\s*dark:bg-slate-800)(?!\s*dark:bg-slate-900)\b', 'bg-slate-100 dark:bg-slate-800', content)
    content = re.sub(r'\bbg-slate-200(?!\s*dark:bg-slate-700)(?!\s*dark:bg-slate-800)\b', 'bg-slate-200 dark:bg-slate-700', content)
    content = re.sub(r'\bborder-slate-200(?!\s*dark:border-slate-800)(?!\s*dark:border-slate-700)\b', 'border-slate-200 dark:border-slate-800', content)

    with open(file, 'w') as f:
        f.write(content)

print("More slate classes fixed")
