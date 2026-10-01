import mongoose from "mongoose";

/*
  AttendanceRecord — One document per student per day.
  Tracks individual class attendances (class1, class2, class3, class4)
  and hostel attendance, per day.
*/

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: [true, "studentId is required"],
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true,
        },
        date: {
            type: String, // Format: YYYY-MM-DD
            required: [true, "Date is required"],
            trim: true,
        },
        class1Attendance: {
            type: String,
            enum: ["present", "absent", "late", "pending"],
            default: "absent",
        },
        class2Attendance: {
            type: String,
            enum: ["present", "absent", "late", "pending"],
            default: "absent",
        },
        class3Attendance: {
            type: String,
            enum: ["present", "absent", "late", "pending"],
            default: "absent",
        },
        class4Attendance: {
            type: String,
            enum: ["present", "absent", "late", "pending"],
            default: "absent",
        },
        hostelAttendance: {
            type: String,
            enum: ["present", "absent", "late", "pending"],
            default: "absent",
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// One record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceSchema);

export default AttendanceRecord;
