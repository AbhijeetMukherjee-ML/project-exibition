import re

with open('frontend/src/components/common/LoginForm.jsx', 'r') as f:
    content = f.read()

# 1. Fix the outer layout so elements aren't spread out randomly
content = content.replace('className="relative w-full h-full flex flex-col justify-between p-6 lg:p-8"', 'className="relative w-full h-full flex flex-col justify-center gap-10 p-10 lg:p-16"')

# 2. Make Tabs bigger
content = content.replace('gap-2.5 py-3 rounded-lg text-xs', 'gap-3 py-5 rounded-xl text-base')
content = content.replace('className="w-4 h-4"', 'className="w-5 h-5"')
content = content.replace('w-1.5 h-1.5 rounded-full', 'w-2 h-2 rounded-full')

# 3. Make Admin Info Box bigger
content = content.replace('className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 p-4"', 'className="rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 p-6 lg:p-8"')
content = content.replace('className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0"', 'className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0"')
content = content.replace('<Building2 className="w-5 h-5" />', '<Building2 className="w-7 h-7" />') # Note: we already changed w-4 to w-5 globally above
content = content.replace('className="text-xs font-bold text-blue-900 dark:text-blue-300"', 'className="text-xl font-bold text-blue-900 dark:text-blue-300"')
content = content.replace('className="text-[10px] leading-relaxed text-blue-700 dark:text-blue-400 mt-1"', 'className="text-sm leading-relaxed text-blue-700 dark:text-blue-400 mt-2"')
# Admin info box badges
content = content.replace('className="flex items-center gap-1.5 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/50 text-[9px] font-semibold text-blue-700 dark:text-blue-400"', 'className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/50 text-xs font-semibold text-blue-700 dark:text-blue-400"')


# 4. Make Student Info Box bigger
content = content.replace('className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/30 p-4"', 'className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/30 p-6 lg:p-8"')
content = content.replace('className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"', 'className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"')
content = content.replace('<GraduationCap className="w-5 h-5" />', '<GraduationCap className="w-7 h-7" />') # Note: w-4 to w-5 happened globally
content = content.replace('className="text-xs font-bold text-emerald-900 dark:text-emerald-300"', 'className="text-xl font-bold text-emerald-900 dark:text-emerald-300"')
content = content.replace('className="text-[10px] leading-relaxed text-emerald-700 dark:text-emerald-400 mt-1"', 'className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-400 mt-2"')
# Student info box badges
content = content.replace('className="flex items-center gap-2 mt-3 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400"', 'className="flex items-center gap-2 mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400"')


# 5. Make inputs themselves bigger text since they are huge now
content = content.replace('className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase"', 'className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 block"')
content = content.replace('text-xs text-slate-900', 'text-base text-slate-900')
content = content.replace('text-xs font-mono', 'text-base font-mono')
content = content.replace('text-xs font-medium', 'text-base font-medium')
content = content.replace('text-xs font-bold shadow-lg', 'text-base font-bold shadow-lg')
content = content.replace('py-4 rounded-xl', 'py-5 rounded-2xl') # Input padding
content = content.replace('py-4 px-4 rounded-xl text-sm bg-blue-600', 'py-5 px-6 rounded-2xl text-base bg-blue-600')
content = content.replace('py-4 px-4 rounded-xl text-sm bg-emerald-600', 'py-5 px-6 rounded-2xl text-base bg-emerald-600')
content = content.replace('py-3.5 rounded-xl border text-xs', 'py-4 rounded-2xl border text-sm mt-4')


# 6. Fix footer
content = content.replace('className="py-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between"', 'className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between w-full mt-auto"')
content = content.replace('text-[10px] text-slate-500', 'text-sm text-slate-500')
content = content.replace('text-[10px] font-medium text-slate-600', 'text-sm font-medium text-slate-600')

with open('frontend/src/components/common/LoginForm.jsx', 'w') as f:
    f.write(content)

print("Fixed boxes and fonts")
