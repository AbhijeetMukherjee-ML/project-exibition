import os
import re

# We will recursively walk frontend/src
src_dir = 'frontend/src'
jsx_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            jsx_files.append(os.path.join(root, f))

# A dictionary of light class -> dark class
mapping = {
    'bg-white': 'dark:bg-slate-900',
    'bg-slate-50': 'dark:bg-slate-950',
    'bg-slate-100': 'dark:bg-slate-800',
    'bg-slate-200': 'dark:bg-slate-700',
    'border-slate-200': 'dark:border-slate-800',
    'border-slate-300': 'dark:border-slate-700',
    'text-slate-900': 'dark:text-white',
    'text-slate-800': 'dark:text-slate-200',
    'text-slate-700': 'dark:text-slate-300',
    'text-slate-600': 'dark:text-slate-400',
    'text-slate-500': 'dark:text-slate-400',
}

# A dictionary of dark class -> light class (for elements originally hardcoded to dark)
dark_to_light = {
    'bg-slate-950': 'bg-slate-50',
    'bg-slate-900': 'bg-white',
    'bg-[#0b1320]': 'bg-white',
    'bg-[#0a111d]': 'bg-white',
    'bg-[#060b14]': 'bg-slate-50',
    'border-slate-800': 'border-slate-200',
    'border-slate-700': 'border-slate-300',
    'text-white': 'text-slate-900',
    'text-slate-200': 'text-slate-800',
    'text-slate-300': 'text-slate-700',
    'text-slate-400': 'text-slate-500',
}

def process_classes(class_str):
    classes = class_str.split()
    new_classes = set(classes)
    
    # Check for missing dark classes
    for light, dark in mapping.items():
        if light in classes:
            # Check if there is already ANY dark variant of this property
            prop_type = light.split('-')[0] # 'bg', 'border', 'text'
            
            # Special case for text because there are many colors
            has_dark = any(c.startswith(f'dark:{prop_type}-') or c == 'dark:text-white' for c in classes)
            if not has_dark:
                new_classes.add(dark)
                
    # Check for missing light classes (where dark is hardcoded without 'dark:')
    for dark_raw, light in dark_to_light.items():
        if dark_raw in classes:
            prop_type = dark_raw.split('-')[0]
            # If it's literally 'bg-slate-950' and NOT 'dark:bg-slate-950'
            has_light = any(c.startswith(f'{prop_type}-') and not c.startswith('dark:') and c != dark_raw for c in classes)
            if not has_light and light not in classes:
                # This means it's hardcoded dark. We should make it responsive!
                # Actually, replacing it might break things if it's meant to be ALWAYS dark.
                # But the user asked for everything to respond to toggle.
                # So we replace `dark_raw` with `light dark:dark_raw`
                new_classes.remove(dark_raw)
                new_classes.add(light)
                new_classes.add(f'dark:{dark_raw}')
                
    return " ".join(sorted(list(new_classes)))

def replace_classnames(match):
    prefix = match.group(1)
    class_str = match.group(2)
    new_class_str = process_classes(class_str)
    return f'{prefix}"{new_class_str}"'

for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()

    # Find className="..." and replace
    new_content = re.sub(r'(className=)"([^"]+)"', replace_classnames, content)
    
    # Also handle template literals with classNames: className={`...`}
    # This is harder to parse perfectly with regex, but we can do a simplified version
    def replace_template(match):
        prefix = match.group(1)
        inner = match.group(2)
        # We can't safely run the full process_classes on template literals because of ${} interpolation
        # But we can try to find space-separated string literals inside it.
        # Actually, let's just leave template literals alone for now to avoid breaking logic,
        # unless we do a simple string replace.
        return match.group(0)

    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)
            
print("Global responsive classes pass completed")
