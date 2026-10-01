import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Person name is required"],
            trim: true,
        },
        externalId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

const Person = mongoose.model("Person", personSchema);

export default Person;
