import os
import re

DIR = 'frontend/src'

replacements = {
    # Backgrounds
    r'\bbg-\[\#0b1320\]\b': 'bg-white dark:bg-[#0b1320]',
    r'\bbg-slate-950\b': 'bg-slate-50 dark:bg-slate-950',
    r'\bbg-slate-900\b': 'bg-slate-100 dark:bg-slate-900',
    r'\bbg-slate-800\b': 'bg-slate-200 dark:bg-slate-800',
    r'\bbg-slate-800/50\b': 'bg-slate-200/50 dark:bg-slate-800/50',
    r'\bbg-slate-700/50\b': 'bg-slate-300/50 dark:bg-slate-700/50',
    # Text
    r'\btext-white\b': 'text-slate-900 dark:text-white',
    r'\btext-slate-100\b': 'text-slate-900 dark:text-slate-100',
    r'\btext-slate-200\b': 'text-slate-800 dark:text-slate-200',
    r'\btext-slate-300\b': 'text-slate-700 dark:text-slate-300',
    r'\btext-slate-400\b': 'text-slate-600 dark:text-slate-400',
    # Border
    r'\bborder-slate-800\b': 'border-slate-200 dark:border-slate-800',
    r'\bborder-slate-700\b': 'border-slate-300 dark:border-slate-700',
    # Divide
    r'\bdivide-slate-800\b': 'divide-slate-200 dark:divide-slate-800',
    r'\bdivide-slate-700\b': 'divide-slate-300 dark:divide-slate-700',
}

for root, _, files in os.walk(DIR):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            # Avoid double patching by checking if "dark:bg-[#0b1320]" exists already
            # Actually, a simpler way is to just do a naive replace and fix any "dark:dark:" 
            # But the regex boundary \b prevents matching "dark:bg-slate-900" if we are careful?
            # No, \b matches before 'b' in 'bg', which is preceded by ':' in 'dark:bg', so it WOULD match.
            # We must use negative lookbehind: (?<!dark:)
            
            new_content = content
            for k, v in replacements.items():
                pattern = r'(?<!dark:)' + k
                new_content = re.sub(pattern, v, new_content)
                
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
                print(f"Patched {path}")

