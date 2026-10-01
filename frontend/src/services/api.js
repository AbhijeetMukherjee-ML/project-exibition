// ============================================================
// API SERVICE — SENTINEL BACKEND
// ============================================================
// Single source of truth for the backend base URL.
// All fetch/Socket.IO calls MUST go through this file.
//
// Backend base:  http://localhost:4000   (process.env.VITE_API_URL)
// Endpoints:
//   GET  /api/health
//   GET  /api/cameras              → Camera[]
//   POST /api/cameras              → Camera
//   GET  /api/cameras/:id          → Camera
//   PATCH /api/cameras/:id         → Camera
//   DELETE /api/cameras/:id        → { message, camera }
//
//   GET  /api/persons              → Person[]
//   POST /api/persons              → Person
//   GET  /api/persons/:id          → Person
//   PATCH /api/persons/:id         → Person
//   DELETE /api/persons/:id        → { message, person }
//
//   GET  /api/detections           → { total, limit, skip, detections[] }
//   POST /api/detections           → Detection
//   GET  /api/detections/current   → { timestamp, windowSeconds, count, detections[] }
//   GET  /api/detections/:id       → Detection
//   PATCH /api/detections/:id      → Detection
//   DELETE /api/detections/:id     → { message, detection }
//
// Socket.IO events (server → client):
//   detection:update  payload: Detection (populated with personId.name/externalId)
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

const get    = (path)             => request('GET',    path);
const post   = (path, body)       => request('POST',   path, body);
const patch  = (path, body)       => request('PATCH',  path, body);
const del    = (path)             => request('DELETE', path);

// ─── health ─────────────────────────────────────────────────

export const apiHealth = () => get('/api/health');

// ─── cameras ────────────────────────────────────────────────
// Response shapes follow the backend exactly:
//   GET /api/cameras  → Camera[]  (plain array)
//   Each Camera: { _id, name, cameraId, location, status, createdAt, updatedAt }

export const apiGetCameras   = (status)    => get(`/api/cameras${status ? `?status=${status}` : ''}`);
export const apiGetCamera    = (id)        => get(`/api/cameras/${id}`);
export const apiCreateCamera = (data)      => post('/api/cameras', data);
export const apiUpdateCamera = (id, data)  => patch(`/api/cameras/${id}`, data);
export const apiDeleteCamera = (id)        => del(`/api/cameras/${id}`);
export const apiStartCameraStream = ()     => post('/api/cameras/stream/start');
export const apiStopCameraStream  = ()     => post('/api/cameras/stream/stop');
export const apiGetCameraStreamStatus = () => get('/api/cameras/stream/status');

// ─── persons ────────────────────────────────────────────────
// Response shapes follow the backend exactly:
//   GET /api/persons  → Person[]  (plain array)
//   Each Person: { _id, name, externalId, createdAt, updatedAt }

export const apiGetPersons   = ()          => get('/api/persons');
export const apiGetPerson    = (id)        => get(`/api/persons/${id}`);
export const apiCreatePerson = (data)      => post('/api/persons', data);
export const apiUpdatePerson = (id, data)  => patch(`/api/persons/${id}`, data);
export const apiDeletePerson = (id)        => del(`/api/persons/${id}`);

// ─── detections ─────────────────────────────────────────────
// Response shapes follow the backend exactly:
//
//   GET /api/detections → { total, limit, skip, detections[] }
//   Query params: cameraId, trackId, identity, from, to, limit, skip
//
//   GET /api/detections/current → { timestamp, windowSeconds, count, detections[] }
//   Query params: window (seconds, default 30), cameraId
//
//   Each Detection:
//   { _id, cameraId, trackId, personId (populated: {_id,name,externalId}|null),
//     identity, identityConfidence, detectionConfidence,
//     boundingBox: { x, y, width, height },
//     firstSeen, lastSeen, createdAt, updatedAt }

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

// ─── Socket.IO connection ────────────────────────────────────
// The backend socket.js emits exactly one event:
//   'detection:update'  →  Detection (populated)
//
// Usage:
//   import { createSocket } from './services/api';
//   const socket = createSocket();
//   socket.on('detection:update', (detection) => { ... });
//   // cleanup:
//   socket.disconnect();

export const getSocketURL = () => BASE_URL;

export default {
  BASE_URL,
  getSocketURL,
  apiHealth,
  // cameras
  apiGetCameras,
  apiGetCamera,
  apiCreateCamera,
  apiUpdateCamera,
  apiDeleteCamera,
  apiStartCameraStream,
  apiStopCameraStream,
  apiGetCameraStreamStatus,
  // persons
  apiGetPersons,
  apiGetPerson,
  apiCreatePerson,
  apiUpdatePerson,
  apiDeletePerson,
  // detections
  apiGetCurrentDetections,
  apiGetDetections,
  apiGetDetection,
  apiCreateDetection,
  apiUpdateDetection,
  apiDeleteDetection,
};
