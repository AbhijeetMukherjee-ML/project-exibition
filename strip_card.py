import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# Make the wrapper a simple flex container filling space
content = content.replace('onClick={(e) => e.stopPropagation()}\n        className="relative w-full h-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 shadow-2xl"', 'className="relative w-full h-full flex flex-col justify-center px-8 lg:px-16"')

# Remove the top brand strip
content = re.sub(r'\{\/\* ================= TOP BRAND STRIP ================= \*\/.*?<div className="h-1[^>]+/>', '', content, flags=re.DOTALL)

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()
# On HomePage, just render LoginForm inside the panel
# Let's restore the right side's styling but without the inner div
right_side = """
      {/* RIGHT SIDE: Login */}
      <div className="w-full lg:w-2/5 flex flex-col bg-slate-50 dark:bg-[#060b14] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] relative">
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
          <LoginForm />
        </div>
      </div>
"""
# Replace the whole RIGHT SIDE block
content = re.sub(r'\{\/\* RIGHT SIDE: Login \*\/.*?</div>\n\n    </div>', right_side + '\n    </div>', content, flags=re.DOTALL)
with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Stripped card styling")
