import re

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Replace the wrapper around LoginForm
content = content.replace('p-6 lg:p-12 flex items-center justify-center', 'p-0 flex flex-col items-stretch justify-center')
content = content.replace('<div className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-8 duration-700">', '<div className="w-full h-full flex flex-col justify-center p-8 lg:p-16 animate-in fade-in slide-in-from-right-8 duration-700">')

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Stretched form wrapper")
