import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    content = re.sub(r'(?<!dark:)text-slate-900', r'text-slate-900 dark:text-white', content)
    content = re.sub(r'(?<!dark:)text-slate-800', r'text-slate-800 dark:text-slate-200', content)
    content = re.sub(r'(?<!dark:)text-slate-700', r'text-slate-700 dark:text-slate-300', content)

    # Clean up double darkness
    for _ in range(2):
        content = re.sub(r'dark:text-white\s+dark:text-white', 'dark:text-white', content)
        content = re.sub(r'dark:text-slate-100\s+dark:text-slate-100', 'dark:text-slate-100', content)
        content = re.sub(r'dark:text-slate-200\s+dark:text-slate-200', 'dark:text-slate-200', content)
        content = re.sub(r'dark:text-slate-300\s+dark:text-slate-300', 'dark:text-slate-300', content)
        # Handle cases where multiple different text colors might have been concatenated
        content = re.sub(r'dark:text-white\s+dark:text-slate-200', 'dark:text-white', content)
        content = re.sub(r'dark:text-slate-200\s+dark:text-white', 'dark:text-white', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing text colors")
