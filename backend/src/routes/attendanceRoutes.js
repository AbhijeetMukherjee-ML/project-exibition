import express from "express";
import {
    getAttendance,
    getStudentAttendance,
    markAttendance,
    bulkMarkAttendance,
    resetAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// GET  /api/attendance?studentId=&date=&type=&periodId=
// DELETE /api/attendance?studentId=&date=&type=
router.route("/")
    .get(getAttendance)
    .delete(resetAttendance);

// GET /api/attendance/student/:studentId
router.get("/student/:studentId", getStudentAttendance);

// POST /api/attendance/mark
router.post("/mark", markAttendance);

// POST /api/attendance/bulk
router.post("/bulk", bulkMarkAttendance);

export default router;
