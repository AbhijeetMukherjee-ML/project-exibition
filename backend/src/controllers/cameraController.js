import { asyncHandler } from "../middleware/errorMiddleware.js";
import cameraService from "../services/cameraService.js";

export const getCameras = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const cameras = await cameraService.getAllCameras(filter);
    res.json(cameras);
});

export const getCamera = asyncHandler(async (req, res) => {
    const camera = await cameraService.getCameraById(req.params.id);
    res.json(camera);
});

export const createCamera = asyncHandler(async (req, res) => {
    const camera = await cameraService.createCamera(req.body);
    res.status(201).json(camera);
});

export const updateCamera = asyncHandler(async (req, res) => {
    const camera = await cameraService.updateCamera(req.params.id, req.body);
    res.json(camera);
});

export const deleteCamera = asyncHandler(async (req, res) => {
    const deletedCamera = await cameraService.deleteCamera(req.params.id);
    res.json({
        message: "Camera deleted successfully",
        camera: deletedCamera,
    });
});

export default {
    getCameras,
    getCamera,
    createCamera,
    updateCamera,
    deleteCamera,
};
