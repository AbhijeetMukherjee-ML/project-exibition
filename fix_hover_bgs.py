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

    # If we have `hover:bg-slate-50 dark:bg-slate-950`, it should be `hover:bg-slate-50 dark:hover:bg-slate-800`
    content = content.replace('hover:bg-slate-50 dark:bg-slate-950', 'hover:bg-slate-50 dark:hover:bg-slate-800')
    
    # What about `hover:bg-slate-100 dark:bg-slate-800` ?
    content = content.replace('hover:bg-slate-100 dark:bg-slate-800', 'hover:bg-slate-100 dark:hover:bg-slate-800')

    with open(file, 'w') as f:
        f.write(content)

print("Fixed messed up hover backgrounds")
