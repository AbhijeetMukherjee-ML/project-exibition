import { asyncHandler } from "../middleware/errorMiddleware.js";
import attendanceService from "../services/attendanceService.js";

// GET /api/attendance?studentId=&date=&type=&periodId=
export const getAttendance = asyncHandler(async (req, res) => {
    const { studentId, date, type, periodId } = req.query;
    const records = await attendanceService.getRecords({ studentId, date, type, periodId });
    res.json(records);
});

// GET /api/attendance/student/:studentId
export const getStudentAttendance = asyncHandler(async (req, res) => {
    const records = await attendanceService.getStudentAttendance(req.params.studentId);
    res.json(records);
});

// POST /api/attendance/mark  — upsert a single attendance record
export const markAttendance = asyncHandler(async (req, res) => {
    const record = await attendanceService.upsertRecord(req.body);
    res.status(200).json(record);
});

// POST /api/attendance/bulk  — bulk upsert (e.g., finalize period → mark absents)
export const bulkMarkAttendance = asyncHandler(async (req, res) => {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ message: "records[] array is required" });
    }
    const result = await attendanceService.bulkUpsert(records);
    res.json({ message: "Bulk attendance updated", result });
});

// DELETE /api/attendance?studentId=&date=&type=&periodId=
export const resetAttendance = asyncHandler(async (req, res) => {
    const { studentId, date, type, periodId } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (date)      filter.date      = date;
    if (type)      filter.type      = type;
    if (periodId)  filter.periodId  = periodId;
    const result = await attendanceService.deleteRecords(filter);
    res.json({ message: "Attendance records deleted", deleted: result.deletedCount });
});

export default { getAttendance, getStudentAttendance, markAttendance, bulkMarkAttendance, resetAttendance };
