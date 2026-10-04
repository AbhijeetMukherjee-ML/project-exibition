import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

content = content.replace('className="relative w-full h-full flex flex-col justify-center p-0"', 'className="relative w-full flex flex-col justify-center"')
content = content.replace('className="w-full h-full flex flex-col justify-center px-2 py-4"', 'className="px-6 pt-6 pb-5"')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Reverted LoginForm padding")
