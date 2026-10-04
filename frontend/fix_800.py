import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    content = re.sub(r'(?<!dark:)bg-slate-800', r'bg-slate-200 dark:bg-slate-800', content)
    content = re.sub(r'(?<!dark:)hover:bg-slate-800', r'hover:bg-slate-200 dark:hover:bg-slate-800', content)
    content = re.sub(r'(?<!dark:)border-slate-700', r'border-slate-300 dark:border-slate-700', content)
    content = re.sub(r'(?<!dark:)hover:bg-slate-700', r'hover:bg-slate-300 dark:hover:bg-slate-700', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing 800")
