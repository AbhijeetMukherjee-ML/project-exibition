import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Remove dark:bg-slate-800 if it was incorrectly added after hover:bg-slate-50 or focus:bg-slate-50
    content = re.sub(r'([a-z]+:bg-slate-50)\s+dark:bg-slate-800', r'\1', content)
    
    # Wait, my regex in fix_white was:
    # content = re.sub(r'(?<!dark:)bg-slate-50(?!.*dark:bg-slate-950)', r'bg-slate-50 dark:bg-slate-800', content)
    # This would match "hover:bg-slate-50" as just "bg-slate-50".
    # So "hover:bg-slate-50" became "hover:bg-slate-50 dark:bg-slate-800".

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing hover")
