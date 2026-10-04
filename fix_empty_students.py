with open('frontend/src/context/AppContext.jsx', 'r') as f:
    content = f.read()

# If studentsRes is empty, fallback to INITIAL_STUDENTS for the demo!
replacement = """      let finalStudents = Array.isArray(studentsRes) ? studentsRes : [];
      if (finalStudents.length === 0) {
        console.warn('Database is empty! Falling back to INITIAL_STUDENTS for demo purposes.');
        finalStudents = INITIAL_STUDENTS;
      }
      setDbStudents(finalStudents);"""

content = content.replace("setDbStudents(Array.isArray(studentsRes) ? studentsRes : []);", replacement)

with open('frontend/src/context/AppContext.jsx', 'w') as f:
    f.write(content)
print("Fixed empty students fallback")
