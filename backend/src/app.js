import express from "express";
import cors from "cors";

import cameraRoutes from "./routes/cameraRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import personRoutes from "./routes/personRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";
import { isDbConnected } from "./database.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(
    cors({
        origin: corsOrigin === "*" ? "*" : [corsOrigin, "http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());

// Existing health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "backend",
        database: isDbConnected() ? "connected" : "disconnected",
    });
});

// API Routes
app.use("/api/cameras", cameraRoutes);
app.use("/api/detections", detectionRoutes);
app.use("/api/persons", personRoutes);

// Fallback & Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
