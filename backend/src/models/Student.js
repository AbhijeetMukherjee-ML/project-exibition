import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        // ── Identity ──────────────────────────────────────────────
        studentId: {
            type: String,
            required: [true, "Student ID is required"],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            trim: true,
            default: "",
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        bloodGroup: {
            type: String,
            trim: true,
            default: "",
        },
        joinedDate: {
            type: String,
            default: "",
        },

        // ── Academic ─────────────────────────────────────────────
        department: {
            type: String,
            trim: true,
            default: "",
        },
        year: {
            type: String,
            trim: true,
            default: "",
        },

        // ── Hostel / Accommodation ───────────────────────────────
        block: {
            type: String,
            trim: true,
            default: "",
        },
        room: {
            type: String,
            trim: true,
            default: "",
        },
        bed: {
            type: String,
            trim: true,
            default: "",
        },

        // ── Guardian ─────────────────────────────────────────────
        guardianName: {
            type: String,
            trim: true,
            default: "",
        },
        guardianPhone: {
            type: String,
            trim: true,
            default: "",
        },
        guardianRelation: {
            type: String,
            trim: true,
            default: "",
        },
        address: {
            type: String,
            trim: true,
            default: "",
        },

        // ── Biometrics ───────────────────────────────────────────
        faceEnrolled: {
            type: Boolean,
            default: false,
        },
        faceConfidence: {
            type: String,
            default: "Pending Scan",
        },

        // ── Status ───────────────────────────────────────────────
        status: {
            type: String,
            enum: ["Active", "Under Watch", "Suspended"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
