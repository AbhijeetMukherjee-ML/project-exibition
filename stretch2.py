import re

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Replace padding
content = content.replace('p-8 lg:p-16', 'px-6 lg:px-12')

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Adjusted HomePage padding")
