import re

with open('frontend/src/components/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Add h-screen overflow-hidden to the main container
content = content.replace('min-h-screen flex flex-col', 'h-screen overflow-hidden flex flex-col')

# Restore vertical padding on the left side but make it smaller
content = content.replace('px-6 lg:px-12 flex flex-col justify-between border-r', 'p-6 lg:p-10 flex flex-col justify-between border-r overflow-y-auto')

# Reduce spacing to prevent scrollbar if possible
content = content.replace('mb-16', 'mb-8')
content = content.replace('mb-12 text-xl', 'mb-6 text-lg')
content = content.replace('space-y-8', 'space-y-4')
content = content.replace('mt-8', 'mt-4')
content = content.replace('mt-16', 'mt-8')
content = content.replace('mb-6">', 'mb-4">')

# Hide points to save vertical space
content = content.replace('{f.points.map((pt, j) => (', '{false && f.points.map((pt, j) => (')

with open('frontend/src/components/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Made things fit")
