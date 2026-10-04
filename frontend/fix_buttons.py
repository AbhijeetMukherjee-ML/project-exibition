import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find buttons with solid background and replace text color
    # e.g., bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white
    content = re.sub(r'(bg-(blue|emerald|rose|amber)-600.*?)(text-slate-900 dark:text-white)', r'\1text-white', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done fixing buttons")
