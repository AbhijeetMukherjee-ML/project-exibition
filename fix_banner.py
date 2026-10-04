import re

with open('frontend/src/components/pages/StudentDashboard.jsx', 'r') as f:
    content = f.read()

# Replace the banner logic
logic_code = """
  const latestHostelLog = studentLogs.find(l => l.type === 'hostel');
  const isOutside = latestHostelLog && latestHostelLog.direction === 'OUT';
"""

content = content.replace('  const violations = studentLogs.filter(l => l.curfewAlert).length;', '  const violations = studentLogs.filter(l => l.curfewAlert).length;\n' + logic_code)

content = content.replace('studentLogs.length > 0 && studentLogs[0].type === \'hostel\' && studentLogs[0].direction === \'OUT\'', 'isOutside')
content = content.replace('studentLogs.length > 0 ? `Last seen: ${studentLogs[0].timestamp} (${studentLogs[0].type === \'hostel\' ? `Gate ${studentLogs[0].direction}` : \'Classroom\'})` : \'No recent movement detected.\'', 'latestHostelLog ? `Last seen at gate: ${latestHostelLog.timestamp} (${latestHostelLog.direction})` : \'No recent gate movement detected.\'')

with open('frontend/src/components/pages/StudentDashboard.jsx', 'w') as f:
    f.write(content)

print("Banner logic fixed")
