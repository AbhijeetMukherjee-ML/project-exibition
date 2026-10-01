import mongoose from "mongoose";
import { spawn } from "child_process";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Camera from "../models/Camera.js";
import { ensureDbConnected } from "../database.js";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let detectorProcess = null;

const buildFindQuery = (id) => {
    if (mongoose.isValidObjectId(id)) {
        return { $or: [{ _id: id }, { cameraId: id }] };
    }
    return { cameraId: id };
};

export const getAllCameras = async (filter = {}) => {
    ensureDbConnected();
    return Camera.find(filter).sort({ createdAt: -1 });
};

export const getCameraById = async (id) => {
    ensureDbConnected();
    const query = buildFindQuery(id);
    const camera = await Camera.findOne(query);
    if (!camera) {
        const error = new Error(`Camera not found with identifier: ${id}`);
        error.statusCode = 404;
        throw error;
    }
    return camera;
};

export const createCamera = async (data) => {
    ensureDbConnected();
    const { name, cameraId, location, status } = data;

    if (!name || !name.trim()) {
        const error = new Error("Camera 'name' is required");
        error.statusCode = 400;
        throw error;
    }

    if (!cameraId || !cameraId.trim()) {
        const error = new Error("Camera 'cameraId' is required");
        error.statusCode = 400;
        throw error;
    }

    const existingCamera = await Camera.findOne({ cameraId: cameraId.trim() });
    if (existingCamera) {
        const error = new Error(`Camera with cameraId '${cameraId.trim()}' already exists`);
        error.statusCode = 409;
        throw error;
    }

    const camera = new Camera({
        name: name.trim(),
        cameraId: cameraId.trim(),
        location: location ? location.trim() : "",
        status: status || "offline",
    });

    return camera.save();
};

export const updateCamera = async (id, data) => {
    ensureDbConnected();
    const query = buildFindQuery(id);

    const allowedUpdates = ["name", "location", "status", "cameraId"];
    const updates = {};
    for (const key of allowedUpdates) {
        if (data[key] !== undefined) {
            updates[key] = data[key];
        }
    }

    const updatedCamera = await Camera.findOneAndUpdate(query, updates, {
        returnDocument: "after",
        runValidators: true,
    });

    if (!updatedCamera) {
        const error = new Error(`Camera not found with identifier: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    return updatedCamera;
};

export const deleteCamera = async (id) => {
    ensureDbConnected();
    const query = buildFindQuery(id);
    const deletedCamera = await Camera.findOneAndDelete(query);

    if (!deletedCamera) {
        const error = new Error(`Camera not found with identifier: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    return deletedCamera;
};

const checkDetectorHealth = () => {
    return new Promise((resolve) => {
        const req = http.get("http://127.0.0.1:5001/health", { timeout: 1000 }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(Boolean(json.ready));
                } catch {
                    resolve(false);
                }
            });
        });

        req.on("error", () => resolve(false));
        req.on("timeout", () => {
            req.destroy();
            resolve(false);
        });
    });
};

export const getStreamStatus = async () => {
    const isRunning =
        detectorProcess !== null &&
        !detectorProcess.killed &&
        detectorProcess.exitCode === null;

    let isReady = false;
    if (isRunning) {
        isReady = await checkDetectorHealth();
    }

    return {
        running: isRunning,
        ready: isReady,
        pid: isRunning ? detectorProcess.pid : null,
        streamUrl: "http://localhost:5001/video",
    };
};

export const startStream = async () => {
    const status = await getStreamStatus();
    if (status.running && status.ready) {
        logger.info(`AI Detector is already running and ready (PID ${status.pid})`);
        return status;
    }

    // If detector was previously launched but is unresponsive or dead, clean up first
    if (detectorProcess) {
        await stopStream();
    }

    const aiDir = path.resolve(__dirname, "../../../ai");
    const venvPython = path.resolve(aiDir, ".venv/bin/python");
    const scriptPath = fs.existsSync(path.resolve(aiDir, "YOLO/Scripts/Detector.py"))
        ? path.resolve(aiDir, "YOLO/Scripts/Detector.py")
        : path.resolve(aiDir, "YOLO/Scripts/detector.py");

    const pythonCmd = fs.existsSync(venvPython) ? venvPython : "python3";

    logger.info(`Launching AI Detector: ${pythonCmd} ${scriptPath} (cwd: ${aiDir})`);

    let startupError = null;

    detectorProcess = spawn(pythonCmd, [scriptPath], {
        cwd: aiDir,
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
    });

    const currentProc = detectorProcess;

    detectorProcess.stdout.on("data", (data) => {
        const text = data.toString().trim();
        if (text) logger.info(`[AI Detector] ${text}`);
    });

    detectorProcess.stderr.on("data", (data) => {
        const text = data.toString().trim();
        if (text) {
            logger.warn(`[AI Detector stderr] ${text}`);
            startupError = text;
        }
    });

    detectorProcess.on("exit", (code, signal) => {
        logger.info(`AI Detector exited with code ${code}, signal ${signal}`);
        if (detectorProcess === currentProc) {
            detectorProcess = null;
        }
    });

    detectorProcess.on("error", (err) => {
        logger.error(`Failed to launch AI Detector: ${err.message}`);
        startupError = err.message;
        if (detectorProcess === currentProc) {
            detectorProcess = null;
        }
    });

    // Wait until Detector.py is ready and streaming frames (up to 15 seconds)
    const startTime = Date.now();
    const maxWaitMs = 15000;
    let isReady = false;

    while (Date.now() - startTime < maxWaitMs) {
        if (!detectorProcess || detectorProcess !== currentProc || currentProc.exitCode !== null) {
            const err = new Error(
                startupError || "AI Detector process exited unexpectedly during startup."
            );
            err.statusCode = 500;
            throw err;
        }

        isReady = await checkDetectorHealth();
        if (isReady) {
            logger.info("AI Detector is verified ready and streaming frames.");
            break;
        }

        await new Promise((resolve) => setTimeout(resolve, 350));
    }

    if (!isReady) {
        logger.warn("AI Detector started but did not report ready frame within 15s. Continuing...");
    }

    return {
        running: true,
        ready: isReady,
        pid: currentProc.pid,
        streamUrl: "http://localhost:5001/video",
    };
};

export const stopStream = async () => {
    if (!detectorProcess) {
        return { running: false, ready: false, pid: null, streamUrl: "http://localhost:5001/video" };
    }

    logger.info(`Stopping AI Detector PID ${detectorProcess.pid}`);
    const proc = detectorProcess;
    detectorProcess = null;

    try {
        proc.kill("SIGINT");
        await new Promise((resolve) => {
            const timer = setTimeout(() => {
                if (proc.exitCode === null) {
                    try {
                        proc.kill("SIGKILL");
                    } catch {}
                }
                resolve();
            }, 1800);

            proc.once("exit", () => {
                clearTimeout(timer);
                resolve();
            });
        });
    } catch (err) {
        logger.error(`Error terminating AI Detector: ${err.message}`);
    }

    return { running: false, ready: false, pid: null, streamUrl: "http://localhost:5001/video" };
};

export default {
    getAllCameras,
    getCameraById,
    createCamera,
    updateCamera,
    deleteCamera,
    getStreamStatus,
    startStream,
    stopStream,
};
