import os
import re

src_dir = 'frontend/src'
jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            jsx_files.append(os.path.join(root, f))

# We will just use re.sub very carefully.
# For example: r'\bbg-white(?!.*dark:bg-slate-900)\b'
# But `.*` is greedy and will look across the whole file. We only want to look within the same string quote!
# Let's extract all class strings first.

def process_class_string(class_str):
    c = class_str
    
    # Missing darks
    c = re.sub(r'\bbg-white(?!\s*dark:bg-slate-900)(?!\s*dark:bg-slate-950)\b', 'bg-white dark:bg-slate-900', c)
    c = re.sub(r'\bbg-slate-50(?!\s*dark:bg-slate-950)(?!\s*dark:bg-slate-900)(?!\s*dark:bg-slate-800)\b', 'bg-slate-50 dark:bg-slate-950', c)
    c = re.sub(r'\bbg-slate-100(?!\s*dark:bg-slate-800)(?!\s*dark:bg-slate-900)\b', 'bg-slate-100 dark:bg-slate-800', c)
    c = re.sub(r'\bbg-slate-200(?!\s*dark:bg-slate-700)(?!\s*dark:bg-slate-800)\b', 'bg-slate-200 dark:bg-slate-700', c)
    
    c = re.sub(r'\bborder-slate-200(?!\s*dark:border-slate-800)\b', 'border-slate-200 dark:border-slate-800', c)
    c = re.sub(r'\bborder-slate-300(?!\s*dark:border-slate-700)\b', 'border-slate-300 dark:border-slate-700', c)
    
    c = re.sub(r'\btext-slate-900(?!\s*dark:text-white)(?!\s*dark:text-slate-100)\b', 'text-slate-900 dark:text-white', c)
    c = re.sub(r'\btext-slate-800(?!\s*dark:text-slate-200)(?!\s*dark:text-slate-300)\b', 'text-slate-800 dark:text-slate-200', c)
    c = re.sub(r'\btext-slate-700(?!\s*dark:text-slate-300)(?!\s*dark:text-slate-400)\b', 'text-slate-700 dark:text-slate-300', c)
    c = re.sub(r'\btext-slate-600(?!\s*dark:text-slate-400)(?!\s*dark:text-slate-300)\b', 'text-slate-600 dark:text-slate-400', c)
    c = re.sub(r'\btext-slate-500(?!\s*dark:text-slate-400)(?!\s*dark:text-slate-300)\b', 'text-slate-500 dark:text-slate-400', c)
    
    c = re.sub(r'\bplaceholder:text-slate-600(?!\s*dark:placeholder:text-slate-400)\b', 'placeholder:text-slate-600 dark:placeholder:text-slate-400', c)

    return c

for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()

    # Find className="<stuff>"
    content = re.sub(r'className="([^"]+)"', lambda m: f'className="{process_class_string(m.group(1))}"', content)
    
    # Find className={`<stuff>`} or similar. We can just run process_class_string on the whole file?
    # No, that's dangerous. Let's find template literals: className={`...`}
    # A simple regex for template literals without nested backticks:
    content = re.sub(r'className=\{`([^`]+)`\}', lambda m: f'className={{`{process_class_string(m.group(1))}`}}', content)

    # Some templates might be like: className={`flex ${isActive ? 'bg-white' : 'bg-transparent'}`}
    # The inner quotes are 'bg-white'.
    content = re.sub(r"'([^']+)'", lambda m: f"'{process_class_string(m.group(1))}'" if any(x in m.group(1) for x in ['bg-', 'text-', 'border-']) else m.group(0), content)

    # Deduplicate anything that might have doubled up
    content = content.replace('dark:bg-slate-900 dark:bg-slate-900', 'dark:bg-slate-900')
    content = content.replace('dark:bg-slate-950 dark:bg-slate-950', 'dark:bg-slate-950')
    content = content.replace('dark:text-white dark:text-white', 'dark:text-white')
    content = content.replace('dark:text-slate-200 dark:text-slate-200', 'dark:text-slate-200')
    content = content.replace('dark:text-slate-400 dark:text-slate-400', 'dark:text-slate-400')
    content = content.replace('dark:border-slate-800 dark:border-slate-800', 'dark:border-slate-800')
    
    with open(file, 'w') as f:
        f.write(content)

print("Fixed all missing light/dark pairs in classNames")
