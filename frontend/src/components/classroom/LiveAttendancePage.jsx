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
  Clock,
  UserCheck,
  Timer,
  Download,
  RotateCcw,
  Lock,
  Settings2,
  ChevronDown,
  Radio,
  Sparkles,
  Users,
  CircleDot
} from 'lucide-react';
import {
  useClassroom,
  cutoffLabel,
  cutoffMinutes
} from '../../context/ClassroomContext';

const RE_MARK_COOLDOWN_MS = 8000;

const STATUS_STYLES = {
  present: {
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    dot: 'bg-emerald-500'
  },
  late: {
    badge:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
    dot: 'bg-amber-500'
  },
  absent: {
    badge:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
    dot: 'bg-rose-500'
  },
  pending: {
    badge:
      'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    dot: 'bg-slate-400'
  }
};

export default function LiveAttendancePage() {
  const {
    students,
    periods,
    activePeriod,
    activePeriodId,
    setActivePeriodId,
    getStatus,
    recordFor,
    recognizeStudent,
    setStatusManual,
    finalizePeriod,
    resetPeriod,
    activeCounts,
    exportCSV,
    tmModelURL,
    setTmModelURL,
    classMappings
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
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const cooldownRef = useRef({});
  const thresholdRef = useRef(threshold);
  const mappingsRef = useRef(classMappings);
  const finalizedRef = useRef({});

  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    mappingsRef.current = classMappings;
  }, [classMappings]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mins = now.getHours() * 60 + now.getMinutes();

    if (
      activePeriod &&
      mins > cutoffMinutes(activePeriod) &&
      !finalizedRef.current[activePeriodId]
    ) {
      finalizedRef.current[activePeriodId] = true;
      finalizePeriod(activePeriodId);
    }
  }, [now, activePeriod, activePeriodId, finalizePeriod]);

  useEffect(() => {
    let stream = null;

    if (webcamOn) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            facingMode: 'user',
            width: 640,
            height: 480
          }
        })
        .then((s) => {
          stream = s;

          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }

          setWebcamError(null);
        })
        .catch((err) => {
          console.error(err);
          setWebcamError('Camera access denied or unavailable.');
          setWebcamOn(false);
        });
    } else if (videoRef.current?.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());

      videoRef.current.srcObject = null;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [webcamOn]);

  const loadModel = useCallback(async () => {
    const tmImage = window.tmImage;

    if (!tmImage) {
      setModelStatus('error');
      setModelError(
        'Teachable Machine runtime not loaded. Check your internet connection.'
      );
      return;
    }

    const raw = urlInput.trim();

    if (!raw) {
      setModelStatus('error');
      setModelError('Paste your Teachable Machine model URL first.');
      return;
    }

    const base = raw.endsWith('/') ? raw : `${raw}/`;

    setModelStatus('loading');
    setModelError(null);

    try {
      const model = await tmImage.load(
        `${base}model.json`,
        `${base}metadata.json`
      );

      modelRef.current = model;

      setLabels(model.getClassLabels());
      setTmModelURL(base);
      setModelStatus('ready');
    } catch (err) {
      console.error(err);

      setModelStatus('error');
      setModelError(
        'Could not load the model. Check that the URL is correct and publicly shared.'
      );
    }
  }, [urlInput, setTmModelURL]);

  useEffect(() => {
    loadModel();
    // eslint-disable-next-line
  }, []);

  const predictLoop = useCallback(async () => {
    if (!runningRef.current) return;

    const model = modelRef.current;
    const video = videoRef.current;

    if (model && video && video.readyState >= 2) {
      try {
        const preds = await model.predict(video);

        const sorted = [...preds].sort(
          (a, b) => b.probability - a.probability
        );

        setPredictions(sorted);

        const top = sorted[0];

        if (top && top.probability >= thresholdRef.current) {
          const studentId = mappingsRef.current[top.className];

          if (studentId) {
            const currentTime = Date.now();

            if (
              currentTime -
                (cooldownRef.current[studentId] || 0) >
              RE_MARK_COOLDOWN_MS
            ) {
              cooldownRef.current[studentId] = currentTime;

              recognizeStudent(
                studentId,
                `${(top.probability * 100).toFixed(1)}%`
              );
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    rafRef.current = requestAnimationFrame(predictLoop);
  }, [recognizeStudent]);

  const startRecognition = async () => {
    if (modelStatus !== 'ready') {
      await loadModel();
      return;
    }

    if (!webcamOn) {
      setWebcamOn(true);
    }

    runningRef.current = true;
    setRunning(true);

    rafRef.current = requestAnimationFrame(predictLoop);
  };

  const stopRecognition = () => {
    runningRef.current = false;
    setRunning(false);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    setPredictions([]);
  };

  useEffect(() => {
    return () => {
      runningRef.current = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const minsNow = now.getHours() * 60 + now.getMinutes();
  const cutoff = activePeriod ? cutoffMinutes(activePeriod) : 0;
  const minsToCutoff = cutoff - minsNow;
  const cutoffPassed = minsNow > cutoff;

  const topPrediction = predictions[0];

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <ScanFace className="w-5 h-5" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-indigo-600 dark:text-indigo-400">
              AI Attendance Console
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Live Attendance
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time face recognition and classroom attendance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                {now.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              running
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                running ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />

            {running ? 'AI Scanning' : 'Standby'}
          </div>
        </div>
      </section>

      {/* PERIOD SELECTOR */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarIcon />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Select Class Period
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Attendance will be recorded against the selected period.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            {periods.length} periods
          </span>
        </div>

        <div className="p-3 flex gap-2 overflow-x-auto">
          {periods.map((p) => {
            const active = p.id === activePeriodId;

            return (
              <button
                key={p.id}
                onClick={() => setActivePeriodId(p.id)}
                className={`min-w-[190px] p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold truncate">
                    {p.subject}
                  </span>

                  {active && (
                    <CircleDot className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                </div>

                <p
                  className={`text-[10px] font-mono mt-1 ${
                    active
                      ? 'text-indigo-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {p.startTime}–{p.endTime} • {p.room}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ACTIVE PERIOD */}
      {activePeriod && (
        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 sm:p-5 shadow-xl shadow-indigo-600/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">
                  {activePeriod.subject}
                </h2>

                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-mono">
                  {activePeriod.teacher}
                </span>
              </div>

              <p className="text-xs text-indigo-100 mt-1">
                {activePeriod.startTime} • Room {activePeriod.room} •
                On-time until {cutoffLabel(activePeriod)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  cutoffPassed
                    ? 'bg-rose-500/15 border-rose-300/20 text-rose-100'
                    : 'bg-white/10 border-white/10 text-white'
                }`}
              >
                <Timer className="w-4 h-4" />

                {cutoffPassed
                  ? 'Late arrivals only'
                  : `${minsToCutoff} min until cutoff`}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Present"
          value={activeCounts.present}
          icon={UserCheck}
          type="success"
        />

        <StatCard
          label="Late"
          value={activeCounts.late}
          icon={Clock}
          type="warning"
        />

        <StatCard
          label="Absent"
          value={activeCounts.absent}
          icon={AlertTriangle}
          type="danger"
        />

        <StatCard
          label="Pending"
          value={activeCounts.pending}
          icon={Users}
          type="neutral"
        />
      </div>

      {/* ACTION TOOLBAR */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWebcamOn(!webcamOn)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border cursor-pointer transition ${
              webcamOn
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {webcamOn ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}

            {webcamOn ? 'Camera Active' : 'Enable Camera'}
          </button>

          {!running ? (
            <button
              onClick={startRecognition}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4" />
              Start AI Recognition
            </button>
          ) : (
            <button
              onClick={stopRecognition}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Square className="w-4 h-4" />
              Stop Recognition
            </button>
          )}

          <div className="flex-1" />

          <button
            onClick={() => finalizePeriod(activePeriodId)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Close Period
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => resetPeriod(activePeriodId)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 cursor-pointer"
            title="Reset period"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_400px] gap-5">

        {/* CAMERA AREA */}
        <section className="space-y-4">
          <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">

            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Classroom Camera
                  </p>

                  <p className="text-[10px] text-slate-500 font-mono">
                    640 × 480 • Face AI
                  </p>
                </div>
              </div>

              {running && (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    LIVE
                  </span>
                </div>
              )}
            </div>

            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {!webcamOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <VideoOff className="w-7 h-7 text-slate-600" />
                  </div>

                  <p className="text-sm font-semibold text-slate-400">
                    Camera is offline
                  </p>

                  <p className="text-[11px] text-slate-600 mt-1">
                    Enable the camera to begin attendance
                  </p>
                </div>
              )}

              {running && topPrediction && (
                <div className="absolute left-4 bottom-4 px-3 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Detected
                  </p>

                  <div className="flex items-center gap-2 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />

                    <span className="text-xs font-bold text-white">
                      {topPrediction.className}
                    </span>

                    <span className="text-[10px] font-mono text-emerald-400">
                      {(topPrediction.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {webcamError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {webcamError}
            </div>
          )}

          {/* MODEL PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-4 py-3 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-500" />

                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Recognition Configuration
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Model, confidence threshold and predictions
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showSettings ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showSettings && (
              <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800">
                <div className="pt-4 flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Confidence Threshold
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.5"
                      max="0.99"
                      step="0.01"
                      value={threshold}
                      onChange={(e) =>
                        setThreshold(parseFloat(e.target.value))
                      }
                      className="w-28 accent-indigo-600 cursor-pointer"
                    />

                    <span className="w-10 text-right font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round(threshold * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Teachable Machine model URL"
                  />

                  <button
                    onClick={loadModel}
                    disabled={modelStatus === 'loading'}
                    className="px-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {modelStatus === 'loading' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}

                    Load
                  </button>
                </div>

                {modelStatus === 'ready' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Model ready • {labels.length} faces enrolled
                  </div>
                )}

                {modelStatus === 'error' && (
                  <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {modelError}
                  </div>
                )}

                {predictions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Recognition Results
                    </p>

                    {predictions.map((p) => {
                      const pct = Math.round(p.probability * 100);
                      const over = p.probability >= threshold;

                      return (
                        <div
                          key={p.className}
                          className="flex items-center gap-2"
                        >
                          <span className="w-24 truncate text-[10px] font-mono text-slate-600 dark:text-slate-300">
                            {p.className}
                          </span>

                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                over
                                  ? 'bg-emerald-500'
                                  : 'bg-indigo-500/50'
                              }`}
                              style={{
                                width: `${pct}%`
                              }}
                            />
                          </div>

                          <span className="w-8 text-right text-[10px] font-mono text-slate-500">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ROSTER */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Class Roster
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  Manage attendance manually if required
                </p>
              </div>

              <div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold">
                {students.length} STUDENTS
              </div>
            </div>
          </div>

          <div className="p-3 space-y-2 max-h-[700px] overflow-y-auto">
            {students.map((s) => {
              const status = getStatus(s.id);
              const rec = recordFor(s.id);
              const statusStyle =
                STATUS_STYLES[status] || STATUS_STYLES.pending;

              return (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 bg-slate-50/60 dark:bg-slate-950/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />

                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-950 ${statusStyle.dot}`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {s.name}
                      </p>

                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        {s.rollNo}
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-1 rounded-lg border uppercase ${statusStyle.badge}`}
                    >
                      {status}
                    </span>
                  </div>

                  {rec && (
                    <div className="mt-2 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-mono text-slate-400">
                        {rec.markedAt} • {rec.confidence} •{' '}
                        {rec.method?.includes('Manual')
                          ? 'Manual'
                          : rec.method?.includes('Auto')
                          ? 'Auto'
                          : 'Face AI'}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    <ManualButton
                      label="Present"
                      type="present"
                      onClick={() =>
                        setStatusManual(s.id, 'present')
                      }
                    />

                    <ManualButton
                      label="Late"
                      type="late"
                      onClick={() =>
                        setStatusManual(s.id, 'late')
                      }
                    />

                    <ManualButton
                      label="Absent"
                      type="absent"
                      onClick={() =>
                        setStatusManual(s.id, 'absent')
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, type }) {
  const styles = {
    success: {
      icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
      value: 'text-emerald-600 dark:text-emerald-400'
    },
    warning: {
      icon: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
      value: 'text-amber-600 dark:text-amber-400'
    },
    danger: {
      icon: 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
      value: 'text-rose-600 dark:text-rose-400'
    },
    neutral: {
      icon: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      value: 'text-slate-600 dark:text-slate-300'
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles[type].icon}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <span className={`text-2xl font-bold font-mono ${styles[type].value}`}>
          {value}
        </span>
      </div>

      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-3">
        {label}
      </p>
    </div>
  );
}

function ManualButton({ label, type, onClick }) {
  const styles = {
    present:
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    late:
      'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    absent:
      'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
  };

  return (
    <button
      onClick={onClick}
      className={`py-1.5 rounded-lg border text-[9px] font-bold cursor-pointer transition ${styles[type]}`}
    >
      {label}
    </button>
  );
}

function CalendarIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
      <Clock className="w-4 h-4" />
    </div>
  );
}