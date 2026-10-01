// ============================================================
// API SERVICE — AEGIS BACKEND
// ============================================================
// Base URL: http://localhost:4000  (VITE_API_URL env var)
//
// Endpoints:
//   /api/health
//   /api/cameras          Camera CRUD
//   /api/persons          Person CRUD (AI face registry)
//   /api/detections       YOLO detection feed
//   /api/students         Student registry CRUD
//   /api/attendance       Attendance records (hostel + classroom)
//
// Socket.IO events (server → client):
//   detection:update  payload: Detection
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── helpers ────────────────────────────────────────────────

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const get    = (path)        => request('GET',    path);
const post   = (path, body)  => request('POST',   path, body);
const patch  = (path, body)  => request('PATCH',  path, body);
const del    = (path)        => request('DELETE', path);

// ─── health ─────────────────────────────────────────────────

export const apiHealth = () => get('/api/health');

// ─── cameras ────────────────────────────────────────────────

export const apiGetCameras            = (status)   => get(`/api/cameras${status ? `?status=${status}` : ''}`);
export const apiGetCamera             = (id)       => get(`/api/cameras/${id}`);
export const apiCreateCamera          = (data)     => post('/api/cameras', data);
export const apiUpdateCamera          = (id, data) => patch(`/api/cameras/${id}`, data);
export const apiDeleteCamera          = (id)       => del(`/api/cameras/${id}`);
export const apiStartCameraStream     = ()         => post('/api/cameras/stream/start');
export const apiStopCameraStream      = ()         => post('/api/cameras/stream/stop');
export const apiGetCameraStreamStatus = ()         => get('/api/cameras/stream/status');

// ─── persons ────────────────────────────────────────────────

export const apiGetPersons   = ()          => get('/api/persons');
export const apiGetPerson    = (id)        => get(`/api/persons/${id}`);
export const apiCreatePerson = (data)      => post('/api/persons', data);
export const apiUpdatePerson = (id, data)  => patch(`/api/persons/${id}`, data);
export const apiDeletePerson = (id)        => del(`/api/persons/${id}`);

// ─── detections ─────────────────────────────────────────────

export const apiGetCurrentDetections = (windowSeconds, cameraId) => {
  const params = new URLSearchParams();
  if (windowSeconds) params.set('window', windowSeconds);
  if (cameraId)      params.set('cameraId', cameraId);
  const qs = params.toString();
  return get(`/api/detections/current${qs ? `?${qs}` : ''}`);
};

export const apiGetDetections = (filter = {}, options = {}) => {
  const params = new URLSearchParams();
  if (filter.cameraId)  params.set('cameraId',  filter.cameraId);
  if (filter.trackId)   params.set('trackId',   filter.trackId);
  if (filter.identity)  params.set('identity',  filter.identity);
  if (filter.from)      params.set('from',      filter.from);
  if (filter.to)        params.set('to',        filter.to);
  if (options.limit)    params.set('limit',     options.limit);
  if (options.skip)     params.set('skip',      options.skip);
  const qs = params.toString();
  return get(`/api/detections${qs ? `?${qs}` : ''}`);
};

export const apiGetDetection    = (id)        => get(`/api/detections/${id}`);
export const apiCreateDetection = (data)      => post('/api/detections', data);
export const apiUpdateDetection = (id, data)  => patch(`/api/detections/${id}`, data);
export const apiDeleteDetection = (id)        => del(`/api/detections/${id}`);

// ─── students ────────────────────────────────────────────────
// GET /api/students         → Student[]
// POST /api/students        → Student
// GET /api/students/:id     → Student
// PATCH /api/students/:id   → Student
// DELETE /api/students/:id  → { message, student }

export const apiGetStudents   = (filter = {}) => {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.block)  params.set('block',  filter.block);
  const qs = params.toString();
  return get(`/api/students${qs ? `?${qs}` : ''}`);
};

export const apiGetStudent    = (id)        => get(`/api/students/${id}`);
export const apiCreateStudent = (data)      => post('/api/students', data);
export const apiUpdateStudent = (id, data)  => patch(`/api/students/${id}`, data);
export const apiDeleteStudent = (id)        => del(`/api/students/${id}`);

// ─── attendance ──────────────────────────────────────────────
// GET  /api/attendance?studentId=&date=&type=&periodId=
// POST /api/attendance/mark     → upsert one record
// POST /api/attendance/bulk     → bulk upsert
// GET  /api/attendance/student/:studentId → all records for student
// DELETE /api/attendance?studentId=&date=&type=

export const apiGetAttendance = (filter = {}) => {
  const params = new URLSearchParams();
  if (filter.studentId) params.set('studentId', filter.studentId);
  if (filter.date)      params.set('date',      filter.date);
  if (filter.type)      params.set('type',      filter.type);
  if (filter.periodId)  params.set('periodId',  filter.periodId);
  const qs = params.toString();
  return get(`/api/attendance${qs ? `?${qs}` : ''}`);
};

export const apiGetStudentAttendance = (studentId) =>
  get(`/api/attendance/student/${studentId}`);

export const apiMarkAttendance = (record) => post('/api/attendance/mark', record);

export const apiBulkMarkAttendance = (records) =>
  post('/api/attendance/bulk', { records });

export const apiResetAttendance = (filter = {}) => {
  const params = new URLSearchParams();
  if (filter.studentId) params.set('studentId', filter.studentId);
  if (filter.date)      params.set('date',      filter.date);
  if (filter.type)      params.set('type',      filter.type);
  if (filter.periodId)  params.set('periodId',  filter.periodId);
  const qs = params.toString();
  return request('DELETE', `/api/attendance${qs ? `?${qs}` : ''}`);
};

// ─── Socket.IO ──────────────────────────────────────────────

export const getSocketURL = () => BASE_URL;

export default {
  BASE_URL,
  getSocketURL,
  apiHealth,
  // cameras
  apiGetCameras, apiGetCamera, apiCreateCamera, apiUpdateCamera, apiDeleteCamera,
  apiStartCameraStream, apiStopCameraStream, apiGetCameraStreamStatus,
  // persons
  apiGetPersons, apiGetPerson, apiCreatePerson, apiUpdatePerson, apiDeletePerson,
  // detections
  apiGetCurrentDetections, apiGetDetections, apiGetDetection,
  apiCreateDetection, apiUpdateDetection, apiDeleteDetection,
  // students
  apiGetStudents, apiGetStudent, apiCreateStudent, apiUpdateStudent, apiDeleteStudent,
  // attendance
  apiGetAttendance, apiGetStudentAttendance, apiMarkAttendance,
  apiBulkMarkAttendance, apiResetAttendance,
};
