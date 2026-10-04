import re

with open('frontend/src/components/pages/StudentDashboard.jsx', 'r') as f:
    content = f.read()

# Add a Current Status Banner right below the header
status_banner_code = """
      {/* Current Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 animate-pulse-slow ${
        studentLogs.length > 0 && studentLogs[0].type === 'hostel' && studentLogs[0].direction === 'OUT' 
          ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400' 
          : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400'
      }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          studentLogs.length > 0 && studentLogs[0].type === 'hostel' && studentLogs[0].direction === 'OUT' ? 'bg-amber-100 dark:bg-amber-500/20' : 'bg-emerald-100 dark:bg-emerald-500/20'
        }`}>
          {studentLogs.length > 0 && studentLogs[0].type === 'hostel' && studentLogs[0].direction === 'OUT' ? <Home className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-bold text-sm">
            {studentLogs.length > 0 && studentLogs[0].type === 'hostel' && studentLogs[0].direction === 'OUT' 
              ? 'Currently Outside Hostel' 
              : 'Safely Inside Hostel / Campus'}
          </h3>
          <p className="text-xs opacity-80">
            {studentLogs.length > 0 ? `Last seen: ${studentLogs[0].timestamp} (${studentLogs[0].type === 'hostel' ? `Gate ${studentLogs[0].direction}` : 'Classroom'})` : 'No recent movement detected.'}
          </p>
        </div>
      </div>
"""

content = content.replace('      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">', status_banner_code + '\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">')

# Add Disciplinary Fines breakdown section
fines_breakdown_code = """
      {/* Disciplinary Records Detailed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            Disciplinary Records
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{studentFines.length} Total Incidents</span>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {studentFines.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">You have a clean record! Keep it up.</div>
          ) : (
            studentFines.map(fine => (
              <div key={fine.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{fine.reason}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{fine.date} • Issued by {fine.issuedBy}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">₹{fine.amount}</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    fine.status === 'Served / Paid' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                  }`}>
                    {fine.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
"""

content = content.replace('    </div>\n  );\n}', fines_breakdown_code + '\n    </div>\n  );\n}')

# Need to make sure ShieldCheck is imported
if 'ShieldCheck' not in content:
    content = content.replace('Home, Phone', 'Home, Phone, ShieldCheck')

with open('frontend/src/components/pages/StudentDashboard.jsx', 'w') as f:
    f.write(content)

print("Student dashboard updated with details")
