import mongoose from "mongoose";
import Person from "../models/Person.js";
import { ensureDbConnected } from "../database.js";

const buildFindQuery = (id) => {
    if (mongoose.isValidObjectId(id)) {
        return { $or: [{ _id: id }, { externalId: id }] };
    }
    return { externalId: id };
};

export const getAllPersons = async (filter = {}) => {
    ensureDbConnected();
    return Person.find(filter).sort({ createdAt: -1 });
};

export const getPersonById = async (id) => {
    ensureDbConnected();
    const query = buildFindQuery(id);
    const person = await Person.findOne(query);
    if (!person) {
        const error = new Error(`Person not found with identifier: ${id}`);
        error.statusCode = 404;
        throw error;
    }
    return person;
};

export const createPerson = async (data) => {
    ensureDbConnected();
    const { name, externalId } = data;

    if (!name || !name.trim()) {
        const error = new Error("Person 'name' is required");
        error.statusCode = 400;
        throw error;
    }

    if (externalId && externalId.trim()) {
        const existing = await Person.findOne({ externalId: externalId.trim() });
        if (existing) {
            const error = new Error(`Person with externalId '${externalId.trim()}' already exists`);
            error.statusCode = 409;
            throw error;
        }
    }

    const person = new Person({
        name: name.trim(),
        externalId: externalId && externalId.trim() ? externalId.trim() : undefined,
    });

    return person.save();
};

export const updatePerson = async (id, data) => {
    ensureDbConnected();
    const query = buildFindQuery(id);

    // Resolve the actual document first so we can compare _id vs _id,
    // not _id vs a raw externalId string (which would always mismatch).
    const personToUpdate = await Person.findOne(query);
    if (!personToUpdate) {
        const error = new Error(`Person not found with identifier: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    const allowedUpdates = ["name", "externalId"];
    const updates = {};
    for (const key of allowedUpdates) {
        if (data[key] !== undefined) {
            updates[key] = data[key];
        }
    }

    if (updates.externalId) {
        const trimmed = updates.externalId.trim();
        const existing = await Person.findOne({ externalId: trimmed });
        if (existing && existing._id.toString() !== personToUpdate._id.toString()) {
            const error = new Error(`Person with externalId '${trimmed}' already exists`);
            error.statusCode = 409;
            throw error;
        }
        updates.externalId = trimmed;
    }

    const updatedPerson = await Person.findByIdAndUpdate(personToUpdate._id, updates, {
        returnDocument: "after",
        runValidators: true,
    });

    return updatedPerson;
};

export const deletePerson = async (id) => {
    ensureDbConnected();
    const query = buildFindQuery(id);
    const deletedPerson = await Person.findOneAndDelete(query);

    if (!deletedPerson) {
        const error = new Error(`Person not found with identifier: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    return deletedPerson;
};

export default {
    getAllPersons,
    getPersonById,
    createPerson,
    updatePerson,
    deletePerson,
};
