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
  X,
  UserPlus,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RE_MARK_COOLDOWN_MS = 8000;

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
  const absentStudents = students.length - presentStudents.length;
  const mappedCount = labels.filter(l => classMappings[l]).length;

  // Webcam
  useEffect(() => {
    let stream = null;
    if (webcamOn) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        .then(ms => {
          stream = ms;
          if (videoRef.current) videoRef.current.srcObject = ms;
          setWebcamError(null);
        })
        .catch(err => {
          console.error(err);
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
        const match = students.find(s => s.name.toLowerCase() === norm || s.id.toLowerCase() === norm);
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
              markStudentPresent(studentId, conf);
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
    if (!webcamOn) setWebcamOn(true);
    runningRef.current = true;
    setRunning(true);
    rafRef.current = requestAnimationFrame(predictLoop);
    showToast('Recognition Started', 'Watching live feed for enrolled faces…', 'info');
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
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    };
  }, []);

  const exportCSV = () => {
    const today = new Date().toISOString().split('T')[0];
    const rows = students.map(s => [s.id, s.name, s.room, s.present ? 'Present' : 'Absent', s.presentAt || ''].join(','));
    const csv = ['Student ID,Name,Room,Status,Marked At', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-${today}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('Exported', `Attendance CSV downloaded.`, 'success');
  };

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
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${running ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {running ? 'SCANNING' : 'IDLE'}
            </span>
          </div>
          <p className="text-xs text-slate-500">AI face recognition marks attendance automatically from the live camera feed.</p>
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
            onClick={resetAttendance}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={() => setWebcamOn(!webcamOn)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition ${webcamOn ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
          >
            {webcamOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            {webcamOn ? 'Camera On' : 'Camera Off'}
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

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Registered" value={students.length} icon={Users} />
        <StatCard label="Present" value={presentStudents.length} icon={UserCheck} accent="emerald" sub={`${students.length ? Math.round((presentStudents.length / students.length) * 100) : 0}%`} />
        <StatCard label="Absent" value={absentStudents} icon={Clock3} />
      </div>

      {/* MODEL + CAMERA */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

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
                  Model connected — {labels.length} classes, {mappedCount} mapped to students
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

          {/* Live camera */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${running ? 'text-emerald-400' : 'text-slate-500'}`} />
                <p className="text-xs font-bold text-white">Live Recognition Feed</p>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/30 border border-slate-800 text-[9px] font-mono text-slate-400">
                <CircleDot className={`w-2.5 h-2.5 ${running ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
                {running ? 'SCANNING' : 'STANDBY'}
              </span>
            </div>

            <div className="relative aspect-[4/3] bg-black overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />

              {!webcamOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <VideoOff className="w-7 h-7 text-slate-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Camera offline</p>
                  <p className="text-[10px] text-slate-600">Enable camera to start recognition</p>
                </div>
              )}

              {webcamOn && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-5 left-5 w-10 h-10 border-l-2 border-t-2 border-blue-400/80 rounded-tl-lg" />
                  <div className="absolute top-5 right-5 w-10 h-10 border-r-2 border-t-2 border-blue-400/80 rounded-tr-lg" />
                  <div className="absolute bottom-5 left-5 w-10 h-10 border-l-2 border-b-2 border-blue-400/80 rounded-bl-lg" />
                  <div className="absolute bottom-5 right-5 w-10 h-10 border-r-2 border-b-2 border-blue-400/80 rounded-br-lg" />
                  {running && (
                    <div className="absolute left-8 right-8 top-1/2 h-px bg-blue-400/50 shadow-[0_0_12px_rgba(96,165,250,0.7)]" />
                  )}
                </div>
              )}

              {running && lastMatch && (
                <div className="absolute left-4 right-4 bottom-4">
                  <div className={`rounded-xl border backdrop-blur-md shadow-2xl p-3 ${lastMatch.studentId ? 'bg-emerald-950/80 border-emerald-500/40' : 'bg-slate-950/85 border-slate-700'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${lastMatch.studentId ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                          {lastMatch.studentId
                            ? <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            : <ScanFace className="w-5 h-5 text-slate-400" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                            {lastMatch.studentId ? 'Attendance Marked ✓' : 'Unknown Face'}
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
        </div>

        {/* RIGHT — attendance list */}
        <div className="space-y-3">
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Attendance Roster</span>
              <span className="text-[9px] font-mono text-slate-500">{presentStudents.length}/{students.length}</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-800">
              {students.map(s => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                  <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{s.name}</p>
                    <p className="text-[9px] font-mono text-slate-600">{s.id} · R{s.room}</p>
                  </div>
                  <div className="shrink-0">
                    {s.present ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        PRESENT
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-600">ABSENT</span>
                    )}
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-xs text-slate-500">No students registered</p>
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
