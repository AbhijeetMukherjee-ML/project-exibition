import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Camera name is required"],
            trim: true,
        },
        cameraId: {
            type: String,
            required: [true, "Camera ID is required"],
            unique: true,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: {
                values: ["online", "offline"],
                message: "Status must be either 'online' or 'offline'",
            },
            default: "offline",
        },
    },
    {
        timestamps: true,
    }
);

const Camera = mongoose.model("Camera", cameraSchema);

export default Camera;
