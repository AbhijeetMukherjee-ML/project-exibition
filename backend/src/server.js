// Must be the very first import so process.env is populated before
// any other module (app.js, database.js, socket.js) reads from it.
import "dotenv/config";

import http from "http";
import app from "./app.js";
import { initSocket, getIO } from "./socket.js";
import { connectDB } from "./database.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Initialize and attach Socket.IO
const io = initSocket(server);

// Connect to MongoDB if MONGO_URI exists — non-blocking, resilient to errors
connectDB().catch((err) => {
    logger.error(`MongoDB connection attempt failed: ${err.message}`);
});

server.listen(PORT, () => {
    logger.info(`Backend running on http://localhost:${PORT}`);
});

export { server, app, io, getIO };
