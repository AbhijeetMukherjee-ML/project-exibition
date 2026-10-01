import mongoose from "mongoose";
import Detection from "../models/Detection.js";
import { emitSocketEvent } from "../socket.js";
import { ensureDbConnected, isDbConnected } from "../database.js";

export const validateDetectionInput = (data) => {
    const { cameraId, trackId, boundingBox } = data;

    if (!cameraId || typeof cameraId !== "string" || !cameraId.trim()) {
        const error = new Error("Field 'cameraId' is required and must be a non-empty string");
        error.statusCode = 400;
        throw error;
    }

    if (trackId === undefined || trackId === null || isNaN(Number(trackId))) {
        const error = new Error("Field 'trackId' is required and must be a number");
        error.statusCode = 400;
        throw error;
    }

    if (!boundingBox || typeof boundingBox !== "object") {
        const error = new Error("Field 'boundingBox' is required and must be an object { x, y, width, height }");
        error.statusCode = 400;
        throw error;
    }

    const { x, y, width, height } = boundingBox;
    if (
        x === undefined || isNaN(Number(x)) ||
        y === undefined || isNaN(Number(y)) ||
        width === undefined || isNaN(Number(width)) ||
        height === undefined || isNaN(Number(height))
    ) {
        const error = new Error("Field 'boundingBox' must contain valid numeric properties: x, y, width, height");
        error.statusCode = 400;
        throw error;
    }
};

export const createDetection = async (data) => {
    validateDetectionInput(data);

    const now = new Date();
    const detectionData = {
        cameraId: data.cameraId.trim(),
        trackId: Number(data.trackId),
        personId: data.personId && mongoose.isValidObjectId(data.personId) ? data.personId : null,
        identity: data.identity !== undefined ? (data.identity ? String(data.identity).trim() : null) : null,
        identityConfidence: data.identityConfidence !== undefined ? Number(data.identityConfidence) : 0,
        detectionConfidence: data.detectionConfidence !== undefined ? Number(data.detectionConfidence) : 0,
        boundingBox: {
            x: Number(data.boundingBox.x),
            y: Number(data.boundingBox.y),
            width: Number(data.boundingBox.width),
            height: Number(data.boundingBox.height),
        },
        firstSeen: data.firstSeen ? new Date(data.firstSeen) : now,
        lastSeen: data.lastSeen ? new Date(data.lastSeen) : now,
    };

    // When MongoDB is unavailable (offline mode), still broadcast the detection
    // over Socket.IO so the dashboard receives live YOLO boxes for in-browser
    // Teachable Machine recognition — persistence is simply skipped.
    if (!isDbConnected()) {
        const liveDetection = { ...detectionData, _id: null, persisted: false };
        emitSocketEvent("detection:update", liveDetection);
        return liveDetection;
    }

    const detection = new Detection(detectionData);
    const savedDetection = await detection.save();

    // Populate person details if linked
    if (savedDetection.personId) {
        await savedDetection.populate("personId", "name externalId");
    }

    // Emit real-time update event via Socket.IO
    emitSocketEvent("detection:update", savedDetection);

    return savedDetection;
};

export const getCurrentDetections = async (windowSeconds = 30, cameraId = null) => {
    ensureDbConnected();

    const cutoff = new Date(Date.now() - windowSeconds * 1000);
    const filter = {
        lastSeen: { $gte: cutoff },
    };

    if (cameraId) {
        filter.cameraId = cameraId;
    }

    const detections = await Detection.find(filter)
        .sort({ lastSeen: -1 })
        .populate("personId", "name externalId");

    return {
        timestamp: new Date().toISOString(),
        windowSeconds,
        count: detections.length,
        detections,
    };
};

export const getAllDetections = async (filter = {}, options = {}) => {
    ensureDbConnected();

    const limit = Math.min(Math.max(parseInt(options.limit, 10) || 50, 1), 200);
    const skip = Math.max(parseInt(options.skip, 10) || 0, 0);

    const detections = await Detection.find(filter)
        .sort({ lastSeen: -1 })
        .skip(skip)
        .limit(limit)
        .populate("personId", "name externalId");

    const total = await Detection.countDocuments(filter);

    return {
        total,
        limit,
        skip,
        detections,
    };
};

export const getDetectionById = async (id) => {
    ensureDbConnected();

    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Invalid detection ID: ${id}`);
        error.statusCode = 400;
        throw error;
    }

    const detection = await Detection.findById(id).populate("personId", "name externalId");
    if (!detection) {
        const error = new Error(`Detection not found with ID: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    return detection;
};

export const updateDetection = async (id, data) => {
    ensureDbConnected();

    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Invalid detection ID: ${id}`);
        error.statusCode = 400;
        throw error;
    }

    // Whitelist fields the AI pipeline is allowed to update
    const allowedUpdates = [
        "identity",
        "identityConfidence",
        "detectionConfidence",
        "boundingBox",
        "lastSeen",
        "personId",
    ];
    const updates = {};
    for (const key of allowedUpdates) {
        if (data[key] !== undefined) {
            updates[key] = data[key];
        }
    }

    if (updates.boundingBox) {
        const { x, y, width, height } = updates.boundingBox;
        if (
            x === undefined || isNaN(Number(x)) ||
            y === undefined || isNaN(Number(y)) ||
            width === undefined || isNaN(Number(width)) ||
            height === undefined || isNaN(Number(height))
        ) {
            const error = new Error("Field 'boundingBox' must contain valid numeric properties: x, y, width, height");
            error.statusCode = 400;
            throw error;
        }
        updates.boundingBox = {
            x: Number(x),
            y: Number(y),
            width: Number(width),
            height: Number(height),
        };
    }

    if (updates.personId && !mongoose.isValidObjectId(updates.personId)) {
        const error = new Error("Invalid personId");
        error.statusCode = 400;
        throw error;
    }

    // Always push lastSeen to now if not explicitly provided
    if (!updates.lastSeen) {
        updates.lastSeen = new Date();
    }

    const updatedDetection = await Detection.findByIdAndUpdate(id, updates, {
        returnDocument: "after",
        runValidators: true,
    }).populate("personId", "name externalId");

    if (!updatedDetection) {
        const error = new Error(`Detection not found with ID: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    // Emit update so the dashboard reflects the change in real time
    emitSocketEvent("detection:update", updatedDetection);

    return updatedDetection;
};

export const deleteDetection = async (id) => {
    ensureDbConnected();

    if (!mongoose.isValidObjectId(id)) {
        const error = new Error(`Invalid detection ID: ${id}`);
        error.statusCode = 400;
        throw error;
    }

    const deletedDetection = await Detection.findByIdAndDelete(id);
    if (!deletedDetection) {
        const error = new Error(`Detection not found with ID: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    return deletedDetection;
};

export default {
    createDetection,
    getCurrentDetections,
    getAllDetections,
    getDetectionById,
    updateDetection,
    deleteDetection,
    validateDetectionInput,
};
