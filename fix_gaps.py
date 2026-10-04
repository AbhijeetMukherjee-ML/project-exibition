import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# 1. Change outer div from justify-center to justify-between, and reduce padding drastically
# Before: className="relative w-full h-full flex flex-col justify-center px-10 lg:px-20 py-8"
# After: className="relative w-full h-full flex flex-col justify-between px-8 py-8 lg:p-12"
content = content.replace('className="relative w-full h-full flex flex-col justify-center px-10 lg:px-20 py-8"', 'className="relative w-full h-full flex flex-col justify-between px-8 py-8 lg:p-12"')

# 2. Remove all the inner px-6 paddings to prevent double padding gaps!
# Header
content = content.replace('className="px-6 pt-6 pb-5"', 'className="pb-5"')
# Tabs
content = content.replace('className="px-6 pb-6"', 'className="pb-6"')
# Form
content = content.replace('className="px-6 pb-6 space-y-4"', 'className="pb-6 space-y-4"')
content = content.replace('className="space-y-4"', 'className="space-y-4 w-full"') # just in case
# Footer
content = content.replace('className="px-6 py-3.5 border-t', 'className="py-6 border-t')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Fixed gaps")
