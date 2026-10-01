import mongoose from "mongoose";
import logger from "./utils/logger.js";

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        logger.warn("MONGO_URI is not defined. Running in offline/no-database mode.");
        return null;
    }

    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });

        logger.info(`MongoDB connected successfully: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            logger.error(`MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB connection disconnected");
        });

        return conn;
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}. Running without database connection.`);
        return null;
    }
};

export const isDbConnected = () => {
    return mongoose.connection.readyState === 1;
};

export const ensureDbConnected = () => {
    if (!isDbConnected()) {
        const error = new Error("Database unavailable. MongoDB is not connected.");
        error.statusCode = 503;
        throw error;
    }
};

export default connectDB;
