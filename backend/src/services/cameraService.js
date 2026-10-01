import mongoose from "mongoose";
import Camera from "../models/Camera.js";
import { ensureDbConnected } from "../database.js";

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

export default {
    getAllCameras,
    getCameraById,
    createCamera,
    updateCamera,
    deleteCamera,
};
