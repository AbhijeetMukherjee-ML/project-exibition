import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Generic deduplication of exact matching dark: classes
    words = content.split()
    for word in set(words):
        if word.startswith('dark:') and '"' not in word and "'" not in word and '`' not in word:
            # Replace exactly two adjacent identical dark classes
            pattern = re.escape(word) + r'\s+' + re.escape(word)
            content = re.sub(pattern, word, content)
            # Sometimes they are separated by multiple spaces
            content = re.sub(pattern, word, content)

    # Some hardcoded ones we know might have overlapped
    content = re.sub(r'bg-slate-200 dark:bg-slate-200 dark:bg-slate-800', r'bg-slate-200 dark:bg-slate-800', content)
    content = re.sub(r'hover:bg-slate-200 dark:hover:bg-slate-200 dark:hover:bg-slate-800', r'hover:bg-slate-200 dark:hover:bg-slate-800', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done deduping")
