import os
import re

src_dir = 'frontend/src'
jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            jsx_files.append(os.path.join(root, f))

for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()

    content = content.replace('hover:text-slate-900 dark:text-white', 'hover:text-slate-900 dark:hover:text-white')
    content = content.replace('hover:text-slate-800 dark:text-slate-200', 'hover:text-slate-800 dark:hover:text-slate-200')
    content = content.replace('hover:text-slate-700 dark:text-slate-300', 'hover:text-slate-700 dark:hover:text-slate-300')
    content = content.replace('dark:hover:text-slate-200 dark:hover:text-slate-200', 'dark:hover:text-slate-200')
    
    with open(file, 'w') as f:
        f.write(content)

print("Fixed messed up hover texts")
