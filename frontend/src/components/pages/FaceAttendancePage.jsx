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
  Download,
  ShieldCheck,
  Activity,
  Cpu,
  UserCheck,
  Clock3,
  Settings2,
  ChevronRight,
  CircleDot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Re-mark cooldown per student (ms)
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
  const [modelStatus, setModelStatus] = useState('idle');
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

  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    mappingsRef.current = classMappings;
  }, [classMappings]);

  const presentStudents = students.filter(s => s.present);
  const absentStudents = students.length - presentStudents.length;
  const mappedCount = labels.filter(l => classMappings[l]).length;

  // ---------- Webcam ----------
  useEffect(() => {
    let stream = null;

    if (webcamOn) {
      navigator.mediaDevices?.getUserMedia({
        video: {
          facingMode: 'user',
          width: 640,
          height: 480
        }
      })
        .then((mediaStream) => {
          stream = mediaStream;

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          setWebcamError(null);
        })
        .catch((err) => {
          console.error('Camera error:', err);
          setWebcamError('Camera access denied or unavailable.');
          setWebcamOn(false);
        });
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());

        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamOn]);

  // ---------- Load Teachable Machine model ----------
  const loadModel = async () => {
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

    const base = raw.endsWith('/') ? raw : raw + '/';

    setModelStatus('loading');
    setModelError(null);

    try {
      const model = await tmImage.load(
        base + 'model.json',
        base + 'metadata.json'
      );

      modelRef.current = model;

      const classLabels = model.getClassLabels();
      setLabels(classLabels);
      setTmModelURL(base);

      classLabels.forEach((label) => {
        if (classMappings[label]) return;

        const norm = label.trim().toLowerCase();

        const match = students.find(
          s =>
            s.name.toLowerCase() === norm ||
            s.id.toLowerCase() === norm
        );

        if (match) {
          setClassMapping(label, match.id);
        }
      });

      setModelStatus('ready');

      showToast(
        'Model Loaded',
        `${classLabels.length} face classes ready for recognition.`,
        'success'
      );
    } catch (err) {
      console.error('TM load error:', err);

      setModelStatus('error');

      setModelError(
        'Could not load the model. Double-check the URL and sharing permissions.'
      );
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

        const sorted = [...preds].sort(
          (a, b) => b.probability - a.probability
        );

        setPredictions(sorted);

        const top = sorted[0];

        if (top && top.probability >= thresholdRef.current) {
          const studentId = mappingsRef.current[top.className];

          const conf = `${(top.probability * 100).toFixed(1)}%`;

          setLastMatch({
            label: top.className,
            studentId,
            conf
          });

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
      showToast(
        'Load a Model First',
        'Paste your Teachable Machine URL and load the model.',
        'warning'
      );
      return;
    }

    if (!webcamOn) {
      setWebcamOn(true);
    }

    runningRef.current = true;
    setRunning(true);

    rafRef.current = requestAnimationFrame(predictLoop);

    showToast(
      'Recognition Started',
      'Watching the live feed for enrolled faces…',
      'info'
    );
  };

  const stopRecognition = () => {
    runningRef.current = false;
    setRunning(false);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    setPredictions([]);
    setLastMatch(null);
  };

  // ---------- Cleanup ----------
  useEffect(() => {
    return () => {
      runningRef.current = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // ---------- CSV ----------
  const exportAttendanceCSV = () => {
    const today = new Date().toISOString().split('T')[0];

    const esc = (v) => {
      const str =
        v === null || v === undefined ? '' : String(v);

      return /[",\n]/.test(str)
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const headers = [
      'Student ID',
      'Name',
      'Room',
      'Block',
      'Department',
      'Status',
      'Present Today',
      'Marked At',
      'Last Confidence',
      'Days Present',
      'Attendance Dates'
    ];

    const rows = students.map((s) => {
      const dates = s.attendanceDates || [];

      const presentToday =
        s.present && s.presentDate === today;

      return [
        s.id,
        s.name,
        s.room,
        s.block,
        s.department,
        s.status,
        presentToday ? 'Yes' : 'No',
        presentToday ? (s.presentAt || '') : '',
        presentToday
          ? (s.lastRecognitionConfidence || '')
          : '',
        dates.length,
        dates.slice().sort().join(' | ')
      ]
        .map(esc)
        .join(',');
    });

    const summary =
      `Attendance Report,Generated ${new Date().toLocaleString()},Present Today: ${presentStudents.length}/${students.length}`;

    const csv = [
      summary,
      '',
      headers.join(','),
      ...rows
    ].join('\n');

    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `attendance-report-${today}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    showToast(
      'Report Exported',
      `Attendance CSV for ${students.length} students downloaded.`,
      'success'
    );
  };

  return (
    <div className="space-y-5">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

        <div>
          <div className="flex flex-wrap items-center gap-2.5">

            <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Facial Recognition Attendance
                </h2>

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-[10px] font-bold font-mono">
                  <Sparkles className="w-3 h-3" />
                  AI POWERED
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live biometric attendance monitoring and automated student verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* System state */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold ${
            running
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              running
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-slate-400'
            }`} />

            {running ? 'Recognition Active' : 'System Idle'}
          </div>

          <button
            onClick={exportAttendanceCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <button
            onClick={() => setWebcamOn(!webcamOn)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              webcamOn
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {webcamOn
              ? <Video className="w-3.5 h-3.5" />
              : <VideoOff className="w-3.5 h-3.5" />
            }

            {webcamOn ? 'Camera On' : 'Camera Off'}
          </button>

          {!running ? (
            <button
              onClick={startRecognition}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              Start Scan
            </button>
          ) : (
            <button
              onClick={stopRecognition}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Square className="w-3.5 h-3.5" />
              Stop Scan
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          QUICK STATUS STRIP
      ====================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Registered
            </span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <p className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
            {students.length}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Students enrolled
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Present
            </span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <p className="mt-1 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {presentStudents.length}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            {students.length ? Math.round((presentStudents.length / students.length) * 100) : 0}% attendance
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Absent
            </span>
            <Clock3 className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <p className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
            {absentStudents}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Awaiting attendance
          </p>
        </div>

        <div className={`p-3 rounded-xl border shadow-sm ${
          modelStatus === 'ready'
            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase tracking-wider font-bold ${
              modelStatus === 'ready'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              AI Model
            </span>
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
          </div>

          <p className={`mt-1 text-sm font-bold ${
            modelStatus === 'ready'
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {modelStatus === 'ready' ? 'READY' : 'NOT LOADED'}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            {modelStatus === 'ready'
              ? `${labels.length} classes • ${mappedCount} mapped`
              : 'Connect model to begin'
            }
          </p>
        </div>
      </div>

      {/* =====================================================
          MODEL CONNECTION
      ====================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Link2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Recognition Model
              </h3>

              <p className="text-[10px] text-slate-400">
                Connect your Teachable Machine TensorFlow.js model
              </p>
            </div>
          </div>

          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400">
            STEP 01
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div className="p-4">

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://teachablemachine.withgoogle.com/models/XXXXXXXX/"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={loadModel}
              disabled={modelStatus === 'loading'}
              className="lg:w-32 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              {modelStatus === 'loading'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <ScanFace className="w-3.5 h-3.5" />
              }

              {modelStatus === 'loading'
                ? 'Loading...'
                : 'Load Model'
              }
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">

            {modelStatus === 'ready' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Model connected
              </span>
            )}

            {modelStatus === 'error' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                {modelError}
              </span>
            )}

            {modelStatus === 'ready' && (
              <>
                <span className="text-[10px] font-mono text-slate-400">
                  {labels.length} classes detected
                </span>

                <span className="text-[10px] font-mono text-slate-400">
                  {mappedCount}/{labels.length} mapped
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN SCANNER GRID
      ====================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)] gap-4">

        {/* ===================================================
            LIVE SCANNER
        ==================================================== */}
        <div className="space-y-3">

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">

            {/* Camera Header */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">

              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${
                  running
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`} />

                <div>
                  <p className="text-xs font-bold text-white">
                    Live Recognition Feed
                  </p>

                  <p className="text-[9px] text-slate-500 font-mono">
                    CAMERA 01 • 640 × 480
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">

                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/30 border border-slate-800 text-[9px] font-mono text-slate-400">
                  <CircleDot className={`w-2.5 h-2.5 ${
                    running
                      ? 'text-emerald-400 animate-pulse'
                      : 'text-slate-600'
                  }`} />

                  {running ? 'SCANNING' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Camera */}
            <div className="relative aspect-[4/3] bg-black overflow-hidden">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {!webcamOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                    <VideoOff className="w-7 h-7 text-slate-600" />
                  </div>

                  <p className="text-xs font-semibold text-slate-400">
                    Camera is offline
                  </p>

                  <p className="text-[10px] text-slate-600 mt-1">
                    Enable the camera to start recognition
                  </p>
                </div>
              )}

              {/* Scanner corners */}
              {webcamOn && (
                <div className="absolute inset-0 pointer-events-none">

                  <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-blue-400/80 rounded-tl-lg" />
                  <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-blue-400/80 rounded-tr-lg" />
                  <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-blue-400/80 rounded-bl-lg" />
                  <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-blue-400/80 rounded-br-lg" />

                  {running && (
                    <div className="absolute left-8 right-8 top-1/2 h-px bg-blue-400/50 shadow-[0_0_12px_rgba(96,165,250,0.7)]" />
                  )}
                </div>
              )}

              {/* Match overlay */}
              {running && lastMatch && (
                <div className="absolute left-4 right-4 bottom-4">

                  <div className={`rounded-xl border backdrop-blur-md shadow-2xl p-3 ${
                    lastMatch.studentId
                      ? 'bg-emerald-950/80 border-emerald-500/40'
                      : 'bg-slate-950/85 border-slate-700'
                  }`}>

                    <div className="flex items-center justify-between gap-3">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          lastMatch.studentId
                            ? 'bg-emerald-500/20'
                            : 'bg-slate-800'
                        }`}>
                          {lastMatch.studentId
                            ? <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            : <ScanFace className="w-5 h-5 text-slate-400" />
                          }
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                            {lastMatch.studentId
                              ? 'Identity Verified'
                              : 'Unknown Class'
                            }
                          </p>

                          <p className="text-sm font-bold text-white truncate">
                            {lastMatch.label}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] uppercase text-slate-500">
                          Confidence
                        </p>

                        <p className={`text-lg font-bold font-mono ${
                          lastMatch.studentId
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }`}>
                          {lastMatch.conf}
                        </p>
                      </div>
                    </div>

                    {lastMatch.studentId && (
                      <div className="mt-2 pt-2 border-t border-emerald-500/10 text-[10px] font-mono text-emerald-300/80">
                        Student ID: {lastMatch.studentId}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scanning badge */}
              {running && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-[9px] font-bold font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>
              )}
            </div>
          </div>

          {webcamError && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {webcamError}
            </div>
          )}

          {/* Prediction monitor */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">

            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">

              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-500" />

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Prediction Monitor
                </span>
              </div>

              <label className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                Threshold

                <strong className="font-mono text-slate-800 dark:text-slate-200">
                  {Math.round(threshold * 100)}%
                </strong>

                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-24 cursor-pointer accent-blue-600"
                />
              </label>
            </div>

            <div className="p-4">

              {predictions.length === 0 ? (
                <div className="py-5 text-center">
                  <ScanFace className="w-7 h-7 text-slate-300 dark:text-slate-700 mx-auto mb-2" />

                  <p className="text-xs text-slate-400">
                    No live predictions
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    Start recognition to monitor confidence scores.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">

                  {predictions.map((p) => {
                    const pct = Math.round(p.probability * 100);
                    const mapped = classMappings[p.className];
                    const over = p.probability >= threshold;

                    return (
                      <div
                        key={p.className}
                        className="flex items-center gap-2.5 text-[11px]"
                      >
                        <span
                          className="w-28 truncate font-mono text-slate-600 dark:text-slate-300"
                          title={p.className}
                        >
                          {p.className}
                        </span>

                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              over
                                ? 'bg-emerald-500'
                                : 'bg-blue-500/50'
                            }`}
                            style={{
                              width: `${pct}%`
                            }}
                          />
                        </div>

                        <span className={`w-9 text-right font-mono ${
                          over
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500'
                        }`}>
                          {pct}%
                        </span>

                        {mapped && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT CONTROL PANEL
        ==================================================== */}
        <div className="space-y-4">

          {/* Mapping */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2.5">

                  <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Class Mapping
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      Connect AI classes to residents
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-slate-400">
                  STEP 02
                </span>
              </div>
            </div>

            <div className="p-4">

              {labels.length === 0 ? (
                <div className="py-5 text-center">
                  <Users className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />

                  <p className="text-xs text-slate-400">
                    No classes available
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    Load a model first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">

                  {labels.map((label) => (
                    <div
                      key={label}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    >

                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 truncate"
                          title={label}
                        >
                          {label}
                        </span>

                        {classMappings[label] && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        )}
                      </div>

                      <select
                        value={classMappings[label] || ''}
                        onChange={(e) =>
                          setClassMapping(label, e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="">
                          — Ignore class —
                        </option>

                        {students.map((s) => (
                          <option
                            key={s.id}
                            value={s.id}
                          >
                            {s.name} ({s.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2.5">

                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Today's Attendance
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      {presentStudents.length} of {students.length} present
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetAttendance}
                  className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
                  title="Reset attendance"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Progress */}
              <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${students.length
                      ? (presentStudents.length / students.length) * 100
                      : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div className="p-4">

              {/* Manual override */}
              <div className="flex gap-2 mb-3">

                <select
                  value={manualSelectId}
                  onChange={(e) =>
                    setManualSelectId(e.target.value)
                  }
                  className="flex-1 min-w-0 px-2.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">
                    Manual attendance...
                  </option>

                  {students
                    .filter(s => !s.present)
                    .map((s) => (
                      <option
                        key={s.id}
                        value={s.id}
                      >
                        {s.name} ({s.id})
                      </option>
                    ))}
                </select>

                <button
                  onClick={() => {
                    if (!manualSelectId) return;

                    markStudentPresent(
                      manualSelectId,
                      null,
                      { manual: true }
                    );

                    setManualSelectId('');
                  }}
                  disabled={!manualSelectId}
                  className="px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Mark present"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Present students */}
              {presentStudents.length === 0 ? (
                <div className="py-6 text-center">
                  <UserCheck className="w-7 h-7 text-slate-300 dark:text-slate-700 mx-auto mb-2" />

                  <p className="text-xs text-slate-400">
                    No students marked present
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">

                  {presentStudents.map((s) => (
                    <div
                      key={s.id}
                      className="group flex items-center gap-2.5 p-2 rounded-lg border border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                    >

                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-300 dark:border-emerald-700"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {s.name}
                        </p>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400 truncate">
                            {s.id}
                          </span>

                          {s.presentAt && (
                            <>
                              <span className="text-slate-300 dark:text-slate-700">
                                •
                              </span>

                              <span className="text-[9px] font-mono text-slate-400">
                                {s.presentAt}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {s.lastRecognitionConfidence && (
                        <span className="hidden sm:block text-[9px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {s.lastRecognitionConfidence}
                        </span>
                      )}

                      <button
                        onClick={() => markStudentAbsent(s.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
                        title="Mark absent"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System settings */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">

            <div className="flex items-center gap-2 mb-2.5">
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                Recognition Settings
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">

              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase">
                  Threshold
                </p>

                <p className="text-xs font-bold font-mono text-slate-700 dark:text-slate-200 mt-0.5">
                  {Math.round(threshold * 100)}%
                </p>
              </div>

              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase">
                  Cooldown
                </p>

                <p className="text-xs font-bold font-mono text-slate-700 dark:text-slate-200 mt-0.5">
                  8 sec
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}