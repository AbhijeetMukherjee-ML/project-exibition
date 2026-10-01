import express from "express";
import {
    getCameras,
    getCamera,
    createCamera,
    updateCamera,
    deleteCamera,
} from "../controllers/cameraController.js";

const router = express.Router();

router.route("/")
    .get(getCameras)
    .post(createCamera);

router.route("/:id")
    .get(getCamera)
    .patch(updateCamera)
    .delete(deleteCamera);

export default router;
