import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Camera,
  Video,
  VideoOff,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Clock3,
  Users,
  Shield,
  Download,
  ScanFace,
  Moon,
  Eye,
  Activity,
  Wifi,
  Grid,
  Square,
  Maximize2,
  Loader2,
  Cpu,
  Link2,
  Play,
  ShieldCheck,
  CircleDot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getSocketURL,
  apiStartCameraStream,
  apiStopCameraStream,
  apiGetCameraStreamStatus,
} from '../../services/api';
import { useTmRecognition } from '../../hooks/useTmRecognition';
import ClassMappingEditor from '../common/ClassMappingEditor';

// Live AI MJPEG stream served by the Python YOLO detector (same feed as Classroom)
const AI_STREAM_URL = 'http://localhost:5001/video';

// Hostel blocks 1–8 (independent of the shared camera system)
const HOSTEL_BLOCKS = [
  { id: 'BLK-1', name: 'Block 1', label: 'Aryabhata Wing',  gender: 'Boys',  floors: 4 },
  { id: 'BLK-2', name: 'Block 2', label: 'Kalpana Wing',    gender: 'Girls', floors: 4 },
  { id: 'BLK-3', name: 'Block 3', label: 'Raman Block',     gender: 'Boys',  floors: 3 },
  { id: 'BLK-4', name: 'Block 4', label: 'Sarabhai Block',  gender: 'Girls', floors: 3 },
  { id: 'BLK-5', name: 'Block 5', label: 'Bhabha Block',    gender: 'Boys',  floors: 5 },
  { id: 'BLK-6', name: 'Block 6', label: 'Curie Block',     gender: 'Girls', floors: 5 },
  { id: 'BLK-7', name: 'Block 7', label: 'Tesla Block',     gender: 'Boys',  floors: 4 },
  { id: 'BLK-8', name: 'Block 8', label: 'Ramanujan Block', gender: 'Mixed', floors: 6 },
];

export default function HostelAttendancePage() {
  const {
    aiOverlayEnabled,
    setAiOverlayEnabled,
    nightVision,
    setNightVision,
    currentDetection,
    triggerSimulatedScan,
    logs,
    students,
    showToast,
    tmModelURL,
    classMappings
  } = useApp();

  // Hostel block selector state (Blocks 1–8)
  const [activeBlockId, setActiveBlockId] = useState('BLK-1');
  const activeBlock = HOSTEL_BLOCKS.find(b => b.id === activeBlockId);

  // Live AI camera feed (backend-launched Python YOLO detector) — same as Classroom
  const [webcamOn, setWebcamOn] = useState(false);
  const [isStartingStream, setIsStartingStream] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [streamKey, setStreamKey] = useState(Date.now());
  const [isGridMode, setIsGridMode] = useState(false);
  const [urlInput, setUrlInput] = useState(tmModelURL);

  const viewportRef = useRef(null);
  const streamImgRef = useRef(null);

  // Shared per-person Teachable Machine recognition over the live YOLO feed.
  // Recognized students are marked present for the 'hostel' slot.
  const {
    modelStatus,
    modelError,
    labels,
    running,
    liveDetections,
    lastMatch,
    loadModel,
    start,
    stop,
  } = useTmRecognition({ slot: 'hostel', streamImgRef });

  const mappedCount = labels.filter(l => classMappings[l]).length;
  const recognizedDetections = Object.values(liveDetections);

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const isCurfewTime = hour >= 22 || hour < 6;

  // Hostel-specific logs (after 10 PM or before 6 AM)
  const hostelLogs = logs.filter(l => {
    if (!l.timestamp) return false;
    const h = new Date(l.timestamp.replace(' ', 'T')).getHours();
    return h >= 22 || h < 6 || l.curfewAlert;
  });

  const totalIn = hostelLogs.filter(l => l.direction === 'IN').length;
  const totalOut = hostelLogs.filter(l => l.direction === 'OUT').length;
  const violations = hostelLogs.filter(l => l.curfewAlert).length;

  // Ensure the AI detector is stopped by default when this page loads, and
  // clean it up when leaving so we never leave the camera process running.
  useEffect(() => {
    setWebcamOn(false);
    apiGetCameraStreamStatus()
      .then(res => { if (res && res.running) apiStopCameraStream().catch(() => {}); })
      .catch(() => {});

    const handleBeforeUnload = () => {
      fetch(`${getSocketURL()}/api/cameras/stream/stop`, { method: 'POST', keepalive: true }).catch(() => {});
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      apiStopCameraStream().catch(() => {});
    };
  }, []);

  // Start / stop the backend Python YOLO detector — identical flow to Classroom
  const handleToggleFeed = async () => {
    if (!webcamOn) {
      setIsStartingStream(true);
      setWebcamError(null);
      try {
        const res = await apiStartCameraStream();
        if (res && res.running) {
          setStreamKey(Date.now());
          setWebcamOn(true);
          showToast('AI Camera Online', 'Python YOLO detector active at hostel gate.', 'success');
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
      stop();
      try {
        await apiStopCameraStream();
        showToast('AI Camera Offline', 'Detector process stopped.', 'info');
      } catch (err) {
        console.error('Failed to stop AI stream:', err);
      }
    }
  };

  // Start / stop Teachable Machine recognition on the live hostel gate feed.
  const startRecognition = async () => {
    if (modelStatus !== 'ready') {
      showToast('Load a Model First', 'Paste your Teachable Machine URL and load the model.', 'warning');
      return;
    }
    if (!webcamOn) {
      await handleToggleFeed();
    }
    if (start()) {
      showToast('Recognition Started', 'Watching hostel gate feed for curfew attendance…', 'info');
    }
  };

  const stopRecognition = () => stop();

  const detectionIsAlert = currentDetection.status === 'CURFEW_ALERT';

  const exportCSV = () => {
    const rows = hostelLogs.map(l =>
      [l.id, l.studentId, l.studentName, l.direction, l.timestamp, l.gate, l.curfewAlert ? 'VIOLATION' : 'OK', l.remarks].join(',')
    );
    const csv = ['Event ID,Student ID,Name,Direction,Timestamp,Gate,Status,Remarks', ...rows].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `hostel-curfew-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('Exported', 'Hostel curfew log downloaded.', 'success');
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
        <div>
          <div className="flex gap-2.5 items-center mb-1">
            <div className="bg-emerald-500/10 border border-emerald-500/20 flex h-9 items-center justify-center rounded-xl w-9">
              <Building2 className="h-5 text-emerald-500 w-5" />
            </div>
            <h2 className="dark:text-white font-bold text-slate-900 text-xl">Hostel Curfew Attendance</h2>
            {isCurfewTime && (
              <span className="bg-amber-500/10 border border-amber-500/20 font-bold font-mono gap-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] text-amber-400">
                <span className="animate-pulse bg-amber-400 h-1.5 rounded-full w-1.5" />
                CURFEW ACTIVE
              </span>
            )}
          </div>
          <p className="dark:text-slate-400 text-slate-500 text-xs">
            After curfew time (10 PM – 6 AM), AI camera marks hostel gate attendance and flags late arrivals.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={exportCSV} className="bg-slate-100 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 flex font-semibold gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 items-center px-3 py-1.5 rounded-lg text-slate-600 text-xs transition">
            <Download className="h-3.5 w-3.5" />
            Export Log
          </button>
          <button
            onClick={handleToggleFeed}
            disabled={isStartingStream}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition ${ webcamOn ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-100 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800' } ${isStartingStream ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isStartingStream ? (
              <Loader2 className="animate-spin h-3.5 text-indigo-400 w-3.5" />
            ) : webcamOn ? (
              <Video className="h-3.5 w-3.5" />
            ) : (
              <VideoOff className="h-3.5 w-3.5" />
            )}
            {isStartingStream ? 'Starting AI...' : webcamOn ? 'AI Feed Active' : 'Enable AI Feed'}
          </button>
          {!running ? (
            <button
              onClick={startRecognition}
              className="bg-emerald-600 cursor-pointer flex font-semibold gap-1.5 hover:bg-emerald-500 items-center px-4 py-1.5 rounded-lg shadow-sm text-white text-xs transition"
            >
              <Play className="h-3.5 w-3.5" />
              Start Scan
            </button>
          ) : (
            <button
              onClick={stopRecognition}
              className="bg-rose-600 cursor-pointer flex font-semibold gap-1.5 hover:bg-rose-500 items-center px-4 py-1.5 rounded-lg shadow-sm text-white text-xs transition"
            >
              <Square className="h-3.5 w-3.5" />
              Stop Scan
            </button>
          )}
          <button
            onClick={triggerSimulatedScan}
            className="bg-slate-100 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 flex font-semibold gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 items-center px-3 py-1.5 rounded-lg text-slate-600 text-xs transition"
          >
            <Zap className="h-3.5 w-3.5" />
            Simulate
          </button>
        </div>
      </div>

      {/* Curfew time banner */}
      {isCurfewTime ? (
        <div className="bg-amber-500/5 border border-amber-500/20 flex gap-3 items-start p-4 rounded-xl">
          <AlertTriangle className="h-5 mt-0.5 shrink-0 text-amber-400 w-5" />
          <div>
            <p className="font-bold text-amber-700 text-sm">Curfew is Active — {now.toLocaleTimeString()}</p>
            <p className="mt-0.5 text-amber-600/80 text-xs">
              AI is monitoring the hostel gate. Any student entering after 10 PM is automatically flagged as a curfew violation.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex gap-3 items-start p-4 rounded-xl">
          <Clock3 className="dark:text-slate-400 h-5 mt-0.5 shrink-0 text-slate-500 w-5" />
          <div>
            <p className="dark:text-slate-300 font-semibold text-slate-700 text-sm">Curfew starts at 10:00 PM</p>
            <p className="dark:text-slate-400 mt-0.5 text-slate-500 text-xs">
              Current time: {now.toLocaleTimeString()}. Hostel gate monitoring will auto-activate when curfew begins.
            </p>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="gap-3 grid grid-cols-3">
        <StatCard label="Entries After Hours" value={totalIn} icon={ArrowDownLeft} accent="emerald" />
        <StatCard label="Exits After Hours" value={totalOut} icon={ArrowUpRight} />
        <StatCard label="Curfew Violations" value={violations} icon={AlertTriangle} accent={violations > 0 ? 'rose' : 'slate'} />
      </div>

      {/* CAMERA + LOG */}
      <div className="gap-5 grid grid-cols-1 xl:grid-cols-[1fr_340px]">

        {/* CAMERA FEED */}
        <div className="space-y-3">

          {/* AI Recognition Model (Teachable Machine) — changeable link */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
              <div className="flex gap-2 items-center">
                <Cpu className="dark:text-slate-400 h-4 text-slate-500 w-4" />
                <span className="dark:text-slate-200 font-bold text-slate-800 text-xs">Face Recognition Model</span>
              </div>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${modelStatus === 'ready' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : modelStatus === 'error' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800'}`}>
                {modelStatus === 'ready' ? `${labels.length} CLASSES` : modelStatus === 'loading' ? 'LOADING…' : modelStatus === 'error' ? 'ERROR' : 'NOT LOADED'}
              </span>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 relative">
                  <Link2 className="-translate-y-1/2 absolute dark:text-slate-400 h-3.5 left-3 text-slate-500 top-1/2 w-3.5" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://teachablemachine.withgoogle.com/models/XXXXXXXX/"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:placeholder-slate-500 dark:text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 font-mono pl-9 placeholder-slate-400 pr-3 py-2.5 rounded-lg text-slate-800 text-xs w-full"
                  />
                </div>
                <button
                  onClick={() => loadModel(urlInput)}
                  disabled={modelStatus === 'loading'}
                  className="bg-emerald-600 cursor-pointer disabled:opacity-60 flex font-semibold gap-1.5 hover:bg-emerald-500 items-center justify-center px-4 py-2.5 rounded-lg sm:w-32 text-white text-xs transition"
                >
                  {modelStatus === 'loading' ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <ScanFace className="h-3.5 w-3.5" />}
                  {modelStatus === 'loading' ? 'Loading…' : 'Load Model'}
                </button>
              </div>
              {modelStatus === 'ready' && (
                <p className="flex gap-1.5 items-center mt-2 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Model connected — {labels.length} classes, {mappedCount} mapped to DB students
                </p>
              )}
              {modelStatus === 'error' && (
                <p className="flex gap-1.5 items-center mt-2 text-[11px] text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {modelError}
                </p>
              )}
              {modelStatus !== 'ready' && modelStatus !== 'error' && (
                <p className="dark:text-slate-400 mt-2 text-[11px] text-slate-500">
                  Paste your Teachable Machine model link, then Start Scan — recognized students are marked present at the hostel gate. You can change this link anytime.
                </p>
              )}
              <ClassMappingEditor labels={labels} accent="violet" />
            </div>
          </div>

          {/* Hostel Block selector */}
          <div className="space-y-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center p-2 rounded-xl">
              <div className="dark:text-slate-400 flex font-bold gap-1.5 items-center px-2 text-[10px] text-slate-500 tracking-widest uppercase">
                <Building2 className="h-3.5 w-3.5" />
                Hostel Blocks
              </div>
              {HOSTEL_BLOCKS.map(blk => {
                const selected = blk.id === activeBlockId;
                return (
                  <button
                    key={blk.id}
                    onClick={() => setActiveBlockId(blk.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${selected ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white dark:bg-slate-900' : 'bg-emerald-500'}`} />
                    {blk.name}
                    <span className="hidden opacity-80 sm:inline text-xs">{blk.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsGridMode(!isGridMode)}
                className="bg-slate-100 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 flex font-semibold gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 items-center ml-auto px-3 py-1.5 rounded-lg text-slate-600 text-xs"
              >
                {isGridMode ? <Square className="h-3.5 w-3.5" /> : <Grid className="h-3.5 w-3.5" />}
                {isGridMode ? 'Single' : 'Grid'}
              </button>
            </div>

            {/* Active block info pill */}
            {activeBlock && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex font-mono gap-3 items-center px-3 py-2 rounded-lg text-[10px] text-slate-400">
                <span className="font-bold text-emerald-500">{activeBlock.name}</span>
                <span className="dark:text-slate-400 text-slate-600">·</span>
                <span>{activeBlock.label}</span>
                <span className="dark:text-slate-400 text-slate-600">·</span>
                <span>{activeBlock.gender}</span>
                <span className="dark:text-slate-400 text-slate-600">·</span>
                <span>{activeBlock.floors} Floors</span>
                <span className={`ml-auto flex items-center gap-1.5 ${webcamOn && !webcamError ? 'text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                  {webcamOn && !webcamError ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            )}
          </div>

          {!isGridMode ? (
            /* SINGLE VIEW */
            <div ref={viewportRef} className="aspect-video bg-black border border-slate-200 dark:border-slate-800 overflow-hidden relative rounded-2xl shadow-2xl">
              {webcamOn ? (
                <img
                  key={streamKey}
                  ref={streamImgRef}
                  crossOrigin="anonymous"
                  src={`${AI_STREAM_URL}?t=${streamKey}`}
                  alt="Hostel AI Video Stream"
                  className={`w-full h-full object-cover ${nightVision ? 'brightness-125 contrast-125 saturate-50 hue-rotate-90' : ''}`}
                  onLoad={() => setWebcamError(null)}
                  onError={() => setWebcamError(`AI video stream unavailable at ${AI_STREAM_URL}. Ensure the Python YOLO detector is running on port 5001.`)}
                />
              ) : isStartingStream ? (
                <div className="absolute bg-black flex flex-col gap-3 inset-0 items-center justify-center">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 flex h-16 items-center justify-center rounded-2xl w-16">
                    <Loader2 className="animate-spin h-8 text-indigo-400 w-8" />
                  </div>
                  <p className="font-semibold text-slate-200 text-xs">Starting AI Camera Process...</p>
                  <p className="dark:text-slate-400 font-mono text-[10px] text-slate-500">Launching YOLO detector via backend service</p>
                </div>
              ) : (
                <div className="absolute bg-black flex flex-col gap-3 inset-0 items-center justify-center">
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex h-16 items-center justify-center rounded-2xl w-16">
                    <VideoOff className="dark:text-slate-400 h-7 text-slate-600 w-7" />
                  </div>
                  <p className="dark:text-slate-400 font-semibold text-slate-500 text-xs">AI Feed Offline</p>
                  <p className="dark:text-slate-400 text-[10px] text-slate-600">Enable AI feed to launch the hostel gate camera</p>
                </div>
              )}

              {/* Feed error overlay */}
              {webcamOn && webcamError && (
                <div className="absolute bg-slate-950/90 flex flex-col gap-2 inset-0 items-center justify-center p-6 text-center z-30">
                  <AlertTriangle className="h-8 mb-1 text-amber-400 w-8" />
                  <p className="font-semibold text-slate-200 text-sm">AI Camera Feed Offline</p>
                  <p className="max-w-sm text-slate-400 text-xs">{webcamError}</p>
                  <p className="dark:text-slate-400 font-mono mt-2 text-[10px] text-slate-500">Expected stream: {AI_STREAM_URL}</p>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute bg-gradient-to-b from-black/50 inset-0 pointer-events-none to-black/70 via-transparent" />

              {/* Scanlines */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.4) 4px)' }}
              />

              {aiOverlayEnabled && webcamOn && !webcamError && (
                <>
                  {/* Top HUD */}
                  <div className="absolute flex items-start justify-between left-4 right-4 top-4">
                    <div className="flex gap-2">
                      <div className="backdrop-blur-md bg-black/75 border border-white/10 flex font-mono gap-2 items-center px-3 py-2 rounded-lg text-[11px] text-white">
                        <span className="animate-pulse bg-red-500 h-2 rounded-full w-2" />
                        <span className="font-bold">{activeBlock?.name}</span>
                        <span className="dark:text-slate-400 text-slate-500">/</span>
                        <span className="dark:text-slate-300 text-slate-700">{activeBlock?.label}</span>
                      </div>
                      <div className="backdrop-blur-md bg-black/75 border border-white/10 font-mono gap-2 hidden items-center px-3 py-2 rounded-lg sm:flex text-[11px] text-white">
                        <Clock3 className="h-3 text-emerald-500 w-3" />
                        {now.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="backdrop-blur-md bg-black/75 border border-white/10 flex font-mono gap-1.5 items-center px-3 py-2 rounded-lg text-[10px] text-emerald-400">
                      <Wifi className="h-3 w-3" />
                      1080P / 30FPS
                    </div>
                  </div>

                  {/* Bottom HUD */}
                  <div className="absolute bottom-4 flex items-end justify-between left-4 right-4">
                    <div className="backdrop-blur-md bg-black/75 border border-white/10 font-mono px-3 py-2 rounded-lg text-[10px] text-slate-300">
                      {activeBlock?.name} · {activeBlock?.label} · ENCRYPTED
                    </div>
                    <div className={`px-3 py-2 rounded-lg backdrop-blur-md border text-[10px] font-mono font-bold ${running ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : detectionIsAlert ? 'bg-red-950/80 border-red-500/30 text-red-400' : 'text-emerald-500'}`}>
                      <span className="animate-pulse bg-current h-1.5 inline-block mr-1.5 rounded-full w-1.5" />
                      {running ? 'RECOGNIZING' : detectionIsAlert ? 'CURFEW VIOLATION' : 'HOSTEL AI ACTIVE'}
                    </div>
                  </div>
                </>
              )}

              {/* Live recognition match card */}
              {webcamOn && !webcamError && running && lastMatch && (() => {
                const isLate = lastMatch.status === 'late';
                const matched = Boolean(lastMatch.studentId);
                const accent = !matched ? 'slate' : isLate ? 'amber' : 'emerald';
                const box = accent === 'emerald'
                  ? 'bg-emerald-950/80 border-emerald-500/40'
                  : accent === 'amber'
                  ? 'bg-amber-950/80 border-amber-500/40'
                  : 'bg-slate-950/85 border-slate-200 dark:border-slate-800';
                const iconBg = accent === 'emerald' ? 'bg-emerald-500/20' : accent === 'amber' ? 'bg-amber-500/20' : 'bg-slate-800';
                const iconColor = accent === 'emerald' ? 'text-emerald-400' : accent === 'amber' ? 'text-amber-400' : 'text-slate-400';
                return (
                  <div className="absolute bottom-16 left-4 right-4 z-20">
                    <div className={`rounded-xl border backdrop-blur-md shadow-2xl p-3 ${box}`}>
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                            {matched ? <ShieldCheck className={`w-5 h-5 ${iconColor}`} /> : <ScanFace className="dark:text-slate-400 h-5 text-slate-500 w-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[9px] text-slate-400 tracking-wider uppercase">
                              {matched ? (isLate ? 'Marked LATE at hostel gate ⏰' : 'Marked Present at hostel gate ✓') : 'Unknown Face'}
                            </p>
                            <p className="font-bold text-sm text-white truncate">{lastMatch.label}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400">Confidence</p>
                          <p className={`text-lg font-bold font-mono ${iconColor}`}>{lastMatch.conf}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* GRID VIEW — all 8 blocks */
            <div className="gap-3 grid grid-cols-2 md:grid-cols-4">
              {HOSTEL_BLOCKS.map(blk => (
                <div
                  key={blk.id}
                  onClick={() => { setActiveBlockId(blk.id); setIsGridMode(false); }}
                  className="aspect-video bg-black border border-slate-200 dark:border-slate-800 cursor-pointer group overflow-hidden relative rounded-xl shadow-lg"
                >
                  {webcamOn && !webcamError ? (
                    <img
                      key={`${streamKey}-${blk.id}`}
                      src={`${AI_STREAM_URL}?t=${streamKey}&blk=${blk.id}`}
                      alt={blk.label}
                      className={`w-full h-full object-cover group-hover:brightness-110 transition-all ${nightVision ? 'brightness-125 contrast-125 saturate-50 hue-rotate-90' : ''}`}
                    />
                  ) : (
                    <div className="bg-white dark:bg-slate-900 flex h-full items-center justify-center w-full">
                      <VideoOff className="dark:text-slate-300 h-6 text-slate-700 w-6" />
                    </div>
                  )}
                  <div className="absolute bg-gradient-to-b from-black/40 inset-0 to-black/60" />
                  <div className="absolute bg-black/70 border border-white/10 flex font-mono gap-1.5 items-center left-2 px-2 py-1 rounded-md text-[10px] text-white top-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    {blk.name}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="font-semibold text-[11px] text-white truncate">{blk.label}</p>
                    <p className="font-mono text-[9px] text-slate-400">{blk.gender} · {blk.floors}F</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3 items-center p-3 rounded-xl">
            <ToggleSwitch
              label="AI Detection Overlay"
              enabled={aiOverlayEnabled}
              onToggle={() => setAiOverlayEnabled(!aiOverlayEnabled)}
              icon={Eye}
            />
            <div className="bg-slate-200 dark:bg-slate-700 h-6 w-px" />
            <ToggleSwitch
              label="IR Night Vision"
              enabled={nightVision}
              onToggle={() => setNightVision(!nightVision)}
              icon={Moon}
            />
            {running && (
              <span className="bg-emerald-500/10 border border-emerald-500/20 flex font-bold font-mono gap-1.5 items-center ml-auto px-2 py-1 rounded-md text-[9px] text-emerald-400">
                <CircleDot className="animate-pulse h-2.5 w-2.5" />
                TM RECOGNITION LIVE
              </span>
            )}
          </div>

          {/* Live recognized persons (YOLO box + Teachable Machine identity) */}
          {webcamOn && recognizedDetections.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="flex font-bold gap-1.5 items-center text-[10px] text-slate-400 tracking-wider uppercase">
                  <Users className="h-3.5 text-emerald-500 w-3.5" />
                  Live Tracked Persons ({recognizedDetections.length})
                </span>
                <span className="font-mono text-[9px] text-emerald-400">REAL-TIME</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recognizedDetections.map(d => {
                  const hasId = Boolean(d.identity);
                  const name = d.identity || `Person #${d.trackId}`;
                  return (
                    <div
                      key={d.trackId}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${ hasId ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400' }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${hasId ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                      <span>{name}</span>
                      <span className="opacity-70 text-[10px]">
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

        {/* RIGHT — Curfew log */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
              <span className="dark:text-slate-200 font-bold text-slate-800 text-xs">After-Hours Log</span>
              <span className="dark:text-slate-400 font-mono text-[9px] text-slate-500">{hostelLogs.length} EVENTS</span>
            </div>
            <div className="divide-slate-100 divide-y max-h-[520px] overflow-y-auto">
              {hostelLogs.length === 0 && (
                <div className="py-12 text-center">
                  <Building2 className="dark:text-slate-300 h-8 mb-3 mx-auto text-slate-700 w-8" />
                  <p className="dark:text-slate-400 text-slate-500 text-xs">No after-hours activity recorded</p>
                </div>
              )}
              {hostelLogs.map(log => (
                <div key={log.id} className={`flex items-start gap-3 px-4 py-3 ${log.curfewAlert ? 'bg-rose-500/[0.03]' : ''}`}>
                  <img src={log.avatar} alt={log.studentName} className="border border-slate-200 dark:border-slate-800 h-8 mt-0.5 object-cover rounded-lg shrink-0 w-8" />
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center">
                      <p className="dark:text-slate-200 font-semibold text-slate-800 text-xs truncate">{log.studentName}</p>
                      {log.curfewAlert && (
                        <span className="bg-rose-500/10 border border-rose-500/20 font-bold gap-1 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] text-rose-400">
                          VIOLATION
                        </span>
                      )}
                    </div>
                    <p className="dark:text-slate-400 font-mono mt-0.5 text-[9px] text-slate-600">{log.studentId} · R{log.room}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className={`text-[9px] font-bold font-mono ${log.direction === 'IN' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {log.direction === 'IN' ? '↙ IN' : '↗ OUT'}
                      </span>
                      <span className="dark:text-slate-400 text-[9px] text-slate-600">{log.timestamp?.split(' ')[1] || ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = 'slate' }) {
  const iconBox = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
  };
  const valueColor = {
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    slate: 'text-slate-900 dark:text-white'
  };
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-soft p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="dark:text-slate-400 font-bold text-[10px] text-slate-500 tracking-wider uppercase">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBox[accent] || iconBox.slate}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className={`text-2xl font-bold font-mono ${valueColor[accent] || valueColor.slate}`}>
        {value}
      </p>
    </div>
  );
}

function ToggleSwitch({ label, enabled, onToggle, icon: Icon }) {
  return (
    <button onClick={onToggle} className="cursor-pointer flex gap-2 group items-center">
      <Icon className={`w-3.5 h-3.5 ${enabled ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
      <span className="dark:text-white group-hover:text-slate-900 text-slate-500 text-xs transition">{label}</span>
      <div className={`relative w-8 h-4 rounded-full transition-colors ${enabled ? 'bg-emerald-600' : 'bg-slate-300'}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${enabled ? 'translate-x-4' : ''}`} />
      </div>
    </button>
  );
}
