import express from "express";
import {
    getCameras,
    getCamera,
    createCamera,
    updateCamera,
    deleteCamera,
    startStream,
    stopStream,
    getStreamStatus,
} from "../controllers/cameraController.js";

const router = express.Router();

// AI Stream lifecycle routes (must come before /:id)
router.post("/stream/start", startStream);
router.post("/stream/stop", stopStream);
router.get("/stream/status", getStreamStatus);

router.route("/")
    .get(getCameras)
    .post(createCamera);

router.route("/:id")
    .get(getCamera)
    .patch(updateCamera)
    .delete(deleteCamera);

export default router;
