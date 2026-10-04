import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# Make inputs py-4 instead of py-3 to take up more vertical space
content = content.replace('py-3 rounded-xl', 'py-4 rounded-xl')

# Make the submit button larger
content = content.replace('py-3 px-4 rounded-xl bg-blue-600', 'py-4 px-4 rounded-xl text-sm bg-blue-600')
content = content.replace('py-3 px-4 rounded-xl bg-emerald-600', 'py-4 px-4 rounded-xl text-sm bg-emerald-600')

# Make the demo button larger
content = content.replace('py-2.5 rounded-xl border', 'py-3.5 rounded-xl border text-xs')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Made inputs huge")
