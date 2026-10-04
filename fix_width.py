import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()
content = content.replace('w-full max-w-lg overflow-hidden', 'w-full h-full flex flex-col overflow-hidden')
with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()
content = content.replace('w-full max-w-xl h-full flex items-center', 'w-full h-full p-4 lg:p-8 flex items-stretch')
# The original container had p-6 lg:p-12
content = content.replace('w-full lg:w-2/5 p-6 lg:p-12 flex items-center justify-center', 'w-full lg:w-2/5 flex flex-col items-stretch justify-stretch')
with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Fixed width")
