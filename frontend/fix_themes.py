import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace bg-[#0b1320] with dark:bg-slate-900
    content = content.replace('bg-[#0b1320]', 'dark:bg-slate-900')
    
    # Fix duplicate dark classes
    content = re.sub(r'dark:bg-slate-900\s+dark:bg-slate-900', 'dark:bg-slate-900', content)
    content = re.sub(r'dark:bg-slate-950\s+dark:bg-slate-950', 'dark:bg-slate-950', content)
    content = re.sub(r'dark:bg-slate-800\s+dark:bg-slate-800', 'dark:bg-slate-800', content)
    content = re.sub(r'dark:text-slate-200\s+dark:text-slate-200', 'dark:text-slate-200', content)
    content = re.sub(r'dark:border-slate-800\s+dark:border-slate-800', 'dark:border-slate-800', content)
    content = re.sub(r'dark:border-slate-700\s+dark:border-slate-700', 'dark:border-slate-700', content)
    
    # Fix dark text on accent backgrounds (e.g. bg-blue-600 with text-slate-900)
    # Actually, any text inside bg-blue-600, bg-emerald-600, bg-rose-600 should probably just be text-white
    content = re.sub(r'(bg-[a-z]+-[67]00[^>]*?text-)slate-900 dark:text-white', r'\1white', content)
    
    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing themes")
