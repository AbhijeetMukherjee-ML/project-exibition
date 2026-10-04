import re

content = "className=\"bg-white dark:bg-slate-900\""

content = re.sub(r'(?<!dark:)bg-slate-900', r'bg-slate-100 dark:bg-slate-900', content)

print(content)
