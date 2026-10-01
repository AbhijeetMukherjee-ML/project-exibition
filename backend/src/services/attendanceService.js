import { ensureDbConnected } from "../database.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import Student from "../models/Student.js";

const getToday = () => new Date().toISOString().split("T")[0];

// Normalize slot key (e.g. 'class1' -> 'class1Attendance', 'hostel' -> 'hostelAttendance')
const normalizeSlotField = (slot = "class1") => {
    const s = slot.toLowerCase().trim();
    if (s.endsWith("attendance")) return s;
    if (s === "hostel") return "hostelAttendance";
    if (s === "class1" || s === "1" || s === "p1") return "class1Attendance";
    if (s === "class2" || s === "2" || s === "p2") return "class2Attendance";
    if (s === "class3" || s === "3" || s === "p3") return "class3Attendance";
    if (s === "class4" || s === "4" || s === "p4") return "class4Attendance";
    return `${s}Attendance`;
};

// ─── GET records ─────────────────────────────────────────────────────────────
export const getRecords = async (filter = {}) => {
    ensureDbConnected();
    const query = {};
    if (filter.studentId) query.studentId = filter.studentId;
    if (filter.date) query.date = filter.date;
    else if (!filter.studentId) query.date = getToday(); // Default to today if no filter given

    return AttendanceRecord.find(query).sort({ date: -1, studentId: 1 });
};

// ─── GET student attendance history ──────────────────────────────────────────
export const getStudentAttendance = async (studentId) => {
    ensureDbConnected();
    return AttendanceRecord.find({ studentId }).sort({ date: -1 });
};

// ─── UPSERT attendance record for a student on a specific date ──────────────
export const upsertRecord = async ({
    studentId,
    name,
    date = getToday(),
    slot = "class1",
    status = "present",
    confidence = "",
    method = "Manual",
    remarks = "",
}) => {
    ensureDbConnected();

    if (!studentId) {
        const err = new Error("studentId is required");
        err.statusCode = 400;
        throw err;
    }

    // If student name isn't passed, look it up in Student model
    let studentName = name;
    if (!studentName) {
        const student = await Student.findOne({ studentId });
        studentName = student ? student.name : studentId;
    }

    const slotField = normalizeSlotField(slot);
    const shortSlot = slotField.replace("Attendance", "");

    const timestamp = new Date().toLocaleTimeString();

    const updateDoc = {
        $set: {
            name: studentName,
            [slotField]: status,
            [`details.${shortSlot}`]: {
                status,
                markedAt: timestamp,
                confidence: confidence || (method === "Manual" ? "Manual" : "AI Match"),
                method,
                remarks,
            },
        },
        $setOnInsert: {
            studentId,
            date,
        },
    };

    return AttendanceRecord.findOneAndUpdate(
        { studentId, date },
        updateDoc,
        { upsert: true, returnDocument: "after", runValidators: true }
    );
};

// ─── BULK upsert ─────────────────────────────────────────────────────────────
export const bulkUpsert = async (records) => {
    ensureDbConnected();
    const date = getToday();
    const ops = records.map((r) => {
        const slotField = normalizeSlotField(r.slot || "class1");
        const shortSlot = slotField.replace("Attendance", "");
        return {
            updateOne: {
                filter: { studentId: r.studentId, date: r.date || date },
                update: {
                    $set: {
                        name: r.name || r.studentId,
                        [slotField]: r.status || "absent",
                        [`details.${shortSlot}`]: {
                            status: r.status || "absent",
                            markedAt: r.markedAt || new Date().toLocaleTimeString(),
                            confidence: r.confidence || "—",
                            method: r.method || "Auto",
                        },
                    },
                    $setOnInsert: {
                        studentId: r.studentId,
                        date: r.date || date,
                    },
                },
                upsert: true,
            },
        };
    });

    return AttendanceRecord.bulkWrite(ops);
};

// ─── RESET / DELETE attendance records ───────────────────────────────────────
export const deleteRecords = async (filter = {}) => {
    ensureDbConnected();
    const query = {};
    if (filter.studentId) query.studentId = filter.studentId;
    if (filter.date) query.date = filter.date;
    else query.date = getToday();

    return AttendanceRecord.deleteMany(query);
};

export default {
    getRecords,
    getStudentAttendance,
    upsertRecord,
    bulkUpsert,
    deleteRecords,
};
