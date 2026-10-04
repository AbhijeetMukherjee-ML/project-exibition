import React, { useState, useRef, useEffect } from 'react';
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
import {
  getSocketURL,
  apiStartCameraStream,
  apiStopCameraStream,
  apiGetCameraStreamStatus,
} from '../../services/api';
import { useTmRecognition } from '../../hooks/useTmRecognition';
import ClassMappingEditor from '../common/ClassMappingEditor';

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
  const [webcamOn, setWebcamOn] = useState(false); // Closed by default
  const [isStartingStream, setIsStartingStream] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [streamAvailable, setStreamAvailable] = useState(false);
  const [frameDimensions, setFrameDimensions] = useState({ width: 640, height: 480 });
  const [streamKey, setStreamKey] = useState(Date.now());

  const streamImgRef = useRef(null);

  // Shared per-person Teachable Machine recognition over the live YOLO feed.
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
  } = useTmRecognition({ slot: activeClassSlot, streamImgRef });

  // Attendance counts for currently selected class slot
  const slotPresentCount = students.filter(s => s[`${activeClassSlot}Attendance`] === 'present').length;
  const slotAbsentCount = students.length - slotPresentCount;
  const mappedCount = labels.filter(l => classMappings[l]).length;

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
      stop();
      try {
        await apiStopCameraStream();
        showToast('AI Camera Offline', 'Detector process stopped.', 'info');
      } catch (err) {
        console.error('Failed to stop AI stream:', err);
      }
    }
  };

  const startRecognition = async () => {
    if (modelStatus !== 'ready') {
      showToast('Load a Model First', 'Paste your Teachable Machine URL and load the model.', 'warning');
      return;
    }
    if (!webcamOn) {
      await handleToggleFeed();
    }
    if (start()) {
      showToast('Recognition Started', `Watching live feed for ${activeClassSlot.toUpperCase()} attendance…`, 'info');
    }
  };

  const stopRecognition = () => stop();

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
      <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
        <div>
          <div className="flex gap-2.5 items-center mb-1">
            <div className="bg-emerald-500/10 border border-emerald-500/20 flex h-9 items-center justify-center rounded-xl w-9">
              <ScanFace className="h-5 text-emerald-500 w-5" />
            </div>
            <h2 className="dark:text-white font-bold text-slate-900 text-xl">Classroom Attendance</h2>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${webcamOn && !webcamError ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : isStartingStream ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-400 animate-pulse' : isStartingStream ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`} />
              {isStartingStream ? 'INITIALIZING AI' : webcamOn && !webcamError ? 'AI CAMERA LIVE' : 'FEED OFFLINE'}
            </span>
          </div>
          <p className="dark:text-slate-400 text-slate-500 text-xs">
            AI face recognition updates {activeSlotInfo.label} ({activeSlotInfo.subject}) in the database per day-wise.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={exportCSV}
            className="bg-slate-100 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 flex font-semibold gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 items-center px-3 py-1.5 rounded-lg text-slate-600 text-xs transition"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>

          <button
            onClick={() => resetAttendance()}
            className="bg-slate-100 border border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:text-slate-400 flex font-semibold gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 items-center px-3 py-1.5 rounded-lg text-slate-600 text-xs transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Today
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
            <button onClick={startRecognition} className="bg-emerald-600 cursor-pointer flex font-semibold gap-1.5 hover:bg-emerald-500 items-center px-4 py-1.5 rounded-lg shadow-sm text-white text-xs transition">
              <Play className="h-3.5 w-3.5" />
              Start Scan
            </button>
          ) : (
            <button onClick={stopRecognition} className="bg-rose-600 cursor-pointer flex font-semibold gap-1.5 hover:bg-rose-500 items-center px-4 py-1.5 rounded-lg shadow-sm text-white text-xs transition">
              <Square className="h-3.5 w-3.5" />
              Stop Scan
            </button>
          )}
        </div>
      </div>

      {/* CLASS PERIOD SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center p-2.5 rounded-xl">
        <span className="dark:text-slate-400 flex font-bold gap-1.5 items-center px-2 text-[10px] text-slate-500 tracking-wider uppercase">
          <BookOpen className="h-3.5 text-emerald-500 w-3.5" />
          Select Class Period:
        </span>
        {CLASS_SLOTS.map(slot => {
          const isSelected = activeClassSlot === slot.id;
          const count = students.filter(s => s[`${slot.id}Attendance`] === 'present').length;
          return (
            <button
              key={slot.id}
              onClick={() => setActiveClassSlot(slot.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${ isSelected ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800' }`}
            >
              <span>{slot.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {count}/{students.length}
              </span>
              <span className="hidden md:inline opacity-75 text-[10px]">({slot.subject})</span>
            </button>
          );
        })}
      </div>

      {/* STATS */}
      <div className="gap-3 grid grid-cols-3">
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
      <div className="gap-5 grid grid-cols-1 xl:grid-cols-[1fr_340px]">
        {/* LEFT — camera + model */}
        <div className="space-y-4">
          {/* Model URL */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
              <div className="flex gap-2 items-center">
                <Cpu className="dark:text-slate-400 h-4 text-slate-500 w-4" />
                <span className="dark:text-slate-200 font-bold text-slate-800 text-xs">AI Recognition Model</span>
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
              <ClassMappingEditor labels={labels} accent="blue" />
            </div>
          </div>

          {/* AI Live Camera & Detection Stream */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl shadow-xl">
            <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
              <div className="flex gap-2 items-center">
                <Activity className={`w-4 h-4 ${webcamOn && !webcamError ? 'text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <div>
                  <p className="dark:text-white font-bold text-slate-900 text-xs">AI Camera Feed</p>
                  <p className="dark:text-slate-400 font-mono text-[9px] text-slate-500">YOLO · Python AI · camera-1 · Target: {activeSlotInfo.label}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex font-bold font-mono gap-1.5 items-center px-2 py-1 rounded-md text-[9px] text-emerald-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  {webcamOn && !webcamError ? 'LIVE' : 'OFFLINE'}
                </span>
                <span className="bg-indigo-500/10 border border-indigo-500/20 flex font-bold font-mono gap-1.5 items-center px-2 py-1 rounded-md text-[9px] text-indigo-400">
                  <CircleDot className="h-2.5 text-indigo-400 w-2.5" />
                  YOLO ACTIVE
                </span>
              </div>
            </div>

            <div className="aspect-[4/3] bg-black overflow-hidden relative">
              {webcamOn ? (
                <img
                  key={streamKey}
                  ref={streamImgRef}
                  crossOrigin="anonymous"
                  src={`http://localhost:5001/video?t=${streamKey}`}
                  alt="YOLO AI Video Stream"
                  className="h-full object-cover w-full"
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
                  <p className="dark:text-slate-400 text-[10px] text-slate-600">Enable AI feed to launch camera & begin monitoring</p>
                </div>
              )}

              {/* Feed error overlay */}
              {webcamOn && webcamError && (
                <div className="absolute bg-slate-950/90 flex flex-col gap-2 inset-0 items-center justify-center p-6 text-center z-20">
                  <AlertTriangle className="h-8 mb-1 text-amber-400 w-8" />
                  <p className="font-semibold text-slate-200 text-sm">AI Camera Feed Offline</p>
                  <p className="max-w-sm text-slate-400 text-xs">{webcamError}</p>
                  <p className="dark:text-slate-400 font-mono mt-2 text-[10px] text-slate-500">Expected stream: http://localhost:5001/video</p>
                </div>
              )}

              {/* Scanner HUD Corners */}
              {webcamOn && !webcamError && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute border-emerald-500/80 border-l-2 border-t-2 h-10 left-5 rounded-tl-lg top-5 w-10" />
                  <div className="absolute border-emerald-500/80 border-r-2 border-t-2 h-10 right-5 rounded-tr-lg top-5 w-10" />
                  <div className="absolute border-b-2 border-emerald-500/80 border-l-2 bottom-5 h-10 left-5 rounded-bl-lg w-10" />
                  <div className="absolute border-b-2 border-emerald-500/80 border-r-2 bottom-5 h-10 right-5 rounded-br-lg w-10" />
                  {running && (
                    <div className="absolute bg-emerald-500/50 h-px left-8 right-8 shadow-[0_0_12px_rgba(96,165,250,0.7)] top-1/2" />
                  )}
                </div>
              )}

              {/* Match overlay */}
              {running && lastMatch && (() => {
                const isLate = lastMatch.status === 'late';
                const matched = Boolean(lastMatch.studentId);
                const box = !matched
                  ? 'bg-slate-950/85 border-slate-200 dark:border-slate-800'
                  : isLate
                  ? 'bg-amber-950/80 border-amber-500/40'
                  : 'bg-emerald-950/80 border-emerald-500/40';
                const iconBg = !matched ? 'bg-slate-800' : isLate ? 'bg-amber-500/20' : 'bg-emerald-500/20';
                const iconColor = !matched ? 'text-slate-400' : isLate ? 'text-amber-400' : 'text-emerald-400';
                return (
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className={`rounded-xl border backdrop-blur-md shadow-2xl p-3 ${box}`}>
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                            {matched ? <ShieldCheck className={`w-5 h-5 ${iconColor}`} /> : <ScanFace className="dark:text-slate-400 h-5 text-slate-500 w-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="dark:text-slate-400 font-bold text-[9px] text-slate-500 tracking-wider uppercase">
                              {matched ? `${activeSlotInfo.label} Marked ${isLate ? 'LATE ⏰' : 'Present ✓'}` : 'Unknown Face'}
                            </p>
                            <p className="font-bold text-sm text-white truncate">{lastMatch.label}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="dark:text-slate-400 text-[9px] text-slate-500">Confidence</p>
                          <p className={`text-lg font-bold font-mono ${matched ? iconColor : 'text-slate-300'}`}>
                            {lastMatch.conf}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Active YOLO Detections Status */}
          {webcamOn && Object.keys(liveDetections).length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="flex font-bold gap-1.5 items-center text-[10px] text-slate-400 tracking-wider uppercase">
                  <Users className="h-3.5 text-emerald-500 w-3.5" />
                  Live Tracked Persons ({Object.keys(liveDetections).length})
                </span>
                <span className="font-mono text-[9px] text-emerald-400">REAL-TIME</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(liveDetections).map(d => {
                  const hasId = Boolean(d.identity || d.personId?.name);
                  const name = d.identity || d.personId?.name || `Person #${d.trackId}`;
                  return (
                    <div
                      key={d.trackId}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${ hasId ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400' }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${hasId ? 'bg-emerald-500' : 'bg-slate-400'}`} />
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

        {/* RIGHT — attendance roster for selected class slot */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl">
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
              <div>
                <span className="dark:text-white font-bold text-slate-900 text-xs">{activeSlotInfo.label} Roster</span>
                <span className="dark:text-slate-400 ml-2 text-[9px] text-slate-500">({activeSlotInfo.subject})</span>
              </div>
              <span className="font-bold font-mono text-[9px] text-emerald-400">{slotPresentCount}/{students.length}</span>
            </div>
            <div className="divide-slate-100 divide-y max-h-[600px] overflow-y-auto">
              {students.map(s => {
                const sid = s.studentId || s.id;
                const slotStatus = s[`${activeClassSlot}Attendance`]; // present | late | absent
                const isSlotPresent = slotStatus === 'present';
                const isSlotLate = slotStatus === 'late';
                const attended = isSlotPresent || isSlotLate;
                return (
                  <div key={sid} className="dark:hover:bg-slate-800 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 items-center px-4 py-2.5 transition">
                    <img
                      src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=2563eb&color=fff&size=256&bold=true`}
                      alt={s.name}
                      className="border border-slate-200 dark:border-slate-800 h-8 object-cover rounded-lg shrink-0 w-8"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="dark:text-slate-200 font-semibold text-slate-800 text-xs truncate">{s.name}</p>
                      <p className="dark:text-slate-400 font-mono text-[9px] text-slate-600">{sid} · R{s.room}</p>
                    </div>
                    <div className="flex gap-1.5 items-center shrink-0">
                      <button
                        onClick={() => {
                          if (attended) {
                            markStudentAbsent(sid, { slot: activeClassSlot });
                          } else {
                            markStudentPresent(sid, null, { slot: activeClassSlot, manual: true });
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition cursor-pointer border ${ isSlotPresent ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25' : isSlotLate ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 hover:text-slate-400' }`}
                        title="Click to toggle attendance in DB"
                      >
                        {isSlotPresent ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>PRESENT</span>
                          </>
                        ) : isSlotLate ? (
                          <>
                            <Clock3 className="h-3 w-3" />
                            <span>LATE</span>
                          </>
                        ) : (
                          <>
                            <X className="h-3 opacity-50 w-3" />
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
                  <p className="dark:text-slate-400 text-slate-500 text-xs">No students registered in database</p>
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
  const isEmerald = accent === 'emerald';
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-soft p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="dark:text-slate-400 font-bold text-[10px] text-slate-500 tracking-wider uppercase">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isEmerald ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className={`text-2xl font-bold font-mono ${isEmerald ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>{value}</p>
      {sub && <p className="dark:text-slate-400 mt-0.5 text-[10px] text-slate-500">{sub} attendance rate</p>}
    </div>
  );
}
