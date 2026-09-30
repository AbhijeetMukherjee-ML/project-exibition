import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Camera, 
  Zap, 
  Eye, 
  Clock, 
  Grid, 
  Square,
  AlertTriangle,
  Radio,
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CameraFeedPage() {
  const { 
    cameras, 
    activeCameraId, 
    setActiveCameraId, 
    activeCamera, 
    aiOverlayEnabled, 
    setAiOverlayEnabled,
    nightVision,
    setNightVision,
    currentDetection,
    triggerSimulatedScan,
    showToast
  } = useApp();

  const [useWebcam, setUseWebcam] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [isGridMode, setIsGridMode] = useState(false);
  const videoRef = useRef(null);

  // WebRTC Webcam Management
  useEffect(() => {
    let stream = null;

    if (useWebcam) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 1920, height: 1080 } })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setWebcamError(null);
          showToast("Camera Connected", "High-definition live video feed active.", "success");
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setWebcamError("Camera access denied or unavailable. Showing CCTV stream.");
          setUseWebcam(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useWebcam]);

  // Capture Snapshot
  const captureSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    if (useWebcam && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = nightVision ? '#041d10' : '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';
      ctx.font = '24px monospace';
      ctx.fillText(`SNAPSHOT: ${activeCamera.name}`, 30, 60);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Matched: ${currentDetection.student.name}`, 30, 100);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const newSnapshot = {
      id: Date.now(),
      image: dataUrl,
      camera: activeCamera.name,
      time: new Date().toLocaleTimeString(),
      person: currentDetection.student.name
    };

    setSnapshots(prev => [newSnapshot, ...prev.slice(0, 4)]);
    showToast("Snapshot Saved", `Image frame captured from ${activeCamera.name}`, "info");
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Channels Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Live CCTV Surveillance & Facial AI</h2>
            <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE FEED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active Camera: <strong className="text-slate-800 dark:text-slate-200">{activeCamera.id} — {activeCamera.name}</strong> ({activeCamera.resolution})
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setUseWebcam(!useWebcam)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              useWebcam 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {useWebcam ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{useWebcam ? 'Device Camera Active' : 'Enable Real Webcam'}</span>
          </button>

          <button
            onClick={() => setIsGridMode(!isGridMode)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Toggle Grid View"
          >
            {isGridMode ? <Square className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>

          <button
            onClick={triggerSimulatedScan}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Face Scan</span>
          </button>
        </div>
      </div>

      {webcamError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{webcamError}</span>
        </div>
      )}

      {/* Horizontal Camera Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Channels:</span>
        {cameras.map((cam) => {
          const isSelected = cam.id === activeCameraId;
          return (
            <button
              key={cam.id}
              onClick={() => {
                setActiveCameraId(cam.id);
                if (cam.id !== 'CAM-01') setUseWebcam(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></span>
              <span>{cam.id}: {cam.name}</span>
            </button>
          );
        })}
      </div>

      {/* BIGGER CAMERA VIEWPORT */}
      {!isGridMode ? (
        <div className="space-y-4">
          
          {/* Main Large Video Frame */}
          <div className={`relative w-full aspect-[16/9] max-h-[640px] rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-xl ${nightVision ? 'brightness-125 contrast-125 saturate-50 hue-rotate-90' : ''}`}>
            
            {useWebcam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
                  alt="Campus Turnstile CCTV"
                  className="w-full h-full object-cover opacity-75"
                />
              </div>
            )}

            {/* Realistic High-Res Security CCTV HUD Overlay */}
            {aiOverlayEnabled && (
              <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
                
                {/* Top CCTV Info Bar */}
                <div className="flex items-center justify-between">
                  <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono text-white flex items-center gap-2 border border-white/10 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="font-bold tracking-wider">{activeCamera.id}</span>
                    <span className="text-slate-400">|</span>
                    <span>{activeCamera.name}</span>
                  </div>

                  <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 border border-white/10 shadow-lg flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Bounding Box HUD */}
                <div
                  className="absolute transition-all duration-500 ease-out border-2 rounded-lg"
                  style={{
                    top: `${currentDetection.box.top}%`,
                    left: `${currentDetection.box.left}%`,
                    width: `${currentDetection.box.width}%`,
                    height: `${currentDetection.box.height}%`,
                    borderColor: currentDetection.status === 'CURFEW_ALERT' ? '#ef4444' : '#10b981',
                    backgroundColor: currentDetection.status === 'CURFEW_ALERT' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                    boxShadow: currentDetection.status === 'CURFEW_ALERT' ? '0 0 20px rgba(239,68,68,0.4)' : '0 0 20px rgba(16,185,129,0.4)'
                  }}
                >
                  {/* Corner Marks */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></div>

                  {/* Person Detection Tag Card */}
                  <div className="absolute -bottom-12 left-0 right-0 mx-auto w-max bg-black/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-white text-xs font-mono whitespace-nowrap shadow-2xl flex items-center gap-2.5">
                    <img
                      src={currentDetection.student.avatar}
                      alt={currentDetection.student.name}
                      className="w-6 h-6 rounded-full object-cover border border-emerald-400"
                    />
                    <span className="font-bold text-emerald-400">{currentDetection.student.name}</span>
                    <span className="text-slate-300 font-medium">({currentDetection.student.id})</span>
                    <span className="text-slate-400">Match: {currentDetection.confidence}</span>
                  </div>
                </div>

                {/* Bottom CCTV Status Info */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                    CHANNEL: 1080P @ 60FPS • NODE: 01-NORTH
                  </div>
                  <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-emerald-400 font-bold">
                    BIOMETRIC AI: VERIFIED ACTIVE
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Under-Camera Control & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Camera View Controls */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    aiOverlayEnabled 
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Bounding Box: {aiOverlayEnabled ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setNightVision(!nightVision)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    nightVision 
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  IR Night Mode: {nightVision ? 'ON' : 'OFF'}
                </button>
              </div>

              <button
                onClick={captureSnapshot}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>Save Snapshot</span>
              </button>
            </div>

            {/* Target Person Identified Card */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={currentDetection.student.avatar}
                  alt={currentDetection.student.name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentDetection.student.name}</p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{currentDetection.student.id} • Room {currentDetection.student.room}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/60">
                {currentDetection.confidence}
              </span>
            </div>

            {/* Recent Snapshots Bar */}
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Snapshots ({snapshots.length}):
              </span>
              {snapshots.length === 0 ? (
                <span className="text-xs text-slate-400">Click "Save Snapshot" to capture</span>
              ) : (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {snapshots.map(s => (
                    <img
                      key={s.id}
                      src={s.image}
                      alt={s.person}
                      title={`${s.person} at ${s.time}`}
                      className="w-10 h-8 rounded object-cover border border-slate-300 dark:border-slate-700"
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* 4-Camera Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map((cam) => (
            <div key={cam.id} className="bg-black rounded-xl overflow-hidden border border-slate-800 relative aspect-video group shadow-md">
              <img
                src={
                  cam.id === 'CAM-01'
                    ? "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
                    : cam.id === 'CAM-02'
                    ? "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                    : cam.id === 'CAM-03'
                    ? "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
                    : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                }
                alt={cam.name}
                className="w-full h-full object-cover opacity-70"
              />

              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{cam.id}: {cam.name}</span>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => {
                    setActiveCameraId(cam.id);
                    setIsGridMode(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-lg"
                >
                  Expand Camera Stream
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
