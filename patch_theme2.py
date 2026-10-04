import os
import re

DIR = 'frontend/src'

replacements = {
    # Backgrounds
    r'\bbg-white\b': 'bg-white dark:bg-[#0b1320]',
    r'\bbg-white/95\b': 'bg-white/95 dark:bg-[#0b1320]/95',
    r'\bbg-white/70\b': 'bg-white/70 dark:bg-[#0b1320]/70',
    # Text
    r'\btext-slate-800\b': 'text-slate-800 dark:text-slate-200',
    r'\btext-slate-700\b': 'text-slate-700 dark:text-slate-300',
    r'\btext-slate-600\b': 'text-slate-600 dark:text-slate-400',
    # Borders
    r'\bborder-slate-200\b': 'border-slate-200 dark:border-slate-800',
    r'\bborder-slate-300\b': 'border-slate-300 dark:border-slate-700',
}

for root, _, files in os.walk(DIR):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = content
            for k, v in replacements.items():
                pattern = r'(?<!dark:)' + k
                new_content = re.sub(pattern, v, new_content)
                
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
                print(f"Patched {path}")

