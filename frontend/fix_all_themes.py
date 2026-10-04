import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Generic border replacement
    content = re.sub(r'(?<!dark:)border-slate-800', r'border-slate-200 dark:border-slate-800', content)
    
    # Backgrounds
    content = re.sub(r'(?<!dark:)bg-slate-950', r'bg-slate-50 dark:bg-slate-950', content)
    content = re.sub(r'(?<!dark:)bg-slate-900', r'bg-slate-100 dark:bg-slate-900', content)
    content = re.sub(r'(?<!dark:)bg-\[#070d18\]', r'bg-white dark:bg-[#070d18]', content)
    content = re.sub(r'(?<!dark:)bg-\[#0a111d\]', r'bg-slate-50 dark:bg-[#0a111d]', content)
    content = re.sub(r'(?<!dark:)bg-\[#080e18\]', r'bg-slate-50 dark:bg-[#080e18]', content)
    content = re.sub(r'(?<!dark:)bg-\[#050a12\]', r'bg-white dark:bg-[#050a12]', content)

    # Some text colors
    # For text-slate-400 without dark:
    content = re.sub(r'(?<!dark:)text-slate-400', r'text-slate-600 dark:text-slate-400', content)
    content = re.sub(r'(?<!dark:)text-slate-300', r'text-slate-700 dark:text-slate-300', content)

    # Fix duplicated stuff caused by overlapping replaces
    content = re.sub(r'bg-slate-100 dark:bg-slate-100 dark:bg-slate-900', r'bg-slate-100 dark:bg-slate-900', content)
    content = re.sub(r'bg-slate-50 dark:bg-slate-50 dark:bg-slate-950', r'bg-slate-50 dark:bg-slate-950', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing all themes")
