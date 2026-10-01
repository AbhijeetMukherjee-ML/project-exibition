import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanFace,
  Video,
  VideoOff,
  Play,
  Square,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Users,
  UserCheck,
  Clock3,
  Download,
  RotateCcw,
  Cpu,
  Activity,
  CircleDot,
  ShieldCheck,
  Check,
  X,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { io } from 'socket.io-client';
import {
  getSocketURL,
  apiGetCurrentDetections,
  apiStartCameraStream,
  apiStopCameraStream,
  apiGetCameraStreamStatus,
} from '../../services/api';

const RE_MARK_COOLDOWN_MS = 8000;

const CLASS_SLOTS = [
  { id: 'class1', label: 'Class 1', time: '09:00 - 09:50', subject: 'Data Structures' },
  { id: 'class2', label: 'Class 2', time: '10:00 - 10:50', subject: 'Operating Systems' },
  { id: 'class3', label: 'Class 3', time: '11:10 - 12:00', subject: 'Database Systems' },
  { id: 'class4', label: 'Class 4', time: '12:00 - 12:50', subject: 'Computer Networks' },
];

export default function ClassroomAttendancePage() {
  const {
    students,
    tmModelURL,
    setTmModelURL,
    classMappings,
    setClassMapping,
    markStudentPresent,
    markStudentAbsent,
    resetAttendance,
    showToast,
    activeClassSlot,
    setActiveClassSlot
  } = useApp();

  const [urlInput, setUrlInput] = useState(tmModelURL);
  const [modelStatus, setModelStatus] = useState('idle'); // idle | loading | ready | error
  const [modelError, setModelError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [running, setRunning] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false); // Closed by default
  const [isStartingStream, setIsStartingStream] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [streamAvailable, setStreamAvailable] = useState(false);
  const [frameDimensions, setFrameDimensions] = useState({ width: 640, height: 480 });
  const [liveDetections, setLiveDetections] = useState({});
  const [threshold, setThreshold] = useState(0.85);
  const [lastMatch, setLastMatch] = useState(null);

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const cooldownRef = useRef({});
  const thresholdRef = useRef(threshold);
  const mappingsRef = useRef(classMappings);
  const activeSlotRef = useRef(activeClassSlot);

  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { mappingsRef.current = classMappings; }, [classMappings]);
  useEffect(() => { activeSlotRef.current = activeClassSlot; }, [activeClassSlot]);

  // Attendance counts for currently selected class slot
  const slotPresentCount = students.filter(s => s[`${activeClassSlot}Attendance`] === 'present').length;
  const slotAbsentCount = students.length - slotPresentCount;
  const mappedCount = labels.filter(l => classMappings[l]).length;

  // Real-time YOLO detection listener via backend Socket.IO
  useEffect(() => {
    let socket;
    try {
      socket = io(getSocketURL(), { transports: ['websocket', 'polling'] });

      socket.on('detection:update', (detection) => {
        if (!detection || detection.trackId === undefined) return;
        setLiveDetections(prev => ({
          ...prev,
          [detection.trackId]: { ...detection, receivedAt: Date.now() }
        }));

        // When identity is provided, verify against student registry and mark DB
        if (detection.identity) {
          const matched = students.find(
            s =>
              (s.name || '').toLowerCase() === detection.identity.toLowerCase() ||
              s.id === detection.identity ||
              s.studentId === detection.identity
          );
          if (matched) {
            const conf = detection.identityConfidence > 0
              ? `${(detection.identityConfidence * 100).toFixed(1)}%`
              : 'AI Match';
            markStudentPresent(matched.id, conf, { slot: activeSlotRef.current });
          }
        }
      });
    } catch (err) {
      console.error('Socket.IO connection failed:', err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [students, markStudentPresent]);

  // Load current detections on mount & prune stale detections (> 3.5s without update)
  useEffect(() => {
    apiGetCurrentDetections(10)
      .then(res => {
        if (res?.detections && Array.isArray(res.detections)) {
          const map = {};
          const now = Date.now();
          res.detections.forEach(d => {
            map[d.trackId] = { ...d, receivedAt: now };
          });
          setLiveDetections(map);
        }
      })
      .catch(() => {});

    const pruneTimer = setInterval(() => {
      const cutoff = Date.now() - 3500;
      setLiveDetections(prev => {
        let changed = false;
        const next = {};
        for (const [id, d] of Object.entries(prev)) {
          if (d.receivedAt >= cutoff) {
            next[id] = d;
          } else {
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(pruneTimer);
  }, []);

  const [streamKey, setStreamKey] = useState(Date.now());

  // Ensure camera is closed/stopped by default when frontend loads
  useEffect(() => {
    setWebcamOn(false);
    apiGetCameraStreamStatus()
      .then(res => {
        if (res && res.running) {
          apiStopCameraStream().catch(() => {});
        }
      })
      .catch(() => {});

    const handleBeforeUnload = () => {
      fetch(`${getSocketURL()}/api/cameras/stream/stop`, {
        method: 'POST',
        keepalive: true,
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      apiStopCameraStream().catch(() => {});
    };
  }, []);

  // Request backend to start or stop Python YOLO Detector.py process
  const handleToggleFeed = async () => {
    if (!webcamOn) {
      setIsStartingStream(true);
      setWebcamError(null);
      try {
        const res = await apiStartCameraStream();
        if (res && res.running) {
          setStreamKey(Date.now());
          setWebcamOn(true);
          setStreamAvailable(true);
          showToast('AI Camera Online', 'Python YOLO detector active.', 'success');
        } else {
          throw new Error('AI detector failed to report ready state.');
        }
      } catch (err) {
        console.error('Failed to start AI stream:', err);
        setWebcamError(err.message || 'Failed to launch AI detector via backend service.');
        showToast('AI Camera Error', err.message || 'Failed to start AI detector.', 'error');
      } finally {
        setIsStartingStream(false);
      }
    } else {
      setWebcamOn(false);
      setStreamAvailable(false);
      try {
        await apiStopCameraStream();
        showToast('AI Camera Offline', 'Detector process stopped.', 'info');
      } catch (err) {
        console.error('Failed to stop AI stream:', err);
      }
    }
  };

  // Load model
  const loadModel = async () => {
    const tmImage = window.tmImage;
    if (!tmImage) {
      setModelStatus('error');
      setModelError('Teachable Machine runtime not found. Check internet connection.');
      return;
    }
    const raw = urlInput.trim();
    if (!raw) { setModelStatus('error'); setModelError('Paste your Teachable Machine model URL first.'); return; }
    const base = raw.endsWith('/') ? raw : raw + '/';
    setModelStatus('loading'); setModelError(null);
    try {
      const model = await tmImage.load(base + 'model.json', base + 'metadata.json');
      modelRef.current = model;
      const classLabels = model.getClassLabels();
      setLabels(classLabels);
      setTmModelURL(base);
      classLabels.forEach(label => {
        if (classMappings[label]) return;
        const norm = label.trim().toLowerCase();
        const match = students.find(s => (s.name || '').toLowerCase() === norm || s.id.toLowerCase() === norm);
        if (match) setClassMapping(label, match.id);
      });
      setModelStatus('ready');
      showToast('Model Loaded', `${classLabels.length} face classes ready.`, 'success');
    } catch (err) {
      console.error(err);
      setModelStatus('error');
      setModelError('Could not load model. Check the URL and sharing permissions.');
    }
  };

  // Recognition loop
  const predictLoop = useCallback(async () => {
    if (!runningRef.current) return;
    const model = modelRef.current;
    const video = videoRef.current;
    if (model && video && video.readyState >= 2) {
      try {
        const preds = await model.predict(video);
        const sorted = [...preds].sort((a, b) => b.probability - a.probability);
        setPredictions(sorted);
        const top = sorted[0];
        if (top && top.probability >= thresholdRef.current) {
          const studentId = mappingsRef.current[top.className];
          const conf = `${(top.probability * 100).toFixed(1)}%`;
          setLastMatch({ label: top.className, studentId, conf });
          if (studentId) {
            const now = Date.now();
            const last = cooldownRef.current[studentId] || 0;
            if (now - last > RE_MARK_COOLDOWN_MS) {
              cooldownRef.current[studentId] = now;
              markStudentPresent(studentId, conf, { slot: activeSlotRef.current });
            }
          }
        }
      } catch (err) { console.error(err); }
    }
    rafRef.current = requestAnimationFrame(predictLoop);
  }, [markStudentPresent]);

  const startRecognition = async () => {
    if (modelStatus !== 'ready') {
      showToast('Load a Model First', 'Paste your Teachable Machine URL and load the model.', 'warning');
      return;
    }
    if (!webcamOn) {
      await handleToggleFeed();
    }
    runningRef.current = true;
    setRunning(true);
    rafRef.current = requestAnimationFrame(predictLoop);
    showToast('Recognition Started', `Watching live feed for ${activeClassSlot.toUpperCase()} attendance…`, 'info');
  };

  const stopRecognition = () => {
    runningRef.current = false;
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPredictions([]); setLastMatch(null);
  };

  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const exportCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const rows = students.map(s => [
      s.studentId || s.id,
      `"${s.name}"`,
      s.room || '',
      s.class1Attendance || 'absent',
      s.class2Attendance || 'absent',
      s.class3Attendance || 'absent',
      s.class4Attendance || 'absent',
      s.hostelAttendance || 'absent'
    ].join(','));
    const csv = ['Student ID,Name,Room,Class 1,Class 2,Class 3,Class 4,Hostel Attendance', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-daywise-${today}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('Exported', `Day-wise attendance CSV downloaded.`, 'success');
  };

  const activeSlotInfo = CLASS_SLOTS.find(s => s.id === activeClassSlot) || CLASS_SLOTS[0];

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Classroom Attendance</h2>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${webcamOn && !webcamError ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : isStartingStream ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-400 animate-pulse' : isStartingStream ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`} />
              {isStartingStream ? 'INITIALIZING AI' : webcamOn && !webcamError ? 'AI CAMERA LIVE' : 'FEED OFFLINE'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            AI face recognition updates {activeSlotInfo.label} ({activeSlotInfo.subject}) in the database per day-wise.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 cursor-pointer transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={() => resetAttendance()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Today
          </button>

          <button
            onClick={handleToggleFeed}
            disabled={isStartingStream}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition ${
              webcamOn
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            } ${isStartingStream ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isStartingStream ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : webcamOn ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <VideoOff className="w-3.5 h-3.5" />
            )}
            {isStartingStream ? 'Starting AI...' : webcamOn ? 'AI Feed Active' : 'Enable AI Feed'}
          </button>

          {!running ? (
            <button onClick={startRecognition} className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition">
              <Play className="w-3.5 h-3.5" />
              Start Scan
            </button>
          ) : (
            <button onClick={stopRecognition} className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition">
              <Square className="w-3.5 h-3.5" />
              Stop Scan
            </button>
          )}
        </div>
      </div>

      {/* CLASS PERIOD SELECTOR */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[#0b1320] border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          Select Class Period:
        </span>
        {CLASS_SLOTS.map(slot => {
          const isSelected = activeClassSlot === slot.id;
          const count = students.filter(s => s[`${slot.id}Attendance`] === 'present').length;
          return (
            <button
              key={slot.id}
              onClick={() => setActiveClassSlot(slot.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{slot.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                {count}/{students.length}
              </span>
              <span className="text-[10px] opacity-75 hidden md:inline">({slot.subject})</span>
            </button>
          );
        })}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Registered Students" value={students.length} icon={Users} />
        <StatCard
          label={`${activeSlotInfo.label} Present`}
          value={slotPresentCount}
          icon={UserCheck}
          accent="emerald"
          sub={`${students.length ? Math.round((slotPresentCount / students.length) * 100) : 0}%`}
        />
        <StatCard label={`${activeSlotInfo.label} Absent`} value={slotAbsentCount} icon={Clock3} />
      </div>

      {/* MODEL + CAMERA */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        {/* LEFT — camera + model */}
        <div className="space-y-4">
          {/* Model URL */}
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-200">AI Recognition Model</span>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${modelStatus === 'ready' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : modelStatus === 'error' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-slate-400 border-slate-700 bg-slate-800'}`}>
                {modelStatus === 'ready' ? `${labels.length} CLASSES` : modelStatus === 'loading' ? 'LOADING…' : modelStatus === 'error' ? 'ERROR' : 'NOT LOADED'}
              </span>
            </div>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://teachablemachine.withgoogle.com/models/XXXXXXXX/"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
                <button
                  onClick={loadModel}
                  disabled={modelStatus === 'loading'}
                  className="sm:w-32 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                >
                  {modelStatus === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanFace className="w-3.5 h-3.5" />}
                  {modelStatus === 'loading' ? 'Loading…' : 'Load Model'}
                </button>
              </div>
              {modelStatus === 'ready' && (
                <p className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Model connected — {labels.length} classes, {mappedCount} mapped to DB students
                </p>
              )}
              {modelStatus === 'error' && (
                <p className="mt-2 text-[11px] text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {modelError}
                </p>
              )}
            </div>
          </div>

          {/* AI Live Camera & Detection Stream */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${webcamOn && !webcamError ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div>
                  <p className="text-xs font-bold text-white">AI Camera Feed</p>
                  <p className="text-[9px] text-slate-500 font-mono">YOLO · Python AI · camera-1 · Target: {activeSlotInfo.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 border border-slate-800 text-[9px] font-mono text-emerald-400 font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {webcamOn && !webcamError ? 'LIVE' : 'OFFLINE'}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-400 font-bold">
                  <CircleDot className="w-2.5 h-2.5 text-indigo-400" />
                  YOLO ACTIVE
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-black overflow-hidden">
              <video ref={videoRef} className="hidden" />

              {webcamOn ? (
                <img
                  key={streamKey}
                  src={`http://localhost:5001/video?t=${streamKey}`}
                  alt="YOLO AI Video Stream"
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    setStreamAvailable(true);
                    setWebcamError(null);
                    if (e.target.naturalWidth && e.target.naturalHeight) {
                      setFrameDimensions({
                        width: e.target.naturalWidth,
                        height: e.target.naturalHeight
                      });
                    }
                  }}
                  onError={() => {
                    setStreamAvailable(false);
                    setWebcamError('AI video stream unavailable at http://localhost:5001/video. Ensure the Python YOLO detector is running on port 5001.');
                  }}
                />
              ) : isStartingStream ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">Starting AI Camera Process...</p>
                  <p className="text-[10px] text-slate-500 font-mono">Launching YOLO detector via backend service</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <VideoOff className="w-7 h-7 text-slate-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">AI Feed Offline</p>
                  <p className="text-[10px] text-slate-600">Enable AI feed to launch camera & begin monitoring</p>
                </div>
              )}

              {/* Feed error overlay */}
              {webcamOn && webcamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/90 text-center gap-2 z-20">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mb-1" />
                  <p className="text-sm font-semibold text-slate-200">AI Camera Feed Offline</p>
                  <p className="text-xs text-slate-400 max-w-sm">{webcamError}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-2">Expected stream: http://localhost:5001/video</p>
                </div>
              )}

              {/* Scanner HUD Corners */}
              {webcamOn && !webcamError && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute top-5 left-5 w-10 h-10 border-l-2 border-t-2 border-blue-400/80 rounded-tl-lg" />
                  <div className="absolute top-5 right-5 w-10 h-10 border-r-2 border-t-2 border-blue-400/80 rounded-tr-lg" />
                  <div className="absolute bottom-5 left-5 w-10 h-10 border-l-2 border-b-2 border-blue-400/80 rounded-bl-lg" />
                  <div className="absolute bottom-5 right-5 w-10 h-10 border-r-2 border-b-2 border-blue-400/80 rounded-br-lg" />
                  {running && (
                    <div className="absolute left-8 right-8 top-1/2 h-px bg-blue-400/50 shadow-[0_0_12px_rgba(96,165,250,0.7)]" />
                  )}
                </div>
              )}

              {/* Match overlay */}
              {running && lastMatch && (
                <div className="absolute left-4 right-4 bottom-4 z-10">
                  <div className={`rounded-xl border backdrop-blur-md shadow-2xl p-3 ${lastMatch.studentId ? 'bg-emerald-950/80 border-emerald-500/40' : 'bg-slate-950/85 border-slate-700'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${lastMatch.studentId ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                          {lastMatch.studentId ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ScanFace className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                            {lastMatch.studentId ? `${activeSlotInfo.label} Attendance Marked in DB ✓` : 'Unknown Face'}
                          </p>
                          <p className="text-sm font-bold text-white truncate">{lastMatch.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-500">Confidence</p>
                        <p className={`text-lg font-bold font-mono ${lastMatch.studentId ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {lastMatch.conf}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active YOLO Detections Status */}
          {webcamOn && Object.keys(liveDetections).length > 0 && (
            <div className="bg-[#0b1320] border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Live Tracked Persons ({Object.keys(liveDetections).length})
                </span>
                <span className="text-[9px] font-mono text-emerald-400">REAL-TIME</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(liveDetections).map(d => {
                  const hasId = Boolean(d.identity || d.personId?.name);
                  const name = d.identity || d.personId?.name || `Person #${d.trackId}`;
                  return (
                    <div
                      key={d.trackId}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
                        hasId ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${hasId ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                      <span>{name}</span>
                      <span className="text-[10px] opacity-70">
                        {d.identityConfidence > 0
                          ? `${Math.round(d.identityConfidence * 100)}%`
                          : `${Math.round((d.detectionConfidence || 0) * 100)}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — attendance roster for selected class slot */}
        <div className="space-y-3">
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">{activeSlotInfo.label} Roster</span>
                <span className="text-[9px] text-slate-500 ml-2">({activeSlotInfo.subject})</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">{slotPresentCount}/{students.length}</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-800">
              {students.map(s => {
                const sid = s.studentId || s.id;
                const isSlotPresent = s[`${activeClassSlot}Attendance`] === 'present';
                return (
                  <div key={sid} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-900/40 transition">
                    <img
                      src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=2563eb&color=fff&size=256&bold=true`}
                      alt={s.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{s.name}</p>
                      <p className="text-[9px] font-mono text-slate-600">{sid} · R{s.room}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (isSlotPresent) {
                            markStudentAbsent(sid, { slot: activeClassSlot });
                          } else {
                            markStudentPresent(sid, null, { slot: activeClassSlot, manual: true });
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition cursor-pointer border ${
                          isSlotPresent
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                        }`}
                        title="Click to toggle attendance in DB"
                      >
                        {isSlotPresent ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>PRESENT</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 opacity-50" />
                            <span>ABSENT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
              {students.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-xs text-slate-500">No students registered in database</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = 'slate', sub }) {
  const accentMap = {
    emerald: 'text-emerald-400 border-emerald-900/40',
    slate: 'text-slate-400 border-slate-800'
  };
  return (
    <div className={`p-4 bg-[#0b1320] border rounded-xl ${accentMap[accent] || accentMap.slate}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${accent === 'emerald' ? 'text-emerald-500' : 'text-slate-500'}`} />
      </div>
      <p className={`text-2xl font-bold font-mono ${accent === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub} attendance rate</p>}
    </div>
  );
}
