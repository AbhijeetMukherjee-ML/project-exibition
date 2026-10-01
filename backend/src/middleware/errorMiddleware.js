import logger from "../utils/logger.js";

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Not Found - ${req.method} ${req.originalUrl}`,
    });
};

export const errorHandler = (err, req, res, next) => {
    logger.error(`Error in [${req.method}] ${req.originalUrl}: ${err.message}`);

    // Mongoose bad ObjectId / CastError
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid format for field '${err.path}': ${err.value}`,
        });
    }

    // Mongoose unique constraint violation
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(409).json({
            success: false,
            message: `Duplicate entry: '${field}' with value '${err.keyValue[field]}' already exists.`,
        });
    }

    // Mongoose schema validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages,
        });
    }

    const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default { asyncHandler, notFoundHandler, errorHandler };
