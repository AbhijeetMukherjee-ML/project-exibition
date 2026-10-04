import re

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Remove dotted background
content = content.replace('bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] ', '')

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Removed dotted background")
