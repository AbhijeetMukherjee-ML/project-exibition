import re
import os

src_dir = 'frontend/src'
jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            jsx_files.append(os.path.join(root, f))

for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()

    # Find patterns like `'bg-something :` and replace with `'bg-something' :`
    content = re.sub(r"'(bg-[^']+) :", r"'\1' :", content)
    
    with open(file, 'w') as f:
        f.write(content)

print("Fixed missing closing quotes before colons")
