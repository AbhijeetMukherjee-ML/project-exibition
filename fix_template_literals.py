import os
import re

src_dir = 'frontend/src'
jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            jsx_files.append(os.path.join(root, f))

# Safe string replacement for missing pairs in ANY string (including template literals)
# Using negative lookbehinds/lookaheads to prevent stacking.
replacements = [
    # text-slate-X missing dark:text-slate-Y
    (r'(?<!dark:)\btext-slate-900\b(?!\s+dark:text-(?:white|slate-100))', 'text-slate-900 dark:text-white'),
    (r'(?<!dark:)\btext-slate-800\b(?!\s+dark:text-(?:white|slate-200))', 'text-slate-800 dark:text-slate-200'),
    (r'(?<!dark:)\btext-slate-700\b(?!\s+dark:text-(?:white|slate-300))', 'text-slate-700 dark:text-slate-300'),
    (r'(?<!dark:)\btext-slate-600\b(?!\s+dark:text-(?:white|slate-400))', 'text-slate-600 dark:text-slate-400'),
    (r'(?<!dark:)\btext-slate-500\b(?!\s+dark:text-(?:white|slate-400))', 'text-slate-500 dark:text-slate-400'),
    
    # borders
    (r'(?<!dark:)\bborder-slate-200\b(?!\s+dark:border-slate-800)', 'border-slate-200 dark:border-slate-800'),
    (r'(?<!dark:)\bborder-slate-300\b(?!\s+dark:border-slate-700)', 'border-slate-300 dark:border-slate-700'),

    # bg
    (r'(?<!dark:)\bbg-white\b(?!\s+dark:bg-slate-(?:900|950))', 'bg-white dark:bg-slate-900'),
    (r'(?<!dark:)\bbg-slate-50\b(?!\s+dark:bg-slate-(?:900|950|800))', 'bg-slate-50 dark:bg-slate-950'),
    (r'(?<!dark:)\bbg-slate-100\b(?!\s+dark:bg-slate-(?:800|900))', 'bg-slate-100 dark:bg-slate-800'),
    (r'(?<!dark:)\bbg-slate-200\b(?!\s+dark:bg-slate-(?:700|800))', 'bg-slate-200 dark:bg-slate-700'),

    # Hardcoded darks without light counterparts
    (r'(?<!dark:)(?<!\b)\bbg-slate-950\b', 'bg-slate-50 dark:bg-slate-950'),
    (r'(?<!dark:)(?<!\b)\bbg-slate-900\b', 'bg-white dark:bg-slate-900'),
    (r'(?<!dark:)(?<!\b)\bborder-slate-800\b', 'border-slate-200 dark:border-slate-800'),
    (r'(?<!dark:)(?<!\b)\bborder-slate-700\b', 'border-slate-300 dark:border-slate-700'),
    (r'(?<!dark:)(?<!\b)\btext-slate-400\b', 'text-slate-500 dark:text-slate-400'),
    (r'(?<!dark:)(?<!\b)\btext-white\b', 'text-slate-900 dark:text-white'),
]

# Note: The negative lookbehind `(?<!\b)` is broken for checking missing words.
# We will just write a custom function for string replacements inside `...` or `...` blocks.
