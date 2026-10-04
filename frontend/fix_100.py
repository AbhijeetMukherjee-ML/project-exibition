import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Backgrounds
    content = re.sub(r'(?<!dark:)bg-slate-100', r'bg-slate-100 dark:bg-slate-900', content)
    content = re.sub(r'(?<!dark:)hover:bg-slate-50', r'hover:bg-slate-50 dark:hover:bg-slate-800', content)
    content = re.sub(r'(?<!dark:)border-slate-200', r'border-slate-200 dark:border-slate-800', content)
    
    # Text
    content = re.sub(r'(?<!dark:)text-slate-600', r'text-slate-600 dark:text-slate-400', content)
    content = re.sub(r'(?<!dark:)text-slate-500', r'text-slate-500 dark:text-slate-400', content)

    # Clean up double darkness
    for _ in range(2):
        content = re.sub(r'dark:bg-slate-900\s+dark:bg-slate-900', 'dark:bg-slate-900', content)
        content = re.sub(r'dark:hover:bg-slate-800\s+dark:hover:bg-slate-800', 'dark:hover:bg-slate-800', content)
        content = re.sub(r'dark:border-slate-800\s+dark:border-slate-800', 'dark:border-slate-800', content)
        content = re.sub(r'dark:text-slate-400\s+dark:text-slate-400', 'dark:text-slate-400', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing 100")
