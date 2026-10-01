import { asyncHandler } from "../middleware/errorMiddleware.js";
import personService from "../services/personService.js";

export const getPersons = asyncHandler(async (req, res) => {
    const persons = await personService.getAllPersons();
    res.json(persons);
});

export const getPerson = asyncHandler(async (req, res) => {
    const person = await personService.getPersonById(req.params.id);
    res.json(person);
});

export const createPerson = asyncHandler(async (req, res) => {
    const person = await personService.createPerson(req.body);
    res.status(201).json(person);
});

export const updatePerson = asyncHandler(async (req, res) => {
    const person = await personService.updatePerson(req.params.id, req.body);
    res.json(person);
});

export const deletePerson = asyncHandler(async (req, res) => {
    const deletedPerson = await personService.deletePerson(req.params.id);
    res.json({
        message: "Person deleted successfully",
        person: deletedPerson,
    });
});

export default {
    getPersons,
    getPerson,
    createPerson,
    updatePerson,
    deletePerson,
};
