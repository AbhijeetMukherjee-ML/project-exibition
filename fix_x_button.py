import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

pattern = r'<button\s*className="[^"]+"\s*>\s*<X className="w-4 h-4" />\s*</button>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Fixed X button")
