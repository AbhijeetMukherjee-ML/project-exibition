import re
import os

with open('frontend/src/components/modals/LoginModal.jsx', 'r') as f:
    content = f.read()

# Change component name
content = content.replace('export default function LoginModal({', 'export default function LoginForm({')
content = content.replace('isOpen,\n  onClose,\n', '')
content = content.replace('if (!isOpen) return null;', '')
content = content.replace('onClose();', '')
content = content.replace('onClick={onClose}', '')

# Remove the fixed overlay
# 94-    <div
# 95-      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
# 96-      onClick={onClose}
# 97-    >
# 98-      <div
pattern = r'<div\s+className="fixed inset-0[^>]+>.*?<div'
content = re.sub(pattern, '<div', content, flags=re.DOTALL)

# Remove the last </div>
content = re.sub(r'</div>\n    </div>\n  \);\n}', '</div>\n  );\n}', content)

# Remove the close X button
x_btn_pattern = r'<button\s+onClick=\{undefined\}.*?<X className="w-4 h-4" />\s*</button>'
content = re.sub(x_btn_pattern, '', content, flags=re.DOTALL)


os.rename('frontend/src/components/modals/LoginModal.jsx', 'frontend/src/components/common/LoginForm.jsx')
with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Converted to LoginForm")
