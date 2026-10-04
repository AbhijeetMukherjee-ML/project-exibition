import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# Revert inputs
content = content.replace('py-4 rounded-xl', 'py-3 rounded-xl')

# Revert buttons
content = content.replace('py-4 px-4 rounded-xl text-sm bg-blue-600', 'py-3 px-4 rounded-xl bg-blue-600')
content = content.replace('py-4 px-4 rounded-xl text-sm bg-emerald-600', 'py-3 px-4 rounded-xl bg-emerald-600')

# Revert demo button
content = content.replace('py-3.5 rounded-xl border text-xs', 'py-2.5 rounded-xl border')

# Revert title
content = content.replace('text-2xl font-black', 'text-lg font-bold')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Reverted to normal size")
