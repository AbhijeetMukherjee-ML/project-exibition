import logging
import signal
import sys
import threading
import time

import cv2
import requests
from flask import Flask, Response, jsonify
from ultralytics import YOLO

MODEL_PATH = "YOLO/Model/yolo26m.pt"
BACKEND_URL = "http://localhost:4000/api/detections"
CAMERA_ID = "camera-1"
SEND_INTERVAL = 0.5
STREAM_PORT = 5001

# Suppress werkzeug request logs to prevent console spam
log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)

app = Flask(__name__)
latest_frame = None
frame_lock = threading.Lock()
cap = None


@app.route("/health")
def health():
    with frame_lock:
        is_ready = latest_frame is not None
    return jsonify({"status": "ok", "ready": is_ready})


@app.route("/video")
def video():
    def generate():
        while True:
            with frame_lock:
                frame = latest_frame

            if frame is None:
                time.sleep(0.01)
                continue

            yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")

            time.sleep(0.03)

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


def run_stream_server():
    app.run(host="0.0.0.0", port=STREAM_PORT, threaded=True, use_reloader=False)


def cleanup_and_exit(signum=None, frame=None):
    global cap
    print("[AI] Shutting down detector process cleanly...")
    try:
        if cap is not None and cap.isOpened():
            cap.release()
    except Exception:
        pass
    sys.exit(0)


signal.signal(signal.SIGINT, cleanup_and_exit)
signal.signal(signal.SIGTERM, cleanup_and_exit)


def send_detection(track_id, box, confidence):
    x1, y1, x2, y2 = box

    data = {
        "cameraId": CAMERA_ID,
        "trackId": int(track_id),
        "detectionConfidence": float(confidence),
        "identity": None,
        "identityConfidence": 0,
        "boundingBox": {
            "x": float(x1),
            "y": float(y1),
            "width": float(x2 - x1),
            "height": float(y2 - y1),
        },
    }

    try:
        response = requests.post(BACKEND_URL, json=data, timeout=2)

        if response.ok:
            print(f"[BACKEND] Sent track {int(track_id)}")
        else:
            print(f"[BACKEND ERROR] {response.status_code}: {response.text}")

    except requests.RequestException as e:
        print(f"[BACKEND ERROR] {e}")


print("[AI] Starting video server...")
threading.Thread(target=run_stream_server, daemon=True).start()
print(f"[AI] Video stream: http://localhost:{STREAM_PORT}/video")

print("[AI] Loading YOLO26-M...")
model = YOLO(MODEL_PATH)
print("[AI] Model loaded.")

# Auto-detect device (0 for CUDA if available, else cpu)
try:
    import torch
    device = 0 if torch.cuda.is_available() else "cpu"
except Exception:
    device = "cpu"
print(f"[AI] Using compute device: {device}")

print("[AI] Opening camera...")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("[AI] Failed to open camera device 0.")
    sys.exit(1)

last_send_time = 0
ready_announced = False

try:
    while True:
        ret, frame = cap.read()

        if not ret:
            print("[AI] Failed to read camera frame.")
            break

        results = model.track(
            frame, persist=True, device=device, classes=[0], conf=0.35, verbose=False
        )

        result = results[0]

        if result.boxes is not None:
            boxes = result.boxes.xyxy.cpu().numpy()
            confidences = result.boxes.conf.cpu().numpy()

            if result.boxes.id is not None:
                track_ids = result.boxes.id.cpu().numpy()
            else:
                track_ids = range(len(boxes))

            should_send = time.time() - last_send_time >= SEND_INTERVAL

            for box, confidence, track_id in zip(boxes, confidences, track_ids):
                x1, y1, x2, y2 = map(int, box)

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                label = f"Person {int(track_id)} | {confidence:.2f}"

                cv2.putText(
                    frame,
                    label,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2,
                )

                if should_send:
                    send_detection(track_id, box, confidence)

            if should_send:
                last_send_time = time.time()

        ret, jpeg = cv2.imencode(".jpg", frame)

        if ret:
            with frame_lock:
                latest_frame = jpeg.tobytes()
            if not ready_announced:
                ready_announced = True
                print("[AI] Detector ready and streaming frames.")
finally:
    if cap is not None and cap.isOpened():
        cap.release()
    print("[AI] Camera released.")
