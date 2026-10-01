import { asyncHandler } from "../middleware/errorMiddleware.js";
import studentService from "../services/studentService.js";

export const getStudents = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.block)  filter.block  = req.query.block;
    const students = await studentService.getAllStudents(filter);
    res.json(students);
});

export const getStudent = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);
    res.json(student);
});

export const createStudent = asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
});

export const updateStudent = asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json(student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
    const deleted = await studentService.deleteStudent(req.params.id);
    res.json({ message: "Student deleted successfully", student: deleted });
});

export default { getStudents, getStudent, createStudent, updateStudent, deleteStudent };
