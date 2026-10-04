import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# Remove outer padding
content = content.replace('className="relative w-full h-full flex flex-col justify-between px-8 py-8 lg:p-12"', 'className="relative w-full h-full flex flex-col justify-between p-6 lg:p-8"')

# Remove ALL inner horizontal paddings
content = content.replace('className="px-6"', 'className=""')
content = content.replace('className="px-6 pt-5 pb-6"', 'className="pt-5 pb-6"')
content = content.replace('className="py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:bg-slate-900/60 flex items-center justify-between"', 'className="py-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between"')
content = content.replace('className="pb-5"', 'className=""')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Make sure HomePage has no padding on the right side
content = content.replace('className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-700"', 'className="w-full h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-700"')

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Nuked gaps")
