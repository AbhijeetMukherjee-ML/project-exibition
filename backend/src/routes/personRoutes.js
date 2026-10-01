import express from "express";
import {
    getPersons,
    getPerson,
    createPerson,
    updatePerson,
    deletePerson,
} from "../controllers/personController.js";

const router = express.Router();

router.route("/")
    .get(getPersons)
    .post(createPerson);

router.route("/:id")
    .get(getPerson)
    .patch(updatePerson)
    .delete(deletePerson);

export default router;
