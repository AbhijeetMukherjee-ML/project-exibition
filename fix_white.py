import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    # Replace bg-white without dark variant
    content = re.sub(r'(?<!dark:)bg-white', r'bg-white dark:bg-slate-900', content)
    
    # Replace bg-slate-50 without dark variant
    # Wait, some bg-slate-50 are the main app wrapper, which I already fixed: bg-slate-50 dark:bg-slate-950
    # I should be careful not to override that.
    content = re.sub(r'(?<!dark:)bg-slate-50(?!.*dark:bg-slate-950)', r'bg-slate-50 dark:bg-slate-800', content)

    # Clean up double darkness
    content = re.sub(r'dark:bg-slate-900\s+dark:bg-slate-900', 'dark:bg-slate-900', content)
    content = re.sub(r'dark:bg-slate-800\s+dark:bg-slate-800', 'dark:bg-slate-800', content)
    
    # In case it overlapped with something I already did:
    content = re.sub(r'bg-white dark:bg-slate-900 dark:bg-\[#070d18\]', 'bg-white dark:bg-[#070d18]', content)
    content = re.sub(r'bg-white dark:bg-slate-900 dark:bg-[#050a12]', 'bg-white dark:bg-[#050a12]', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing white")
