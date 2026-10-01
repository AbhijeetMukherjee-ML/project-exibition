import { asyncHandler } from "../middleware/errorMiddleware.js";
import detectionService from "../services/detectionService.js";

export const getCurrentDetections = asyncHandler(async (req, res) => {
    const windowSeconds = parseInt(req.query.window, 10) || 30;
    const cameraId = req.query.cameraId || null;

    const result = await detectionService.getCurrentDetections(windowSeconds, cameraId);
    res.json(result);
});

export const getDetections = asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.cameraId) filter.cameraId = req.query.cameraId;
    if (req.query.trackId)  filter.trackId = Number(req.query.trackId);
    if (req.query.identity) filter.identity = req.query.identity;

    // Date range filter on lastSeen: ?from=ISO&to=ISO
    if (req.query.from || req.query.to) {
        filter.lastSeen = {};
        if (req.query.from) filter.lastSeen.$gte = new Date(req.query.from);
        if (req.query.to)   filter.lastSeen.$lte = new Date(req.query.to);
    }

    const options = {
        limit: req.query.limit,
        skip: req.query.skip,
    };

    const result = await detectionService.getAllDetections(filter, options);
    res.json(result);
});

export const getDetection = asyncHandler(async (req, res) => {
    const detection = await detectionService.getDetectionById(req.params.id);
    res.json(detection);
});

export const createDetection = asyncHandler(async (req, res) => {
    const detection = await detectionService.createDetection(req.body);
    res.status(201).json(detection);
});

export const updateDetection = asyncHandler(async (req, res) => {
    const detection = await detectionService.updateDetection(req.params.id, req.body);
    res.json(detection);
});

export const deleteDetection = asyncHandler(async (req, res) => {
    const deletedDetection = await detectionService.deleteDetection(req.params.id);
    res.json({
        message: "Detection deleted successfully",
        detection: deletedDetection,
    });
});

export default {
    getCurrentDetections,
    getDetections,
    getDetection,
    createDetection,
    updateDetection,
    deleteDetection,
};
