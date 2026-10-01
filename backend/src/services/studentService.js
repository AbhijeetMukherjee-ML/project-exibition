import { ensureDbConnected } from "../database.js";
import Student from "../models/Student.js";
import { INITIAL_STUDENTS } from "../data/initialStudents.js";

// ─── GET all students (auto-seed if empty) ───────────────────────────────────
export const getAllStudents = async (filter = {}) => {
    ensureDbConnected();
    const count = await Student.countDocuments();
    if (count === 0) {
        try {
            await Student.insertMany(INITIAL_STUDENTS);
        } catch (err) {
            console.error("Auto-seeding students failed:", err.message);
        }
    }
    return Student.find(filter).sort({ studentId: 1 });
};

// ─── GET one student ─────────────────────────────────────────────────────────
export const getStudentById = async (id) => {
    ensureDbConnected();
    const student = await Student.findOne({
        $or: [{ _id: id }, { studentId: id }],
    });
    if (!student) {
        const err = new Error(`Student not found: ${id}`);
        err.statusCode = 404;
        throw err;
    }
    return student;
};

// ─── CREATE student ──────────────────────────────────────────────────────────
export const createStudent = async (data) => {
    ensureDbConnected();

    if (!data.name?.trim()) {
        const err = new Error("Student 'name' is required");
        err.statusCode = 400;
        throw err;
    }

    let studentId = data.studentId?.trim();
    if (!studentId) {
        const total = await Student.countDocuments();
        studentId = `STU-2026-${String(total + 1).padStart(3, "0")}`;
    }

    const existing = await Student.findOne({ studentId });
    if (existing) {
        const err = new Error(`Student with ID '${studentId}' already exists`);
        err.statusCode = 409;
        throw err;
    }

    const student = new Student({
        studentId,
        name: data.name.trim(),
        avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name.trim())}&background=2563eb&color=fff&size=256&bold=true`,
        email: data.email || "",
        phone: data.phone || "",
        bloodGroup: data.bloodGroup || "",
        joinedDate: data.joinedDate || new Date().toISOString().split("T")[0],
        department: data.department || "",
        year: data.year || "",
        block: data.block || "",
        room: data.room || "",
        bed: data.bed || "",
        guardianName: data.guardianName || "",
        guardianPhone: data.guardianPhone || "",
        guardianRelation: data.guardianRelation || "",
        address: data.address || "",
        faceEnrolled: data.faceEnrolled ?? false,
        faceConfidence: data.faceConfidence || "Pending Scan",
        status: data.status || "Active",
    });

    return student.save();
};

// ─── UPDATE student ──────────────────────────────────────────────────────────
export const updateStudent = async (id, data) => {
    ensureDbConnected();

    const student = await Student.findOne({
        $or: [{ _id: id }, { studentId: id }],
    });
    if (!student) {
        const err = new Error(`Student not found: ${id}`);
        err.statusCode = 404;
        throw err;
    }

    const allowed = [
        "name", "avatar", "email", "phone", "bloodGroup",
        "department", "year", "block", "room", "bed",
        "guardianName", "guardianPhone", "guardianRelation", "address",
        "faceEnrolled", "faceConfidence", "status", "joinedDate",
    ];

    const updates = {};
    for (const key of allowed) {
        if (data[key] !== undefined) updates[key] = data[key];
    }

    return Student.findByIdAndUpdate(student._id, updates, {
        returnDocument: "after",
        runValidators: true,
    });
};

// ─── DELETE student ──────────────────────────────────────────────────────────
export const deleteStudent = async (id) => {
    ensureDbConnected();

    const deleted = await Student.findOneAndDelete({
        $or: [{ _id: id }, { studentId: id }],
    });
    if (!deleted) {
        const err = new Error(`Student not found: ${id}`);
        err.statusCode = 404;
        throw err;
    }
    return deleted;
};

export default { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
