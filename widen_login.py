import re

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()
content = content.replace('w-full max-w-[420px]', 'w-full max-w-xl h-full flex items-center')
with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()
content = content.replace('w-full max-w-[400px]', 'w-full w-full h-full justify-center')
with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Widened login")
