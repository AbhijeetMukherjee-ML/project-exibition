import express from "express";
import {
    getCurrentDetections,
    getDetections,
    getDetection,
    createDetection,
    updateDetection,
    deleteDetection,
} from "../controllers/detectionController.js";

const router = express.Router();

// Active/recent detections — must precede /:id
router.get("/current", getCurrentDetections);

router.route("/")
    .get(getDetections)
    .post(createDetection);

router.route("/:id")
    .get(getDetection)
    .patch(updateDetection)
    .delete(deleteDetection);

export default router;
