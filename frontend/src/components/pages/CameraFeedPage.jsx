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
  CheckCircle2,
  ShieldCheck,
  Activity,
  ScanFace,
  Moon,
  Crosshair,
  Image as ImageIcon,
  Wifi,
  Cpu,
  ChevronRight
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef(null);
  const viewportRef = useRef(null);

  // --------------------------------------------------
  // Webcam
  // --------------------------------------------------

  useEffect(() => {
    let stream = null;

    if (useWebcam) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            width: 1920,
            height: 1080
          }
        })
        .then((mediaStream) => {
          stream = mediaStream;

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          setWebcamError(null);

          showToast(
            'Camera Connected',
            'High-definition live video feed active.',
            'success'
          );
        })
        .catch((err) => {
          console.error('Camera error:', err);

          setWebcamError(
            'Camera access denied or unavailable. Showing CCTV stream.'
          );

          setUseWebcam(false);
        });
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());

        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam]);

  // --------------------------------------------------
  // Snapshot
  // --------------------------------------------------

  const captureSnapshot = () => {
    const canvas = document.createElement('canvas');

    canvas.width = 1280;
    canvas.height = 720;

    const ctx = canvas.getContext('2d');

    if (useWebcam && videoRef.current) {
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      ctx.fillStyle = nightVision ? '#041d10' : '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#3b82f6';
      ctx.font = '24px monospace';

      ctx.fillText(
        `SNAPSHOT: ${activeCamera.name}`,
        30,
        60
      );

      ctx.fillStyle = '#ffffff';

      ctx.fillText(
        `Matched: ${currentDetection.student.name}`,
        30,
        100
      );
    }

    const dataUrl = canvas.toDataURL('image/png');

    const newSnapshot = {
      id: Date.now(),
      image: dataUrl,
      camera: activeCamera.name,
      time: new Date().toLocaleTimeString(),
      person: currentDetection.student.name
    };

    setSnapshots((prev) => [
      newSnapshot,
      ...prev.slice(0, 4)
    ]);

    showToast(
      'Snapshot Saved',
      `Image frame captured from ${activeCamera.name}`,
      'info'
    );
  };

  // --------------------------------------------------
  // Fullscreen
  // --------------------------------------------------

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await viewportRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreen
    );

    return () =>
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreen
      );
  }, []);

  // --------------------------------------------------
  // Camera image
  // --------------------------------------------------

  const getCameraImage = (cam) => {
    if (cam.id === 'CAM-01') {
      return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85';
    }

    if (cam.id === 'CAM-02') {
      return 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=85';
    }

    if (cam.id === 'CAM-03') {
      return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=85';
    }

    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85';
  };

  const detectionIsAlert =
    currentDetection.status === 'CURFEW_ALERT';

  return (
    <div className="space-y-4">

      {/* =====================================================
          COMMAND HEADER
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

        <div className="p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Surveillance Command
                </h2>

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM ONLINE
                </span>

              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time CCTV monitoring, biometric detection and AI-assisted security analysis
              </p>
            </div>

          </div>

          {/* Header Controls */}

          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={() => setUseWebcam(!useWebcam)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                useWebcam
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {useWebcam ? (
                <Video className="w-3.5 h-3.5" />
              ) : (
                <VideoOff className="w-3.5 h-3.5" />
              )}

              {useWebcam
                ? 'Device Camera'
                : 'Real Webcam'}
            </button>

            <button
              onClick={() => setIsGridMode(!isGridMode)}
              className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {isGridMode ? (
                <Square className="w-3.5 h-3.5" />
              ) : (
                <Grid className="w-3.5 h-3.5" />
              )}

              {isGridMode ? 'Single View' : 'Grid View'}
            </button>

            <button
              onClick={triggerSimulatedScan}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Simulate Scan
            </button>

          </div>

        </div>

        {/* System Metrics */}

        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200 dark:border-slate-800">

          <Metric
            icon={Radio}
            label="Feed Status"
            value="LIVE"
            accent="emerald"
          />

          <Metric
            icon={Cpu}
            label="AI Engine"
            value="ACTIVE"
            accent="blue"
          />

          <Metric
            icon={ShieldCheck}
            label="Security"
            value="ARMED"
            accent="violet"
          />

          <Metric
            icon={Activity}
            label="Detection"
            value="MONITORING"
            accent="amber"
          />

        </div>

      </div>

      {/* Webcam Error */}

      {webcamError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {webcamError}
        </div>
      )}

      {/* =====================================================
          CAMERA CHANNELS
      ====================================================== */}

      <div className="flex flex-col lg:flex-row gap-3">

        <div className="flex-1 flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

          <div className="px-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Video className="w-3.5 h-3.5" />
            Channels
          </div>

          {cameras.map((cam) => {

            const selected =
              cam.id === activeCameraId;

            return (
              <button
                key={cam.id}
                onClick={() => {
                  setActiveCameraId(cam.id);

                  if (cam.id !== 'CAM-01') {
                    setUseWebcam(false);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >

                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    selected
                      ? 'bg-white'
                      : 'bg-emerald-500'
                  }`}
                />

                {cam.id}

                <span className="hidden sm:inline">
                  {cam.name}
                </span>

              </button>
            );
          })}

        </div>

      </div>

      {/* =====================================================
          MAIN SURVEILLANCE AREA
      ====================================================== */}

      {!isGridMode ? (

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4">

          {/* VIDEO */}

          <div
            ref={viewportRef}
            className="relative aspect-video xl:aspect-auto xl:min-h-[600px] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl"
          >

            {useWebcam ? (

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

            ) : (

              <img
                src={getCameraImage(activeCamera)}
                alt={activeCamera.name}
                className={`w-full h-full object-cover ${
                  nightVision
                    ? 'brightness-125 contrast-125 saturate-50 hue-rotate-90'
                    : ''
                }`}
              />

            )}

            {/* Dark CCTV gradient */}

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

            {/* Scanlines */}

            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.4) 4px)'
              }}
            />

            {/* TOP HUD */}

            {aiOverlayEnabled && (

              <>

                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">

                  <div className="flex gap-2">

                    <div className="px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-[11px]">

                      <div className="flex items-center gap-2">

                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                        <span className="font-bold">
                          {activeCamera.id}
                        </span>

                        <span className="text-slate-400">
                          /
                        </span>

                        <span className="text-slate-300">
                          {activeCamera.name}
                        </span>

                      </div>

                    </div>

                    <div className="hidden sm:flex px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] items-center gap-2">

                      <Clock className="w-3 h-3 text-blue-400" />

                      {new Date().toLocaleTimeString()}

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <div className="px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">

                      <Wifi className="w-3 h-3" />

                      1080P / 60FPS

                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white hover:bg-black cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>

                {/* Detection Box */}

                <div
                  className="absolute transition-all duration-500 rounded-md"
                  style={{
                    top: `${currentDetection.box.top}%`,
                    left: `${currentDetection.box.left}%`,
                    width: `${currentDetection.box.width}%`,
                    height: `${currentDetection.box.height}%`,
                    border: `2px solid ${
                      detectionIsAlert
                        ? '#ef4444'
                        : '#10b981'
                    }`,
                    backgroundColor: detectionIsAlert
                      ? 'rgba(239,68,68,.12)'
                      : 'rgba(16,185,129,.10)',
                    boxShadow: detectionIsAlert
                      ? '0 0 30px rgba(239,68,68,.5)'
                      : '0 0 30px rgba(16,185,129,.4)'
                  }}
                >

                  {/* Corner brackets */}

                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-white" />

                  {/* Detection label */}

                  <div className="absolute -top-10 left-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/90 border border-white/10 backdrop-blur-md whitespace-nowrap">

                    <Crosshair
                      className={`w-3.5 h-3.5 ${
                        detectionIsAlert
                          ? 'text-red-400'
                          : 'text-emerald-400'
                      }`}
                    />

                    <span className="text-white text-[10px] font-mono font-bold">
                      {detectionIsAlert
                        ? 'ALERT DETECTED'
                        : 'FACE DETECTED'}
                    </span>

                  </div>

                  {/* Person tag */}

                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2">

                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 shadow-xl whitespace-nowrap">

                      <img
                        src={currentDetection.student.avatar}
                        alt={currentDetection.student.name}
                        className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                      />

                      <div>

                        <p className="text-[11px] font-bold text-white">
                          {currentDetection.student.name}
                        </p>

                        <p className="text-[9px] font-mono text-slate-400">
                          {currentDetection.student.id}
                        </p>

                      </div>

                      <div className="h-6 w-px bg-white/10" />

                      <div className="text-right">

                        <p className="text-[9px] text-slate-400">
                          MATCH
                        </p>

                        <p className="text-[11px] font-mono font-bold text-emerald-400">
                          {currentDetection.confidence}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Bottom HUD */}

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">

                  <div className="px-3 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">

                    NODE: 01-NORTH
                    <span className="mx-2 text-slate-600">•</span>
                    CHANNEL: {activeCamera.id}
                    <span className="mx-2 text-slate-600">•</span>
                    ENCRYPTED

                  </div>

                  <div
                    className={`px-3 py-2 rounded-lg backdrop-blur-md border text-[10px] font-mono font-bold ${
                      detectionIsAlert
                        ? 'bg-red-950/80 border-red-500/30 text-red-400'
                        : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                    BIOMETRIC AI ACTIVE
                  </div>

                </div>

              </>

            )}

          </div>

          {/* =================================================
              RIGHT INTELLIGENCE PANEL
          ================================================== */}

          <div className="space-y-3">

            {/* Detection */}

            <Panel title="Live Detection" icon={ScanFace}>

              <div className="flex items-center gap-3">

                <img
                  src={currentDetection.student.avatar}
                  alt={currentDetection.student.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />

                <div className="min-w-0">

                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentDetection.student.name}
                  </p>

                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {currentDetection.student.id}
                  </p>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    Room {currentDetection.student.room}
                  </p>

                </div>

              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">

                <InfoBox
                  label="Confidence"
                  value={currentDetection.confidence}
                  green
                />

                <InfoBox
                  label="Status"
                  value={
                    detectionIsAlert
                      ? 'ALERT'
                      : 'VERIFIED'
                  }
                  green={!detectionIsAlert}
                  red={detectionIsAlert}
                />

              </div>

            </Panel>

            {/* AI Controls */}

            <Panel title="AI Controls" icon={Cpu}>

              <ToggleRow
                icon={Eye}
                label="Detection Overlay"
                description="Show biometric bounding boxes"
                enabled={aiOverlayEnabled}
                onClick={() =>
                  setAiOverlayEnabled(!aiOverlayEnabled)
                }
              />

              <ToggleRow
                icon={Moon}
                label="IR Night Vision"
                description="Enhanced low-light visibility"
                enabled={nightVision}
                onClick={() =>
                  setNightVision(!nightVision)
                }
              />

            </Panel>

            {/* Camera Information */}

            <Panel title="Camera Diagnostics" icon={Activity}>

              <Diagnostic
                label="Resolution"
                value={activeCamera.resolution}
              />

              <Diagnostic
                label="Connection"
                value="STABLE"
                success
              />

              <Diagnostic
                label="AI Processing"
                value="REAL-TIME"
                success
              />

              <Diagnostic
                label="Channel"
                value={activeCamera.id}
              />

            </Panel>

            {/* Snapshot */}

            <button
              onClick={captureSnapshot}
              className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Camera className="w-4 h-4" />
              Capture Evidence Snapshot
            </button>

          </div>

        </div>

      ) : (

        /* =====================================================
           GRID MODE
        ====================================================== */

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {cameras.map((cam) => (

            <div
              key={cam.id}
              className="relative aspect-video overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-lg group"
            >

              <img
                src={getCameraImage(cam)}
                alt={cam.name}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

              <div className="absolute top-3 left-3 right-3 flex justify-between">

                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md text-white border border-white/10 text-[10px] font-mono">

                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />

                  {cam.id}

                  <span className="text-slate-400">
                    {cam.name}
                  </span>

                </div>

                <div className="px-2 py-1 rounded bg-black/70 text-[9px] font-mono text-emerald-400">
                  LIVE
                </div>

              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">

                <div>

                  <p className="text-white text-xs font-semibold">
                    {cam.name}
                  </p>

                  <p className="text-slate-400 text-[9px] font-mono mt-0.5">
                    {cam.resolution} • AI ACTIVE
                  </p>

                </div>

                <button
                  onClick={() => {
                    setActiveCameraId(cam.id);
                    setIsGridMode(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Open
                  <ChevronRight className="w-3 h-3" />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =====================================================
          BOTTOM CONTROLS
      ====================================================== */}

      {!isGridMode && (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

          {/* View controls */}

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

            <div className="flex items-center justify-between mb-3">

              <div>

                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Camera Controls
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Configure live monitoring
                </p>

              </div>

              <Camera className="w-4 h-4 text-slate-400" />

            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  setAiOverlayEnabled(!aiOverlayEnabled)
                }
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                  aiOverlayEnabled
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'
                }`}
              >
                Bounding Box {aiOverlayEnabled ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => setNightVision(!nightVision)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                  nightVision
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'
                }`}
              >
                IR Mode {nightVision ? 'ON' : 'OFF'}
              </button>

            </div>

          </div>

          {/* Current target */}

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

            <div className="flex items-center gap-3">

              <img
                src={currentDetection.student.avatar}
                alt={currentDetection.student.name}
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />

              <div className="flex-1 min-w-0">

                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentDetection.student.name}
                </p>

                <p className="text-[10px] font-mono text-slate-400">
                  {currentDetection.student.id}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[9px] text-slate-400 uppercase">
                  Match
                </p>

                <p className="text-sm font-mono font-bold text-emerald-500">
                  {currentDetection.confidence}
                </p>

              </div>

            </div>

          </div>

          {/* Snapshots */}

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

            <div className="flex items-center justify-between mb-2">

              <div className="flex items-center gap-1.5">

                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Evidence
                </span>

                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                  {snapshots.length}
                </span>

              </div>

              <button
                onClick={captureSnapshot}
                className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Capture
              </button>

            </div>

            {snapshots.length === 0 ? (

              <p className="text-[10px] text-slate-400">
                No evidence captured yet.
              </p>

            ) : (

              <div className="flex gap-2 overflow-x-auto">

                {snapshots.map((snapshot) => (

                  <img
                    key={snapshot.id}
                    src={snapshot.image}
                    alt={snapshot.person}
                    title={`${snapshot.person} • ${snapshot.time}`}
                    className="w-14 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                  />

                ))}

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


/* ============================================================
   SMALL UI COMPONENTS
============================================================ */

function Metric({
  icon: Icon,
  label,
  value,
  accent
}) {
  const accentClasses = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    violet: 'text-violet-500',
    amber: 'text-amber-500'
  };

  return (
    <div className="px-4 py-2.5 flex items-center gap-2.5">

      <Icon
        className={`w-3.5 h-3.5 ${
          accentClasses[accent]
        }`}
      />

      <div>

        <p className="text-[9px] uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p
          className={`text-[10px] font-mono font-bold ${
            accentClasses[accent]
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}


function Panel({
  title,
  icon: Icon,
  children
}) {
  return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

      <div className="flex items-center gap-2 mb-3">

        <Icon className="w-3.5 h-3.5 text-blue-500" />

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>

      </div>

      {children}

    </div>
  );
}


function InfoBox({
  label,
  value,
  green,
  red
}) {
  return (
    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

      <p className="text-[9px] uppercase text-slate-400">
        {label}
      </p>

      <p
        className={`text-xs font-mono font-bold mt-0.5 ${
          red
            ? 'text-red-500'
            : green
            ? 'text-emerald-500'
            : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {value}
      </p>

    </div>
  );
}


function ToggleRow({
  icon: Icon,
  label,
  description,
  enabled,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2 text-left cursor-pointer group"
    >

      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          enabled
            ? 'bg-blue-50 dark:bg-blue-950 text-blue-500'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      <div className="flex-1">

        <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </p>

        <p className="text-[9px] text-slate-400">
          {description}
        </p>

      </div>

      <div
        className={`w-8 h-4 rounded-full relative transition-colors ${
          enabled
            ? 'bg-blue-600'
            : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >

        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
            enabled
              ? 'translate-x-4'
              : 'translate-x-0.5'
          }`}
        />

      </div>

    </button>
  );
}


function Diagnostic({
  label,
  value,
  success
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0 border-slate-100 dark:border-slate-800">

      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <span
        className={`text-[10px] font-mono font-semibold ${
          success
            ? 'text-emerald-500'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {value}
      </span>

    </div>
  );
}