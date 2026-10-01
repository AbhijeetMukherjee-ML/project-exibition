import { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useApp } from '../context/AppContext';
import { getSocketURL, apiGetCurrentDetections } from '../services/api';

// How long after marking a student present before they can be re-marked.
const RE_MARK_COOLDOWN_MS = 8000;
// Drop a tracked box if no fresh detection has arrived within this window.
const STALE_MS = 3500;
// Minimum gap between recognition sweeps (keeps CPU sane with many crops).
const SWEEP_INTERVAL_MS = 250;
// TM image models are trained on 224×224 inputs.
const TM_INPUT = 224;

/**
 * Shared Teachable Machine recognition over the live YOLO feed.
 *
 * YOLO (Python) streams person bounding boxes via Socket.IO (`detection:update`).
 * For each live box we crop that region out of the MJPEG stream frame and run the
 * Teachable Machine model on the crop, so several people can be identified at once.
 * A confident match that maps to a registered student is marked present for `slot`.
 *
 * The TM model URL lives in AppContext (persisted to localStorage), so it can be
 * changed at any time and is shared across pages.
 *
 * @param {object}   opts
 * @param {string}   opts.slot          Attendance slot to mark (e.g. 'hostel', 'class1').
 * @param {React.RefObject<HTMLImageElement>} opts.streamImgRef  The live MJPEG <img>.
 */
export function useTmRecognition({ slot, streamImgRef }) {
  const {
    students,
    tmModelURL,
    setTmModelURL,
    classMappings,
    setClassMapping,
    markStudentPresent,
    showToast,
  } = useApp();

  const [modelStatus, setModelStatus] = useState('idle'); // idle | loading | ready | error
  const [modelError, setModelError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [threshold, setThreshold] = useState(0.85);
  const [running, setRunning] = useState(false);
  const [liveDetections, setLiveDetections] = useState({}); // trackId -> detection (+identity)
  const [lastMatch, setLastMatch] = useState(null);

  const modelRef = useRef(null);
  const timerRef = useRef(null);
  const runningRef = useRef(false);
  const cooldownRef = useRef({});
  const cropCanvasRef = useRef(null);
  const sweepingRef = useRef(false);

  const thresholdRef = useRef(threshold);
  const mappingsRef = useRef(classMappings);
  const slotRef = useRef(slot);
  const studentsRef = useRef(students);
  const detectionsRef = useRef({}); // mirror of liveDetections for the sweep loop

  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { mappingsRef.current = classMappings; }, [classMappings]);
  useEffect(() => { slotRef.current = slot; }, [slot]);
  useEffect(() => { studentsRef.current = students; }, [students]);
  useEffect(() => { detectionsRef.current = liveDetections; }, [liveDetections]);

  // ── Live YOLO boxes over Socket.IO ──────────────────────────────────────
  useEffect(() => {
    let socket;
    try {
      socket = io(getSocketURL(), { transports: ['websocket', 'polling'] });
      socket.on('detection:update', (d) => {
        if (!d || d.trackId === undefined || d.trackId === null) return;
        setLiveDetections(prev => ({
          ...prev,
          [d.trackId]: {
            ...prev[d.trackId],
            ...d,
            // Preserve a client-resolved identity across box updates that carry none.
            identity: d.identity || prev[d.trackId]?.identity || null,
            identityConfidence:
              d.identityConfidence || prev[d.trackId]?.identityConfidence || 0,
            receivedAt: Date.now(),
          },
        }));
      });
    } catch (err) {
      console.error('Socket.IO connection failed:', err);
    }
    return () => { if (socket) socket.disconnect(); };
  }, []);

  // Seed from any current detections, and prune stale boxes.
  useEffect(() => {
    apiGetCurrentDetections(10)
      .then(res => {
        if (res?.detections && Array.isArray(res.detections)) {
          const now = Date.now();
          const map = {};
          res.detections.forEach(d => { map[d.trackId] = { ...d, receivedAt: now }; });
          setLiveDetections(prev => ({ ...map, ...prev }));
        }
      })
      .catch(() => {});

    const prune = setInterval(() => {
      const cutoff = Date.now() - STALE_MS;
      setLiveDetections(prev => {
        let changed = false;
        const next = {};
        for (const [id, d] of Object.entries(prev)) {
          if (d.receivedAt >= cutoff) next[id] = d;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(prune);
  }, []);

  // ── Load the Teachable Machine model ────────────────────────────────────
  const loadModel = useCallback(async (urlArg) => {
    const tmImage = window.tmImage;
    if (!tmImage) {
      setModelStatus('error');
      setModelError('Teachable Machine runtime not found. Check your internet connection.');
      return;
    }
    const raw = (urlArg ?? tmModelURL ?? '').trim();
    if (!raw) {
      setModelStatus('error');
      setModelError('Paste your Teachable Machine model URL first.');
      return;
    }
    const base = raw.endsWith('/') ? raw : raw + '/';
    setModelStatus('loading');
    setModelError(null);
    try {
      const model = await tmImage.load(base + 'model.json', base + 'metadata.json');
      modelRef.current = model;
      const classLabels = model.getClassLabels();
      setLabels(classLabels);
      setTmModelURL(base);
      // Auto-map TM class labels to registered students by name / id.
      classLabels.forEach(label => {
        if (mappingsRef.current[label]) return;
        const norm = label.trim().toLowerCase();
        const match = studentsRef.current.find(s =>
          (s.name || '').toLowerCase() === norm ||
          (s.id || '').toLowerCase() === norm ||
          (s.studentId || '').toLowerCase() === norm
        );
        if (match) setClassMapping(label, match.id);
      });
      setModelStatus('ready');
      showToast('Model Loaded', `${classLabels.length} identity classes ready.`, 'success');
    } catch (err) {
      console.error(err);
      setModelStatus('error');
      setModelError('Could not load model. Check the URL and that sharing is public.');
      showToast('Model Error', 'Could not load the Teachable Machine model.', 'error');
    }
  }, [tmModelURL, setTmModelURL, setClassMapping, showToast]);

  // ── Recognition sweep: crop each YOLO box and classify it ───────────────
  const sweep = useCallback(async () => {
    if (sweepingRef.current) return;
    sweepingRef.current = true;
    try {
      const model = modelRef.current;
      const img = streamImgRef?.current;
      if (!model || !img || !img.naturalWidth) return;

      const nW = img.naturalWidth;
      const nH = img.naturalHeight;
      let canvas = cropCanvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = TM_INPUT;
        canvas.height = TM_INPUT;
        cropCanvasRef.current = canvas;
      }
      const ctx = canvas.getContext('2d');

      const dets = Object.values(detectionsRef.current);
      for (const d of dets) {
        const bb = d.boundingBox;
        if (!bb) continue;

        // Clamp the crop rectangle to the frame bounds.
        const sx = Math.max(0, Math.min(Number(bb.x), nW - 1));
        const sy = Math.max(0, Math.min(Number(bb.y), nH - 1));
        const sw = Math.max(1, Math.min(Number(bb.width), nW - sx));
        const sh = Math.max(1, Math.min(Number(bb.height), nH - sy));

        try {
          ctx.clearRect(0, 0, TM_INPUT, TM_INPUT);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TM_INPUT, TM_INPUT);
        } catch {
          continue; // tainted canvas / frame not ready
        }

        let preds;
        try {
          preds = await model.predict(canvas);
        } catch {
          continue;
        }
        if (!runningRef.current) return;

        const top = [...preds].sort((a, b) => b.probability - a.probability)[0];
        if (!top) continue;
        const conf = top.probability;
        const confident = conf >= thresholdRef.current;
        const studentId = mappingsRef.current[top.className];

        // Reflect the identity on the box for on-feed display.
        setLiveDetections(prev => {
          const existing = prev[d.trackId];
          if (!existing) return prev;
          return {
            ...prev,
            [d.trackId]: {
              ...existing,
              identity: confident ? top.className : existing.identity,
              identityConfidence: conf,
            },
          };
        });

        if (confident && studentId) {
          setLastMatch({ label: top.className, studentId, conf: `${(conf * 100).toFixed(1)}%` });
          const now = Date.now();
          const last = cooldownRef.current[studentId] || 0;
          if (now - last > RE_MARK_COOLDOWN_MS) {
            cooldownRef.current[studentId] = now;
            markStudentPresent(studentId, `${(conf * 100).toFixed(1)}%`, { slot: slotRef.current });
          }
        }
      }
    } finally {
      sweepingRef.current = false;
    }
  }, [streamImgRef, markStudentPresent]);

  const tick = useCallback(async () => {
    if (!runningRef.current) return;
    await sweep();
    if (!runningRef.current) return;
    timerRef.current = setTimeout(tick, SWEEP_INTERVAL_MS);
  }, [sweep]);

  const start = useCallback(() => {
    if (!modelRef.current) {
      showToast('Load a Model First', 'Paste your Teachable Machine URL and load the model.', 'warning');
      return false;
    }
    if (runningRef.current) return true;
    runningRef.current = true;
    setRunning(true);
    tick();
    return true;
  }, [tick, showToast]);

  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setLastMatch(null);
  }, []);

  useEffect(() => () => {
    runningRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    modelStatus,
    modelError,
    labels,
    threshold,
    setThreshold,
    running,
    liveDetections,
    lastMatch,
    loadModel,
    start,
    stop,
    tmModelURL,
  };
}

export default useTmRecognition;
