import re

with open('frontend/src/components/modals/LoginModal.jsx', 'r') as f:
    content = f.read()

left_side = """
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row relative z-10 border border-slate-200 dark:border-slate-800"
      >
        {/* ================= LEFT INFO PANEL (60%) ================= */}
        <div className="w-full md:w-[60%] bg-slate-50 dark:bg-slate-900 p-8 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col justify-between">
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
              <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
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

              <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
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

        {/* ================= RIGHT LOGIN FORM (40%) ================= */}
        <div className="w-full md:w-[40%] flex flex-col relative">
"""

# Replace the wrapper div
content = re.sub(
    r'      <div\n        onClick=\{\(e\) => e.stopPropagation\(\)\}\n        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl"\n      >',
    left_side,
    content,
    flags=re.MULTILINE
)

# And close the extra div at the end
content = re.sub(r'        </div>\n\n      </div>\n    </div>\n  \);\n}', '        </div>\n\n        </div>\n      </div>\n    </div>\n  );\n}', content)

# I should also hide the top header logo in the right side because it's now on the left side, or just keep it minimal.
# The right side has:
header_to_remove = """          <div className="flex items-start justify-between">

            <div className="flex items-center gap-3.5">

              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white dark:text-slate-900" />
                </div>

                <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Sentinel AI
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                  Secure Access Gateway
                </p>
              </div>

            </div>

            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>"""

# Replace the header to just the X button
new_header = """          <div className="flex items-start justify-end">
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>"""

content = content.replace(header_to_remove, new_header)


with open('frontend/src/components/modals/LoginModal.jsx', 'w') as f:
    f.write(content)

print("LoginModal updated")
