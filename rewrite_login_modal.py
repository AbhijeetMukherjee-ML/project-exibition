import re

with open('frontend/src/components/modals/LoginModal.jsx', 'r') as f:
    content = f.read()

# We need to change the modal container from max-w-sm to max-w-4xl and make it a flex container
content = content.replace('className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"',
                          'className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row"')

# Now we need to split the content.
# Right now, the modal has:
# 1. HEADER (px-6 py-4 border-b)
# 2. ROLE TABS (grid grid-cols-2)
# 3. CONTENT (px-6 py-5)
# 4. FOOTER (px-6 py-3.5 border-t)
# We can make the left side (60%) the info panel, and the right side (40%) the login form with tabs.

left_side = """
        {/* ================= LEFT INFO PANEL (60%) ================= */}
        <div className="w-full md:w-[60%] bg-slate-50 dark:bg-slate-800/50 p-8 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Sentinel AI</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-wider">SECURE ACCESS GATEWAY</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Administrator Access</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed ml-11">
                  Full command over the Smart Hostel ecosystem. View live AI camera feeds, manage student registries, monitor real-time classroom attendance, issue disciplinary notices, and override curfew violations. Intended only for Wardens, Proctors, and System Admins.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Student Access</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed ml-11">
                  Personalized dashboard for residents. Check your daily classroom attendance percentages, review your hostel entry/exit logs recorded by the AI gates, and track any outstanding disciplinary fines or curfew alerts issued against your profile.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <Lock className="w-3 h-3" />
            End-to-End Encrypted Verification
          </div>
        </div>
"""

# Replace the outer structure
# Find the start of the modal content after the wrapper div:
#     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
#      <div className="absolute inset-0 bg-slate-900/40 dark:bg-[#030712]/80 backdrop-blur-sm" onClick={onClose} />
#      <div className="w-full max-w-sm... flex flex-col md:flex-row">

# Then we put `left_side`, and wrap the rest in a `w-full md:w-[40%] flex flex-col`
replacement = """
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row relative z-10">
""" + left_side + """
        {/* ================= RIGHT LOGIN FORM (40%) ================= */}
        <div className="w-full md:w-[40%] flex flex-col">
"""

content = re.sub(r'      <div className="w-full max-w-4xl[^>]+>', replacement, content)

# Find the end of the modal (the last two </div>s) and add one more </div> to close the right side wrapper.
content = re.sub(r'        </div>\n\n      </div>\n    </div>\n  \);\n}', '        </div>\n\n        </div>\n      </div>\n    </div>\n  );\n}', content)

with open('frontend/src/components/modals/LoginModal.jsx', 'w') as f:
    f.write(content)

print("Login modal rebuilt")
