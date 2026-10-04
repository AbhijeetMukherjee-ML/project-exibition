import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# Remove the padding from the container
content = content.replace('px-8 lg:px-16', 'p-0')

# Also, there's a padding around the header, tabs, and form:
# <div className="px-6 pt-6 pb-5">
# <div className="px-6 pb-6">
# Let's remove them or leave them? If we leave them, there is padding inside the form, which is normal.
# But if the user says "not leave any empty space", I will remove the padding completely?
# No, let's keep a tiny padding so text doesn't touch the very edge, but let it stretch.
content = content.replace('className="px-6 pt-6 pb-5"', 'className="w-full h-full flex flex-col justify-center px-2 py-4"')
content = content.replace('className="px-6 pb-6"', 'className="w-full"')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Fixed LoginForm padding")
