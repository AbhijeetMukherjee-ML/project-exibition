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
  RotateCcw,
  Loader2,
  Users,
  Sparkles,
  UserPlus,
  X,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Re-mark cooldown per student (ms) so a single continuous detection
// doesn't spam logs — attendance is set once, then respected.
const RE_MARK_COOLDOWN_MS = 8000;

export default function FaceAttendancePage() {
  const {
    students,
    tmModelURL,
    setTmModelURL,
    classMappings,
    setClassMapping,
    markStudentPresent,
    markStudentAbsent,
    resetAttendance,
    showToast
  } = useApp();

  const [urlInput, setUrlInput] = useState(tmModelURL);
  const [modelStatus, setModelStatus] = useState('idle'); // idle | loading | ready | error
  const [modelError, setModelError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [running, setRunning] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [threshold, setThreshold] = useState(0.85);
  const [lastMatch, setLastMatch] = useState(null);
  const [manualSelectId, setManualSelectId] = useState('');

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const cooldownRef = useRef({});
  const thresholdRef = useRef(threshold);
  const mappingsRef = useRef(classMappings);

  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { mappingsRef.current = classMappings; }, [classMappings]);

  const presentStudents = students.filter(s => s.present);

  // ---------- Webcam ----------
  useEffect(() => {
    let stream = null;
    if (webcamOn) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
          setWebcamError(null);
        })
        .catch((err) => {
          console.error('Camera error:', err);
          setWebcamError('Camera access denied or unavailable.');
          setWebcamOn(false);
        });
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [webcamOn]);

  // ---------- Load Teachable Machine model ----------
  const loadModel = async () => {
    const tmImage = window.tmImage;
    if (!tmImage) {
      setModelStatus('error');
      setModelError('Teachable Machine runtime not loaded. Check your internet connection (the TF.js/TM scripts load from a CDN).');
      return;
    }
    const raw = urlInput.trim();
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

      // Auto-map any class whose label already matches a student name or ID.
      classLabels.forEach((label) => {
        if (classMappings[label]) return;
        const norm = label.trim().toLowerCase();
        const match = students.find(
          s => s.name.toLowerCase() === norm || s.id.toLowerCase() === norm
        );
        if (match) setClassMapping(label, match.id);
      });

      setModelStatus('ready');
      showToast('Model Loaded', `${classLabels.length} face classes ready for recognition.`, 'success');
    } catch (err) {
      console.error('TM load error:', err);
      setModelStatus('error');
      setModelError('Could not load the model. Double-check the URL (it should end with the model id and be publicly shared).');
    }
  };

  // ---------- Recognition loop ----------
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
              markStudentPresent(studentId, conf);
            }
          }
        }
      } catch (err) {
        console.error('Prediction error:', err);
      }
    }
    rafRef.current = requestAnimationFrame(predictLoop);
  }, [markStudentPresent]);

  const startRecognition = async () => {
    if (modelStatus !== 'ready') {
      showToast('Load a Model First', 'Paste your Teachable Machine URL and load the model.', 'warning');
      return;
    }
    if (!webcamOn) setWebcamOn(true);
    runningRef.current = true;
    setRunning(true);
    rafRef.current = requestAnimationFrame(predictLoop);
    showToast('Recognition Started', 'Watching the live feed for enrolled faces…', 'info');
  };

  const stopRecognition = () => {
    runningRef.current = false;
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPredictions([]);
    setLastMatch(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const mappedCount = labels.filter(l => classMappings[l]).length;

  // ---------- CSV attendance report ----------
  const exportAttendanceCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const esc = (v) => {
      const str = v === null || v === undefined ? '' : String(v);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const headers = [
      'Student ID', 'Name', 'Room', 'Block', 'Department', 'Status',
      'Present Today', 'Marked At', 'Last Confidence', 'Days Present', 'Attendance Dates'
    ];
    const rows = students.map((s) => {
      const dates = s.attendanceDates || [];
      const presentToday = s.present && s.presentDate === today;
      return [
        s.id, s.name, s.room, s.block, s.department, s.status,
        presentToday ? 'Yes' : 'No',
        presentToday ? (s.presentAt || '') : '',
        presentToday ? (s.lastRecognitionConfidence || '') : '',
        dates.length,
        dates.slice().sort().join(' | ')
      ].map(esc).join(',');
    });
    const summary = `Attendance Report,Generated ${new Date().toLocaleString()},Present Today: ${presentStudents.length}/${students.length}`;
    const csv = [summary, '', headers.join(','), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report Exported', `Attendance CSV for ${students.length} students downloaded.`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Facial Recognition Attendance</h2>
            <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono font-bold">
              <Sparkles className="w-3 h-3" /> TEACHABLE MACHINE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Recognized students are automatically marked <strong>present</strong> and logged.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportAttendanceCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Download attendance report as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setWebcamOn(!webcamOn)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              webcamOn
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {webcamOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            <span>{webcamOn ? 'Camera On' : 'Enable Camera'}</span>
          </button>

          {!running ? (
            <button
              onClick={startRecognition}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Start Recognition
            </button>
          ) : (
            <button
              onClick={stopRecognition}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Square className="w-3.5 h-3.5" /> Stop
            </button>
          )}
        </div>
      </div>

      {/* Model Setup */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Link2 className="w-3.5 h-3.5" /> Step 1 — Connect Teachable Machine Model
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://teachablemachine.withgoogle.com/models/XXXXXXXX/"
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={loadModel}
            disabled={modelStatus === 'loading'}
            className="px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
          >
            {modelStatus === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanFace className="w-3.5 h-3.5" />}
            {modelStatus === 'loading' ? 'Loading…' : 'Load Model'}
          </button>
        </div>

        {modelStatus === 'ready' && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Model ready — {labels.length} classes detected, {mappedCount} mapped to students.
          </div>
        )}
        {modelStatus === 'error' && (
          <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {modelError}
          </div>
        )}
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          In Teachable Machine: <strong>Export Model → Tensorflow.js → Upload (shareable link)</strong>, then paste the link above.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live camera + predictions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative w-full aspect-[4/3] max-h-[520px] rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            {!webcamOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                <VideoOff className="w-10 h-10" />
                <span className="text-xs font-mono">Camera off — enable it to begin</span>
              </div>
            )}

            {/* Live match overlay */}
            {running && lastMatch && (
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-sm border shadow-lg flex items-center gap-2 ${
                  lastMatch.studentId
                    ? 'bg-emerald-600/90 border-emerald-300/40 text-white'
                    : 'bg-black/80 border-white/10 text-slate-200'
                }`}>
                  <ScanFace className="w-3.5 h-3.5" />
                  <span className="font-bold">{lastMatch.label}</span>
                  <span>{lastMatch.conf}</span>
                  {!lastMatch.studentId && <span className="text-amber-300">(unmapped)</span>}
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SCANNING
                </div>
              </div>
            )}
          </div>

          {webcamError && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {webcamError}
            </div>
          )}

          {/* Confidence threshold + live prediction bars */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Predictions</span>
              <label className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                Match threshold: <strong className="text-slate-800 dark:text-slate-200 font-mono">{Math.round(threshold * 100)}%</strong>
                <input
                  type="range" min="0.5" max="0.99" step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-28 cursor-pointer accent-blue-600"
                />
              </label>
            </div>
            {predictions.length === 0 ? (
              <p className="text-xs text-slate-400">Start recognition to see live confidence scores.</p>
            ) : (
              <div className="space-y-1.5">
                {predictions.map((p) => {
                  const pct = Math.round(p.probability * 100);
                  const mapped = classMappings[p.className];
                  const over = p.probability >= threshold;
                  return (
                    <div key={p.className} className="flex items-center gap-2 text-[11px]">
                      <span className="w-28 truncate font-mono text-slate-600 dark:text-slate-300" title={p.className}>{p.className}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${over ? 'bg-emerald-500' : 'bg-blue-500/60'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-9 text-right font-mono text-slate-500 dark:text-slate-400">{pct}%</span>
                      {mapped && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: mapping + present list */}
        <div className="space-y-4">
          {/* Step 2 — map classes to students */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" /> Step 2 — Map Classes → Students
            </div>
            {labels.length === 0 ? (
              <p className="text-xs text-slate-400">Load a model to list its face classes here.</p>
            ) : (
              <div className="space-y-2">
                {labels.map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-24 truncate text-xs font-mono text-slate-700 dark:text-slate-300" title={label}>{label}</span>
                    <span className="text-slate-300 dark:text-slate-600">→</span>
                    <select
                      value={classMappings[label] || ''}
                      onChange={(e) => setClassMapping(label, e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">— Not a student (ignore) —</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Present today */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Present ({presentStudents.length}/{students.length})
              </div>
              <button
                onClick={resetAttendance}
                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                title="Reset all to absent"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            {/* Manual override — mark someone present without a scan */}
            <div className="flex items-center gap-2">
              <select
                value={manualSelectId}
                onChange={(e) => setManualSelectId(e.target.value)}
                className="flex-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Manually mark present…</option>
                {students.filter(s => !s.present).map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (!manualSelectId) return;
                  markStudentPresent(manualSelectId, null, { manual: true });
                  setManualSelectId('');
                }}
                disabled={!manualSelectId}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Mark selected student present"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {presentStudents.length === 0 ? (
              <p className="text-xs text-slate-400">No one marked present yet.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {presentStudents.map((s) => (
                  <div key={s.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                    <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-emerald-300 dark:border-emerald-700" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{s.presentAt}</p>
                    </div>
                    {s.lastRecognitionConfidence && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{s.lastRecognitionConfidence}</span>
                    )}
                    <button
                      onClick={() => markStudentAbsent(s.id)}
                      className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer flex-shrink-0"
                      title="Mark absent"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
