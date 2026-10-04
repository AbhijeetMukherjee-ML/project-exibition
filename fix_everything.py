import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    original = content

    # Backgrounds
    content = re.sub(r'(?<!dark:)bg-slate-950', r'bg-slate-50 dark:bg-slate-950', content)
    content = re.sub(r'(?<!dark:)bg-slate-900', r'bg-slate-100 dark:bg-slate-900', content)
    content = re.sub(r'(?<!dark:)bg-slate-800', r'bg-slate-200 dark:bg-slate-800', content)
    content = re.sub(r'(?<!dark:)bg-slate-100', r'bg-slate-100 dark:bg-slate-900', content)
    content = re.sub(r'(?<!dark:)bg-\[#070d18\]', r'bg-white dark:bg-[#070d18]', content)
    content = re.sub(r'(?<!dark:)bg-\[#0a111d\]', r'bg-slate-50 dark:bg-[#0a111d]', content)
    content = re.sub(r'(?<!dark:)bg-\[#080e18\]', r'bg-slate-50 dark:bg-[#080e18]', content)
    content = re.sub(r'(?<!dark:)bg-\[#050a12\]', r'bg-white dark:bg-[#050a12]', content)

    content = re.sub(r'(?<!dark:)hover:bg-slate-800', r'hover:bg-slate-200 dark:hover:bg-slate-800', content)
    content = re.sub(r'(?<!dark:)hover:bg-slate-700', r'hover:bg-slate-300 dark:hover:bg-slate-700', content)
    content = re.sub(r'(?<!dark:)hover:bg-slate-50', r'hover:bg-slate-50 dark:hover:bg-slate-800', content)

    # Borders
    content = re.sub(r'(?<!dark:)border-slate-800', r'border-slate-200 dark:border-slate-800', content)
    content = re.sub(r'(?<!dark:)border-slate-700', r'border-slate-300 dark:border-slate-700', content)
    content = re.sub(r'(?<!dark:)border-slate-200', r'border-slate-200 dark:border-slate-800', content)

    # Text Colors (lighter variants missed in fix_all_texts.py)
    content = re.sub(r'(?<!dark:)text-slate-600', r'text-slate-600 dark:text-slate-400', content)
    content = re.sub(r'(?<!dark:)text-slate-500', r'text-slate-500 dark:text-slate-400', content)
    content = re.sub(r'(?<!dark:)text-slate-400', r'text-slate-600 dark:text-slate-400', content)
    content = re.sub(r'(?<!dark:)text-slate-300', r'text-slate-700 dark:text-slate-300', content)
    
    # Accent buttons (from fix_buttons.py)
    content = re.sub(r'(bg-(blue|emerald|rose|amber)-600.*?)(text-slate-900 dark:text-white)', r'\1text-white', content)
    content = re.sub(r'(bg-(blue|emerald|rose|amber)-600.*?)(text-slate-900)', r'\1text-white', content)

    # Clean up double darkness
    for _ in range(3):
        # general regex to clean exact duplicates:
        content = re.sub(r'(dark:[a-z0-9\-]+)\s+\1', r'\1', content)
        # specific hardcoded cases from overlapping:
        content = re.sub(r'bg-slate-100 dark:bg-slate-100 dark:bg-slate-900', 'bg-slate-100 dark:bg-slate-900', content)
        content = re.sub(r'bg-slate-50 dark:bg-slate-50 dark:bg-slate-950', 'bg-slate-50 dark:bg-slate-950', content)
        content = re.sub(r'bg-slate-200 dark:bg-slate-200 dark:bg-slate-800', 'bg-slate-200 dark:bg-slate-800', content)
        content = re.sub(r'hover:bg-slate-200 dark:hover:bg-slate-200 dark:hover:bg-slate-800', 'hover:bg-slate-200 dark:hover:bg-slate-800', content)
        content = re.sub(r'hover:bg-slate-50 dark:hover:bg-slate-50 dark:hover:bg-slate-800', 'hover:bg-slate-50 dark:hover:bg-slate-800', content)
        content = re.sub(r'border-slate-200 dark:border-slate-200 dark:border-slate-800', 'border-slate-200 dark:border-slate-800', content)
        
        # specific text dedupe
        content = re.sub(r'text-slate-600 dark:text-slate-600 dark:text-slate-400', 'text-slate-600 dark:text-slate-400', content)
        content = re.sub(r'text-slate-500 dark:text-slate-500 dark:text-slate-400', 'text-slate-500 dark:text-slate-400', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing everything!")
