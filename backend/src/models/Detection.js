import mongoose from "mongoose";

const boundingBoxSchema = new mongoose.Schema(
    {
        x: {
            type: Number,
            required: [true, "boundingBox.x is required"],
        },
        y: {
            type: Number,
            required: [true, "boundingBox.y is required"],
        },
        width: {
            type: Number,
            required: [true, "boundingBox.width is required"],
        },
        height: {
            type: Number,
            required: [true, "boundingBox.height is required"],
        },
    },
    { _id: false }
);

const detectionSchema = new mongoose.Schema(
    {
        cameraId: {
            type: String,
            required: [true, "cameraId is required"],
            trim: true,
            index: true,
        },
        trackId: {
            type: Number,
            required: [true, "trackId is required"],
        },
        personId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Person",
            default: null,
        },
        identity: {
            type: String,
            trim: true,
            default: null,
        },
        identityConfidence: {
            type: Number,
            default: 0,
        },
        detectionConfidence: {
            type: Number,
            default: 0,
        },
        boundingBox: {
            type: boundingBoxSchema,
            required: [true, "boundingBox is required"],
        },
        firstSeen: {
            type: Date,
            default: Date.now,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

detectionSchema.index({ cameraId: 1, trackId: 1 });

const Detection = mongoose.model("Detection", detectionSchema);

export default Detection;
