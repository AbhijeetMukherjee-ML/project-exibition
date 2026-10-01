import { Server } from "socket.io";
import logger from "./utils/logger.js";

let io = null;

export const initSocket = (httpServer) => {
    const corsOrigin = process.env.CORS_ORIGIN || "*";

    io = new Server(httpServer, {
        cors: {
            origin: corsOrigin === "*" ? "*" : [corsOrigin, "http://localhost:5173"],
            methods: ["GET", "POST", "PATCH", "DELETE"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        logger.info(`Socket client connected: ${socket.id}`);

        socket.on("disconnect", (reason) => {
            logger.info(`Socket client disconnected: ${socket.id} (${reason})`);
        });
    });

    return io;
};

export const getIO = () => {
    return io;
};

export const emitSocketEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    } else {
        logger.warn(`Cannot emit '${event}': Socket.IO is not initialized.`);
    }
};

export default { initSocket, getIO, emitSocketEvent };
