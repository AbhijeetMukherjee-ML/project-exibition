import re

files = [
    'frontend/src/components/pages/ClassroomAttendancePage.jsx',
    'frontend/src/components/pages/HostelAttendancePage.jsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    content = re.sub(
        r"isStartingStream '([^']+)' '([^']+)'",
        r"isStartingStream ? '\1' : '\2'",
        content
    )

    with open(file, 'w') as f:
        f.write(content)

print("Fixed missing ? and : in Classroom/Hostel")
