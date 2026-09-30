import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanFace, Video, VideoOff, Play, Square, Link2, CheckCircle2,
  AlertTriangle, Loader2, Clock, UserCheck, UserX, Timer, Download,
  RotateCcw, Lock
} from 'lucide-react';
import { useClassroom, cutoffLabel, cutoffMinutes } from '../../context/ClassroomContext';

const RE_MARK_COOLDOWN_MS = 8000;

const STATUS_STYLES = {
  present: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
  late: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
  absent: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
  pending: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
};

export default function LiveAttendancePage() {
  const {
    students, periods, activePeriod, activePeriodId, setActivePeriodId,
    getStatus, recordFor, recognizeStudent, setStatusManual,
    finalizePeriod, resetPeriod, activeCounts, exportCSV,
    tmModelURL, setTmModelURL, classMappings
  } = useClassroom();

  const [urlInput, setUrlInput] = useState(tmModelURL);
  const [modelStatus, setModelStatus] = useState('idle');
  const [modelError, setModelError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [running, setRunning] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [threshold, setThreshold] = useState(0.85);
  const [now, setNow] = useState(new Date());

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const cooldownRef = useRef({});
  const thresholdRef = useRef(threshold);
  const mappingsRef = useRef(classMappings);
  const finalizedRef = useRef({});

  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { mappingsRef.current = classMappings; }, [classMappings]);

  // Ticking clock — drives the cutoff countdown and auto-finalize.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-mark absentees once the cutoff for the active period passes.
  useEffect(() => {
    const mins = now.getHours() * 60 + now.getMinutes();
    if (activePeriod && mins > cutoffMinutes(activePeriod) && !finalizedRef.current[activePeriodId]) {
      finalizedRef.current[activePeriodId] = true;
      finalizePeriod(activePeriodId);
    }
  }, [now, activePeriod, activePeriodId, finalizePeriod]);

  // Webcam
  useEffect(() => {
    let stream = null;
    if (webcamOn) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        .then((s) => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; setWebcamError(null); })
        .catch((err) => { console.error(err); setWebcamError('Camera access denied or unavailable.'); setWebcamOn(false); });
    } else if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [webcamOn]);

  const loadModel = useCallback(async () => {
    const tmImage = window.tmImage;
    if (!tmImage) { setModelStatus('error'); setModelError('Teachable Machine runtime not loaded (check internet — it loads from a CDN).'); return; }
    const raw = urlInput.trim();
    if (!raw) { setModelStatus('error'); setModelError('Paste your Teachable Machine model URL first.'); return; }
    const base = raw.endsWith('/') ? raw : raw + '/';
    setModelStatus('loading'); setModelError(null);
    try {
      const model = await tmImage.load(base + 'model.json', base + 'metadata.json');
      modelRef.current = model;
      setLabels(model.getClassLabels());
      setTmModelURL(base);
      setModelStatus('ready');
    } catch (err) {
      console.error(err); setModelStatus('error');
      setModelError('Could not load the model. Check the URL is correct and publicly shared.');
    }
  }, [urlInput, setTmModelURL]);

  // Auto-load the preset model on mount.
  useEffect(() => { loadModel(); /* eslint-disable-next-line */ }, []);

  const predictLoop = useCallback(async () => {
    if (!runningRef.current) return;
    const model = modelRef.current, video = videoRef.current;
    if (model && video && video.readyState >= 2) {
      try {
        const preds = await model.predict(video);
        const sorted = [...preds].sort((a, b) => b.probability - a.probability);
        setPredictions(sorted);
        const top = sorted[0];
        if (top && top.probability >= thresholdRef.current) {
          const studentId = mappingsRef.current[top.className];
          if (studentId) {
            const nowT = Date.now();
            if (nowT - (cooldownRef.current[studentId] || 0) > RE_MARK_COOLDOWN_MS) {
              cooldownRef.current[studentId] = nowT;
              recognizeStudent(studentId, `${(top.probability * 100).toFixed(1)}%`);
            }
          }
        }
      } catch (err) { console.error(err); }
    }
    rafRef.current = requestAnimationFrame(predictLoop);
  }, [recognizeStudent]);

  const startRecognition = async () => {
    if (modelStatus !== 'ready') { loadModel(); return; }
    if (!webcamOn) setWebcamOn(true);
    runningRef.current = true; setRunning(true);
    rafRef.current = requestAnimationFrame(predictLoop);
  };
  const stopRecognition = () => {
    runningRef.current = false; setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPredictions([]);
  };

  useEffect(() => () => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
  }, []);

  const minsNow = now.getHours() * 60 + now.getMinutes();
  const cutoff = activePeriod ? cutoffMinutes(activePeriod) : 0;
  const minsToCutoff = cutoff - minsNow;
  const cutoffPassed = minsNow > cutoff;

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Select Period
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Now: {now.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map((p) => {
            const isActive = p.id === activePeriodId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePeriodId(p.id)}
                className={`px-3 py-2 rounded-lg text-left transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="block text-xs font-bold truncate max-w-[180px]">{p.subject}</span>
                <span className={`block text-[10px] font-mono ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {p.startTime}–{p.endTime} • {p.room}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active period banner + cutoff countdown */}
      {activePeriod && (
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{activePeriod.subject}</h2>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{activePeriod.teacher}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Class {activePeriod.startTime} • On-time until <strong className="text-slate-700 dark:text-slate-300">{cutoffLabel(activePeriod)}</strong> ({activePeriod.graceMinutes} min grace) • Ends {activePeriod.endTime}
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border ${
            cutoffPassed
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            {cutoffPassed
              ? 'Cutoff passed — late arrivals only'
              : `On-time window closes in ${minsToCutoff} min`}
          </div>
        </div>
      )}

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Present', value: activeCounts.present, cls: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Late', value: activeCounts.late, cls: 'text-amber-600 dark:text-amber-400' },
          { label: 'Absent', value: activeCounts.absent, cls: 'text-rose-600 dark:text-rose-400' },
          { label: 'Pending', value: activeCounts.pending, cls: 'text-slate-500 dark:text-slate-400' }
        ].map((s) => (
          <div key={s.label} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className={`text-2xl font-bold font-mono ${s.cls}`}>{s.value}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setWebcamOn(!webcamOn)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${webcamOn ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          {webcamOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          {webcamOn ? 'Camera On' : 'Enable Camera'}
        </button>
        {!running ? (
          <button onClick={startRecognition} className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Play className="w-3.5 h-3.5" /> Start Recognition
          </button>
        ) : (
          <button onClick={stopRecognition} className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        )}
        <div className="flex-1" />
        <button onClick={() => finalizePeriod(activePeriodId)} className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer" title="Mark everyone not yet seen as absent">
          <Lock className="w-3.5 h-3.5" /> Close Period
        </button>
        <button onClick={exportCSV} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
        <button onClick={() => resetPeriod(activePeriodId)} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Camera */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative w-full aspect-[4/3] max-h-[460px] rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
            {!webcamOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
                <VideoOff className="w-10 h-10" />
                <span className="text-xs font-mono">Camera off — enable it to take attendance</span>
              </div>
            )}
            {running && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SCANNING
              </div>
            )}
          </div>

          {webcamError && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {webcamError}
            </div>
          )}

          {/* Model status + predictions */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" /> Recognition Model
              </span>
              <label className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                Threshold <strong className="font-mono text-slate-800 dark:text-slate-200">{Math.round(threshold * 100)}%</strong>
                <input type="range" min="0.5" max="0.99" step="0.01" value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-24 cursor-pointer accent-blue-600" />
              </label>
            </div>
            <div className="flex gap-2">
              <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500" />
              <button onClick={loadModel} disabled={modelStatus === 'loading'} className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
                {modelStatus === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanFace className="w-3.5 h-3.5" />}
                Load
              </button>
            </div>
            {modelStatus === 'ready' && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Model ready — {labels.length} faces enrolled.</p>}
            {modelStatus === 'error' && <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {modelError}</p>}
            {predictions.length > 0 && (
              <div className="space-y-1 pt-1">
                {predictions.map((p) => {
                  const pct = Math.round(p.probability * 100);
                  const over = p.probability >= threshold;
                  return (
                    <div key={p.className} className="flex items-center gap-2 text-[11px]">
                      <span className="w-24 truncate font-mono text-slate-600 dark:text-slate-300">{p.className}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${over ? 'bg-emerald-500' : 'bg-blue-500/60'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-9 text-right font-mono text-slate-500 dark:text-slate-400">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Roster */}
        <div className="space-y-3">
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <UserCheck className="w-3.5 h-3.5" /> Class Roster ({students.length})
            </span>
            <div className="space-y-3">
              {students.map((s) => {
                const status = getStatus(s.id);
                const rec = recordFor(s.id);
                return (
                  <div key={s.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.name}</p>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{s.rollNo}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${STATUS_STYLES[status]}`}>
                        {status}
                      </span>
                    </div>
                    {rec && (
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {rec.markedAt} • {rec.confidence} • {rec.method?.includes('Manual') ? 'Manual' : rec.method?.includes('Auto') ? 'Auto' : 'Face AI'}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setStatusManual(s.id, 'present')} className="flex-1 py-1 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer">Present</button>
                      <button onClick={() => setStatusManual(s.id, 'late')} className="flex-1 py-1 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer">Late</button>
                      <button onClick={() => setStatusManual(s.id, 'absent')} className="flex-1 py-1 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer">Absent</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
