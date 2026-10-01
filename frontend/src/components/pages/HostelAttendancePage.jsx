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
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getSocketURL,
  apiStartCameraStream,
  apiStopCameraStream,
  apiGetCameraStreamStatus,
} from '../../services/api';

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
    showToast
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

  const viewportRef = useRef(null);

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
      try {
        await apiStopCameraStream();
        showToast('AI Camera Offline', 'Detector process stopped.', 'info');
      } catch (err) {
        console.error('Failed to stop AI stream:', err);
      }
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Hostel Curfew Attendance</h2>
            {isCurfewTime && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border bg-amber-500/10 border-amber-500/20 text-amber-400 text-[10px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                CURFEW ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            After curfew time (10 PM – 6 AM), AI camera marks hostel gate attendance and flags late arrivals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 cursor-pointer transition">
            <Download className="w-3.5 h-3.5" />
            Export Log
          </button>
          <button
            onClick={handleToggleFeed}
            disabled={isStartingStream}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition ${
              webcamOn ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
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
          <button
            onClick={triggerSimulatedScan}
            className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Scan
          </button>
        </div>
      </div>

      {/* Curfew time banner */}
      {isCurfewTime ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-300">Curfew is Active — {now.toLocaleTimeString()}</p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              AI is monitoring the hostel gate. Any student entering after 10 PM is automatically flagged as a curfew violation.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700">
          <Clock3 className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-300">Curfew starts at 10:00 PM</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Current time: {now.toLocaleTimeString()}. Hostel gate monitoring will auto-activate when curfew begins.
            </p>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Entries After Hours" value={totalIn} icon={ArrowDownLeft} accent="emerald" />
        <StatCard label="Exits After Hours" value={totalOut} icon={ArrowUpRight} />
        <StatCard label="Curfew Violations" value={violations} icon={AlertTriangle} accent={violations > 0 ? 'rose' : 'slate'} />
      </div>

      {/* CAMERA + LOG */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">

        {/* CAMERA FEED */}
        <div className="space-y-3">

          {/* Hostel Block selector */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#0b1320] border border-slate-800">
              <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Hostel Blocks
              </div>
              {HOSTEL_BLOCKS.map(blk => {
                const selected = blk.id === activeBlockId;
                return (
                  <button
                    key={blk.id}
                    onClick={() => setActiveBlockId(blk.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${selected ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-emerald-500'}`} />
                    {blk.name}
                    <span className="hidden sm:inline text-xs opacity-80">{blk.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsGridMode(!isGridMode)}
                className="ml-auto px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {isGridMode ? <Square className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
                {isGridMode ? 'Single' : 'Grid'}
              </button>
            </div>

            {/* Active block info pill */}
            {activeBlock && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0b1320] border border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="font-bold text-violet-400">{activeBlock.name}</span>
                <span className="text-slate-600">·</span>
                <span>{activeBlock.label}</span>
                <span className="text-slate-600">·</span>
                <span>{activeBlock.gender}</span>
                <span className="text-slate-600">·</span>
                <span>{activeBlock.floors} Floors</span>
                <span className={`ml-auto flex items-center gap-1.5 ${webcamOn && !webcamError ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                  {webcamOn && !webcamError ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            )}
          </div>

          {!isGridMode ? (
            /* SINGLE VIEW */
            <div ref={viewportRef} className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
              {webcamOn ? (
                <img
                  key={streamKey}
                  src={`${AI_STREAM_URL}?t=${streamKey}`}
                  alt="Hostel AI Video Stream"
                  className={`w-full h-full object-cover ${nightVision ? 'brightness-125 contrast-125 saturate-50 hue-rotate-90' : ''}`}
                  onLoad={() => setWebcamError(null)}
                  onError={() => setWebcamError(`AI video stream unavailable at ${AI_STREAM_URL}. Ensure the Python YOLO detector is running on port 5001.`)}
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
                  <p className="text-[10px] text-slate-600">Enable AI feed to launch the hostel gate camera</p>
                </div>
              )}

              {/* Feed error overlay */}
              {webcamOn && webcamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/90 text-center gap-2 z-30">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mb-1" />
                  <p className="text-sm font-semibold text-slate-200">AI Camera Feed Offline</p>
                  <p className="text-xs text-slate-400 max-w-sm">{webcamError}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-2">Expected stream: {AI_STREAM_URL}</p>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.4) 4px)' }}
              />

              {aiOverlayEnabled && webcamOn && !webcamError && (
                <>
                  {/* Top HUD */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className="flex gap-2">
                      <div className="px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-bold">{activeBlock?.name}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-300">{activeBlock?.label}</span>
                      </div>
                      <div className="hidden sm:flex px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] items-center gap-2">
                        <Clock3 className="w-3 h-3 text-violet-400" />
                        {now.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <Wifi className="w-3 h-3" />
                      1080P / 30FPS
                    </div>
                  </div>

                  {/* Bottom HUD */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                      {activeBlock?.name} · {activeBlock?.label} · ENCRYPTED
                    </div>
                    <div className={`px-3 py-2 rounded-lg backdrop-blur-md border text-[10px] font-mono font-bold ${detectionIsAlert ? 'bg-red-950/80 border-red-500/30 text-red-400' : 'bg-violet-950/80 border-violet-500/30 text-violet-400'}`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                      {detectionIsAlert ? 'CURFEW VIOLATION' : 'HOSTEL AI ACTIVE'}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* GRID VIEW — all 8 blocks */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {HOSTEL_BLOCKS.map(blk => (
                <div
                  key={blk.id}
                  onClick={() => { setActiveBlockId(blk.id); setIsGridMode(false); }}
                  className="relative aspect-video overflow-hidden rounded-xl bg-black border border-slate-800 shadow-lg group cursor-pointer"
                >
                  {webcamOn && !webcamError ? (
                    <img
                      key={`${streamKey}-${blk.id}`}
                      src={`${AI_STREAM_URL}?t=${streamKey}&blk=${blk.id}`}
                      alt={blk.label}
                      className={`w-full h-full object-cover group-hover:brightness-110 transition-all ${nightVision ? 'brightness-125 contrast-125 saturate-50 hue-rotate-90' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                      <VideoOff className="w-6 h-6 text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 border border-white/10 font-mono text-[10px] text-white">
                    <span className={`w-1.5 h-1.5 rounded-full ${webcamOn && !webcamError ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    {blk.name}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[11px] font-semibold truncate">{blk.label}</p>
                    <p className="text-slate-400 text-[9px] font-mono">{blk.gender} · {blk.floors}F</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Controls */}
          <div className="flex items-center gap-3 p-3 bg-[#0b1320] border border-slate-800 rounded-xl">
            <ToggleSwitch
              label="AI Detection Overlay"
              enabled={aiOverlayEnabled}
              onToggle={() => setAiOverlayEnabled(!aiOverlayEnabled)}
              icon={Eye}
            />
            <div className="w-px h-6 bg-slate-800" />
            <ToggleSwitch
              label="IR Night Vision"
              enabled={nightVision}
              onToggle={() => setNightVision(!nightVision)}
              icon={Moon}
            />
          </div>
        </div>

        {/* RIGHT — Curfew log */}
        <div className="space-y-3">
          <div className="bg-[#0b1320] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">After-Hours Log</span>
              <span className="text-[9px] font-mono text-slate-500">{hostelLogs.length} EVENTS</span>
            </div>
            <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-800">
              {hostelLogs.length === 0 && (
                <div className="py-12 text-center">
                  <Building2 className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">No after-hours activity recorded</p>
                </div>
              )}
              {hostelLogs.map(log => (
                <div key={log.id} className={`flex items-start gap-3 px-4 py-3 ${log.curfewAlert ? 'bg-rose-500/[0.03]' : ''}`}>
                  <img src={log.avatar} alt={log.studentName} className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-200 truncate">{log.studentName}</p>
                      {log.curfewAlert && (
                        <span className="inline-flex items-center gap-1 text-[8px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                          VIOLATION
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] font-mono text-slate-600 mt-0.5">{log.studentId} · R{log.room}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold font-mono ${log.direction === 'IN' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {log.direction === 'IN' ? '↙ IN' : '↗ OUT'}
                      </span>
                      <span className="text-[9px] text-slate-600">{log.timestamp?.split(' ')[1] || ''}</span>
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
  const colors = {
    emerald: 'text-emerald-400 border-emerald-900/40',
    rose: 'text-rose-400 border-rose-900/40',
    slate: 'text-slate-400 border-slate-800'
  };
  return (
    <div className={`p-4 bg-[#0b1320] border rounded-xl ${colors[accent]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${accent === 'emerald' ? 'text-emerald-500' : accent === 'rose' ? 'text-rose-500' : 'text-slate-500'}`} />
      </div>
      <p className={`text-2xl font-bold font-mono ${accent === 'emerald' ? 'text-emerald-400' : accent === 'rose' ? 'text-rose-400' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function ToggleSwitch({ label, enabled, onToggle, icon: Icon }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-2 cursor-pointer group">
      <Icon className={`w-3.5 h-3.5 ${enabled ? 'text-violet-400' : 'text-slate-500'}`} />
      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition">{label}</span>
      <div className={`relative w-8 h-4 rounded-full transition-colors ${enabled ? 'bg-violet-600' : 'bg-slate-700'}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : ''}`} />
      </div>
    </button>
  );
}
