import re

with open('frontend/src/components/modals/LoginModal.jsx', 'r') as f:
    content = f.read()

# Container sizing
content = content.replace('max-w-6xl', 'max-w-[1400px] min-h-[750px]')

# Left side
content = content.replace('p-10 border-r', 'p-16 border-r')
content = content.replace('w-10 h-10 rounded-xl', 'w-16 h-16 rounded-2xl')
content = content.replace('ShieldCheck className="w-5 h-5 text-white"', 'ShieldCheck className="w-8 h-8 text-white"')
content = content.replace('text-lg font-black', 'text-3xl font-black')
content = content.replace('text-[10px] text-slate-500 font-mono tracking-wider', 'text-sm text-slate-500 font-mono tracking-wider mt-1')

content = content.replace('p-5 border border-slate-200', 'p-8 border-2 border-slate-200')
content = content.replace('w-8 h-8 rounded-lg', 'w-12 h-12 rounded-xl')
content = content.replace('Shield className="w-4 h-4"', 'Shield className="w-6 h-6"')
content = content.replace('GraduationCap className="w-4 h-4"', 'GraduationCap className="w-6 h-6"')

content = content.replace('font-bold text-sm text-slate-900', 'font-bold text-xl text-slate-900')
content = content.replace('text-sm text-slate-500 dark:text-slate-400 leading-relaxed ml-11', 'text-base text-slate-500 dark:text-slate-400 leading-relaxed ml-16 mt-2')

content = content.replace('mt-8 flex items-center gap-2 text-[10px]', 'mt-12 flex items-center gap-3 text-sm')

# Right side header
content = content.replace('text-xl font-bold tracking-tight', 'text-2xl font-bold tracking-tight')
content = content.replace('text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-0.5', 'text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-1')
content = content.replace('text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 'text-xs font-mono font-bold px-2 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400')

# Right side tabs
content = content.replace('py-2 rounded-lg text-xs font-bold', 'py-4 rounded-xl text-base font-bold')
content = content.replace('w-3.5 h-3.5', 'w-5 h-5')

# Right side forms
content = content.replace('px-6 py-5', 'px-12 py-8')
content = content.replace('space-y-4', 'space-y-6')
content = content.replace('text-[11px] font-bold uppercase tracking-wider', 'text-sm font-bold uppercase tracking-wider')

content = content.replace('py-3 rounded-xl', 'py-4 rounded-2xl')
content = content.replace('text-xs font-medium', 'text-base font-medium')
content = content.replace('text-xs font-mono', 'text-base font-mono')
content = content.replace('text-xs font-bold', 'text-base font-bold')

# Icons in inputs
content = content.replace('w-4 h-4 text-slate-400', 'w-5 h-5 text-slate-400')
content = content.replace('pl-10 pr-10', 'pl-12 pr-12')
content = content.replace('pl-10 pr-3', 'pl-12 pr-4')
content = content.replace('left-3', 'left-4')
content = content.replace('right-3', 'right-4')

content = content.replace('text-[10px] font-semibold text-slate-500', 'text-sm font-bold text-slate-500')
content = content.replace('py-2.5 rounded-xl', 'py-4 rounded-2xl')

# Info box inside right panel
content = content.replace('p-4 rounded-xl', 'p-6 rounded-2xl')
content = content.replace('text-[10px] leading-relaxed', 'text-sm leading-relaxed')

with open('frontend/src/components/modals/LoginModal.jsx', 'w') as f:
    f.write(content)

print("Login modal made HUGE")
