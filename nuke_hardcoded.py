import os
import re

src_dir = 'frontend/src'
jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            jsx_files.append(os.path.join(root, f))

def clean_class_string(c):
    # Remove all dark:bg-[#...] and bg-[#...]
    c = re.sub(r'dark:bg-\[#[0-9a-fA-F]+\](?:/[0-9]+)?', '', c)
    c = re.sub(r'bg-\[#[0-9a-fA-F]+\](?:/[0-9]+)?', '', c)
    
    # Remove duplicates like dark:bg-slate-900 dark:bg-slate-900
    classes = c.split()
    seen = set()
    new_classes = []
    
    # We want to keep responsive pairs. But if there are conflicting ones like `bg-white` and `bg-slate-50`, we should resolve them.
    # It's better to just keep unique classes.
    for cls in classes:
        if cls not in seen:
            seen.add(cls)
            new_classes.append(cls)
            
    # Also if both `dark:bg-slate-900` and `dark:bg-slate-950` exist, keep only one.
    has_dark_bg = [x for x in new_classes if x.startswith('dark:bg-')]
    if len(has_dark_bg) > 1:
        # keep the last one, remove others
        for extra in has_dark_bg[:-1]:
            new_classes.remove(extra)
            
    has_light_bg = [x for x in new_classes if x.startswith('bg-') and not x.startswith('dark:bg-') and x not in ['bg-transparent', 'bg-gradient-to-r', 'bg-clip-text', 'bg-white', 'bg-slate-50', 'bg-slate-100', 'bg-slate-200']]
    # wait, we shouldn't strip color bgs like bg-emerald-500.
    
    # Fix border duplicates
    has_dark_border = [x for x in new_classes if x.startswith('dark:border-')]
    if len(has_dark_border) > 1:
        for extra in has_dark_border[:-1]:
            new_classes.remove(extra)

    has_dark_text = [x for x in new_classes if x.startswith('dark:text-')]
    if len(has_dark_text) > 1:
        for extra in has_dark_text[:-1]:
            new_classes.remove(extra)
            
    return " ".join(new_classes)


for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()

    # Find className="<stuff>"
    content = re.sub(r'className="([^"]+)"', lambda m: f'className="{clean_class_string(m.group(1))}"', content)
    
    # template literals
    content = re.sub(r'className=\{`([^`]+)`\}', lambda m: f'className={{`{clean_class_string(m.group(1))}`}}', content)

    with open(file, 'w') as f:
        f.write(content)

print("Nuked all hex bgs and deduplicated responsive conflicts")
