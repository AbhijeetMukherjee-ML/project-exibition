import re

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Change width of Left Side (Info) to 60%
content = content.replace('className="w-full lg:w-1/2 p-8 lg:p-16', 'className="w-full lg:w-3/5 p-8 lg:p-16')

# Change width of Right Side (Login) to 40%
content = content.replace('className="w-full lg:w-1/2 p-6 lg:p-12', 'className="w-full lg:w-2/5 p-6 lg:p-12')

# To make the left space "not empty", remove max-w constraints on text and features so they span the 60% nicely
content = content.replace('max-w-lg mb-12', 'max-w-2xl mb-12 text-xl')
content = content.replace('space-y-6 max-w-lg', 'space-y-8 max-w-2xl mt-8')

# Add a subtle background pattern to the right side so it doesn't look empty
pattern = r'bg-slate-50 dark:bg-\[\#060b14\]'
replacement = 'bg-slate-50 dark:bg-[#060b14] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]'
content = re.sub(pattern, replacement, content)

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Resized to 60/40 and filled space")
